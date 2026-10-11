import {
    describe,
    expect,
    test,
    vi,
} from "vitest";

import {
    LocationWidget,
} from "../../components/LocationWidget";

import type {
    LocationButton,
    LocationWidgetEventBus,
} from "../../components/LocationWidget";


type LoadingHandler = (
    isLoading: boolean,
) => void;


const createWidget = () => {
    let clickHandler:
        EventListener |
        undefined;

    let loadingHandler:
        LoadingHandler |
        undefined;


    const button:
        LocationButton = {
        disabled: false,
        textContent: "",

        addEventListener(
            _eventName,
            handler,
        ) {
            clickHandler =
                handler;
        },
    };


    const emit = vi.fn();


    const eventBus:
        LocationWidgetEventBus =
        {
            emit,

            on(
                _eventName,
                handler,
            ) {
                loadingHandler =
                    handler;
            },
        };


    new LocationWidget({
        button,
        eventBus,
    });


    return {
        button,
        emit,

        getClickHandler:
            () => clickHandler,

        getLoadingHandler:
            () => loadingHandler,
    };
};


describe(
    "LocationWidget",
    () => {
        test(
            "отправляет location:request по клику",
            () => {
                const {
                    emit,
                    getClickHandler,
                } = createWidget();

                const clickHandler =
                    getClickHandler();

                if (!clickHandler) {
                    throw new Error(
                        "Обработчик click не зарегистрирован",
                    );
                }

                clickHandler(
                    new Event(
                        "click",
                    ),
                );

                expect(
                    emit,
                ).toHaveBeenCalledWith(
                    "location:request",
                );
            },
        );


        test(
            "показывает состояние загрузки",
            () => {
                const {
                    button,
                    getLoadingHandler,
                } = createWidget();

                const loadingHandler =
                    getLoadingHandler();

                if (!loadingHandler) {
                    throw new Error(
                        "Обработчик location:loading не зарегистрирован",
                    );
                }

                loadingHandler(true);

                expect(
                    button.disabled,
                ).toBe(true);

                expect(
                    button.textContent,
                ).toBe(
                    "Определяем местоположение...",
                );
            },
        );


        test(
            "убирает состояние загрузки",
            () => {
                const {
                    button,
                    getLoadingHandler,
                } = createWidget();

                const loadingHandler =
                    getLoadingHandler();

                if (!loadingHandler) {
                    throw new Error(
                        "Обработчик location:loading не зарегистрирован",
                    );
                }

                loadingHandler(false);

                expect(
                    button.disabled,
                ).toBe(false);

                expect(
                    button.textContent,
                ).toBe(
                    "📍 Погода рядом со мной",
                );
            },
        );
    },
);