export interface CityData {
    name: string;
    country?: string;
    latitude: number;
    longitude: number;
}

export interface WeatherData {
    temperature_2m: number;
    weather_code: number;
}

export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface LocationData {
    city?: string;
    town?: string;
    village?: string;
    name?: string;
    country?: string;
}

export interface WeatherLoadedPayload {
    city: string;
    country?: string;
    weather: WeatherData;
    latitude: number;
    longitude: number;
}