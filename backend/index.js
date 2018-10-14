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

  /* LEGACY
  var multiple = false;
  var otherCoordinates;
  if (req.query.otherLoc !== "undefined") {
    const otherLoc = req.query.otherLoc;
    otherCoordinates = await google.getCoordinates(otherLoc);
    console.log(otherLoc);
    multiple = true;
  }
  */

  console.log('1');

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

  console.log('2');

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
      result.travelDuration.push(res);
    }

    results.push(result);
  }

  console.log('3');

  return res.send(results);

  /*
  const promiseFiltered = filtered.map(async item => {
    // do the google directions api call here to get duration
    itemCoordinates = [
      item.property.location.geoPoint.latitude,
      item.property.location.geoPoint.longitude
    ];

    item.travelDuration = await google.getDuration(inputCoordinates, itemCoordinates);

    if (multiple) {
      item.travelDuration2 = {
        driving: await google.getDuration(
          otherCoordinates,
          itemCoordinates,
          "driving"
        ),
        walking: await google.getDuration(
          otherCoordinates,
          itemCoordinates,
          "walking"
        )
      };
    }

    const detailedItem = await immoweb.getInformations(item.id);

    if (detailedItem.property.hasOwnProperty("description"))
      item.description = detailedItem.property.description;
    else if (detailedItem.property.alternativeDescriptions.hasOwnProperty("en"))
      item.description = detailedItem.property.alternativeDescriptions.en;
    else if (detailedItem.property.alternativeDescriptions.hasOwnProperty("fr"))
      item.description = detailedItem.property.alternativeDescriptions.fr;
    else if (detailedItem.property.alternativeDescriptions.hasOwnProperty("nl"))
      item.description = detailedItem.property.alternativeDescriptions.nl;

    if (item.transaction.hasOwnProperty("sale"))
      item.price = item.transaction.sale.price;
    else if (item.transaction.hasOwnProperty("rental"))
      item.price = item.transaction.rental.monthlyRentalPrice;
    else item.price = "-1";

    if (
      item.property.hasOwnProperty("livingDescription") &&
      item.property.livingDescription.hasOwnProperty("netHabitableSurface")
    )
      item.surface = item.property.livingDescription.netHabitableSurface;
    else item.surface = "-1";

    if (
      item.property.hasOwnProperty("bedroom") &&
      item.property.bedroom.hasOwnProperty("count")
    )
      item.bedrooms = item.property.bedroom.count;
    else item.bedrooms = "-1";

    return item;
  });

  const results = await Promise.all(promiseFiltered);

  //TODO make all that in the frontend
  //const cleanResults = results
  // only include those that we can find a route to
  //.filter(item => item.travelDuration != "-1")
  // only include those where the duration is not too long
  //.filter(item => parseInt(item.travelDuration.driving) < maxWait * 60)
  // only include those that we can find a price to
  //.filter(item => item.price != "-1") // TODO do we ?
  // sort them by lowest travelroute
  //.sort(
  //  (a, b) =>
  //    parseInt(a.travelDuration.driving, 10) -
  //    parseInt(b.travelDuration.driving, 10)
  //);

  return res.send(results);
  */
});

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('App listening on port 3000!');
});
