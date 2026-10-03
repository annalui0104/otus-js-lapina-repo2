import {
    describe,
    expect,
    test,
    vi,
} from "vitest";

import {
    LocationWidget,
} from "../../components/LocationWidget.js";

describe("LocationWidget", () => {
    const createWidget = () => {
        let clickHandler;
        let loadingHandler;

        const button = {
            disabled: false,
            textContent: "",
            addEventListener: vi.fn(
                (event, handler) => {
                    if (event === "click") {
                        clickHandler = handler;
                    }
                },
            ),
        };

        const eventBus = {
            emit: vi.fn(),

            on: vi.fn(
                (event, handler) => {
                    if (
                        event ===
                        "location:loading"
                    ) {
                        loadingHandler =
                            handler;
                    }
                },
            ),
        };

        new LocationWidget({
            button,
            eventBus,
        });

        return {
            button,
            eventBus,
            clickHandler,
            loadingHandler,
        };
    };

    test("отправляет location:request по клику", () => {
        const {
            eventBus,
            clickHandler,
        } = createWidget();

        clickHandler();

        expect(
            eventBus.emit,
        ).toHaveBeenCalledWith(
            "location:request",
        );
    });

    test("показывает состояние загрузки", () => {
        const {
            button,
            loadingHandler,
        } = createWidget();

        loadingHandler(true);

        expect(button.disabled).toBe(true);

        expect(
            button.textContent,
        ).toBe(
            "Определяем местоположение...",
        );
    });

    test("убирает состояние загрузки", () => {
        const {
            button,
            loadingHandler,
        } = createWidget();

        loadingHandler(false);

        expect(button.disabled).toBe(false);

        expect(
            button.textContent,
        ).toBe(
            "📍 Погода рядом со мной",
        );
    });
});