const STORAGE_KEY = "weather-history";

export const addCityToHistory = (history, city) => {
    const filtered = history.filter(
        (item) => item.toLowerCase() !== city.toLowerCase(),
    );

    return [city, ...filtered].slice(0, 10);
};

export const loadHistory = () => {
    const value = localStorage.getItem(STORAGE_KEY);

    return value ? JSON.parse(value) : [];
};

export const saveHistory = (history) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};