import {
    describe,
    expect,
    test,
    vi,
} from "vitest";

import {
    SearchWidget,
} from "../../components/SearchWidget";

import type {
    SearchForm,
    SearchInput,
    SearchWidgetEventBus,
} from "../../components/SearchWidget";


const createSubmitEvent = () => {
    const event =
        new Event(
            "submit",
            {
                cancelable: true,
            },
        );

    const preventDefault =
        vi.spyOn(
            event,
            "preventDefault",
        );

    return {
        event,
        preventDefault,
    };
};


describe(
    "SearchWidget",
    () => {
        test(
            "отправляет city:search при submit",
            () => {
                let submitHandler:
                    EventListener |
                    undefined;


                const form:
                    SearchForm = {
                    addEventListener(
                        _eventName,
                        handler,
                    ) {
                        submitHandler =
                            handler;
                    },
                };


                const input:
                    SearchInput = {
                    value:
                        "  Москва  ",
                };


                const emit =
                    vi.fn();


                const eventBus:
                    SearchWidgetEventBus =
                    {
                        emit,
                    };


                new SearchWidget({
                    form,
                    input,
                    eventBus,
                });


                if (!submitHandler) {
                    throw new Error(
                        "Обработчик submit не зарегистрирован",
                    );
                }


                const {
                    event,
                    preventDefault,
                } =
                    createSubmitEvent();


                submitHandler(
                    event,
                );


                expect(
                    preventDefault,
                ).toHaveBeenCalled();


                expect(
                    emit,
                ).toHaveBeenCalledWith(
                    "city:search",
                    "Москва",
                );
            },
        );


        test(
            "не отправляет событие для пустой строки",
            () => {
                let submitHandler:
                    EventListener |
                    undefined;


                const form:
                    SearchForm = {
                    addEventListener(
                        _eventName,
                        handler,
                    ) {
                        submitHandler =
                            handler;
                    },
                };


                const input:
                    SearchInput = {
                    value:
                        "   ",
                };


                const emit =
                    vi.fn();


                const eventBus:
                    SearchWidgetEventBus =
                    {
                        emit,
                    };


                new SearchWidget({
                    form,
                    input,
                    eventBus,
                });


                if (!submitHandler) {
                    throw new Error(
                        "Обработчик submit не зарегистрирован",
                    );
                }


                const event =
                    new Event(
                        "submit",
                    );


                submitHandler(
                    event,
                );


                expect(
                    emit,
                ).not.toHaveBeenCalled();
            },
        );
    },
);