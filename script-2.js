
//HTML CSS parts
const cityWeather = document.getElementById('cityWeather')
const weatherIcon = document.getElementById('weatherIcon')
const futureWeatherContainer = document.getElementById('futureWeather');


//Fetch BKK weather data

const weatherBKK = () => {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=Bangkok,TH&units=metric&APPID=ff00ce86f58d26574c1ae87ef3c8000e`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((BKKData) => {
      const cityName = BKKData.name;
      const temperature = BKKData.main.temp.toFixed(1);
      const weatherDescription = BKKData.weather[0].description;

      // Function to format time into readable format
      const formatTime = ts => new Date(ts * 1000).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });

      // Sunrise and sunset in seconds
      const sunrise = BKKData.sys.sunrise;
      const sunset = BKKData.sys.sunset;

      // Sunrise and sunset in readable format
      const sunriseTime = formatTime(BKKData.sys.sunrise);
      const sunsetTime = formatTime(BKKData.sys.sunset);


      // Actual time seconds
      const currentTime = Math.floor(Date.now() / 1000);

      let weatherIcon = "";

      // Check if it is night time (that is if it is before or after sunset - sunrise)
      const isNight = currentTime < sunrise || currentTime > sunset;

      if (isNight) {
        weatherIcon = '<i class="fas fa-moon"></i>'; // Moon night time
      } else if (weatherDescription.toLowerCase().includes("clear")) {
        weatherIcon = '<i class="fas fa-sun"></i>'; // Sun daytime
      } else if (weatherDescription.toLowerCase().includes("cloud") && weatherDescription.toLowerCase().includes("scattered")) {
        weatherIcon = '<i class="fa-solid fa-cloud-sun"></i>'; // Scattered clouds
      } else if (weatherDescription.toLowerCase().includes("cloud") && weatherDescription.toLowerCase().includes("broken")) {
        weatherIcon = '<i class="fa-solid fa-cloud-sun"></i>'; // Broken clouds
      } else if (weatherDescription.toLowerCase().includes("cloud")) {
        weatherIcon = '<i class="fas fa-cloud"></i>'; // Moln
      } else if (weatherDescription.toLowerCase().includes("rain")) {
        weatherIcon = '<i class="fas fa-cloud-showers-heavy"></i>'; // Regn
      } else if (weatherDescription.toLowerCase().includes("snow")) {
        weatherIcon = '<i class="fas fa-snowflake"></i>'; // Snö
      }



      cityWeather.innerHTML = `
      <h2>${cityName} ${weatherIcon}</h2>
      <p>${weatherDescription} | ${temperature}°</p>
      <p>Sunrise: ${sunriseTime}</p>
      <p>Sunset: ${sunsetTime}</p>`;




    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
};

// Call function
weatherBKK();




const ForecastBKK = () => {
  fetch('https://api.openweathermap.org/data/2.5/forecast?q=Bangkok,TH&units=metric&APPID=ff00ce86f58d26574c1ae87ef3c8000e')
    .then((response) => response.json())
    .then((data) => {
      const today = new Date().getDate(); // Get today's date
      const filteredForecast = data.list
        .filter(item => item.dt_txt.includes("12:00:00")) // Keep only 12:00 forecasts
        .filter(item => new Date(item.dt_txt).getDate() > today) // Exclude today
        .slice(0, 4); // Limit to the next 4 days

      // Clear previous content
      futureWeatherContainer.innerHTML = "";

      // Loop through each forecast and append it correctly
      filteredForecast.forEach(item => {
        const date = new Date(item.dt_txt);
        const Forecastweekday = date.toLocaleDateString("en-US", { weekday: "short" }); // Get weekday name
        const ForecastTemp = item.main.temp.toFixed(1); // Round to 1 decimal




        const forecastItem = `<div class="forecast-item"><p>${Forecastweekday}</p><p>${ForecastTemp}°</p></div>`;
        futureWeather.innerHTML += forecastItem;


      });
    })
    .catch((error) => console.error("Error fetching forecast:", error));
};

// Call function
ForecastBKK();


