const request = require('request-promise');
const querystring = require('querystring');
const api = require('./api.json');

const polyline = require('@mapbox/polyline');

// coordinates is a [latitude, longitude]
exports.getClassifieds = async (coordinates) => {
    const params = {
        propertyTypes: "HOUSE", //required
        transactionTypes: "FOR_RENT", //required
        minBedroomCount: 2,
        maxPrice: 1500,
        geoSearchPoint: polyline.encode([coordinates]),
        geoSearchRadius: 10000,
        range: "0-30"
    };

    return request({
        url: api.immoweb_url + "/classifieds?" + querystring.stringify(params),
        headers: {
            "x-iw-api-key": api.immoweb_key,
            Accept: "application/vnd.be.immoweb.classifieds.v2.1+json" 
        }
    }).then(body => {
        return JSON.parse(body);
    });
};