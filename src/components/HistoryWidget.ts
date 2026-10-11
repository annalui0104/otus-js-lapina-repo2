export interface HistoryWidgetElement {
    innerHTML: string;

    append(
        ...nodes: Array<
            Node | string
        >
    ): void;
}

export interface HistoryWidgetEventBus {
    on(
        eventName:
        "history:updated",

        handler:
        (
            history:
            string[],
        ) => void,
    ): void;

    emit(
        eventName:
        "city:search",

        city: string,
    ): void;
}

interface HistoryWidgetOptions {
    element:
        HistoryWidgetElement;

    eventBus:
        HistoryWidgetEventBus;
}

export class HistoryWidget {
    private readonly element:
        HistoryWidgetElement;

    private readonly eventBus:
        HistoryWidgetEventBus;

    constructor({
                    element,
                    eventBus,
                }: HistoryWidgetOptions) {
        this.element =
            element;

        this.eventBus =
            eventBus;

        this.eventBus.on(
            "history:updated",
            (history) => {
                this.render(
                    history,
                );
            },
        );
    }

    private render(
        history: string[],
    ): void {
        this.element.innerHTML =
            "";

        history.forEach(
            (city) => {
                const item =
                    document.createElement(
                        "li",
                    );

                const button =
                    document.createElement(
                        "button",
                    );

                button.type =
                    "button";

                button.textContent =
                    city;

                button.addEventListener(
                    "click",
                    () => {
                        this.eventBus.emit(
                            "city:search",
                            city,
                        );
                    },
                );

                item.append(
                    button,
                );

                this.element.append(
                    item,
                );
            },
        );
    }
}