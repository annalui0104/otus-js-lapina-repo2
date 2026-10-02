export class MapService {
    constructor(
        apiKey =
        import.meta.env.VITE_GEOAPIFY_API_KEY,
    ) {
        this.apiKey = apiKey;
    }

    createMapUrl(latitude, longitude) {
        if (!this.apiKey) {
            throw new Error(
                "Geoapify API key не указан",
            );
        }

        const params = new URLSearchParams({
            style: "osm-bright",
            width: "600",
            height: "300",
            center:
                `lonlat:${longitude},${latitude}`,
            zoom: "10",
            marker:
                `lonlat:${longitude},${latitude};` +
                "color:#ff0000;size:48",
            apiKey: this.apiKey,
        });

        return (
            "https://maps.geoapify.com/v1/staticmap?" +
            params.toString()
        );
    }
}