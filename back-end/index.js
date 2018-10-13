const fs = require('fs')
const request = require('request')
const express = require('express')
const querystring = require('querystring')

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
		console.log(response)
		console.log(body)
		res.send(body)
	})
})

app.listen(3000, function () {
	console.log('Example app listening on port 3000!')
})
