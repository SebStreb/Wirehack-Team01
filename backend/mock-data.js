const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

// GET /get-location?input=Brussels
app.get("/get-coordinates", async (req, res) => {
  console.log('/get-coordinates', req.query);
  setTimeout(() => {
    res.send(require('./example-data/get-coordinates.json'));
  }, 2000);
});

// GET /get-location?input=Brussels
app.get("/get-location", async (req, res) => {
  console.log('/get-location', req.query);
  setTimeout(() => {
    return res.send(require('./example-data/get-location.json'));
  }, 2000);
});

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log("App listening on port 3000!");
});
