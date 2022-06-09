let apiKey = "6012fc2491a7112eae2e7a250ec9ffa1";
let tempToday = document.querySelector("#temperature-today")
let celsiusTemperature = null
let celsiusLink = document.querySelector("#celsius-link")
let fahrenheitLink = document.querySelector("#fahrenheit-link")

function apiSearch(city) {
  let weatherUrl = "https://api.openweathermap.org/data/2.5/weather";
  let unit = "metric";
  let apiUrl = `${weatherUrl}?q=${city}&units=${unit}&appid=${apiKey}`;
  axios.get(apiUrl).then(updateWeatherData);
}
function convertToCelsius(event){
  event.preventDefault()
  tempToday.innerHTML = Math.round(celsiusTemperature)
  celsiusLink.classList.add("active")
  fahrenheitLink.classList.remove("active")
}
function convertToFahrenheit(event){
  event.preventDefault()
  let fahrenheitTemp = (celsiusTemperature * 9) / 5 + 32
  tempToday.innerHTML = Math.round(fahrenheitTemp)
  celsiusLink.classList.remove("active")
  fahrenheitLink.classList.add("active")
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
function getCurrentLocation(event) {
  event.preventDefault()
  navigator.geolocation.getCurrentPosition(determineCoordinates)
}
function handleSubmit(event) {
  event.preventDefault();
  let userCity = document.querySelector("#city-input").value;
  apiSearch(userCity);
}
function updateWeatherData(response) {
  document.querySelector("#displayed-city").innerHTML = response.data.name;
  celsiusTemperature = response.data.main.temp
  tempToday.innerHTML = Math.round(celsiusTemperature);
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(response.data.wind.speed);
  document.querySelector("#date").innerHTML = formatDate();
  let weatherIcon = response.data.weather[0].icon;
  let icon = document.querySelector("#weather-icon");
  icon.setAttribute("src",`http://openweathermap.org/img/wn/${weatherIcon}@2x.png`);
  icon.setAttribute("alt", response.data.weather[0].description);

}
document
  .querySelector("#search-city-form")
  .addEventListener("submit", handleSubmit);
document.querySelector("#current-position-button")
  .addEventListener("click", getCurrentLocation)

apiSearch("Annecy");


//unit conversion



celsiusLink.addEventListener("click", convertToCelsius)
fahrenheitLink.addEventListener("click", convertToFahrenheit)
