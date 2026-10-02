export class LocationService {
    constructor({
                    geolocation = globalThis.navigator?.geolocation,
                    fetchImpl,
                    apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY,
                } = {}) {
        this.geolocation = geolocation;

        this.fetch =
            fetchImpl ??
            ((...args) => globalThis.fetch(...args));

        this.apiKey = apiKey;
    }

    getCurrentPosition() {
        if (!this.geolocation) {
            return Promise.reject(
                new Error(
                    "Геолокация не поддерживается браузером",
                ),
            );
        }

        return new Promise((resolve, reject) => {
            this.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude:
                        position.coords.latitude,
                        longitude:
                        position.coords.longitude,
                    });
                },

                (error) => {
                    const messages = {
                        1: "Нет доступа к местоположению",
                        2: "Местоположение недоступно",
                        3: "Истекло время ожидания геолокации",
                    };

                    reject(
                        new Error(
                            messages[error.code] ??
                            "Не удалось определить местоположение",
                        ),
                    );
                },

                {
                    enableHighAccuracy: false,
                    timeout: 30000,
                    maximumAge: 300000,
                },
            );
        });
    }

    async getCityByCoordinates(
        latitude,
        longitude,
    ) {
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

        const response = await this.fetch(url);

        if (!response.ok) {
            throw new Error(
                "Не удалось определить город",
            );
        }

        const data = await response.json();

        if (!data.results?.length) {
            throw new Error(
                "Не удалось определить город",
            );
        }

        return data.results[0];
    }
}