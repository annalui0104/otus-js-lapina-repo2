import {
    afterEach,
    describe,
    expect,
    test,
    vi,
} from "vitest";

import {
    HistoryWidget,
} from "../../components/HistoryWidget.js";

describe("HistoryWidget", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    test("отрисовывает историю городов", () => {
        const handlers = {};

        const eventBus = {
            emit: vi.fn(),

            on: vi.fn(
                (event, handler) => {
                    handlers[event] =
                        handler;
                },
            ),
        };

        const createdButtons = [];

        const documentMock = {
            createElement: vi.fn(
                (tagName) => {
                    if (
                        tagName ===
                        "button"
                    ) {
                        const button = {
                            type: "",
                            textContent: "",
                            addEventListener:
                                vi.fn(
                                    (
                                        event,
                                        handler,
                                    ) => {
                                        button.click =
                                            handler;
                                    },
                                ),
                        };

                        createdButtons.push(
                            button,
                        );

                        return button;
                    }

                    return {
                        append: vi.fn(),
                    };
                },
            ),
        };

        vi.stubGlobal(
            "document",
            documentMock,
        );

        const element = {
            innerHTML: "old",
            append: vi.fn(),
        };

        new HistoryWidget({
            element,
            eventBus,
        });

        handlers["history:updated"]([
            "Москва",
            "Казань",
        ]);

        expect(
            element.innerHTML,
        ).toBe("");

        expect(
            element.append,
        ).toHaveBeenCalledTimes(2);

        expect(
            createdButtons[0]
                .textContent,
        ).toBe("Москва");

        expect(
            createdButtons[1]
                .textContent,
        ).toBe("Казань");
    });

    test("клик по истории отправляет city:search", () => {
        const handlers = {};

        const eventBus = {
            emit: vi.fn(),

            on: (
                event,
                handler,
            ) => {
                handlers[event] =
                    handler;
            },
        };

        let button;

        vi.stubGlobal(
            "document",
            {
                createElement: (
                    tagName,
                ) => {
                    if (
                        tagName ===
                        "button"
                    ) {
                        button = {
                            addEventListener: (
                                event,
                                handler,
                            ) => {
                                button.click =
                                    handler;
                            },
                        };

                        return button;
                    }

                    return {
                        append: vi.fn(),
                    };
                },
            },
        );

        const element = {
            innerHTML: "",
            append: vi.fn(),
        };

        new HistoryWidget({
            element,
            eventBus,
        });

        handlers["history:updated"]([
            "Москва",
        ]);

        button.click();

        expect(
            eventBus.emit,
        ).toHaveBeenCalledWith(
            "city:search",
            "Москва",
        );
    });
});