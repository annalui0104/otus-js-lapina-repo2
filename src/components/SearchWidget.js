export class SearchWidget {
    constructor({
                    form,
                    input,
                    eventBus,
                }) {
        this.form = form;
        this.input = input;
        this.eventBus = eventBus;

        this.handleSubmit =
            this.handleSubmit.bind(this);

        this.form.addEventListener(
            "submit",
            this.handleSubmit,
        );
    }

    handleSubmit(event) {
        event.preventDefault();

        const city = this.input.value.trim();

        if (!city) {
            return;
        }

        this.eventBus.emit(
            "city:search",
            city,
        );
    }
}