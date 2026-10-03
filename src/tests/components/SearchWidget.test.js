import {
    describe,
    expect,
    test,
    vi,
} from "vitest";

import {
    SearchWidget,
} from "../../components/SearchWidget.js";

describe("SearchWidget", () => {
    test("отправляет city:search при submit", () => {
        let submitHandler;

        const form = {
            addEventListener: vi.fn(
                (event, handler) => {
                    if (event === "submit") {
                        submitHandler = handler;
                    }
                },
            ),
        };

        const input = {
            value: "  Москва  ",
        };

        const eventBus = {
            emit: vi.fn(),
        };

        new SearchWidget({
            form,
            input,
            eventBus,
        });

        const event = {
            preventDefault: vi.fn(),
        };

        submitHandler(event);

        expect(
            event.preventDefault,
        ).toHaveBeenCalled();

        expect(
            eventBus.emit,
        ).toHaveBeenCalledWith(
            "city:search",
            "Москва",
        );
    });

    test("не отправляет событие для пустой строки", () => {
        let submitHandler;

        const form = {
            addEventListener: (
                event,
                handler,
            ) => {
                submitHandler = handler;
            },
        };

        const eventBus = {
            emit: vi.fn(),
        };

        new SearchWidget({
            form,
            input: {
                value: "   ",
            },
            eventBus,
        });

        submitHandler({
            preventDefault: vi.fn(),
        });

        expect(
            eventBus.emit,
        ).not.toHaveBeenCalled();
    });
});