export class AboutWidget {
    constructor({
                    element,
                    weatherContent,
                }) {
        this.element = element;
        this.weatherContent =
            weatherContent;
    }

    show() {
        this.weatherContent.hidden = true;
        this.element.hidden = false;
    }

    hide() {
        this.element.hidden = true;
        this.weatherContent.hidden = false;
    }
}