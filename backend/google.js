const request = require('request-promise');
const querystring = require('querystring');
const api = require('./api.json');

// origin and destintation are [latitude, longitude], mode is driving/walking/bicycling/transit
exports.getDuration = async (origin, destination, mode) => {
  const params = {
      key: api.google_key,
      origin: origin.join(','),
      destination: destination.join(','),
      mode: mode,
      alternatives: false //we only need one route to get its time
      //departure_time: TODO get timestamp for a random 8:00 in the future
  };
  if (api.debug) console.log('GET', api.google_url + "/directions/json?" + querystring.stringify(params));
  return request(api.google_url + "/directions/json?" + querystring.stringify(params)).then(body => {
      const parsed = JSON.parse(body);
      if (parsed.routes.length > 0) {
          const duration = parsed.routes[0].legs[0].duration.value;
          return duration + "";
      } else return "-1";
  })
};

exports.getCoordinatesFromText = async (input) => {
  const params = {
    input: input,
    inputtype: "textquery",
    fields: "formatted_address,geometry",
    key: api.google_key
  };
  if (api.debug) console.log('GET', api.google_url + '/place/findplacefromtext/json?' + querystring.stringify(params));
  return request(api.google_url + '/place/findplacefromtext/json?' + querystring.stringify(params)).then(body => {
      const parsed = JSON.parse(body);
      return [
        parsed.candidates[0].geometry.location.lat,
        parsed.candidates[0].geometry.location.lng
      ];
    });
}