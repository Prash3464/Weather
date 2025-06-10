const input = document.querySelector("input");
const temp = document.querySelector(".temprature span");
const loc = document.querySelector(".location span");
const headingElement = document.querySelector('.name');
const desc = document.querySelector('.weatherDesc span');
const detail = document.querySelector('.weatherDetail');
const date = document.querySelector('.today span');
const sun = document.getElementById("sun");
const moon = document.getElementById("moon");
const stars = document.getElementById("stars");
const clouds = document.getElementById("clouds");
const sky = document.getElementById("sky");
const SunriseTime = document.getElementById("sunrise-time");
const SunsetTime = document.getElementById("sunset-time");
const MoonriseTime = document.getElementById("moonrise-time");
const MoonsetTime = document.getElementById("moonset-time");
// Set the heading text
headingElement.textContent = "Weather App";
const centerX = 150;
const centerY = 150;
const radius = 120;


const time = new Date();
const today = time.getDate();
const month = time.getMonth();
const year = time.getFullYear();



input.addEventListener("keypress", (e) => {
  if (e.key === 'Enter') {
    // console.log(input.value);
    // console.log(e.key);

    getWeather(input.value);
    input.value = "";
  }
});

async function getWeather(city) {
  const url = `https://wttr.in/${city}?format=j1`;

  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    const current = data.current_condition[0];
    const tempValue = current.temp_C;
    const location = data.nearest_area[0].areaName[0].value;
    const weatherDesc = current.weatherDesc[0].value;
    const humidity = current.humidity;
    const windSpeed = current.windspeedKmph;
    const astronomy = data.weather[0].astronomy[0];
    const sunrise = astronomy.sunrise;
  const sunset = astronomy.sunset;
    const moonrise = astronomy.moonrise;
  const moonset = astronomy.moonset;



    console.log(data);
    console.log(weatherDesc);
    date.textContent = `${today}:${month}:${year}  ${time.getHours()}:${time.getMinutes()}`;
    temp.textContent = `${tempValue}°C`;
    loc.textContent = location;
    desc.textContent = weatherDesc;
    detail.innerHTML = `
                <label>Humidity: ${humidity}</label><br>
                <label>Wind Speed: ${windSpeed}Kmph</label> `;
        SunriseTime.textContent = `${sunrise}`;
    SunsetTime.textContent = `${sunset}`;
    // console.log(sunrise, sunset);
       MoonriseTime.textContent = `${moonrise}`;
    MoonsetTime.textContent = `${moonset}`;
    sun.style.display = "block";
    moon.style.display = "block";

    // add wheather condition according to weatherDesc
    if (weatherDesc.toLowerCase().includes("sunny")) {
      sun.style.display = "block";
      moon.style.display = "none";
      clouds.innerHTML = "";
      stars.innerHTML = "";
      

    } else if (weatherDesc.toLowerCase().includes("cloudy")) {
      stars.innerHTML = "";
      if (!clouds.children.length) addClouds();
    }else if (weatherDesc.toLowerCase().includes("rain")) {
      stars.innerHTML = "";
      if (!clouds.children.length) addClouds();
    } else if (weatherDesc.toLowerCase().includes("clear")) {
      sun.style.display = "block";
      moon.style.display = "none";
      stars.innerHTML = "";
    }


    setInterval(() => {
  updateVisuals();
}, 1000);

  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    alert("Error fetching weather data. Please try again.");
  }
}


function updateVisuals() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const timeDecimal = hours + minutes / 60 + seconds / 3600;

  let angleDeg;

  if (timeDecimal >= 6 && timeDecimal < 18) {
    // 🌞 Sun moves from 180° to 0° from 6AM to 6PM
    const progress = (timeDecimal - 6) / 12; // 0 to 1
    angleDeg = 180 - progress * 180;
    const angleRad = (angleDeg * Math.PI) / 180;
    const sunX = centerX + radius * Math.cos(angleRad) - 20;
    const sunY = centerY - radius * Math.sin(angleRad) - 20;
    sun.style.left = `${sunX}px`;
    sun.style.top = `${sunY}px`;
    sun.style.display = "block";
    moon.style.display = "none";




  } else {
    // 🌙 Moon moves from 180° to 0° from 6PM to 6AM
    const nightProgress = timeDecimal >= 18
      ? (timeDecimal - 18) / 12
      : (timeDecimal + 6) / 12;
    angleDeg = 180 - nightProgress * 180;
    const angleRad = (angleDeg * Math.PI) / 180;
    const moonX = centerX + radius * Math.cos(angleRad) - 20;
    const moonY = centerY - radius * Math.sin(angleRad) - 20;
    moon.style.left = `${moonX}px`;
    moon.style.top = `${moonY}px`;
    moon.style.display = "block";
    sun.style.display = "none";

    clouds.innerHTML = "";
    if (!stars.children.length) addStars();
  }
}

function addStars() {
  stars.innerHTML = "";
  for (let i = 0; i < 80; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    stars.appendChild(star);
  }
}

function addClouds() {
  clouds.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    const cloud = document.createElement("div");
    cloud.className = "cloud";
    cloud.style.top = `${Math.random() * 60 + 10}px`;
    cloud.style.animationDuration = `${30 + Math.random() * 40}s`;
    cloud.style.left = `${Math.random() * 100}vw`;
    clouds.appendChild(cloud);
  }
}

