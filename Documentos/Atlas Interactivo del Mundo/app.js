document.addEventListener("DOMContentLoaded", function () {
    const map = L.map('map').setView([51.505, -0.09], 2);  // World centered

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const countryInfo = {
        "USA": { "history": "Founded in 1776, the USA is a leading country in the Americas." },
        "France": { "history": "Known for its rich cultural history, revolution, and cuisine." },
        "Japan": { "history": "Japan is known for its technological advancements and rich culture." },
        "India": { "history": "India is one of the world's oldest civilizations, rich in culture and history." },
        "Pakistan": { "history": "Pakistan was created in 1947 as a separate nation for Muslims in South Asia." },
        "China": { "history": "China is one of the oldest civilizations, with a rich history of dynasties." },
        "Spain": { "history": "Spain is known for its historical empires, art, and Mediterranean culture." }
    };

    // Populate country datalist for autocomplete search
    fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(data => {
            const datalist = document.getElementById("country-list");
            data.forEach(country => {
                const option = document.createElement("option");
                option.value = country.name.common;
                datalist.appendChild(option);
            });
        });

    document.getElementById("search").addEventListener("input", function (e) {
        const countryName = e.target.value.trim();
        if (countryName.length > 2) {
            document.getElementById("loading").style.display = 'block';

            fetch(`https://restcountries.com/v3.1/name/${countryName}`)
                .then(response => response.json())
                .then(data => {
                    document.getElementById("loading").style.display = 'none';
                    if (data && data.length > 0) {
                        const country = data[0];
                        const additionalInfo = countryInfo[country.name.common] || {};

                        document.getElementById("info").innerHTML = `
                            <strong>Nombre:</strong> ${country.name.common} <br>
                            <strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'} <br>
                            <strong>Población:</strong> ${country.population.toLocaleString()} <br>
                            <strong>Región:</strong> ${country.region} <br>
                            <strong>Moneda:</strong> ${Object.values(country.currencies)[0].name} (${Object.keys(country.currencies)[0]}) <br>
                            <strong>Idiomas:</strong> ${Object.values(country.languages).join(", ")} <br>
                            <strong>Zona horaria:</strong> ${country.timezones.join(", ")} <br>
                            <strong>Fronteras:</strong> ${country.borders ? country.borders.join(", ") : 'N/A'} <br>
                            <strong>Historia:</strong> ${additionalInfo.history || 'N/A'} <br>
                        `;
                        document.getElementById("flag").src = country.flags.svg;

                        // Adjust map zoom based on country location
                        map.setView(country.latlng, 5);
                        L.marker(country.latlng).addTo(map).bindPopup(`<b>${country.name.common}</b>`).openPopup();

                        // Fetch weather info for the country
                        const lat = country.latlng[0];
                        const lon = country.latlng[1];

                        fetchWeather(lat, lon);
                    }
                })
                .catch(err => {
                    document.getElementById("loading").style.display = 'none';
                    console.log("Error: ", err);
                });
        }
    });

    // Function to fetch weather info using OpenWeatherMap API
    function fetchWeather(lat, lon) {
        const apiKey = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=es`;

        fetch(weatherUrl)
            .then(response => response.json())
            .then(data => {
                const weather = data.weather[0].description;
                const temp = data.main.temp;
                const humidity = data.main.humidity;

                document.getElementById("weather").innerHTML = `
                    <h3>Clima en ${data.name}</h3>
                    <p><strong>Descripción:</strong> ${weather}</p>
                    <p><strong>Temperatura:</strong> ${temp}°C</p>
                    <p><strong>Humedad:</strong> ${humidity}%</p>
                `;
            })
            .catch(err => {
                console.log("Error fetching weather data: ", err);
            });
    }

    // Initialize the timeline
    const timelineJson = {
        "title": { "text": { "headline": "Línea de Tiempo Histórica" } },
        "events": [
            { "start_date": { "year": "-3000" }, "text": { "headline": "Primeras Civilizaciones", "text": "Surgimiento de las primeras civilizaciones en Mesopotamia y Egipto." } },
            { "start_date": { "year": "-776" }, "text": { "headline": "Primeros Juegos Olímpicos", "text": "Se celebran los primeros Juegos Olímpicos en la antigua Grecia." } },
            { "start_date": { "year": "476" }, "text": { "headline": "Caída del Imperio Romano", "text": "Fin del Imperio Romano de Occidente, marcando el inicio de la Edad Media." } },
            { "start_date": { "year": "622" }, "text": { "headline": "Hégira de Mahoma", "text": "Mahoma y sus seguidores emigran a Medina, marcando el inicio del calendario islámico." } },
            { "start_date": { "year": "1492" }, "text": { "headline": "Descubrimiento de América", "text": "Cristóbal Colón llega a América bajo el patrocinio de los Reyes Católicos." } },
            { "start_date": { "year": "1776" }, "text": { "headline": "Independencia de EE.UU.", "text": "Estados Unidos declara su independencia de Gran Bretaña." } },
            { "start_date": { "year": "1789" }, "text": { "headline": "Revolución Francesa", "text": "El pueblo francés se levanta contra la monarquía." } },
            { "start_date": { "year": "1865" }, "text": { "headline": "Abolición de la Esclavitud en EE.UU.", "text": "Se aprueba la Decimotercera Enmienda, que prohíbe la esclavitud." } },
            { "start_date": { "year": "1914" }, "text": { "headline": "Primera Guerra Mundial", "text": "Comienza la Primera Guerra Mundial tras el asesinato del archiduque Francisco Fernando." } },
            { "start_date": { "year": "1939" }, "text": { "headline": "Segunda Guerra Mundial", "text": "Comienza la Segunda Guerra Mundial con la invasión de Polonia por Alemania." } },
            { "start_date": { "year": "1947" }, "text": { "headline": "Independencia de Pakistán", "text": "Pakistán se convierte en un país independiente." } },
            { "start_date": { "year": "1969" }, "text": { "headline": "Llegada a la Luna", "text": "La misión Apollo 11 lleva a Neil Armstrong a pisar la Luna." } },
            { "start_date": { "year": "1989" }, "text": { "headline": "Caída del Muro de Berlín", "text": "El Muro de Berlín cae, marcando el fin de la Guerra Fría." } },
            { "start_date": { "year": "2001" }, "text": { "headline": "Atentados del 11 de septiembre", "text": "Ataques terroristas en EE.UU. que cambian la política global." } },
            { "start_date": { "year": "2020" }, "text": { "headline": "Pandemia de COVID-19", "text": "El mundo enfrenta una pandemia global debido al coronavirus." } }
        ]
    };
    
    new TL.Timeline('timeline-embed', timelineJson);
});