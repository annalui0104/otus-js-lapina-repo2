export class LocationWidget {
    constructor({
                    button,
                    eventBus,
                }) {
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

    setLoading(isLoading) {
        this.button.disabled = isLoading;

        this.button.textContent =
            isLoading
                ? "Определяем местоположение..."
                : "📍 Погода рядом со мной";
    }
}