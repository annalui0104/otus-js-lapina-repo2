export interface SearchForm {
    addEventListener(
        eventName: "submit",
        handler: EventListener,
    ): void;
}

export interface SearchInput {
    value: string;
}

export interface SearchWidgetEventBus {
    emit(
        eventName: "city:search",
        city: string,
    ): void;
}

interface SearchWidgetOptions {
    form: SearchForm;
    input: SearchInput;
    eventBus: SearchWidgetEventBus;
}

export class SearchWidget {
    private readonly form:
        SearchForm;

    private readonly input:
        SearchInput;

    private readonly eventBus:
        SearchWidgetEventBus;

    constructor({
                    form,
                    input,
                    eventBus,
                }: SearchWidgetOptions) {
        this.form = form;
        this.input = input;
        this.eventBus = eventBus;

        this.handleSubmit =
            this.handleSubmit.bind(
                this,
            );

        this.form.addEventListener(
            "submit",
            this.handleSubmit,
        );
    }

    private handleSubmit(
        event: Event,
    ): void {
        event.preventDefault();

        const city =
            this.input.value.trim();

        if (!city) {
            return;
        }

        this.eventBus.emit(
            "city:search",
            city,
        );
    }
}