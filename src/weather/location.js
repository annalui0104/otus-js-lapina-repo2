export const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(
                new Error(
                    "Геолокация не поддерживается вашим браузером",
                ),
            );

            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            () => {
                reject(
                    new Error(
                        "Не удалось определить местоположение",
                    ),
                );
            },
            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 300000,
            },
        );
    });
};