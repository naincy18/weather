// const cityInput=document.querySelector("#city-input");
// const searchBtn=document.querySelector("#search-btn");
// // console.log(cityInput);


// const API_KEY = "2e76d9f7ecba6ff26118211fdc60033c";

// searchBtn.addEventListener("click",()=>{
//      const city=cityInput.value.trim();
//      if(city===""){
//           return;
//      }
//      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
     
//      // Sends a request to the API.
//      fetch(url)  
//      .then(response => response.json())
//      .then(data => {
//           console.log(data);
//      });
//      console.log(url);
// });


// ========== GET ELEMENTS ==========
const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search-btn");
const locationBtn = document.querySelector("#location-btn");
const weatherResult = document.querySelector("#weather-result");
const loadingEl = document.querySelector("#loading");
const errorEl = document.querySelector("#error");
const emptyState = document.querySelector("#empty-state");
const historyEl = document.querySelector("#history");


// Weather display elements
const cityNameEl = document.querySelector("#city-name");
const countryEl = document.querySelector("#country");
const dateTimeEl = document.querySelector("#date-time");
const temperatureEl = document.querySelector("#temperature");
const weatherIconEl = document.querySelector("#weather-icon");
const descriptionEl = document.querySelector("#description");
const feelsLikeEl = document.querySelector("#feels-like");
const humidityEl = document.querySelector("#humidity");
const windEl = document.querySelector("#wind");
const visibilityEl = document.querySelector("#visibility");
const pressureEl = document.querySelector("#pressure");
const cloudsEl = document.querySelector("#clouds");
const forecastEl = document.querySelector("#forecast");


// ========== STATE ==========


let searchHistory = JSON.parse(localStorage.getItem("weatherHistory")) || [];

// ========== HELPER FUNCTIONS ==========

// Show/hide elements
function showLoading() {
    loadingEl.classList.remove("hidden");
    weatherResult.classList.add("hidden");
    errorEl.classList.add("hidden");
    emptyState.classList.add("hidden");
}

function showError() {
    errorEl.classList.remove("hidden");
    loadingEl.classList.add("hidden");
    weatherResult.classList.add("hidden");
    emptyState.classList.add("hidden");
}


function showWeather() {
    weatherResult.classList.remove("hidden");
    loadingEl.classList.add("hidden");
    errorEl.classList.add("hidden");
    emptyState.classList.add("hidden");
}

// ========== ANIMATIONS ==========
function clearAnimations() {
    document.querySelectorAll(".raindrop, .snowflake, .sun-ray, .thunder")
        .forEach(el => el.remove());
}

function startRain() {
    clearAnimations();
    for (let i = 0; i < 80; i++) {
        const drop = document.createElement("div");
        drop.classList.add("raindrop");
        drop.style.left = Math.random() * 100 + "vw";
        drop.style.animationDuration = (Math.random() * 0.5 + 0.5) + "s";
        drop.style.animationDelay = (Math.random() * 2) + "s";
        document.body.appendChild(drop);
    }
}


function startSnow() {
    clearAnimations();
    for (let i = 0; i < 60; i++) {
        const flake = document.createElement("div");
        flake.classList.add("snowflake");
        flake.style.left = Math.random() * 100 + "vw";
        flake.style.width = (Math.random() * 6 + 4) + "px";
        flake.style.height = flake.style.width;
        flake.style.animationDuration = (Math.random() * 3 + 3) + "s";
        flake.style.animationDelay = (Math.random() * 3) + "s";
        document.body.appendChild(flake);
    }
}
function startSun() {
    clearAnimations();
    for (let i = 0; i < 12; i++) {
        const ray = document.createElement("div");
        ray.classList.add("sun-ray");
        ray.style.setProperty("--angle", (i * 30) + "deg");
        ray.style.animationDuration = (Math.random() * 2 + 2) + "s";
        ray.style.animationDelay = (Math.random() * 1) + "s";
        document.body.appendChild(ray);
    }
}


function startThunder() {
    clearAnimations();
    const flash = document.createElement("div");
    flash.classList.add("thunder");
    document.body.appendChild(flash);
    startRain();
}


// Change background based on weather
function setBackground(weatherMain) {
    const body = document.body;
    body.className = "";

    if (weatherMain === "Clear") {
        body.classList.add("weather-clear");
        startSun();
    } else if (weatherMain === "Clouds") {
        body.classList.add("weather-clouds")
        clearAnimations();
    } else if (weatherMain === "Rain" || weatherMain === "Drizzle") {
        body.classList.add("weather-rain");
        startRain();
    } else if (weatherMain === "Snow") {
        body.classList.add("weather-snow");
        startSnow();
    } else if (weatherMain === "Thunderstorm") {
        body.classList.add("weather-thunderstorm");
        startThunder();
    } else if (weatherMain === "Mist" || weatherMain === "Fog" || weatherMain === "Haze") {
        body.classList.add("weather-mist");
        clearAnimations();
    } else {
        body.classList.add("weather-default");
        clearAnimations();
    }
}


// Format date
function formatDate() {
    const now = new Date();
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    };
    return now.toLocaleDateString("en-US", options);
}

// ========== SEARCH HISTORY ==========
function saveHistory(city) {
    if (!searchHistory.includes(city)) {
        searchHistory.unshift(city);
        if (searchHistory.length > 5) {
            searchHistory.pop();
        }
        localStorage.setItem("weatherHistory", JSON.stringify(searchHistory));
    }
    renderHistory();
}



function renderHistory() {
    historyEl.innerHTML = "";

    searchHistory.forEach((city, index) => {
        const wrapper = document.createElement("div");
        wrapper.style.display = "flex";
        wrapper.style.alignItems = "center";
        wrapper.style.gap = "4px";

        const btn = document.createElement("button");
        btn.textContent = city;
        btn.classList.add("history-btn");

        btn.addEventListener("click", () => {
            cityInput.value = city;
            getWeather(city);
        });
         // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "x";
        deleteBtn.classList.add("history-delete");
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            searchHistory.splice(index, 1);
            localStorage.setItem("weatherHistory", JSON.stringify(searchHistory));
            renderHistory();

            // If no history left, reset to empty state
            if (searchHistory.length === 0) {
                weatherResult.classList.add("hidden");
                emptyState.classList.remove("hidden");
                document.body.className = "weather-default";
                cityInput.value = "";
                clearAnimations();
            }
        });
        
        wrapper.appendChild(btn);
        wrapper.appendChild(deleteBtn);
        historyEl.appendChild(wrapper);
    });
}


// ========== GET WEATHER ==========

async function getWeather(city) {
    showLoading();

    try {
        // Current weather
     //    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
     //    const weatherRes = await fetch(weatherUrl);
     //    const weatherData = await weatherRes.json();

     const weatherUrl = `http://localhost:3000/weather?city=${city}`;
     const weatherRes = await fetch(weatherUrl);
     const weatherData = await weatherRes.json();

        if (weatherData.cod !== 200) {
            showError();
            return;
        }

        // Forecast
        const forecastUrl = `http://localhost:3000/forecast?city=${city}`;
        const forecastRes = await fetch(forecastUrl);
        const forecastData = await forecastRes.json();

        // Display weather 
        displayWeather(weatherData);
        displayForecast(forecastData);
       
        saveHistory(weatherData.name);
        setBackground(weatherData.weather[0].main);
        showWeather();
         } catch (error) {
        showError();
    }
}


// ========== DISPLAY WEATHER ==========

function displayWeather(data) {
    cityNameEl.textContent = data.name;
    countryEl.textContent = data.sys.country;
    dateTimeEl.textContent = formatDate();
    temperatureEl.textContent = Math.round(data.main.temp) + "°";
    weatherIconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherIconEl.alt = data.weather[0].description;
    descriptionEl.textContent = data.weather[0].description;
    feelsLikeEl.textContent = Math.round(data.main.feels_like) + "°C";
    humidityEl.textContent = data.main.humidity + "%";
    windEl.textContent = data.wind.speed + " m/s";
    visibilityEl.textContent = (data.visibility / 1000).toFixed(1) + " km";
    pressureEl.textContent = data.main.pressure + " hpa";
    cloudsEl.textContent = data.clouds.all + "%";
}

// ========== DISPLAY FORECAST ==========
function displayForecast(data) {
    forecastEl.innerHTML = "";

    // Get one forecast per day (every 8th item = 24 hours)
    const dailyData = data.list.filter((item, index) => index % 8 === 0);

    dailyData.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short"});
        const icon = day.weather[0].icon;
        const maxTemp = Math.round(day.main.temp_max);
        const minTemp = Math.round(day.main.temp_min);
        const desc = day.weather[0].description;

        const card = document.createElement("div");
        card.classList.add("forecast-card");
        card.innerHTML = `
            <p class="forecast-day">${dayName}</p>
            <img class="forecast-icon"
                src="https://openweathermap.org/img/wn/${icon}@2x.png"
                alt="${desc}">
            <p class="forecast-temp">${maxTemp}°</p>
            <p class="forecast-min">${minTemp}°</p>
            <p class="forecast-desc">${desc}</p>
        `;

        forecastEl.appendChild(card);
    });
}

// ========== EVENT LISTENERS ==========

// Search button
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (!city) return;
    getWeather(city);
});

// Enter key
cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const city = cityInput.value.trim();
        if (!city) return;
        getWeather(city);
    }
});


// Current location button
locationBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    showLoading();

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;

            try {
                const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
                const res = await fetch(url);
                const data = await res.json();

                getWeather(data.name);

            } catch (error) {
                showError();
            }
        },
        () => {
            showError();
        }
    );
});

// ========== INIT ==========

function init() {
    renderHistory();

    // Load last searched city
    if (searchHistory.length > 0) {
        getWeather(searchHistory[0]);
    }
}

init();


