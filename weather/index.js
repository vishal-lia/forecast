const request = require('request');

exports.getWeather = (latitude, longitude, units, callback) => {
    request({
        url: `https://api.darksky.net/forecast/d819e888366357ca1dbb6e3531621fed/${latitude},${longitude}?units=${units}`,
        json: true
    }, function(error, response, body) {
        if(error) throw error;

        if(response.statusCode === 200) {
            callback(null, {
                temperature: body.currently.temperature,
                summary: body.currently.summary,
                apparentTemperature: body.currently.apparentTemperature,
                low: body.daily.data[0].temperatureLow,
                high: body.daily.data[0].temperatureHigh,
                uvindex: body.currently.uvIndex,
                weatherIcon: body.currently.icon,
                wind: body.currently.windSpeed,
                humidity: body.currently.humidity,
                dewpoint: body.currently.dewPoint,
                pressure: body.currently.pressure,
                visibility: body.currently.visibility
            });
        } else {
            callback(body.error);
        }
    });
}