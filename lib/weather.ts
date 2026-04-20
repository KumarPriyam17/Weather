export interface WeatherData {
    weather: any;
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    feelsLike: number;
    isDay: boolean;
    location: string;
    lat: number;
    lon: number;
}

// Map WMO Weather Codes to our condition strings
// https://open-meteo.com/en/docs
function getWeatherCondition(code: number): string {
    if (code === 0) return 'Clear';
    if (code === 1 || code === 2 || code === 3) return 'Clouds';
    if (code >= 45 && code <= 48) return 'Fog';
    if (code >= 51 && code <= 67) return 'Rain';
    if (code >= 71 && code <= 77) return 'Snow';
    if (code >= 80 && code <= 82) return 'Rain';
    if (code >= 85 && code <= 86) return 'Snow';
    if (code >= 95 && code <= 99) return 'Thunderstorm';
    return 'Clear';
}

export async function getCoordinates(city: string) {
    try {
        const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
                city
            )}&count=1&language=en&format=json`
        );
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            throw new Error('City not found');
        }

        return {
            lat: data.results[0].latitude,
            lon: data.results[0].longitude,
            name: data.results[0].name,
            country: data.results[0].country,
        };
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        throw error;
    }
}

export async function fetchWeather(city: string): Promise<WeatherData> {
    try {
        // 1. Get coordinates
        const coords = await getCoordinates(city);

        // 2. Get weather data
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_WEATHER_API_URL}?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m`
        );
        const data = await response.json();
        const current = data.current;

        return {
            temperature: Math.round(current.temperature_2m),
            condition: getWeatherCondition(current.weather_code),
            humidity: current.relative_humidity_2m,
            windSpeed: current.wind_speed_10m,
            feelsLike: Math.round(current.apparent_temperature),
            isDay: current.is_day === 1,
            location: `${coords.name}, ${coords.country}`,
            lat: coords.lat,
            lon: coords.lon,
        };
    } catch (error) {
        console.error('Error fetching weather:', error);
        throw error;
    }
}

export async function fetchWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
    try {
        // 1. Reverse geocode to get city name
        // We can use the same geocoding API with reverse=true or just search by coordinates if supported, 
        // but Open-Meteo Geocoding API doesn't strictly have a "reverse" endpoint in the same way. 
        // However, we can use a different approach or just display "Current Location".
        // A better free option is often BigDataCloud or similar, but let's stick to Open-Meteo ecosystem if possible.
        // Actually, Open-Meteo doesn't have a direct reverse geocoding endpoint in the free tier easily accessible without looking up docs.
        // Let's try to fetch the weather first.

        // For a better UX, let's try to find the nearest city using the search API with the coordinates? No, that's not how it works.
        // Let's use a simple reverse geocoding service if possible, or just default to a generic name.
        // Actually, https://nominatim.openstreetmap.org/reverse is free and easy.

        let locationName = "Current Location";
        try {
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const geoData = await geoRes.json();
            if (geoData && geoData.address) {
                locationName = geoData.address.city || geoData.address.town || geoData.address.village || "Current Location";
                if (geoData.address.country) {
                    locationName += `, ${geoData.address.country}`;
                }
            }
        } catch (e) {
            console.warn("Reverse geocoding failed", e);
        }

        // 2. Get weather data
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_WEATHER_API_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m`
        );
        const data = await response.json();
        const current = data.current;

        return {
            temperature: Math.round(current.temperature_2m),
            condition: getWeatherCondition(current.weather_code),
            humidity: current.relative_humidity_2m,
            windSpeed: current.wind_speed_10m,
            feelsLike: Math.round(current.apparent_temperature),
            isDay: current.is_day === 1,
            location: locationName,
            lat: lat,
            lon: lon,
        };
    } catch (error) {
        console.error('Error fetching weather by coords:', error);
        throw error;
    }
}

export interface ForecastData {
    day: string;
    tempMax: number;
    tempMin: number;
    condition: string;
}

export async function fetchForecast(lat: number, lon: number): Promise<ForecastData[]> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_WEATHER_API_URL}?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
        );
        const data = await response.json();
        const daily = data.daily;

        return daily.time.map((time: string, index: number) => {
            const date = new Date(time);
            return {
                day: date.toLocaleDateString('en-US', { weekday: 'short' }),
                tempMax: Math.round(daily.temperature_2m_max[index]),
                tempMin: Math.round(daily.temperature_2m_min[index]),
                condition: getWeatherCondition(daily.weather_code[index]),
            };
        });
    } catch (error) {
        console.error('Error fetching forecast:', error);
        return [];
    }
}
