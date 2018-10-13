const fs = require("fs");
const https = require("https");
const express = require("express");
const querystring = require("querystring");
const request = require("request");
const polyline = require('@mapbox/polyline');

	//Line to encode lat/long in Google :
	//console.log(polyline.encode([[50.83711, 4.399754]]))

const api = JSON.parse(fs.readFileSync("api.json"));

const app = express();

app.get("/", function(req, res) {
  const params = {
    propertyTypes: "HOUSE", //required
    transactionTypes: "FOR_RENT", //required
    minBedroomCount: 2,
    maxPrice: 1500 //,
    //geoSearchPoint: '50.83,4.39',
    //geoSearchRadius: 10
  };

  console.log();

  const options = {
    host: api.immoweb_url,
    port: 443,
    method: "GET",
    path: "/classifieds" + querystring.stringify(params),
    headers: {
      "x-iw-api-key": api.immoweb_key, //required
      Accept: "application/vnd.be.immoweb.classifieds.v2.0+json" //required
    }
  };

  const request = https.request(options, result => {
    console.log(`STATUS: ${result.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(result.headers)}`);
    result.setEncoding("utf8");
    result.on("data", chunk => {
      console.log(`BODY: ${chunk}`);
    });
    result.on("end", () => {
      console.log("No more data in response.");
    });
  });
  request.end();
});
>>>>>>> 4aed49ca478579cce47e4f1bc007c3199e074a6d

// GET /get-location?input=Brussels
app.get("/get-location", (req, res) => {
  if (req.query.input.length === 0) return res.send("please specify the input");
  request(
    "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=" +
      req.query.input +
      "&inputtype=textquery&fields=formatted_address%2Cgeometry&key=" +
      api.google_key,
    function(error, response, body) {
      if (error) {
        console.log("error:", error); // Print the error if one occurred
        console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
      }
      res.send(body);
    }
  );
});

app.listen(3000, function () {
	console.log('Example app listening on port 3000!')
})
