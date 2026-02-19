const apiKey = "b6fb1826e2de5a102dd2bb1239e9df91";
let bgGif = document.getElementById("bgGif");

function getWeatherIcon(weather){
    if(weather=="Clear") return '☀️';
    if(weather=="Rain") return '🌧️';
    if(weather=="Clouds") return '☁️';
    if(weather=="Snow") return '❄️';
    return '🌤️';
}

async function getWeather(){
    const city = document.getElementById("city").value.trim();
    if(!city){alert("Enter a city!"); return;}

    try{
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
        if(!res.ok) throw new Error("City not found");
        const data = await res.json();

        const weatherMain = data.weather[0].main;

        // Left GIF
        bgGif.style.backgroundImage = `url('images/${weatherMain.toLowerCase()}.gif')`;

        // BODY climate-related background
        let body = document.body;
        if(weatherMain=="Clear"){
            body.style.background = "url('images/sunny-bg.jpg') no-repeat center/cover";
        } else if(weatherMain=="Rain"){
            body.style.background = "url('images/rain-bg.jpg') no-repeat center/cover";
        } else if(weatherMain=="Clouds"){
            body.style.background = "url('images/clouds.mp4') no-repeat center/cover";
        } else if(weatherMain=="Snow"){
            body.style.background = "url('images/snow-bg.jpg') no-repeat center/cover";
        } else {
            body.style.background = "url('images/default-climate-bg.jpg') no-repeat center/cover";
        }

        // Today info
        let icon = `<div class="weather-icon">${getWeatherIcon(weatherMain)}</div>`;
        document.getElementById("todayInfo").innerHTML = `
            <p><strong>${data.name}</strong></p>
            ${icon}
            <p>${weatherMain} | ${Math.round(data.main.temp)} °C</p>
            <p>Humidity: ${data.main.humidity}% | Wind: ${data.wind.speed} m/s</p>
        `;

        // 7-day forecast
        const lat = data.coord.lat;
        const lon = data.coord.lon;
        const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
        const forecastData = await forecastRes.json();
        const weeklyContainer = document.getElementById("weeklyForecast");
        weeklyContainer.innerHTML = "";

        const daysMap = {};
        forecastData.list.forEach(item=>{
            const date = new Date(item.dt*1000).toDateString();
            if(!daysMap[date]) daysMap[date]=[];
            daysMap[date].push(item);
        });

        const dayKeys = Object.keys(daysMap).slice(0,7);
        dayKeys.forEach(day=>{
            const dayData = daysMap[day];
            const tempDay = Math.round(dayData.reduce((s,d)=>s+d.main.temp,0)/dayData.length);
            const mainCondition = dayData[0].weather[0].main;

            let iconHtml = `<div class="weather-icon">${getWeatherIcon(mainCondition)}</div>`;

            const card = document.createElement("div");
            card.classList.add("forecast-card");
            if(mainCondition=="Clear") card.classList.add("weather-clear");
            else if(mainCondition=="Rain") card.classList.add("weather-rain");
            else if(mainCondition=="Clouds") card.classList.add("weather-clouds");
            else if(mainCondition=="Snow") card.classList.add("weather-snow");

            card.innerHTML = `
                <strong>${day.slice(0,3)}</strong>
                ${iconHtml}
                <p>${tempDay} °C</p>
                <p>${mainCondition}</p>
            `;
            weeklyContainer.appendChild(card);
        });

    } catch(err){ alert(err.message); }
}
