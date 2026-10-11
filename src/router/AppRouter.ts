import Navigo from "navigo";

type CityHandler = (
    city: string,
) => void | Promise<void>;

type SimpleHandler =
    () => void | Promise<void>;

export class AppRouter {
    private readonly router:
        Navigo;

    constructor(
        root =
        import.meta.env
            .BASE_URL,
    ) {
        const normalizedRoot =
            root === "/"
                ? "/"
                : root.replace(
                    /\/$/,
                    "",
                );

        this.router =
            new Navigo(
                normalizedRoot,
            );
    }

    onCity(
        handler: CityHandler,
    ): this {
        this.router.on(
            "/city/:cityName",
            (match) => {
                const cityName =
                    match?.data
                        ?.cityName;

                if (
                    typeof cityName !==
                    "string"
                ) {
                    return;
                }

                void handler(
                    decodeURIComponent(
                        cityName,
                    ),
                );
            },
        );

        return this;
    }

    onAbout(
        handler: SimpleHandler,
    ): this {
        this.router.on(
            "/about",
            () => {
                void handler();
            },
        );

        return this;
    }

    onHome(
        handler: SimpleHandler,
    ): this {
        this.router.on(
            "/",
            () => {
                void handler();
            },
        );

        return this;
    }

    navigateToCity(
        city: string,
    ): void {
        void this.router.navigate(
            `/city/${encodeURIComponent(
                city,
            )}`,
        );
    }

    navigateToAbout():
        void {
        void this.router.navigate(
            "/about",
        );
    }

    navigateHome():
        void {
        void this.router.navigate(
            "/",
        );
    }

    start(): void {
        this.router.resolve();
    }
}