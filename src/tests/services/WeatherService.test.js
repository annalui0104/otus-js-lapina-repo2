import {
    describe,
    expect,
    test,
    vi,
} from "vitest";

import {
    WeatherService,
} from "../../services/WeatherService.js";

describe("WeatherService", () => {
    test("находит город", async () => {
        const city = {
            name: "Москва",
            latitude: 55.75,
            longitude: 37.61,
        };

        const fetchMock = vi.fn()
            .mockResolvedValue({
                ok: true,
                json: async () => ({
                    results: [city],
                }),
            });

        const service =
            new WeatherService(fetchMock);

        await expect(
            service.findCity("Москва"),
        ).resolves.toEqual(city);
    });

    test("выбрасывает ошибку, если город не найден", async () => {
        const fetchMock = vi.fn()
            .mockResolvedValue({
                ok: true,
                json: async () => ({
                    results: [],
                }),
            });

        const service =
            new WeatherService(fetchMock);

        await expect(
            service.findCity("Unknown"),
        ).rejects.toThrow(
            "Город не найден",
        );
    });

    test("обрабатывает ошибку API поиска", async () => {
        const fetchMock = vi.fn()
            .mockResolvedValue({
                ok: false,
            });

        const service =
            new WeatherService(fetchMock);

        await expect(
            service.findCity("Москва"),
        ).rejects.toThrow(
            "Не удалось найти город",
        );
    });

    test("получает текущую погоду", async () => {
        const current = {
            temperature_2m: 15,
            weather_code: 2,
        };

        const fetchMock = vi.fn()
            .mockResolvedValue({
                ok: true,
                json: async () => ({
                    current,
                }),
            });

        const service =
            new WeatherService(fetchMock);

        await expect(
            service.getWeather(
                55.75,
                37.61,
            ),
        ).resolves.toEqual(current);
    });

    test("обрабатывает ошибку API погоды", async () => {
        const fetchMock = vi.fn()
            .mockResolvedValue({
                ok: false,
            });

        const service =
            new WeatherService(fetchMock);

        await expect(
            service.getWeather(1, 2),
        ).rejects.toThrow(
            "Не удалось загрузить погоду",
        );
    });

    test("обрабатывает отсутствие данных о погоде", async () => {
        const fetchMock = vi.fn()
            .mockResolvedValue({
                ok: true,
                json: async () => ({}),
            });

        const service =
            new WeatherService(fetchMock);

        await expect(
            service.getWeather(1, 2),
        ).rejects.toThrow(
            "Данные о погоде отсутствуют",
        );
    });
});