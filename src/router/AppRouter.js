import Navigo from "navigo";

export class AppRouter {
    constructor(
        root = import.meta.env.BASE_URL,
    ) {
        const normalizedRoot =
            root === "/"
                ? "/"
                : root.replace(/\/$/, "");

        this.router =
            new Navigo(normalizedRoot);
    }

    onCity(handler) {
        this.router.on(
            "/city/:cityName",
            ({ data }) => {
                return handler(
                    decodeURIComponent(
                        data.cityName,
                    ),
                );
            },
        );

        return this;
    }

    onAbout(handler) {
        this.router.on(
            "/about",
            handler,
        );

        return this;
    }

    onHome(handler) {
        this.router.on(handler);

        return this;
    }

    navigateToCity(city) {
        this.router.navigate(
            `/city/${encodeURIComponent(city)}`,
        );
    }

    navigateToAbout() {
        this.router.navigate(
            "/about",
        );
    }

    navigateHome() {
        this.router.navigate("/");
    }

    start() {
        this.router.resolve();
    }
}