const fs = require('fs')
const https = require('https')
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

	console.log()

	const options = {
		host: api.immoweb_url,
		port: 443,
		method: 'GET',
		path: '/classifieds' + querystring.stringify(params),
		headers: {
			'x-iw-api-key': api.immoweb_key, //required
			'Accept': 'application/vnd.be.immoweb.classifieds.v2.0+json' //required
		}
	}

	const request = https.request(options, (result) => {
		console.log(`STATUS: ${result.statusCode}`)
		console.log(`HEADERS: ${JSON.stringify(result.headers)}`)
		result.setEncoding('utf8')
		result.on('data', (chunk) => {
			console.log(`BODY: ${chunk}`)
		})
		result.on('end', () => {
			console.log('No more data in response.')
		})
	})
	request.end()
})

app.listen(3000, function () {
	console.log('Example app listening on port 3000!')
})
