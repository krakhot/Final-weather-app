let apiKey = "6012fc2491a7112eae2e7a250ec9ffa1";
let unit = "metric";
let tempToday = document.querySelector("#temperature-today")

function apiCurrentWeatherSearch (city) {
  let weatherUrl = "https://api.openweathermap.org/data/2.5/weather";
  let apiUrl = `${weatherUrl}?q=${city}&units=${unit}&appid=${apiKey}`;
  axios.get(apiUrl).then(updateWeatherData);
}
function apiForecastSearch(coordinates){
  let forecastUrl = `https://api.openweathermap.org/data/2.5/onecall`
  let apiUrl = `${forecastUrl}?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${unit}`
  axios.get(apiUrl).then(displayForecast)
}
function clearSearchBar(){
  document.querySelector("#city-input").value = "";
}
function determineCurrentCity(response){
  apiCurrentWeatherSearch(response.data[0].name)
}
function determineCoordinates(position) {
  let lat = position.coords.latitude
  let lon = position.coords.longitude
  let geoLocUrl = `https://api.openweathermap.org/geo/1.0/reverse`
  let apiUrl = `${geoLocUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}`
  axios.get(apiUrl).then(determineCurrentCity)
}
function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast")
  let forecast = response.data.daily;
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function(forecastDay, index) {
    if (index < 6) {
      forecastHTML = forecastHTML + ` 
      <div class="col-2 forecast-details">
        <div class="date">${formatForecastDate(forecastDay.dt)}</div>
          <img src="https://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png" alt="weather icon" class="weather-icon-small" />
          <div class="forecast-temperature">
            <span class="forecast-max-temp">
              ${Math.round(forecastDay.temp.max)}°
            </span>
            <span class="forecast-min-temp">
              ${Math.round(forecastDay.temp.min)}°
            </span>               
        </div>
      </div>
      `;
    }
  })
  forecastHTML = forecastHTML + `</div>`
  forecastElement.innerHTML = forecastHTML
}
function formatDate() {
  let now = new Date();
  let weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = weekDays[now.getDay()];
  let hours = now.getHours();
  let minutes = now.getMinutes();
  if (hours < 10) {hours = `0${hours}`;}
  if (minutes < 10) {minutes = `0${minutes}`;}
  return `${day} ${hours}:${minutes}`;
}
function formatForecastDate(timestamp) {
  let weekDays = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];
  let date = new Date(timestamp * 1000)
  let day = date.getDay() + 1;
  if (day >6) {day = 0}
  return weekDays[day]
}
function getCurrentLocation(event) {
  event.preventDefault()
  navigator.geolocation.getCurrentPosition(determineCoordinates)
}
function handleSubmit(event) {
  event.preventDefault();
  let userCity = document.querySelector("#city-input").value;
  apiCurrentWeatherSearch(userCity);
  clearSearchBar()
}
function updateWeatherData(response) {
  document.querySelector("#displayed-city").innerHTML = response.data.name;
  tempToday.innerHTML = Math.round(response.data.main.temp);
  document.querySelector("#description").innerHTML = response.data.weather[0].description;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(response.data.wind.speed);
  document.querySelector("#date").innerHTML = formatDate();
  let weatherIcon = response.data.weather[0].icon;
  let iconElement = document.querySelector("#weather-icon");
  iconElement.setAttribute("src",`https://openweathermap.org/img/wn/${weatherIcon}@2x.png`);
  iconElement.setAttribute("alt", response.data.weather[0].description);
  apiForecastSearch(response.data.coord);
}

document.querySelector("#search-city-form")
  .addEventListener("submit", handleSubmit);
document.querySelector("#current-position-button")
  .addEventListener("click", getCurrentLocation)
  
apiCurrentWeatherSearch("saint-antonin-noble-val");

