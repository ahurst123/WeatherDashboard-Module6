const OWMAPI = 'a2f94a753ac3b868acf178ecb1f6b0c2';

document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const city = document.getElementById('city-input').value;
    if (city) {
        getWeatherData(city);
    }
})

function getWeatherData(city) {
    fetch('http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}')
        .then(Response => Response.json())
        .then(data => {
            displayCurrentWeather(data);
            saveToHistory(city);
            getForecast(data.coord.lat, data.coord.lon);
        })
        .catch(error => console.error('error fetching data:', error));
}
