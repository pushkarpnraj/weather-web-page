const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-Btn");
const currentLocation = document.querySelector('.curr-location');
const currentWeatherDiv = document.querySelector('.current-weather');
const weatherCardsDiv = document.querySelector('.weather-cards');

//API key
const API_KEY = "9770ceef63a8c9b9754f8e9f674112ad";




//adding data to cards
function createWeatherCard(cityName, weatherItem, index) {
    if (index === 0) {
        return `<div class="details">
        <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
        <h6>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
        <h6>Wind: ${(weatherItem.wind.speed)}M/S</h6>
        <h6>Humidity: ${(weatherItem.main.humidity)}%</h6>

    </div>
    <div class="icon">
    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
    <h6>${(weatherItem.weather[0].description)}</h6>
    </div>`
    } else {
        return `
        <div class="card">
        <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
        <h6>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
        <h6>Wind: ${(weatherItem.wind.speed)}M/S</h6>
        <h6>Humidity: ${(weatherItem.main.humidity)}%</h6>
        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
        <h6>${(weatherItem.weather[0].description)}</h6>
                    </div>
        `

    }
}

//----------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------

//getting weather details of enterd city name
const getWeatherDetails = (cityName, longitude, latitude) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(response => response.json()).then(data => {
        // Filter the forecasts to get only one forecast per day
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });

        // Clearing previous weather data
        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";

        // Creating weather cards and adding them to the DOM
        fiveDaysForecast.forEach((weatherItem, index) => {
            console.log(weatherItem)
            const html = createWeatherCard(cityName, weatherItem, index);
            if (index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", html);
            } else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", html);
            }
        });
    }).catch(() => {
        alert("An error occurred while fetching the weather forecast!");
    });
}


//----------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------

//calling method getCityCorrdinates
function getCityCorrdinates() {
    //trim method will remove whitespaces from both sides of a string
    const cityName = cityInput.value.trim();
    if (cityName === "") {
        alert("We need location information. Please share city name or coordinates.");
    }
    const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    //now will fetch city coordinates from API
    fetch(API_URL).then((respone) => respone.json()).then((data) => {
        if (!data.length) {
            alert(`No coordinates found for ${cityName}`)
        }
        console.log(data[0]);
        const { name, lat, lon } = data[0];
        //for getting weather details we are calling getWeatherDetails function
        getWeatherDetails(name, lon, lat);

    }).catch(() => {
        console.log("An error occur while fetching the data")
    })
}
//----------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------



//----------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------
//function to get user coordinates
function getUserCoordinates() {
    navigator.geolocation.getCurrentPosition(
        function (position) {
            // Success callback
            const { latitude, longitude } = position.coords;
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            fetch(API_URL).then((response) => response.json()).then((data) => {
                console.log(data)
                const { name } = data[0];
                console.log(name);
                getWeatherDetails(name, longitude, latitude)
            }).catch(() => console.log("An error occur while fetching the data"))
        },
        function (error) {
            // Error callback
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    console.error('User denied the request for Geolocation.');
                    break;
                case error.POSITION_UNAVAILABLE:
                    console.error('Location information is unavailable.');
                    break;
                case error.TIMEOUT:
                    console.error('The request to get user location timed out.');
                    break;
                case error.UNKNOWN_ERROR:
                    console.error('An unknown error occurred.');
                    break;
            }
        })

}

//----------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------







searchBtn.addEventListener('click', getCityCorrdinates);
currentLocation.addEventListener('click', getUserCoordinates);

//calling getCityCorrdinates on keypress
cityInput.addEventListener('keyup', (e) => {
    e.key === "Enter" && getCityCorrdinates();
})