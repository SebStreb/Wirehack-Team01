const express = require('express');
const cors = require('cors');

const google = require('./google');
const immoweb = require('./immoweb');

const app = express();
app.use(cors());

// GET /get-coordinates?input=Brussels
app.get('/get-coordinates', async (req, res) => {
  if (!req.query.input || req.query.input.length === 0) return res.send('please specify the input');
  const inputCoordinates = await google.getCoordinates(req.query.input);
  return res.send(inputCoordinates);
});

// GET /get-location?input=Brussels
app.get('/get-location', async (req, res) => {
  if (!req.query.input || req.query.input.length === 0)
  // TODO rename locations
  { return res.send('please specify the locations'); }
  const locations = req.query.input.split(';');

  if (!req.query.houseApp || req.query.houseApp.length === 0)
  // TODO rename propertyType
  { return res.send('please specify the propertyType'); }
  const propertyType = req.query.houseApp;

  if (!req.query.rentBuy || req.query.rentBuy.length === 0)
  // TODO rename transactionType
  { return res.send('please specify the transactionType'); }
  const transactionType = req.query.rentBuy;

  let maxPrice;
  if (!req.query.maxPrice || req.query.maxPrice.length === 0) maxPrice = '10000000000';
  else maxPrice = req.query.maxPrice;

  let minBedroom;
  if (!req.query.minBed || req.query.minBed.length === 0) minBedroom = '0';
  else minBedroom = req.query.minBed;

  let minSize;
  if (!req.query.minSize || req.query.minSize.length === 0) minSize = '0';
  else minSize = req.query.minSize;

  const allCoordinates = await Promise.all(
    locations.map(async location => await google.getCoordinates(location)),
  );

  const centerPoint = [0, 0];
  allCoordinates.map((coordinates) => {
    centerPoint[0] += coordinates[0];
    centerPoint[1] += coordinates[1];
  });
  centerPoint[0] /= allCoordinates.length;
  centerPoint[1] /= allCoordinates.length;

  // const center = await google.getCoordinates(centerPoint);
  const houses = await immoweb.getClassifieds(
    centerPoint,
    propertyType,
    transactionType,
    minBedroom,
    maxPrice,
  );
  const filtered = houses.filter(house => house.property.location.hasOwnProperty('geoPoint'));

  const results = [];
  for await (const house of filtered) {
    const result = {};

    // If we don't have at least this, I don't know what to do
    result.id = house.id;
    result.propertyType = house.property.type;
    result.transactionType = house.transaction.type;

    // TODO see if need to test
    result.city = house.property.location.address.locality;
    result.postalCode = house.property.location.address.postalCode;
    result.geoPoint = house.property.location.geoPoint;

    if (
      house.property.hasOwnProperty('bedroom')
      && house.property.bedroom.hasOwnProperty('count')
    ) result.bedrooms = house.property.bedroom.count;
    else result.bedrooms = '-1';

    if (
      house.property.hasOwnProperty('livingDescription')
      && house.property.livingDescription.hasOwnProperty('netHabitableSurface')
    ) result.surface = house.property.livingDescription.netHabitableSurface;
    else result.surface = '-1';

    if (house.transaction.hasOwnProperty('sale')) result.price = house.transaction.sale.price;
    else if (house.transaction.hasOwnProperty('rental')) result.price = house.transaction.rental.monthlyRentalPrice;
    else result.price = '-1';

    // TODO see if need to test
    result.image = house.media.pictures.baseUrl
      + house.media.pictures.items[0].relativeUrl.large;

    const details = await immoweb.getInformations(result.id);
    if (details.property.hasOwnProperty('description')) result.description = details.property.description;
    else if (details.property.alternativeDescriptions.hasOwnProperty('en')) result.description = details.property.alternativeDescriptions.en;
    else if (details.property.alternativeDescriptions.hasOwnProperty('fr')) result.description = details.property.alternativeDescriptions.fr;
    else if (details.property.alternativeDescriptions.hasOwnProperty('nl')) result.description = details.property.alternativeDescriptions.nl;

    const houseCoordinates = [
      result.geoPoint.latitude,
      result.geoPoint.longitude,
    ];

    result.travelDuration = [];
    for await (const coordinates of allCoordinates) {
      const res = await google.getDuration(coordinates, houseCoordinates);
      result.travels.push(res);
    }

    results.push(result);
  }


  return res.send(results);
});

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('App listening on port 3000!');
});
