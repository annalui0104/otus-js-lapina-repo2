import type {
    EventBus,
} from "../core/EventBus";

import type {
    AppEvents,
} from "../types/events";

import type {
    WeatherLoadedPayload,
} from "../types/weather";


export interface TextElement {
    textContent: string | null;
}

export interface VisibilityElement {
    hidden: HTMLElement["hidden"];
}

export interface ImageElement {
    src: string;
    alt: string;
}

export interface WeatherMapService {
    createMapUrl(
        latitude: number,
        longitude: number,
    ): string;
}


interface WeatherWidgetOptions {
    cityName: TextElement;

    temperature: TextElement;

    condition: TextElement;

    weatherBlock:
        VisibilityElement;

    mapSection:
        VisibilityElement;

    map:
        ImageElement;

    error:
        TextElement &
        VisibilityElement;

    eventBus:
        EventBus<AppEvents>;

    mapService:
        WeatherMapService;
}


export class WeatherWidget {
    private readonly cityName:
        TextElement;

    private readonly temperature:
        TextElement;

    private readonly condition:
        TextElement;

    private readonly weatherBlock:
        VisibilityElement;

    private readonly mapSection:
        VisibilityElement;

    private readonly map:
        ImageElement;

    private readonly error:
        TextElement &
        VisibilityElement;

    private readonly mapService:
        WeatherMapService;


    constructor({
                    cityName,
                    temperature,
                    condition,
                    weatherBlock,
                    mapSection,
                    map,
                    error,
                    eventBus,
                    mapService,
                }: WeatherWidgetOptions) {
        this.cityName =
            cityName;

        this.temperature =
            temperature;

        this.condition =
            condition;

        this.weatherBlock =
            weatherBlock;

        this.mapSection =
            mapSection;

        this.map =
            map;

        this.error =
            error;

        this.mapService =
            mapService;


        eventBus.on(
            "weather:loaded",
            (data) => {
                this.render(data);
            },
        );


        eventBus.on(
            "weather:error",
            (message) => {
                this.showError(
                    message,
                );
            },
        );
    }


    private render({
                       city,
                       country,
                       weather,
                       latitude,
                       longitude,
                   }: WeatherLoadedPayload): void {
        this.error.hidden =
            true;


        this.cityName.textContent =
            country
                ? `${city}, ${country}`
                : city;


        this.temperature.textContent =
            `${Math.round(
                weather
                    .temperature_2m,
            )} °C`;


        this.condition.textContent =
            this.getWeatherDescription(
                weather
                    .weather_code,
            );


        this.map.src =
            this.mapService
                .createMapUrl(
                    latitude,
                    longitude,
                );


        this.map.alt =
            `Карта города ${city}`;


        this.weatherBlock.hidden =
            false;

        this.mapSection.hidden =
            false;
    }


    private showError(
        message: string,
    ): void {
        this.error.textContent =
            message;

        this.error.hidden =
            false;

        this.weatherBlock.hidden =
            true;

        this.mapSection.hidden =
            true;
    }


    private getWeatherDescription(
        code: number,
    ): string {
        const descriptions:
            Record<
                number,
                string
            > = {
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


        return (
            descriptions[code] ??
            "Нет данных"
        );
    }
}