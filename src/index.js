let apiKey = "6012fc2491a7112eae2e7a250ec9ffa1";

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
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${day} ${hours}:${minutes}`;
}
function determineCurrentCity(response){
  apiSearch(response.data[0].name)
}
function determineCoordinates(position) {
  let lat = position.coords.latitude
  let lon = position.coords.longitude
  let geoLocUrl = `http://api.openweathermap.org/geo/1.0/reverse`
  let apiUrl = `${geoLocUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}`
  axios.get(apiUrl).then(determineCurrentCity)
}

function getCurrentLocation(event) {
  event.preventDefault()
  navigator.geolocation.getCurrentPosition(determineCoordinates)
}
function handleSubmit(event) {
  event.preventDefault();
  let userCity = document.querySelector("#city-input").value;
  apiSearch(userCity);
}

function apiSearch(city) {
  let weatherUrl = "https://api.openweathermap.org/data/2.5/weather";
  let unit = "metric";
  let apiUrl = `${weatherUrl}?q=${city}&units=${unit}&appid=${apiKey}`;
  axios.get(apiUrl).then(updateWeatherData);
}

function updateWeatherData(response) {
  document.querySelector("#displayed-city").innerHTML = response.data.name;
  document.querySelector("#temperature-today").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#date").innerHTML = formatDate();
  let weatherIcon = response.data.weather[0].icon;
  let icon = document.querySelector("#weather-icon");
  icon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`
  );
  icon.setAttribute("alt", response.data.weather[0].description);
}
document
  .querySelector("#search-city-form")
  .addEventListener("submit", handleSubmit);
document.querySelector("#current-position-button")
  .addEventListener("click", getCurrentLocation)


apiSearch("Annecy");
