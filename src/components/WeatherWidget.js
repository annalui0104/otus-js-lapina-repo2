export class WeatherWidget {
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
                }) {
        this.cityName = cityName;
        this.temperature = temperature;
        this.condition = condition;
        this.weatherBlock = weatherBlock;
        this.mapSection = mapSection;
        this.map = map;
        this.error = error;
        this.mapService = mapService;

        eventBus.on(
            "weather:loaded",
            (data) => this.render(data),
        );

        eventBus.on(
            "weather:error",
            (message) =>
                this.showError(message),
        );
    }

    render({
               city,
               country,
               weather,
               latitude,
               longitude,
           }) {
        this.error.hidden = true;

        this.cityName.textContent =
            country
                ? `${city}, ${country}`
                : city;

        this.temperature.textContent =
            `${Math.round(
                weather.temperature_2m,
            )} °C`;

        this.condition.textContent =
            this.getWeatherDescription(
                weather.weather_code,
            );

        this.map.src =
            this.mapService.createMapUrl(
                latitude,
                longitude,
            );

        this.map.alt =
            `Карта города ${city}`;

        this.weatherBlock.hidden = false;
        this.mapSection.hidden = false;
    }

    showError(message) {
        this.error.textContent = message;
        this.error.hidden = false;

        this.weatherBlock.hidden = true;
        this.mapSection.hidden = true;
    }

    getWeatherDescription(code) {
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

        return descriptions[code] ??
            "Нет данных";
    }
}