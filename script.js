const OWMAPI = 'a2f94a753ac3b868acf178ecb1f6b0c2';

document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const city = document.getElementById('city-input').value;
    if (city) {
        getWeatherData(city);
    }
})

function getWeatherData(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OWMAPI}`)
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
            <p> Date: ${new Date().toLocaleDateString()} </p>
            <img src ="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}">
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

function getForecast(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OWMAPI}`)
        .then(response => response.json())
        .then(data => {
            displayForecast(data);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function displayForecast(data) {
    const forecastEL = document.getElementById('forecast-data');
    forecastEL.innerHTML = '';
    for (let x = 0; x < data.list.length; x += 8) {
        const day = data.list[x];
        const tempFahrenheit = kelvintoFahrenheit(day.main.temp);
        const windSpeedMph = metersPerSecondToMph(day.wind.speed);
        const weatherCard = document.createElement('div');
        weatherCard.className = 'weather-card';
        weatherCard.innerHTML = `
        <h3> ${new Date(day.dt_txt).toLocaleDateString()} </h3>
        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}">
        <p>Temperature: ${tempFahrenheit.toFixed(2)}°F</p>
        <p>Humidity: ${day.main.humidity}%</p>
        <p>Wind Speed ${windSpeedMph.toFixed(2)} mph</p>
        `;
        forecastEL.appendChild(weatherCard);
    }
}

function saveToHistory(city) {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(history));
        updateHistoryUI();
    }
}

function updateHistoryUI() {
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    history.forEach(city => {
        const li = document.createElement('li');
        li.textContent = city;
        li.addEventListener('click', () => getWeatherData(city));
        historyList.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', updateHistoryUI);