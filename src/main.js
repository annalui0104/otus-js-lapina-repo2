import "./style.css";

import {
    findCity, getCityByCoordinates,
    getWeather,
} from "./weather/api.js";

import {
    addCityToHistory,
    loadHistory,
    saveHistory,
} from "./weather/history.js";
import {getCurrentLocation} from "./weather/location.js";

const searchForm = document.querySelector("#search-form");
const cityInput = document.querySelector("#city-input");

const weatherBlock = document.querySelector("#weather");
const cityName = document.querySelector("#city-name");
const temperature = document.querySelector("#temperature");
const condition = document.querySelector("#condition");

const mapSection = document.querySelector("#map-section");
const map = document.querySelector("#map");

const historyList = document.querySelector("#history");
const error = document.querySelector("#error");

const locationButton =
    document.querySelector("#location-button");

let history = loadHistory();

const getWeatherDescription = (weatherCode) => {
    const descriptions = {
        0: "Ясно",
        1: "Преимущественно ясно",
        2: "Переменная облачность",
        3: "Пасмурно",
        45: "Туман",
        48: "Изморозь",
        51: "Лёгкая морось",
        53: "Морось",
        55: "Сильная морось",
        61: "Небольшой дождь",
        63: "Дождь",
        65: "Сильный дождь",
        71: "Небольшой снег",
        73: "Снег",
        75: "Сильный снег",
        80: "Небольшой ливень",
        81: "Ливень",
        82: "Сильный ливень",
        95: "Гроза",
    };

    return descriptions[weatherCode] ?? "Нет данных";
};

const createMapUrl = (latitude, longitude) => {
    const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;

    const coordinates = `${longitude},${latitude}`;

    return (
        "https://maps.geoapify.com/v1/staticmap" +
        "?style=osm-bright" +
        "&width=600" +
        "&height=300" +
        `&center=lonlat:${coordinates}` +
        "&zoom=10" +
        `&marker=lonlat:${coordinates};color:%23ff0000;size:48` +
        `&apiKey=${apiKey}`
    );
};

const renderHistory = () => {
    historyList.innerHTML = "";

    history.forEach((city) => {
        const item = document.createElement("li");
        const button = document.createElement("button");

        button.type = "button";
        button.textContent = city;

        button.addEventListener("click", () => {
            cityInput.value = city;
            searchWeather(city);
        });

        item.append(button);
        historyList.append(item);
    });
};

const showError = (message) => {
    error.textContent = message;
    error.hidden = false;

    weatherBlock.hidden = true;
    mapSection.hidden = true;
};

const hideError = () => {
    error.textContent = "";
    error.hidden = true;
};

const searchWeather = async (city) => {
    hideError();

    try {
        const cityData = await findCity(city);

        const weather = await getWeather(
            cityData.latitude,
            cityData.longitude,
        );

        cityName.textContent =
            `${cityData.name}, ${cityData.country}`;

        temperature.textContent =
            `${Math.round(weather.temperature_2m)} °C`;

        condition.textContent =
            getWeatherDescription(weather.weather_code);

        map.src = createMapUrl(
            cityData.latitude,
            cityData.longitude,
        );

        map.alt = `Карта города ${cityData.name}`;

        weatherBlock.hidden = false;
        mapSection.hidden = false;

        history = addCityToHistory(
            history,
            cityData.name,
        );

        saveHistory(history);
        renderHistory();
    } catch (searchError) {
        showError(searchError.message);
    }
};
const searchWeatherByLocation = async () => {
    hideError();

    locationButton.disabled = true;
    locationButton.textContent =
        "Определяем местоположение...";

    try {
        const {
            latitude,
            longitude,
        } = await getCurrentLocation();

        const location =
            await getCityByCoordinates(
                latitude,
                longitude,
            );

        const weather = await getWeather(
            latitude,
            longitude,
        );

        const currentCity =
            location.city ??
            location.name ??
            "Ваш город";

        cityName.textContent =
            `${currentCity}, ${location.country ?? ""}`;

        temperature.textContent =
            `${Math.round(weather.temperature_2m)} °C`;

        condition.textContent =
            getWeatherDescription(
                weather.weather_code,
            );

        map.src = createMapUrl(
            latitude,
            longitude,
        );

        map.alt =
            `Карта города ${currentCity}`;

        weatherBlock.hidden = false;
        mapSection.hidden = false;

        history = addCityToHistory(
            history,
            currentCity,
        );

        saveHistory(history);
        renderHistory();
    } catch (locationError) {
        showError(
            locationError.message,
        );
    } finally {
        locationButton.disabled = false;
        locationButton.textContent =
            "📍 Погода рядом со мной";
    }
};

locationButton.addEventListener(
    "click",
    searchWeatherByLocation,
);


searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) {
        showError("Введите название города");
        return;
    }

    searchWeather(city);
});

renderHistory();