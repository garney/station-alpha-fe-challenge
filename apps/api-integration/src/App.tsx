import { useState, useEffect } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import Forecast from "./components/Forecast";
import WeatherMap from "./components/WeatherMap";
import WeatherAlerts from "./components/WeatherAlerts";
import { ApiError } from "./errors";
import { getCurrentWeather, getCachedWeatherData } from "./services/weatherApi";

// Types for weather data
export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_kph: number;
    wind_dir: string;
    humidity: number;
    feelslike_c: number;
    feelslike_f: number;
    uv: number;
  };
  forecast?: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        condition: {
          text: string;
          icon: string;
        };
        daily_chance_of_rain: number;
      };
    }>;
  };
  alerts?: {
    alert: Array<{
      headline: string;
      severity: string;
      urgency: string;
      areas: string;
      desc: string;
      effective: string;
      expires: string;
    }>;
  };
}

export interface SearchData {
  id: string | number;
  lat: number;
  lon: number;
  name: string;
  timestamp?: number;
}

function App() {
  // Weather data state
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  // Loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Error state
  const [error, setError] = useState<string | null>(null);
  // Search query state
  const [searchQuery, setSearchQuery] = useState<SearchData | null>(null);
  // Search history

  useEffect(() => {
    let cashedWeather = getCachedWeatherData("weather");

    !!cashedWeather && setWeatherData(cashedWeather);
  }, []);
  useEffect(() => {
    let showLoaderTimeout: ReturnType<typeof setTimeout>;
    let fetchDebounceTimeout: ReturnType<typeof setTimeout>;

    const fetchWeatherData = async () => {
      if (!searchQuery) {
        return;
      }
      setError(null);
      setIsLoading(false);

      showLoaderTimeout = setTimeout(() => {
        setIsLoading(true);
      }, 1000);
      try {
        const { lat, lon } = searchQuery;
        const results = await getCurrentWeather(lat, lon);
        setWeatherData(results);
      } catch (error) {
        if (error instanceof ApiError) {
          setError(`Error ${error.status}: ${error.message}`);
        } else {
          setError("Some error");
        }
        setWeatherData(null);
      } finally {
        clearTimeout(showLoaderTimeout);
        setIsLoading(false);
      }
    };
    fetchDebounceTimeout = setTimeout(fetchWeatherData, 500);
    return () => {
      clearTimeout(fetchDebounceTimeout);
      clearTimeout(showLoaderTimeout);
    };
  }, [searchQuery]);

  return (
    <div className="weather-app">
      <header className="app-header">
        <h1>Weather Dashboard</h1>
        <p className="app-description">
          Get real-time weather information for any location
        </p>
      </header>

      <main className="app-content">
        <section className="instructions">
          <h2>API Integration Challenge</h2>
          <p>
            Welcome to the Weather Dashboard API Integration Challenge! Your
            task is to implement a weather application that integrates with a
            public weather API.
          </p>
          <div className="task-list">
            <h3>Your Tasks:</h3>
            <ol>
              <li>
                <strong>Current Weather Display</strong>
                <p>
                  Implement a search function and display current weather
                  conditions for the searched location.
                </p>
              </li>
              <li>
                <strong>Search Functionality</strong>
                <p>
                  Add autocomplete/suggestions for city search and remember
                  recent searches.
                </p>
              </li>
              <li>
                <strong>Extended Forecast</strong>
                <p>Show a 5-day forecast with temperature and conditions.</p>
              </li>
              <li>
                <strong>Weather Map</strong>
                <p>
                  Implement a visual map showing weather patterns and allow
                  users to select locations from the map.
                </p>
              </li>
              <li>
                <strong>Weather Alerts</strong>
                <p>
                  Display any weather alerts or warnings for the selected
                  location.
                </p>
              </li>
            </ol>
          </div>
          <div className="api-info">
            <h3>Recommended APIs:</h3>
            <ul>
              <li>
                <a
                  href="https://www.weatherapi.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WeatherAPI.com
                </a>
              </li>
              <li>
                <a
                  href="https://openweathermap.org/api"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  OpenWeatherMap
                </a>
              </li>
              <li>
                <a
                  href="https://www.visualcrossing.com/weather-api"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visual Crossing Weather
                </a>
              </li>
            </ul>
          </div>
        </section>

        <section className="implementation-area">
          <h2>Your Implementation</h2>

          {/* Search Component Placeholder */}
          <SearchBar
            onSearch={setSearchQuery}
            mapValue={
              weatherData
                ? `${weatherData?.location.name}, ${weatherData?.location.country}`
                : ""
            }
          />
          {/* Weather Display Placeholders */}
          <div className="weather-display">
            {error && <div className="error-message">{error}</div>}

            {!isLoading && !error && !weatherData && (
              <div className="no-data">
                Search for a location to see weather information
              </div>
            )}

            {weatherData && !isLoading && (
              <div className="weather-content">
                {/* Current Weather Placeholder */}
                <CurrentWeather weatherData={weatherData} />

                {/* Forecast Placeholder */}
                <Forecast weatherData={weatherData} />

                {/* Weather Map Placeholder */}
                <WeatherMap
                  weatherData={weatherData}
                  onLocationSelect={setSearchQuery}
                />

                {/* Alerts Placeholder */}
                <WeatherAlerts weatherData={weatherData} />
              </div>
            )}
            {isLoading && (
              <div className="loading">Loading weather data...</div>
            )}
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>
          API Integration Challenge | Created for Station Alpha Frontend
          Developer Interviews
        </p>
      </footer>
    </div>
  );
}

export default App;
