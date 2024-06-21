const OWMAPI = 'a2f94a753ac3b868acf178ecb1f6b0c2';

document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const city = document.getElementById('city-input').value;
    if (city) {
        getWeatherData(city);
    }
})

function getWeatherData(city) {
    fetch('http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OWMAPI}')
        .then(Response => Response.json())
        .then(data => {
            displayCurrentWeather(data);
            saveToHistory(city);
            getForecast(data.coord.lat, data.coord.lon);
        })
        .catch(error => console.error('error fetching data:', error));
}

function displayCurrentWeather(data) {
    const currentWeatherEl = document.getElementById('current-weather-data');
    const tempFahrenheit = kelvintoFahrenheit(data.main.temp);
    const windSpeedMph = metersPerSecondToMph(data.wind.speed);
    currentWeatherEl.innerHTML = `
        <div class="weather-card">
            <h3>${data.name}</h3>
            <p> Date: ${new Date().toLocaleDateString} </p>
            <img src ="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${day.weather[0].description}">
            <p> Temperature: ${tempFahrenheit.toFixed(2)}°F</p>
            <p> Humidity: ${data.main.humidity}% </p>
            <p> Wind Speed: ${windSpeedMph.toFixed(2)}mph</p>
        </div>
    `;    
}

function kelvintoFahrenheit(kelvin) {
    return((kelvin - 273.15) * 9 / 5) + 32;
}

function metersPerSecondToMph(metersPerSecond) {
    return metersPerSecond * 2.23694;
}