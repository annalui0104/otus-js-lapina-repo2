import {
    describe,
    expect,
    test,
    vi,
} from "vitest";

import {
    WeatherWidget,
} from "../../components/WeatherWidget";

import {
    EventBus,
} from "../../core/EventBus";

import type {
    AppEvents,
} from "../../types/events";

import type {
    WeatherMapService,
} from "../../components/WeatherWidget";


const createWidget = () => {
    const eventBus =
        new EventBus<AppEvents>();

    const elements = {
        cityName: {
            textContent: "",
        },

        temperature: {
            textContent: "",
        },

        condition: {
            textContent: "",
        },

        weatherBlock: {
            hidden: true,
        },

        mapSection: {
            hidden: true,
        },

        map: {
            src: "",
            alt: "",
        },

        error: {
            hidden: true,
            textContent: "",
        },
    };

    const createMapUrl =
        vi.fn<
            (
                latitude: number,
                longitude: number,
            ) => string
        >();

    createMapUrl.mockReturnValue(
        "map-url",
    );

    const mapService:
        WeatherMapService = {
        createMapUrl,
    };

    new WeatherWidget({
        ...elements,
        eventBus,
        mapService,
    });

    return {
        eventBus,
        elements,
        createMapUrl,
    };
};


describe(
    "WeatherWidget",
    () => {
        test(
            "отображает полученную погоду",
            () => {
                const {
                    eventBus,
                    elements,
                    createMapUrl,
                } = createWidget();

                eventBus.emit(
                    "weather:loaded",
                    {
                        city: "Москва",
                        country: "Россия",

                        weather: {
                            temperature_2m: 17.6,
                            weather_code: 2,
                        },

                        latitude: 55.75,
                        longitude: 37.61,
                    },
                );

                expect(
                    elements.cityName
                        .textContent,
                ).toBe(
                    "Москва, Россия",
                );

                expect(
                    elements.temperature
                        .textContent,
                ).toBe(
                    "18 °C",
                );

                expect(
                    elements.condition
                        .textContent,
                ).toBe(
                    "Переменная облачность",
                );

                expect(
                    createMapUrl,
                ).toHaveBeenCalledWith(
                    55.75,
                    37.61,
                );

                expect(
                    elements.map.src,
                ).toBe(
                    "map-url",
                );

                expect(
                    elements.weatherBlock
                        .hidden,
                ).toBe(false);

                expect(
                    elements.mapSection
                        .hidden,
                ).toBe(false);
            },
        );

        test(
            "работает без названия страны",
            () => {
                const {
                    eventBus,
                    elements,
                } = createWidget();

                eventBus.emit(
                    "weather:loaded",
                    {
                        city: "Москва",

                        weather: {
                            temperature_2m: 10,
                            weather_code: 0,
                        },

                        latitude: 1,
                        longitude: 2,
                    },
                );

                expect(
                    elements.cityName
                        .textContent,
                ).toBe(
                    "Москва",
                );
            },
        );

        test(
            "отображает неизвестный код погоды",
            () => {
                const {
                    eventBus,
                    elements,
                } = createWidget();

                eventBus.emit(
                    "weather:loaded",
                    {
                        city: "Москва",

                        weather: {
                            temperature_2m: 10,
                            weather_code: 999,
                        },

                        latitude: 1,
                        longitude: 2,
                    },
                );

                expect(
                    elements.condition
                        .textContent,
                ).toBe(
                    "Нет данных",
                );
            },
        );

        test(
            "показывает ошибку",
            () => {
                const {
                    eventBus,
                    elements,
                } = createWidget();

                eventBus.emit(
                    "weather:error",
                    "Город не найден",
                );

                expect(
                    elements.error
                        .textContent,
                ).toBe(
                    "Город не найден",
                );

                expect(
                    elements.error.hidden,
                ).toBe(false);

                expect(
                    elements.weatherBlock
                        .hidden,
                ).toBe(true);

                expect(
                    elements.mapSection
                        .hidden,
                ).toBe(true);
            },
        );
    },
);