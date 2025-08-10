const apiKey = "Add Api Key";
const resultBox = document.getElementById("weatherResult");
const forecastToggle = document.getElementById("forecastToggle");

window.onload = () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      getWeatherByCoords(lat, lon);
    }, () => {
      resultBox.innerHTML = "Location permission denied.";
    });
  } else {
    resultBox.innerHTML = "Geolocation not supported.";
  }
};

function toggleForecast() {
  const city = document.getElementById("cityInput").value.trim();
  if (city) {
    getWeatherByCity();
  }
}

function getWeatherByCity() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) {
    resultBox.innerHTML = "Please enter a city name.";
    return;
  }

  if (forecastToggle.checked) {
    get5DayForecast(city);
  } else {
    getCurrentWeather(city);
  }
}

function getWeatherByCoords(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => displayCurrentWeather(data))
    .catch(() => resultBox.innerHTML = "Error fetching location weather.");
}

function getCurrentWeather(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      if (data.cod === 200) displayCurrentWeather(data);
      else resultBox.innerHTML = "City not found.";
    });
}

function get5DayForecast(city) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      if (data.cod === "200") displayForecast(data);
      else resultBox.innerHTML = "City not found.";
    });
}

function displayCurrentWeather(data) {
  const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  resultBox.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <img src="${iconUrl}" alt="${data.weather[0].description}">
    <p><strong>🌡 Temperature:</strong> ${data.main.temp}°C</p>
    <p><strong>🌥 Condition:</strong> ${data.weather[0].description}</p>
    <p><strong>💧 Humidity:</strong> ${data.main.humidity}%</p>
    <p><strong>🌬 Wind:</strong> ${data.wind.speed} m/s</p>
  `;
}

function displayForecast(data) {
  let html = `<h2>${data.city.name}, ${data.city.country}</h2>`;
  const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));

  dailyData.forEach(item => {
    const date = new Date(item.dt_txt).toDateString();
    const icon = item.weather[0].icon;
    html += `
      <div style="margin-bottom: 15px;">
        <strong>${date}</strong><br>
        <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="${item.weather[0].description}">
        <p>🌡 ${item.main.temp}°C | 🌥 ${item.weather[0].description}</p>
      </div>
    `;
  });

  resultBox.innerHTML = html;
}
