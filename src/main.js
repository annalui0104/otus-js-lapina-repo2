import "./style.css";

import { EventBus } from "./core/EventBus.js";

import { SearchWidget } from "./components/SearchWidget.js";
import { LocationWidget } from "./components/LocationWidget.js";
import { WeatherWidget } from "./components/WeatherWidget.js";
import { HistoryWidget } from "./components/HistoryWidget.js";

import { WeatherService } from "./services/WeatherService.js";
import { LocationService } from "./services/LocationService.js";
import { StorageService } from "./services/StorageService.js";
import { MapService } from "./services/MapService.js";


const eventBus = new EventBus();

const weatherService = new WeatherService();
const locationService = new LocationService();
const storageService = new StorageService();
const mapService = new MapService();


new SearchWidget({
    form: document.querySelector(
        "#search-form",
    ),
    input: document.querySelector(
        "#city-input",
    ),
    eventBus,
});


new LocationWidget({
    button: document.querySelector(
        "#location-button",
    ),
    eventBus,
});


new WeatherWidget({
    cityName: document.querySelector(
        "#city-name",
    ),

    temperature: document.querySelector(
        "#temperature",
    ),

    condition: document.querySelector(
        "#condition",
    ),

    weatherBlock: document.querySelector(
        "#weather",
    ),

    mapSection: document.querySelector(
        "#map-section",
    ),

    map: document.querySelector(
        "#map",
    ),

    error: document.querySelector(
        "#error",
    ),

    eventBus,
    mapService,
});


new HistoryWidget({
    element: document.querySelector(
        "#history",
    ),
    eventBus,
});


const updateHistory = (city) => {
    const history =
        storageService.addCity(city);

    eventBus.emit(
        "history:updated",
        history,
    );
};


const loadWeather = async ({
                               city,
                               country,
                               latitude,
                               longitude,
                           }) => {
    const weather =
        await weatherService.getWeather(
            latitude,
            longitude,
        );

    eventBus.emit(
        "weather:loaded",
        {
            city,
            country,
            weather,
            latitude,
            longitude,
        },
    );
};


eventBus.on(
    "city:search",
    async (city) => {
        try {
            const cityData =
                await weatherService.findCity(
                    city,
                );

            await loadWeather({
                city: cityData.name,
                country: cityData.country,
                latitude:
                cityData.latitude,
                longitude:
                cityData.longitude,
            });

            updateHistory(
                cityData.name,
            );
        } catch (error) {
            eventBus.emit(
                "weather:error",
                error.message,
            );
        }
    },
);


eventBus.on(
    "location:request",
    async () => {
        eventBus.emit(
            "location:loading",
            true,
        );

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

            const city =
                location.city ??
                location.town ??
                location.village ??
                location.name ??
                "Ваш город";

            await loadWeather({
                city,
                country:
                location.country,
                latitude,
                longitude,
            });

            updateHistory(city);
        } catch (error) {
            eventBus.emit(
                "weather:error",
                error.message,
            );
        } finally {
            eventBus.emit(
                "location:loading",
                false,
            );
        }
    },
);


eventBus.emit(
    "history:updated",
    storageService.getHistory(),
);