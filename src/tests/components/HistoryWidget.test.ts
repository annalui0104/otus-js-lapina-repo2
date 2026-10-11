import {
    afterEach,
    describe,
    expect,
    test,
    vi,
} from "vitest";

import {
    HistoryWidget,
} from "../../components/HistoryWidget";

import type {
    HistoryWidgetEventBus,
    HistoryWidgetElement,
} from "../../components/HistoryWidget";


type HistoryHandler =
    (history: string[]) => void;

type ClickHandler =
    () => void;


interface ButtonMock {
    type: string;
    textContent: string;

    addEventListener(
        eventName: string,
        handler: ClickHandler,
    ): void;

    click(): void;
}


const createButtonMock =
    (): ButtonMock => {
        let clickHandler:
            ClickHandler |
            undefined;

        return {
            type: "",
            textContent: "",

            addEventListener(
                _eventName,
                handler,
            ) {
                clickHandler =
                    handler;
            },

            click() {
                clickHandler?.();
            },
        };
    };


describe(
    "HistoryWidget",
    () => {
        afterEach(() => {
            vi.unstubAllGlobals();
        });


        test(
            "отрисовывает историю городов",
            () => {
                let historyHandler:
                    HistoryHandler |
                    undefined;

                const eventBus:
                    HistoryWidgetEventBus =
                    {
                        emit:
                            vi.fn(),

                        on:
                            vi.fn(
                                (
                                    _eventName,
                                    handler,
                                ) => {
                                    historyHandler =
                                        handler;
                                },
                            ),
                    };


                const createdButtons:
                    ButtonMock[] = [];


                const documentMock = {
                    createElement:
                        vi.fn(
                            (
                                tagName:
                                string,
                            ) => {
                                if (
                                    tagName ===
                                    "button"
                                ) {
                                    const button =
                                        createButtonMock();

                                    createdButtons.push(
                                        button,
                                    );

                                    return button;
                                }

                                return {
                                    append:
                                        vi.fn(),
                                };
                            },
                        ),
                };


                vi.stubGlobal(
                    "document",
                    documentMock,
                );


                const element:
                    HistoryWidgetElement =
                    {
                        innerHTML:
                            "old",

                        append:
                            vi.fn(),
                    };


                new HistoryWidget({
                    element,
                    eventBus,
                });


                if (
                    !historyHandler
                ) {
                    throw new Error(
                        "history:updated handler не зарегистрирован",
                    );
                }


                historyHandler([
                    "Москва",
                    "Казань",
                ]);


                expect(
                    element.innerHTML,
                ).toBe("");


                expect(
                    element.append,
                ).toHaveBeenCalledTimes(
                    2,
                );


                expect(
                    createdButtons[0]
                        ?.textContent,
                ).toBe(
                    "Москва",
                );


                expect(
                    createdButtons[1]
                        ?.textContent,
                ).toBe(
                    "Казань",
                );
            },
        );


        test(
            "клик по истории отправляет city:search",
            () => {
                let historyHandler:
                    HistoryHandler |
                    undefined;

                const emit =
                    vi.fn();


                const eventBus:
                    HistoryWidgetEventBus =
                    {
                        emit,

                        on(
                            _eventName,
                            handler,
                        ) {
                            historyHandler =
                                handler;
                        },
                    };


                let createdButton:
                    ButtonMock |
                    undefined;


                vi.stubGlobal(
                    "document",
                    {
                        createElement(
                            tagName:
                            string,
                        ) {
                            if (
                                tagName ===
                                "button"
                            ) {
                                createdButton =
                                    createButtonMock();

                                return createdButton;
                            }

                            return {
                                append:
                                    vi.fn(),
                            };
                        },
                    },
                );


                const element:
                    HistoryWidgetElement =
                    {
                        innerHTML:
                            "",

                        append:
                            vi.fn(),
                    };


                new HistoryWidget({
                    element,
                    eventBus,
                });


                if (
                    !historyHandler
                ) {
                    throw new Error(
                        "history:updated handler не зарегистрирован",
                    );
                }


                historyHandler([
                    "Москва",
                ]);


                if (
                    !createdButton
                ) {
                    throw new Error(
                        "Кнопка города не создана",
                    );
                }


                createdButton.click();


                expect(
                    emit,
                ).toHaveBeenCalledWith(
                    "city:search",
                    "Москва",
                );
            },
        );
    },
);