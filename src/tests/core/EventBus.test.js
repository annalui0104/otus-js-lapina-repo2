import {
    describe,
    expect,
    test,
    vi,
} from "vitest";

import {
    EventBus,
} from "../../core/EventBus.js";

describe("EventBus", () => {
    test("подписывает обработчик на событие", () => {
        const bus = new EventBus();
        const handler = vi.fn();

        bus.on("test", handler);

        bus.emit("test", "hello");

        expect(handler).toHaveBeenCalledWith(
            "hello",
        );
    });

    test("поддерживает несколько обработчиков", () => {
        const bus = new EventBus();

        const first = vi.fn();
        const second = vi.fn();

        bus.on("test", first);
        bus.on("test", second);

        bus.emit("test", 123);

        expect(first).toHaveBeenCalledWith(
            123,
        );

        expect(second).toHaveBeenCalledWith(
            123,
        );
    });

    test("off удаляет обработчик", () => {
        const bus = new EventBus();
        const handler = vi.fn();

        bus.on("test", handler);

        bus.off("test", handler);

        bus.emit("test");

        expect(handler)
            .not
            .toHaveBeenCalled();
    });

    test("unsubscribe удаляет подписку", () => {
        const bus = new EventBus();
        const handler = vi.fn();

        const unsubscribe =
            bus.on("test", handler);

        unsubscribe();

        bus.emit("test");

        expect(handler)
            .not
            .toHaveBeenCalled();
    });

    test("emit неизвестного события не вызывает ошибку", () => {
        const bus = new EventBus();

        expect(() => {
            bus.emit("unknown");
        }).not.toThrow();
    });

    test("off неизвестного события не вызывает ошибку", () => {
        const bus = new EventBus();

        expect(() => {
            bus.off(
                "unknown",
                () => {},
            );
        }).not.toThrow();
    });
});