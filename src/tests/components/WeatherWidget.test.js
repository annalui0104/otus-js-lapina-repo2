import {
    describe,
    expect,
    test,
    vi,
} from "vitest";

import {
    WeatherWidget,
} from "../../components/WeatherWidget.js";

const createWidget = () => {
    const handlers = {};

    const eventBus = {
        on: vi.fn(
            (event, handler) => {
                handlers[event] = handler;
            },
        ),
    };

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

    const mapService = {
        createMapUrl: vi.fn(
            () => "map-url",
        ),
    };

    new WeatherWidget({
        ...elements,
        eventBus,
        mapService,
    });

    return {
        handlers,
        elements,
        mapService,
    };
};

describe("WeatherWidget", () => {
    test("отображает полученную погоду", () => {
        const {
            handlers,
            elements,
            mapService,
        } = createWidget();

        handlers["weather:loaded"]({
            city: "Москва",
            country: "Россия",

            weather: {
                temperature_2m: 17.6,
                weather_code: 2,
            },

            latitude: 55.75,
            longitude: 37.61,
        });

        expect(
            elements.cityName.textContent,
        ).toBe("Москва, Россия");

        expect(
            elements.temperature
                .textContent,
        ).toBe("18 °C");

        expect(
            elements.condition.textContent,
        ).toBe(
            "Переменная облачность",
        );

        expect(
            mapService.createMapUrl,
        ).toHaveBeenCalledWith(
            55.75,
            37.61,
        );

        expect(
            elements.map.src,
        ).toBe("map-url");

        expect(
            elements.weatherBlock.hidden,
        ).toBe(false);

        expect(
            elements.mapSection.hidden,
        ).toBe(false);
    });

    test("работает без названия страны", () => {
        const {
            handlers,
            elements,
        } = createWidget();

        handlers["weather:loaded"]({
            city: "Москва",

            weather: {
                temperature_2m: 10,
                weather_code: 0,
            },

            latitude: 1,
            longitude: 2,
        });

        expect(
            elements.cityName.textContent,
        ).toBe("Москва");
    });

    test("отображает неизвестный код погоды", () => {
        const {
            handlers,
            elements,
        } = createWidget();

        handlers["weather:loaded"]({
            city: "Москва",

            weather: {
                temperature_2m: 10,
                weather_code: 999,
            },

            latitude: 1,
            longitude: 2,
        });

        expect(
            elements.condition.textContent,
        ).toBe("Нет данных");
    });

    test("показывает ошибку", () => {
        const {
            handlers,
            elements,
        } = createWidget();

        handlers["weather:error"](
            "Город не найден",
        );

        expect(
            elements.error.textContent,
        ).toBe("Город не найден");

        expect(
            elements.error.hidden,
        ).toBe(false);

        expect(
            elements.weatherBlock.hidden,
        ).toBe(true);

        expect(
            elements.mapSection.hidden,
        ).toBe(true);
    });
});