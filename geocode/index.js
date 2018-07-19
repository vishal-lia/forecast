const request = require('request');

exports.geocodeAddress = (address, lat, lng, callback) => {
    let url = null;
    if(address) {
        url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GEOCODE_API_KEY}`;
    } else if(lat && lng) {
        url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GEOCODE_API_KEY}`;        
    }

    request({
        url: url,
        json:true
    }, function(error, response, body) {
        if(error) throw error;

        if(body.status !== 'OK') {
            callback('Unable to find that address');
        }
        else {
            callback(null, {
                address: body.results[0].formatted_address,
                latitude: body.results[0].geometry.location.lat,
                longitude: body.results[0].geometry.location.lng
            });
        }
    });
}