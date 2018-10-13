const express = require("express");
const cors = require("cors");

const google = require("./google");
const immoweb = require("./immoweb");

const app = express();
app.use(cors());

// GET /get-location?input=Brussels
app.get("/get-location", async (req, res) => {
  if (!req.query.input || req.query.input.length === 0)
    return res.send("please specify the input");
  const input = req.query.input;
  const houseOrApp = req.query.houseApp;
  const rentOrBuy = req.query.rentBuy;
  const minBedroom = req.query.minBed;
  const maxPrice = req.query.maxPrice;
  console.log(houseOrApp + " " + rentOrBuy + " " + minBedroom + " " + maxPrice);

  const inputCoordinates = await google.getCoordinatesFromText(input);
  const listOfHouses = await immoweb.getClassifieds(
    inputCoordinates,
    houseOrApp,
    rentOrBuy,
    maxPrice,
    minBedroom
  );

  // filter those without geopoint
  const filtered = listOfHouses.filter(item =>
    item.property.location.hasOwnProperty("geoPoint")
  );

  const promiseFiltered = filtered.map(async item => {
    // do the google directions api call here to get duration
    itemCoordinates = [
      item.property.location.geoPoint.latitude,
      item.property.location.geoPoint.longitude
    ];
    item.travelDuration = {
      driving: await google.getDuration(
        inputCoordinates,
        itemCoordinates,
        "driving"
      ),
      walking: await google.getDuration(
        inputCoordinates,
        itemCoordinates,
        "walking"
      )
    };

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

    return item;
  });

  const results = await Promise.all(promiseFiltered);
  const cleanResults = results
    // only include those that we can find a route to
    .filter(item => item.travelDuration != "-1")
    // only include those that we can find a price to
    .filter(item => item.price != "-1") // TODO do we ?
    // sort them by lowest travelroute
    .sort(
      (a, b) =>
        parseInt(a.travelDuration.driving, 10) -
        parseInt(b.travelDuration.driving, 10)
    );

  return res.send(cleanResults);
});

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log("App listening on port 3000!");
});
