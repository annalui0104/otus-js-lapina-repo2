import type {
    Coordinates,
    LocationData,
} from "../types/weather";


interface PositionLike {
    coords: {
        latitude: number;
        longitude: number;
    };
}

interface GeolocationErrorLike {
    code: number;
}

export interface GeolocationLike {
    getCurrentPosition(
        successCallback:
        (
            position:
            PositionLike,
        ) => void,

        errorCallback?:
        (
            error:
            GeolocationErrorLike,
        ) => void,

        options?:
        PositionOptions,
    ): void;
}


export interface FetchResponseLike {
    ok: boolean;

    json():
        Promise<unknown>;
}

export type FetchLike =
    (
        url: string,
    ) => Promise<
        FetchResponseLike
    >;


interface LocationServiceOptions {
    geolocation?:
        GeolocationLike |
        null;

    fetchImpl?:
        FetchLike;

    apiKey?: string;
}


interface ReverseResponse {
    results?:
        LocationData[];
}


const defaultFetch:
    FetchLike =
    async (url) => {
        return globalThis.fetch(
            url,
        );
    };


export class LocationService {
    private readonly geolocation:
        GeolocationLike |
        null |
        undefined;

    private readonly fetchImpl:
        FetchLike;

    private readonly apiKey:
        string;


    constructor(
        options: LocationServiceOptions = {},
    ) {
        this.geolocation =
            options.geolocation ??
            (
                typeof navigator !== "undefined"
                    ? navigator.geolocation
                    : undefined
            );

        this.fetchImpl =
            options.fetchImpl ??
            defaultFetch;

        this.apiKey =
            options.apiKey ??
            import.meta.env
                .VITE_GEOAPIFY_API_KEY;
    }


    getCurrentPosition():
        Promise<Coordinates> {
        const geolocation =
            this.geolocation;

        if (!geolocation) {
            return Promise.reject(
                new Error(
                    "Геолокация не поддерживается браузером",
                ),
            );
        }

        return new Promise(
            (
                resolve,
                reject,
            ) => {
                geolocation
                    .getCurrentPosition(
                        (
                            position,
                        ) => {
                            resolve({
                                latitude:
                                position
                                    .coords
                                    .latitude,

                                longitude:
                                position
                                    .coords
                                    .longitude,
                            });
                        },

                        (
                            error,
                        ) => {
                            const messages:
                                Record<
                                    number,
                                    string
                                > = {
                                1:
                                    "Нет доступа к местоположению",

                                2:
                                    "Местоположение недоступно",

                                3:
                                    "Истекло время ожидания геолокации",
                            };

                            reject(
                                new Error(
                                    messages[
                                        error.code
                                        ] ??
                                    "Не удалось определить местоположение",
                                ),
                            );
                        },

                        {
                            enableHighAccuracy:
                                false,

                            timeout:
                                30000,

                            maximumAge:
                                300000,
                        },
                    );
            },
        );
    }


    async getCityByCoordinates(
        latitude: number,
        longitude: number,
    ): Promise<LocationData> {
        if (!this.apiKey) {
            throw new Error(
                "Geoapify API key не указан",
            );
        }

        const url =
            "https://api.geoapify.com/v1/geocode/reverse" +
            `?lat=${latitude}` +
            `&lon=${longitude}` +
            "&type=city" +
            "&format=json" +
            "&lang=ru" +
            `&apiKey=${this.apiKey}`;

        const response =
            await this.fetchImpl(
                url,
            );

        if (!response.ok) {
            throw new Error(
                "Не удалось определить город",
            );
        }

        const data =
            (await response.json()) as ReverseResponse;

        if (
            !data.results?.length
        ) {
            throw new Error(
                "Не удалось определить город",
            );
        }

        return data.results[0];
    }
}