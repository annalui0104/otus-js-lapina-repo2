import {
    describe,
    expect,
    test,
} from "vitest";

import {
    MapService,
} from "../../services/MapService.js";

describe("MapService", () => {
    test("создает URL карты", () => {
        const service =
            new MapService("test-key");

        const url =
            service.createMapUrl(
                55.75,
                37.61,
            );

        expect(url).toContain(
            "https://maps.geoapify.com/v1/staticmap",
        );

        expect(url).toContain(
            "apiKey=test-key",
        );
    });

    test("использует longitude и latitude", () => {
        const service =
            new MapService("test-key");

        const url =
            service.createMapUrl(
                55.75,
                37.61,
            );

        const decoded =
            decodeURIComponent(url);

        expect(decoded).toContain(
            "lonlat:37.61,55.75",
        );
    });

    test("требует API key", () => {
        const service =
            new MapService("");

        expect(() => {
            service.createMapUrl(
                1,
                2,
            );
        }).toThrow(
            "Geoapify API key не указан",
        );
    });
});