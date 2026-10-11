import "./style.css";

import {
    EventBus,
} from "./core/EventBus";

import {
    AppRouter,
} from "./router/AppRouter";

import {
    SearchWidget,
} from "./components/SearchWidget";

import {
    LocationWidget,
} from "./components/LocationWidget";

import {
    WeatherWidget,
} from "./components/WeatherWidget";

import {
    HistoryWidget,
} from "./components/HistoryWidget";

import {
    AboutWidget,
} from "./components/AboutWidget";

import {
    WeatherService,
} from "./services/WeatherService";

import {
    LocationService,
} from "./services/LocationService";

import {
    StorageService,
} from "./services/StorageService";

import {
    MapService,
} from "./services/MapService";

import type {
    AppEvents,
} from "./types/events";


const getElement = <
    T extends Element,
>(
    selector: string,
): T => {
    const element =
        document.querySelector<T>(
            selector,
        );

    if (!element) {
        throw new Error(
            `Не найден элемент: ${selector}`,
        );
    }

    return element;
};


const getErrorMessage = (
    error: unknown,
): string => {
    if (
        error instanceof Error
    ) {
        return error.message;
    }

    return "Неизвестная ошибка";
};


const eventBus =
    new EventBus<AppEvents>();

const router =
    new AppRouter();

const weatherService =
    new WeatherService();

const locationService =
    new LocationService();

const storageService =
    new StorageService();

const mapService =
    new MapService();


const cityInput =
    getElement<HTMLInputElement>(
        "#city-input",
    );


new SearchWidget({
    form:
        getElement<HTMLFormElement>(
            "#search-form",
        ),

    input:
    cityInput,

    eventBus,
});


new LocationWidget({
    button:
        getElement<HTMLButtonElement>(
            "#location-button",
        ),

    eventBus,
});


new WeatherWidget({
    cityName:
        getElement<HTMLElement>(
            "#city-name",
        ),

    temperature:
        getElement<HTMLElement>(
            "#temperature",
        ),

    condition:
        getElement<HTMLElement>(
            "#condition",
        ),

    weatherBlock:
        getElement<HTMLElement>(
            "#weather",
        ),

    mapSection:
        getElement<HTMLElement>(
            "#map-section",
        ),

    map:
        getElement<HTMLImageElement>(
            "#map",
        ),

    error:
        getElement<HTMLElement>(
            "#error",
        ),

    eventBus,
    mapService,
});


new HistoryWidget({
    element:
        getElement<HTMLElement>(
            "#history",
        ),

    eventBus,
});


const aboutWidget =
    new AboutWidget({
        element:
            getElement<HTMLElement>(
                "#about-page",
            ),

        weatherContent:
            getElement<HTMLElement>(
                "#weather-content",
            ),
    });


const updateHistory = (
    city: string,
): void => {
    const history =
        storageService
            .addCity(city);

    eventBus.emit(
        "history:updated",
        history,
    );
};


const loadCityWeather =
    async (
        city: string,
    ): Promise<void> => {
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
                    city:
                    cityData.name,

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
                getErrorMessage(
                    error,
                ),
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
                getErrorMessage(
                    error,
                ),
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

        cityInput.value =
            city;

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


getElement<HTMLAnchorElement>(
    "#home-link",
).addEventListener(
    "click",
    (event) => {
        event.preventDefault();

        router.navigateHome();
    },
);


getElement<HTMLAnchorElement>(
    "#about-link",
).addEventListener(
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