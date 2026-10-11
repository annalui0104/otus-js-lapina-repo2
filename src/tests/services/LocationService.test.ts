import {
    describe,
    expect,
    test,
    vi,
} from "vitest";

import {
    LocationService,
} from "../../services/LocationService";

import type {
    FetchLike,
    GeolocationLike,
} from "../../services/LocationService";


describe(
    "LocationService",
    () => {
        test(
            "получает координаты пользователя",
            async () => {
                const geolocation:
                    GeolocationLike =
                    {
                        getCurrentPosition(
                            success,
                        ) {
                            success({
                                coords: {
                                    latitude:
                                        10,

                                    longitude:
                                        20,
                                },
                            });
                        },
                    };

                const service =
                    new LocationService({
                        geolocation,
                        apiKey:
                            "test-key",
                    });

                await expect(
                    service
                        .getCurrentPosition(),
                ).resolves.toEqual({
                    latitude: 10,
                    longitude: 20,
                });
            },
        );


        test(
            "обрабатывает отсутствие geolocation",
            async () => {
                const service =
                    new LocationService({
                        geolocation:
                            null,

                        apiKey:
                            "test-key",
                    });

                await expect(
                    service
                        .getCurrentPosition(),
                ).rejects.toThrow(
                    "Геолокация не поддерживается браузером",
                );
            },
        );


        test.each([
            [
                1,
                "Нет доступа к местоположению",
            ],

            [
                2,
                "Местоположение недоступно",
            ],

            [
                3,
                "Истекло время ожидания геолокации",
            ],
        ] as const)(
            "обрабатывает ошибку геолокации %s",
            async (
                code,
                message,
            ) => {
                const geolocation:
                    GeolocationLike =
                    {
                        getCurrentPosition(
                            _success,
                            error,
                        ) {
                            error?.({
                                code,
                            });
                        },
                    };

                const service =
                    new LocationService({
                        geolocation,
                        apiKey:
                            "test-key",
                    });

                await expect(
                    service
                        .getCurrentPosition(),
                ).rejects.toThrow(
                    message,
                );
            },
        );


        test(
            "определяет город по координатам",
            async () => {
                const location = {
                    city:
                        "Москва",

                    country:
                        "Россия",
                };

                const fetchMock:
                    FetchLike =
                    vi.fn(
                        async () => ({
                            ok: true,

                            json:
                                async () => ({
                                    results: [
                                        location,
                                    ],
                                }),
                        }),
                    );

                const service =
                    new LocationService({
                        geolocation:
                            null,

                        fetchImpl:
                        fetchMock,

                        apiKey:
                            "test-key",
                    });

                await expect(
                    service
                        .getCityByCoordinates(
                            55.75,
                            37.61,
                        ),
                ).resolves.toEqual(
                    location,
                );
            },
        );


        test(
            "обрабатывает ошибку reverse geocoding",
            async () => {
                const fetchMock:
                    FetchLike =
                    vi.fn(
                        async () => ({
                            ok: false,

                            json:
                                async () => ({}),
                        }),
                    );

                const service =
                    new LocationService({
                        geolocation:
                            null,

                        fetchImpl:
                        fetchMock,

                        apiKey:
                            "test-key",
                    });

                await expect(
                    service
                        .getCityByCoordinates(
                            1,
                            2,
                        ),
                ).rejects.toThrow(
                    "Не удалось определить город",
                );
            },
        );
    },
);