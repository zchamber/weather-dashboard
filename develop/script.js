
document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '0b490e4a5d7e4284790d472318f18b59';
    const cityInput = document.getElementById('cityInput');
    const searchButton = document.getElementById('searchButton');
    const forecastContainer = document.getElementById('forecast');
    const searchHistoryContainer = document.getElementById('searchHistory');
    const currentWeatherContainer = document.getElementById('currentWeather');

    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    const saveSearchHistory = () => {
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    };

    const renderSearchHistory = () => {
        searchHistoryContainer.innerHTML = searchHistory.map(city => {
            return '<button class="history-item">' + city + '</button>';

        }).join('');

        // Attach a click event listener to each search history item
        searchHistoryContainer.querySelectorAll('.history-item').forEach(historyItem => {
            historyItem.addEventListener('click', () => {
                const city = historyItem.textContent;
                searchCity(city);
            });
        });
    };

    const displayCurrentWeather = (data) => {
        const { name, dt, main, wind, weather } = data;
        const currentDate = new Date(dt * 1000);
        const { temp, humidity } = main;
        const { speed } = wind;
        const weatherIcon = weather[0].icon;

        const currentWeatherElement = document.getElementById('currentWeather');
        currentWeatherElement.innerHTML = `
            <h2>${name} (${currentDate.toLocaleDateString()}) <img src="http://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather Icon"></h2>
            <p>Temperature: ${temp}°F</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${speed} MPH</p>
        `;
    };

    const displayForecast = (data) => {
        forecastContainer.innerHTML = data.list.slice(0, 5).map(forecast => {
            const forecastDate = new Date(forecast.dt * 1000);
            const { temp, humidity } = forecast.main;
            const { speed } = forecast.wind;
            const weatherIcon = forecast.weather[0].icon;

            return `
                <div class="forecast-item">
                    <p>Date: ${forecastDate.toLocaleDateString()}</p>
                    <p><img src="http://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather Icon"></p>
                    <p>Temperature: ${temp}°F</p>
                    <p>Humidity: ${humidity}%</p>
                    <p>Wind Speed: ${speed} MPH</p>
                </div>
            `;
        }).join('');
    };

    const searchCity = (city) => {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                displayCurrentWeather(data);
                return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`);
            })
            .then(response => response.json())
            .then(data => {
                displayForecast(data);
                if (!searchHistory.includes(city)) {
                    searchHistory.push(city);
                    saveSearchHistory();
                    renderSearchHistory();
                }
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
            });
    };

    searchButton.addEventListener('click', () => {
        const city = cityInput.value.trim();
        if (city !== '') {
            searchCity(city);
        }
    });

    renderSearchHistory();
});