interface AboutWidgetOptions {
    element: HTMLElement;
    weatherContent: HTMLElement;
}

export class AboutWidget {
    private readonly element:
        HTMLElement;

    private readonly weatherContent:
        HTMLElement;

    constructor({
                    element,
                    weatherContent,
                }: AboutWidgetOptions) {
        this.element =
            element;

        this.weatherContent =
            weatherContent;
    }

    show(): void {
        this.weatherContent.hidden =
            true;

        this.element.hidden =
            false;
    }

    hide(): void {
        this.element.hidden =
            true;

        this.weatherContent.hidden =
            false;
    }
}