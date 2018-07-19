require('./config');

const express = require('express');
const bodyParser = require('body-parser');
const geocode = require('./geocode');
const weather = require('./weather');

const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/public'));

app.post('/weather', function(req, res) {
    let weatherDetails = {
        latlon: {
            lat: 0,
            lng: 0
        }
    };
    
    let address = null;
    let lat = 0, lng = 0;
    let units = req.body.units;

    if(req.body.address) {
        address = req.body.address;
    } else if(req.body.lat && req.body.lng){
        lat = req.body.lat;
        lng = req.body.lng;
    }
    geocode.geocodeAddress(address, lat, lng, (errMsg, geocode) => {
        if(errMsg) {
            console.log(errMsg);
        } else {
            weatherDetails.cityLocation = geocode.address.toUpperCase();
            weatherDetails.latlon.lat = geocode.latitude;
            weatherDetails.latlon.lng = geocode.longitude;

            weather.getWeather(geocode.latitude, geocode.longitude, units, (errMsg, weather) => {
                if(errMsg) {
                    console.log(errMsg);
                } else {
                    weatherDetails.temperature = Math.round(weather.temperature);
                    weatherDetails.summary = weather.summary;                   
                    weatherDetails.apparentTemp = Math.round(weather.apparentTemperature);
                    weatherDetails.low = Math.round(weather.low);
                    weatherDetails.high = Math.round(weather.high);
                    weatherDetails.uvindex = weather.uvindex;
                    weatherDetails.weatherIcon = weather.weatherIcon;
                    weatherDetails.wind = Math.round(weather.wind);
                    weatherDetails.humidity = Math.round(weather.humidity)*100;
                    weatherDetails.dewpoint = Math.round(weather.dewpoint);
                    weatherDetails.pressure = weather.pressure.toFixed(1);
                    weatherDetails.visibility = weather.visibility.toFixed(1);
        
                    res.send(weatherDetails);
                }
            });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
