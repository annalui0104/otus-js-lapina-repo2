export class HistoryWidget {
    constructor({
                    element,
                    eventBus,
                }) {
        this.element = element;
        this.eventBus = eventBus;

        eventBus.on(
            "history:updated",
            (history) =>
                this.render(history),
        );
    }

    render(history) {
        this.element.innerHTML = "";

        history.forEach((city) => {
            const item =
                document.createElement("li");

            const button =
                document.createElement("button");

            button.type = "button";
            button.textContent = city;

            button.addEventListener(
                "click",
                () => {
                    this.eventBus.emit(
                        "city:search",
                        city,
                    );
                },
            );

            item.append(button);
            this.element.append(item);
        });
    }
}