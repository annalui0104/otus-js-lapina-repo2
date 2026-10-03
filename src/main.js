import "./style.css";

import {
    EventBus,
} from "./core/EventBus.js";

import {
    AppRouter,
} from "./router/AppRouter.js";

import {
    SearchWidget,
} from "./components/SearchWidget.js";

import {
    LocationWidget,
} from "./components/LocationWidget.js";

import {
    WeatherWidget,
} from "./components/WeatherWidget.js";

import {
    HistoryWidget,
} from "./components/HistoryWidget.js";

import {
    AboutWidget,
} from "./components/AboutWidget.js";

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


const eventBus = new EventBus();
const router = new AppRouter();

const weatherService =
    new WeatherService();

const locationService =
    new LocationService();

const storageService =
    new StorageService();

const mapService =
    new MapService();


const cityInput =
    document.querySelector(
        "#city-input",
    );


new SearchWidget({
    form: document.querySelector(
        "#search-form",
    ),

    input: cityInput,

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

    weatherBlock:
        document.querySelector(
            "#weather",
        ),

    mapSection:
        document.querySelector(
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


const aboutWidget =
    new AboutWidget({
        element:
            document.querySelector(
                "#about-page",
            ),

        weatherContent:
            document.querySelector(
                "#weather-content",
            ),
    });


const updateHistory = (city) => {
    const history =
        storageService.addCity(city);

    eventBus.emit(
        "history:updated",
        history,
    );
};


const loadCityWeather =
    async (city) => {
        try {
            const cityData =
                await weatherService
                    .findCity(city);

            const weather =
                await weatherService
                    .getWeather(
                        cityData.latitude,
                        cityData.longitude,
                    );

            eventBus.emit(
                "weather:loaded",
                {
                    city: cityData.name,

                    country:
                    cityData.country,

                    weather,

                    latitude:
                    cityData.latitude,

                    longitude:
                    cityData.longitude,
                },
            );

            updateHistory(
                cityData.name,
            );
        } catch (error) {
            eventBus.emit(
                "weather:error",
                error.message,
            );
        }
    };


eventBus.on(
    "city:search",
    (city) => {
        router.navigateToCity(
            city,
        );
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
                location.name;

            if (!city) {
                throw new Error(
                    "Не удалось определить город",
                );
            }

            router.navigateToCity(
                city,
            );
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


router.onCity(
    async (city) => {
        aboutWidget.hide();

        cityInput.value = city;

        await loadCityWeather(
            city,
        );
    },
);


router.onAbout(() => {
    aboutWidget.show();
});


router.onHome(() => {
    aboutWidget.hide();
});


document
    .querySelector(
        "#home-link",
    )
    .addEventListener(
        "click",
        (event) => {
            event.preventDefault();

            router.navigateHome();
        },
    );


document
    .querySelector(
        "#about-link",
    )
    .addEventListener(
        "click",
        (event) => {
            event.preventDefault();

            router.navigateToAbout();
        },
    );


eventBus.emit(
    "history:updated",
    storageService.getHistory(),
);


router.start();