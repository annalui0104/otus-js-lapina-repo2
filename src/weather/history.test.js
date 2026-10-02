import { describe, expect, test } from "vitest";
import { addCityToHistory } from "./history.js";

describe("addCityToHistory", () => {
    test("не добавляет повторяющийся город", () => {
        const history = ["Москва", "Казань"];

        const result = addCityToHistory(history, "Москва");

        expect(result).toEqual([
            "Москва",
            "Казань",
        ]);
    });

    test("оставляет не более 10 городов", () => {
        const history = [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
        ];

        const result = addCityToHistory(history, "11");

        expect(result).toHaveLength(10);
        expect(result[0]).toBe("11");
    });
});