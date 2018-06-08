let controller = (function () {
    let DOMStrings = {
        inputLocation: '.location',
        inputBtn: '.search-btn',
        cityLocation: '.city-location',
        dateTime: '.date-time',
        temperature: '.temperature',
        summary: '.summary',
        apparentTemp: '#apparent-temp',
        low: '#low',
        high: '#high',
        uvindex: '#uvindex',
        weatherImages: '.weather-images',
        wind: '#wind',
        humidity: '#humidity',
        dewpoint: '#dewpoint',
        pressure: '#pressure',
        visibility: '#visibility',
        mapHolder: '#map-holder'
    };

    function getMapLocation() {
        let latlon = {
            lat: 0,
            lng: 0
        };

        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                latlon.lat = position.coords.latitude;
                latlon.lng = position.coords.longitude;

                // Get weather details as latlon cannot be returned since it's async
                getWeather(null, latlon);
            });
        } else {
            console.log('Geolocation is not supported by this browser.');
        }
    }

    function getWeather(address, mapLocation) {
        let url = null;
        let data = null;

        if(address) {
            // Get weather details of this address from server
            data ={
                address: address
            };
        } else if(mapLocation){
            // Get weather details of current location from server
            data = mapLocation;
        }

        url = '/weather';
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(function(response) {
            if(response.ok) {
                return response.json();
            }
        }).then(function(weather) {
            // Display weather details
            displayWeather(weather);

            // Display map location
            showMapLocation(weather.latlon);
        }).catch(function(err) {
            console.log('Error:', err);
        });
    }

    function displayWeather(weather) {
        document.querySelector(DOMStrings.cityLocation).textContent = weather.cityLocation;
        document.querySelector(DOMStrings.dateTime).textContent = 'as of ' + getDate();
        document.querySelector(DOMStrings.temperature).innerHTML = weather.temperature + '&deg;C';
        document.querySelector(DOMStrings.summary).textContent = weather.summary;
        document.querySelector(DOMStrings.apparentTemp).innerHTML = 'feels like ' + '<span class="degree">' + weather.apparentTemp + '&deg;' + '</span>';
        document.querySelector(DOMStrings.low).innerHTML = 'Low: ' + '<span class="degree">' + weather.low + '&deg;' + '</span>';
        document.querySelector(DOMStrings.high).innerHTML = 'High: ' + '<span class="degree">' + weather.high + '&deg;' + '</span>';
        document.querySelector(DOMStrings.uvindex).textContent = `UV Index ${weather.uvindex} of 10`;
        document.querySelector(DOMStrings.weatherImages).style.display = 'block';
        document.querySelector(DOMStrings.weatherImages).innerHTML = `<img src='images/icons/${weather.weatherIcon}.png' class='weather-icon'>`;
        document.querySelector(DOMStrings.wind).textContent = weather.wind + ' m/s';
        document.querySelector(DOMStrings.humidity).textContent = weather.humidity + '%';
        document.querySelector(DOMStrings.dewpoint).innerHTML = weather.dewpoint + '&deg;';
        document.querySelector(DOMStrings.pressure).textContent = weather.pressure + ' hPa';
        document.querySelector(DOMStrings.visibility).textContent = weather.visibility + ' km';
    }

    function showMapLocation(latlon) {
        let map = new google.maps.Map(document.querySelector(DOMStrings.mapHolder) , {
            zoom: 12,
            center: latlon
        });

        let marker = new google.maps.Marker({
            position: latlon,
            map: map,
            title: 'Click to zoom'
        });

        map.addListener('center_changed', () => {
            // 3 seconds after the center of map has changed, pan back to marker
            window.setTimeout(() => {
                map.panTo(marker.getPosition());
            }, 3000);
        });

        marker.addListener('click', () => {
            map.setZoom(16);
            map.setCenter(marker.getPosition());
        });
    }

    function updateWeather() {
        let addressField = document.querySelector(DOMStrings.inputLocation);
        if(addressField.value) {
            getWeather(addressField.value, null);
        }

        addressField.value = "";
    }

    function setupEventListener() {
        document.querySelector(DOMStrings.inputBtn).addEventListener('click', updateWeather);

        document.addEventListener('keypress', event => {
            if(event.keyCode === 13 || event.which === 13) {
                updateWeather();
            }
        });
    }

    function getDate() {
        let date = null, timezone = null;
        date = new Date();
        timezone = date.toString().replace(/(.*\((.*)\).*)/, '$2');

        return date.getHours() + ':' + date.getMinutes() + ' ' + timezone;
    }

    return {
        init: function () {
            console.log("Application has started.");

            // Get Current Client Location
            getMapLocation();

            // Setup Event Listener on location
            setupEventListener();
        }
    }
})();


controller.init();

