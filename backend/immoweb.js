const request = require("request-promise");
const querystring = require("querystring");
const polyline = require("@mapbox/polyline");
const api = require("./api.json");

// coordinates is a [latitude, longitude]
exports.getClassifieds = async coordinates => {
  const params = {
    propertyTypes: "HOUSE", // required
    transactionTypes: "FOR_RENT", // required
    minBedroomCount: 2,
    maxPrice: 1500,
    geoSearchPoint: polyline.encode([coordinates]),
    geoSearchRadius: 10000,
    range: "0-30"
  };
  const url = `${api.immoweb_url}/classifieds?${querystring.stringify(params)}`;

  if (api.debug) console.log("GET", url);
  return request({
    url: url,
    headers: {
      "x-iw-api-key": api.immoweb_key,
      Accept: "application/vnd.be.immoweb.classifieds.v2.1+json"
    }
  }).then(body => JSON.parse(body));
};

exports.getInformations = async classifiedID => {
  const url = `${api.immoweb_url}/classifieds/${classifiedID}`;

  if (api.debug) console.log("GET", url);
  return request({
    url: url,
    headers: {
      "x-iw-api-key": api.immoweb_key,
      Accept: "application/vnd.be.immoweb.classifieds.v2.1+json"
    }
  }).then(body => JSON.parse(body));
};
