import "./style.css";

import {
    WeatherService,
} from "./services/WeatherService.js";

import {
    LocationService,
} from "./services/LocationService.js";

import {
    StorageService,
} from "./services/StorageService.js";

import {
    MapService,
} from "./services/MapService.js";

const weatherService = new WeatherService();
const locationService = new LocationService();
const storageService = new StorageService();
const mapService = new MapService();

const searchForm =
    document.querySelector("#search-form");

const cityInput =
    document.querySelector("#city-input");

const locationButton =
    document.querySelector("#location-button");

const weatherBlock =
    document.querySelector("#weather");

const cityName =
    document.querySelector("#city-name");

const temperature =
    document.querySelector("#temperature");

const condition =
    document.querySelector("#condition");

const mapSection =
    document.querySelector("#map-section");

const map =
    document.querySelector("#map");

const historyList =
    document.querySelector("#history");

const error =
    document.querySelector("#error");

let history = storageService.getHistory();

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

    return descriptions[weatherCode] ??
        "Нет данных";
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

const showWeather = ({
                         city,
                         country,
                         weather,
                         latitude,
                         longitude,
                     }) => {
    cityName.textContent = country
        ? `${city}, ${country}`
        : city;

    temperature.textContent =
        `${Math.round(weather.temperature_2m)} °C`;

    condition.textContent =
        getWeatherDescription(
            weather.weather_code,
        );

    map.src = mapService.createMapUrl(
        latitude,
        longitude,
    );

    map.alt = `Карта города ${city}`;

    weatherBlock.hidden = false;
    mapSection.hidden = false;
};

const renderHistory = () => {
    historyList.innerHTML = "";

    history.forEach((city) => {
        const item =
            document.createElement("li");

        const button =
            document.createElement("button");

        button.type = "button";
        button.textContent = city;

        button.addEventListener(
            "click",
            () => {
                cityInput.value = city;
                searchWeather(city);
            },
        );

        item.append(button);
        historyList.append(item);
    });
};

const searchWeather = async (city) => {
    hideError();

    try {
        const cityData =
            await weatherService.findCity(city);

        const weather =
            await weatherService.getWeather(
                cityData.latitude,
                cityData.longitude,
            );

        showWeather({
            city: cityData.name,
            country: cityData.country,
            weather,
            latitude: cityData.latitude,
            longitude: cityData.longitude,
        });

        history =
            storageService.addCity(
                cityData.name,
            );

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
        } =
            await locationService
                .getCurrentPosition();

        const location =
            await locationService
                .getCityByCoordinates(
                    latitude,
                    longitude,
                );

        const weather =
            await weatherService.getWeather(
                latitude,
                longitude,
            );

        const currentCity =
            location.city ??
            location.town ??
            location.village ??
            location.name ??
            "Ваш город";

        showWeather({
            city: currentCity,
            country: location.country,
            weather,
            latitude,
            longitude,
        });

        history =
            storageService.addCity(
                currentCity,
            );

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

searchForm.addEventListener(
    "submit",
    (event) => {
        event.preventDefault();

        const city =
            cityInput.value.trim();

        if (!city) {
            showError(
                "Введите название города",
            );
            return;
        }

        searchWeather(city);
    },
);

locationButton.addEventListener(
    "click",
    searchWeatherByLocation,
);

renderHistory();