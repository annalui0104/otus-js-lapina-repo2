interface StorageLike {
    getItem(
        key: string,
    ): string | null;

    setItem(
        key: string,
        value: string,
    ): void;
}

export class StorageService {
    private readonly storage:
        StorageLike;

    private readonly key:
        string;

    constructor(
        storage:
        StorageLike =
        globalThis
            .localStorage,

        key =
        "weather-history",
    ) {
        this.storage =
            storage;

        this.key =
            key;
    }

    getHistory(): string[] {
        const value =
            this.storage.getItem(
                this.key,
            );

        if (!value) {
            return [];
        }

        try {
            const history:
                unknown =
                JSON.parse(
                    value,
                );

            if (
                !Array.isArray(
                    history,
                )
            ) {
                return [];
            }

            return history.filter(
                (
                    item,
                ): item is string =>
                    typeof item ===
                    "string",
            );
        } catch {
            return [];
        }
    }

    saveHistory(
        history: string[],
    ): void {
        this.storage.setItem(
            this.key,
            JSON.stringify(
                history,
            ),
        );
    }

    addCity(
        city: string,
    ): string[] {
        const normalizedCity =
            city.trim();

        if (!normalizedCity) {
            return this.getHistory();
        }

        const history =
            this.getHistory();

        const filteredHistory =
            history.filter(
                (item) =>
                    item.toLowerCase() !==
                    normalizedCity
                        .toLowerCase(),
            );

        const newHistory = [
            normalizedCity,
            ...filteredHistory,
        ].slice(0, 10);

        this.saveHistory(
            newHistory,
        );

        return newHistory;
    }
}