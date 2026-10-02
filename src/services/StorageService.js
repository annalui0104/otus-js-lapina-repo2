export class StorageService {
    constructor(
        storage = globalThis.localStorage,
        key = "weather-history",
    ) {
        this.storage = storage;
        this.key = key;
    }

    getHistory() {
        const value = this.storage.getItem(this.key);

        if (!value) {
            return [];
        }

        try {
            const history = JSON.parse(value);

            return Array.isArray(history)
                ? history
                : [];
        } catch {
            return [];
        }
    }

    saveHistory(history) {
        this.storage.setItem(
            this.key,
            JSON.stringify(history),
        );
    }

    addCity(city) {
        const normalizedCity = city.trim();

        if (!normalizedCity) {
            return this.getHistory();
        }

        const history = this.getHistory();

        const filteredHistory = history.filter(
            (item) =>
                item.toLowerCase() !==
                normalizedCity.toLowerCase(),
        );

        const newHistory = [
            normalizedCity,
            ...filteredHistory,
        ].slice(0, 10);

        this.saveHistory(newHistory);

        return newHistory;
    }
}