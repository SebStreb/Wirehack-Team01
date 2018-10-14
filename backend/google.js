const request = require('request-promise');
const querystring = require('querystring');
const api = require('./api.json');

// origin and destintation are [latitude, longitude], mode is driving/walking/bicycling/transit
exports.getDuration = async (origin, destination) => {
  const modes = ['driving', 'walking', 'bicycling', 'transit'];
  const result = {};

  for await (const mode of modes) {
    const params = {
      mode,
      key: api.google_key,
      origin: origin.join(','),
      destination: destination.join(','),
      alternatives: false,
    };
    const url = `${api.google_url}/directions/json?${querystring.stringify(
      params,
    )}`;

    // eslint-disable-next-line no-console
    if (api.debug) console.log('GET', url);
    await request(url).then((body) => {
      const parsed = JSON.parse(body);
      if (parsed.routes.length > 0) result[mode] = {
        duration: parsed.routes[0].legs[0].duration.value,
        instructions: paresed.routes[0].legs[0].steps.map(step => `<p>${step.html_instructions}</p>`).join('\n')
      };
      else result[mode] = {duration: "-1", instructions: "<p>No direction found</p>"};
    });
  }

  return result;
};

const coordinatesCache = {};
exports.getCoordinates = async (input) => {
  if (typeof coordinatesCache[input] !== 'undefined') {
    return coordinatesCache[input];
  }
  const params = {
    input,
    inputtype: 'textquery',
    fields: 'formatted_address,geometry',
    key: api.google_key,
  };
  const url = `${
    api.google_url
  }/place/findplacefromtext/json?${querystring.stringify(params)}`;

  // eslint-disable-next-line no-console
  if (api.debug) console.log('GET', url);
  return request(url).then((body) => {
    const parsed = JSON.parse(body);
    const coordinates = [
      parsed.candidates[0].geometry.location.lat,
      parsed.candidates[0].geometry.location.lng,
    ];
    coordinatesCache[input] = coordinates;
    return coordinates;
  });
};
