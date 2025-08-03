import { WeatherData } from "../App";
import { ApiError, handleApiError } from "../errors";

const API_KEY = "768adddc368a475c650c068925e13db6";
const SECOND_API_KEY = "c660765589de4cb88b0230148250108";
const BASE_URL = "https://api.openweathermap.org/"; //map api
const SECOND_URL = "https://api.weatherapi.com"; //alerts api

/**
 * Get current weather data for a location
 * @param location - City name, zip code, or coordinates
 * @returns Promise with weather data
 */
export const getCurrentWeather = async (
  lat: number,
  lon: number,
): Promise<WeatherData> => {
  try {
    const data = await getWeatherForecast(lat, lon);
    const results = transformWeatherData(data);
    cacheWeatherData("weather", results);
    return results;
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`API Error ${error.status}: ${error.message}`);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

/**
 * Get forecast weather data for a location
 * @param location - City name, zip code, or coordinates
 * @param days - Number of days for forecast (1-10)
 * @returns Promise with weather forecast data
 */
export const getWeatherForecast = async (
  lat: number,
  lon: number,
): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `${SECOND_URL}/v1/forecast.json?q=${lat},${lon}&key=${SECOND_API_KEY}&days=5&alerts=yes`,
    );

    if (!response.ok) return handleApiError(response);
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`API Error ${error.status}: ${error.message}`);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

/**
 * Search for locations (autocomplete)
 * @param query - Partial location name
 * @returns Promise with location suggestions
 */
export const searchLocations = async (query: string): Promise<any[]> => {
  const isZip = /^\d{4,10}$/.test(query);
  const results: any[] = [];

  try {
    if (isZip) {
      const zipResponse = await fetch(
        `${BASE_URL}/geo/1.0/zip?zip=${encodeURIComponent(query)}&appid=${API_KEY}`,
      );

      if (zipResponse.ok) {
        const zipData = await zipResponse.json();
        results.push({
          id: "zip",
          name: `${zipData.name}, ${zipData.country}`,
          lat: zipData.lat,
          lon: zipData.lon,
        });
      } else {
        handleApiError(zipResponse);
      }
    }

    const cityResponse = await fetch(
      `${BASE_URL}geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`,
    );

    if (!cityResponse.ok) {
      handleApiError(cityResponse);
    }

    const cityData = await cityResponse.json();

    cityData.forEach((item: any, index: number) => {
      results.push({
        id: results.length + index, // ensure unique id
        name: `${item.local_names?.eu || item.name}${item.state ? ", " + item.state : ""}, ${item.country}`,
        lat: item.lat,
        lon: item.lon,
      });
    });

    return results;
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`API Error ${error.status}: ${error.message}`);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

/**
 * Transform raw API data to our application's data structure
 * @param data - Raw data from API
 * @returns Transformed WeatherData object
 */
const transformWeatherData = (data: any): WeatherData => {
  const { forecast, current, location, alerts } = data;

  return {
    location: {
      name: location.name,
      country: location.country,
      lat: location.lat,
      lon: location.lon,
    },
    current: {
      temp_c: current?.temp_c || 0,
      temp_f: current?.temp_f || 0,
      condition: {
        text: current.condition.text,
        icon: current.condition.icon,
        code: current.condition.code,
      },
      wind_kph: current.wind_kph,
      wind_dir: current.wind_dir || "N",
      humidity: current.humidity,
      feelslike_c: current.feelslike_c,
      feelslike_f: current.feelslike_f,
      uv: current.uv,
    },
    forecast: !!forecast.forecastday.length
      ? {
          forecastday: forecast.forecastday.map((day: any) => ({
            date: day.date,
            day: {
              maxtemp_c: day.day.maxtemp_c || 0,
              mintemp_c: day.day.mintemp_c || 0,
              condition: {
                text: day.day.condition?.text,
                icon: day.day.condition?.icon,
              },
              daily_chance_of_rain: day.day.daily_chance_of_rain,
            },
          })),
        }
      : undefined,
    alerts: !!alerts?.alert.length
      ? {
          alert: alerts.alert.map((alert: any) => ({
            headline: alert.headline,
            severity: alert.severity,
            urgency: alert.urgency,
            areas: alert.areas,
            desc: alert.desc,
            effective: alert.effective,
            expires: alert.expires,
          })),
        }
      : undefined,
  };
};

/**
 * Get map URL for a location
 * @param lat - Latitude
 * @param lon - Longitude
 * @param zoom - Zoom level (1-18)
 * @param type - Map type (e.g., 'precipitation', 'temp', 'wind')
 * @returns Map URL string
 */
export const getWeatherMapUrl = (
  type: string = "precipitation_new",
  zoom: number,
): string => {
  return `https://tile.openweathermap.org/map/${type}/${zoom}/{x}/{y}.png?appid=${API_KEY}`;
};

/**
 * Cache weather data in localStorage
 * @param key - Cache key
 * @param data - Data to cache
 * @param expirationMinutes - Cache expiration in minutes
 */
export const cacheWeatherData = (
  key: string,
  data: any,
  expirationMinutes: number = 30,
): void => {
  const now = new Date();
  const item = {
    data,
    expiry: now.getTime() + expirationMinutes * 60 * 1000,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

/**
 * Get cached weather data from localStorage
 * @param key - Cache key
 * @returns Cached data or null if expired/not found
 */
export const getCachedWeatherData = (key: string): any | null => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  const now = new Date();

  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }

  return item.data;
};
