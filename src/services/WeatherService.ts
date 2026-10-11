import type {
    CityData,
    WeatherData,
} from "../types/weather";

interface GeocodingResponse {
    results?: CityData[];
}

interface ForecastResponse {
    current?: WeatherData;
}

const defaultFetch = (
    ...args: Parameters<
        typeof fetch
    >
): ReturnType<typeof fetch> =>
    globalThis.fetch(...args);

export class WeatherService {
    private readonly fetchImpl:
        typeof fetch;

    constructor(
        fetchImpl: typeof fetch =
        defaultFetch,
    ) {
        this.fetchImpl =
            fetchImpl;
    }

    async findCity(
        city: string,
    ): Promise<CityData> {
        const url =
            "https://geocoding-api.open-meteo.com/v1/search" +
            `?name=${encodeURIComponent(city)}` +
            "&count=1&language=ru&format=json";

        const response =
            await this.fetchImpl(
                url,
            );

        if (!response.ok) {
            throw new Error(
                "Не удалось найти город",
            );
        }

        const data =
            (await response.json()) as GeocodingResponse;

        if (
            !data.results?.length
        ) {
            throw new Error(
                "Город не найден",
            );
        }

        return data.results[0];
    }

    async getWeather(
        latitude: number,
        longitude: number,
    ): Promise<WeatherData> {
        const url =
            "https://api.open-meteo.com/v1/forecast" +
            `?latitude=${latitude}` +
            `&longitude=${longitude}` +
            "&current=temperature_2m,weather_code" +
            "&timezone=auto";

        const response =
            await this.fetchImpl(
                url,
            );

        if (!response.ok) {
            throw new Error(
                "Не удалось загрузить погоду",
            );
        }

        const data =
            (await response.json()) as ForecastResponse;

        if (!data.current) {
            throw new Error(
                "Данные о погоде отсутствуют",
            );
        }

        return data.current;
    }
}