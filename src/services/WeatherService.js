export class WeatherService {
    constructor(fetchImpl) {
        this.fetch =
            fetchImpl ??
            ((...args) => globalThis.fetch(...args));
    }

    async findCity(city) {
        const url =
            "https://geocoding-api.open-meteo.com/v1/search" +
            `?name=${encodeURIComponent(city)}` +
            "&count=1&language=ru&format=json";

        const response = await this.fetch(url);

        if (!response.ok) {
            throw new Error("Не удалось найти город");
        }

        const data = await response.json();

        if (!data.results?.length) {
            throw new Error("Город не найден");
        }

        return data.results[0];
    }

    async getWeather(latitude, longitude) {
        const url =
            "https://api.open-meteo.com/v1/forecast" +
            `?latitude=${latitude}` +
            `&longitude=${longitude}` +
            "&current=temperature_2m,weather_code" +
            "&timezone=auto";

        const response = await this.fetch(url);

        if (!response.ok) {
            throw new Error("Не удалось загрузить погоду");
        }

        const data = await response.json();

        if (!data.current) {
            throw new Error("Данные о погоде отсутствуют");
        }

        return data.current;
    }
}