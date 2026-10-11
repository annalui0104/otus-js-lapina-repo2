export interface LocationButton {
    disabled: boolean;
    textContent: string | null;

    addEventListener(
        eventName: "click",
        handler: EventListener,
    ): void;
}

export interface LocationWidgetEventBus {
    emit(
        eventName: "location:request",
    ): void;

    on(
        eventName: "location:loading",
        handler: (
            isLoading: boolean,
        ) => void,
    ): void;
}

interface LocationWidgetOptions {
    button: LocationButton;
    eventBus: LocationWidgetEventBus;
}

export class LocationWidget {
    private readonly button:
        LocationButton;

    private readonly eventBus:
        LocationWidgetEventBus;

    constructor({
                    button,
                    eventBus,
                }: LocationWidgetOptions) {
        this.button = button;
        this.eventBus = eventBus;

        this.button.addEventListener(
            "click",
            () => {
                this.eventBus.emit(
                    "location:request",
                );
            },
        );

        this.eventBus.on(
            "location:loading",
            (isLoading) => {
                this.setLoading(
                    isLoading,
                );
            },
        );
    }

    private setLoading(
        isLoading: boolean,
    ): void {
        this.button.disabled =
            isLoading;

        this.button.textContent =
            isLoading
                ? "Определяем местоположение..."
                : "📍 Погода рядом со мной";
    }
}