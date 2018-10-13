const fs = require('fs')
const request = require('request')
const express = require('express')
const querystring = require('querystring')
const polyline = require('@mapbox/polyline');

//Line to encode lat/long in Google :
//console.log(polyline.encode([[50.83711, 4.399754]]))

const api = JSON.parse(fs.readFileSync("api.json"))

const app = express()

app.get('/', function (req, res) {
	const params = {
		propertyTypes: 'HOUSE', //required
		transactionTypes: 'FOR_RENT', //required
		minBedroomCount: 2,
		maxPrice: 1500//,
		//geoSearchPoint: '50.83,4.39',
		//geoSearchRadius: 10
	}

	request({
		url: api.immoweb_url + '/classifieds?' + querystring.stringify(params),
		headers: {
			'x-iw-api-key': api.immoweb_key, //required
			'Accept': 'application/vnd.be.immoweb.classifieds.v2.0+json' //required
		}
	}, function (error, response, body) {
		if (error) console.log(error)
		//console.log(response)
		//console.log(body)
		res.send(body)
	})
})

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
      fullRequest = JSON.parse(body);
      coordinates = [fullRequest.candidates[0].geometry.location.lat, fullRequest.candidates[0].geometry.location.lng];
      const params = {
		propertyTypes: 'HOUSE', //required
		transactionTypes: 'FOR_RENT', //required
		minBedroomCount: 2,
		maxPrice: 1500,
		geoSearchPoint: polyline.encode([coordinates]),
		geoSearchRadius: 10000
	}

	request({
		url: api.immoweb_url + '/classifieds?' + querystring.stringify(params),
		headers: {
			'x-iw-api-key': api.immoweb_key, //required
			'Accept': 'application/vnd.be.immoweb.classifieds.v2.1+json' //required
		}
	}, function (error, response, body) {
		if (error) console.log(error)
		//console.log(response)
		//console.log(body)
		res.send(body)
	})
    }
  );
});

app.listen(3000, function () {
	console.log('Example app listening on port 3000!')
})
