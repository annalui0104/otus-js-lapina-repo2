import {
    describe,
    expect,
    test,
    vi,
} from "vitest";

import {
    StorageService,
} from "../../services/StorageService.js";

const createStorage = () => {
    const data = {};

    return {
        getItem: vi.fn(
            (key) => data[key] ?? null,
        ),

        setItem: vi.fn(
            (key, value) => {
                data[key] = value;
            },
        ),
    };
};

describe("StorageService", () => {
    test("возвращает пустую историю", () => {
        const storage = createStorage();

        const service =
            new StorageService(storage);

        expect(
            service.getHistory(),
        ).toEqual([]);
    });

    test("сохраняет и читает историю", () => {
        const storage = createStorage();

        const service =
            new StorageService(storage);

        service.saveHistory([
            "Москва",
            "Казань",
        ]);

        expect(
            service.getHistory(),
        ).toEqual([
            "Москва",
            "Казань",
        ]);
    });

    test("не добавляет дубликаты", () => {
        const storage = createStorage();

        const service =
            new StorageService(storage);

        service.addCity("Москва");
        service.addCity("Казань");

        const result =
            service.addCity("Москва");

        expect(result).toEqual([
            "Москва",
            "Казань",
        ]);
    });

    test("игнорирует регистр при поиске дубликатов", () => {
        const storage = createStorage();

        const service =
            new StorageService(storage);

        service.addCity("Москва");

        const result =
            service.addCity("МОСКВА");

        expect(result).toHaveLength(1);
        expect(result[0]).toBe("МОСКВА");
    });

    test("оставляет максимум 10 городов", () => {
        const storage = createStorage();

        const service =
            new StorageService(storage);

        for (let i = 1; i <= 11; i++) {
            service.addCity(
                `Город ${i}`,
            );
        }

        expect(
            service.getHistory(),
        ).toHaveLength(10);
    });

    test("возвращает пустой массив при поврежденном JSON", () => {
        const storage = {
            getItem: vi.fn(
                () => "{bad-json}",
            ),

            setItem: vi.fn(),
        };

        const service =
            new StorageService(storage);

        expect(
            service.getHistory(),
        ).toEqual([]);
    });
});