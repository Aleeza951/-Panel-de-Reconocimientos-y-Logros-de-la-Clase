document.addEventListener("DOMContentLoaded", function () {
    const map = L.map('map').setView([51.505, -0.09], 2);  // World centered

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const countryInfo = {
        "USA": {
            "history": "Founded in 1776, the USA is a leading country in the Americas.",
            "famous_landmarks": ["Statue of Liberty", "Grand Canyon", "White House"],
            "famous_personalities": ["Abraham Lincoln", "Oprah Winfrey"],
            "government": "Federal Republic",
            "famous_foods": ["Burgers", "Hot Dogs", "Apple Pie"],
            "population_density": "36 people per square kilometer",
            "tourist_attractions": ["Yellowstone", "Disneyland", "Niagara Falls"],
            "language_family": "Indo-European (English)",
            "currency_symbol": "$",
            "flag_colors": ["Red", "White", "Blue"],
            "national_animal": "Bald Eagle",
            "timezone": "UTC -5 to -10",
            "major_cities": ["New York", "Los Angeles", "Chicago"]
        },
        "France": {
            "history": "Known for its rich cultural history, revolution, and cuisine.",
            "famous_landmarks": ["Eiffel Tower", "Louvre Museum"],
            "famous_personalities": ["Napoleon Bonaparte", "Marie Curie"],
            "government": "Republic",
            "famous_foods": ["Croissant", "Baguette", "Escargot"],
            "population_density": "119 people per square kilometer",
            "tourist_attractions": ["Versailles", "Mont Saint-Michel", "Château de Chambord"],
            "language_family": "Indo-European (French)",
            "currency_symbol": "€",
            "flag_colors": ["Blue", "White", "Red"],
            "national_animal": "Gallic Rooster",
            "timezone": "UTC +1",
            "major_cities": ["Paris", "Marseille", "Lyon"]
        },
        "Japan": {
            "history": "Japan is known for its technological advancements and rich culture.",
            "famous_landmarks": ["Mount Fuji", "Kyoto Temples", "Tokyo Tower"],
            "famous_personalities": ["Emperor Akihito", "Hayao Miyazaki", "Yoko Ono"],
            "government": "Constitutional Monarchy",
            "famous_foods": ["Sushi", "Ramen", "Tempura"],
            "population_density": "347 people per square kilometer",
            "tourist_attractions": ["Hiroshima Peace Memorial", "Nara Park", "Fushimi Inari Shrine"],
            "language_family": "Japonic (Japanese)",
            "currency_symbol": "¥",
            "flag_colors": ["Red", "White"],
            "national_animal": "Japanese Macaque",
            "timezone": "UTC +9",
            "major_cities": ["Tokyo", "Osaka", "Kyoto"]
        },
        "India": {
            "history": "India is one of the world's oldest civilizations, rich in culture and history.",
            "famous_landmarks": ["Taj Mahal", "Qutub Minar", "Red Fort"],
            "famous_personalities": ["Mahatma Gandhi", "Indira Gandhi"],
            "government": "Federal Republic",
            "famous_foods": ["Biryani", "Samosa", "Butter Chicken"],
            "population_density": "464 people per square kilometer",
            "tourist_attractions": ["Kerala Backwaters", "Jaipur Forts", "Golden Temple"],
            "language_family": "Indo-European (Hindi, English)",
            "currency_symbol": "₹",
            "flag_colors": ["Saffron", "White", "Green"],
            "national_animal": "Bengal Tiger",
            "timezone": "UTC +5:30",
            "major_cities": ["New Delhi", "Mumbai", "Bangalore"]
        },
        "Pakistan": {
            "history": "Pakistan was created in 1947 as a separate nation for Muslims in South Asia.",
            "famous_landmarks": ["Badshahi Mosque", "Lahore Fort", "Karimabad"],
            "famous_personalities": ["Quaid-e-Azam Muhammad Ali Jinnah", "Malala Yousafzai", "Imran Khan"],
            "government": "Islamic Republic",
            "famous_foods": ["Biryani", "Nihari", "Seekh Kebabs"],
            "population_density": "287 people per square kilometer",
            "tourist_attractions": ["Fairy Meadows", "Karimabad", "Murree Hills"],
            "language_family": "Indo-European (Urdu, Punjabi)",
            "currency_symbol": "₨",
            "flag_colors": ["Green", "White"],
            "national_animal": "Markhor",
            "timezone": "UTC +5",
            "major_cities": ["Islamabad", "Karachi", "Lahore"]
        },
        "China": {
            "history": "China is one of the oldest civilizations, with a rich history of dynasties.",
            "famous_landmarks": ["Great Wall of China", "Forbidden City", "Terracotta Army"],
            "famous_personalities": ["Confucius", "Mao Zedong", "Jack Ma"],
            "government": "Communist State",
            "famous_foods": ["Peking Duck", "Dim Sum", "Hot Pot"],
            "population_density": "150 people per square kilometer",
            "tourist_attractions": ["Zhangjiajie National Forest", "Potala Palace", "Yangtze River"],
            "language_family": "Sino-Tibetan (Mandarin)",
            "currency_symbol": "¥",
            "flag_colors": ["Red", "Yellow"],
            "national_animal": "Giant Panda",
            "timezone": "UTC +8",
            "major_cities": ["Beijing", "Shanghai", "Hong Kong"]
        },
        "Spain": {
            "history": "Spain is known for its historical empires, art, and Mediterranean culture.",
            "famous_landmarks": ["Sagrada Familia", "Alhambra", "Park Güell"],
            "famous_personalities": ["Pablo Picasso", "Antonio Gaudí", "Salvador Dalí"],
            "government": "Constitutional Monarchy",
            "famous_foods": ["Paella", "Tapas", "Churros"],
            "population_density": "93 people per square kilometer",
            "tourist_attractions": ["La Rambla", "Costa Brava", "Seville Cathedral"],
            "language_family": "Indo-European (Spanish)",
            "currency_symbol": "€",
            "flag_colors": ["Red", "Yellow"],
            "national_animal": "Bull",
            "timezone": "UTC +1",
            "major_cities": ["Madrid", "Barcelona", "Seville"]
        }
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
                            <strong>Lugares famosos:</strong> ${additionalInfo.famous_landmarks ? additionalInfo.famous_landmarks.join(", ") : 'N/A'} <br>
                            <strong>Personalidades famosas:</strong> ${additionalInfo.famous_personalities ? additionalInfo.famous_personalities.join(", ") : 'N/A'} <br>
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
});
