import type {
    WeatherLoadedPayload,
} from "./weather";

export interface AppEvents {
    "city:search": string;
    "location:request": void;
    "location:loading": boolean;
    "weather:loaded": WeatherLoadedPayload;
    "weather:error": string;
    "history:updated": string[];
}