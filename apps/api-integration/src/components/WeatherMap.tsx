import { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import { WeatherData, SearchData } from "../App";
import { getWeatherMapUrl } from "../services/weatherApi";
import "leaflet/dist/leaflet.css";

interface WeatherMapProps {
  weatherData: WeatherData;
  onLocationSelect: (Object: SearchData) => void;
}

const WeatherMap = ({ weatherData, onLocationSelect }: WeatherMapProps) => {
  const [mapType, setMapType] = useState<string>("precipitation_new");
  const [zoom, setZoom] = useState<number>(10);
  const [mapUrl, setMapUrl] = useState("");
  const [coord, setCoord] = useState({
    lat: weatherData.location.lat,
    lon: weatherData.location.lon,
  });

  useEffect(() => {
    const fetchWeatherMap = async () => {
      try {
        const results = await getWeatherMapUrl(mapType, zoom);
        setMapUrl(results);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setMapUrl("");
      }
    };
    setCoord({
      lat: weatherData.location.lat,
      lon: weatherData.location.lon,
    });
    const debounceTimer = setTimeout(fetchWeatherMap, 500);
    return () => clearTimeout(debounceTimer);
  }, [mapType, zoom, weatherData.location]);

  const MapClickHandler = () => {
    useMapEvents({
      click(e: any) {
        const { lat, lng } = e.latlng;
        onLocationSelect({ id: Date.now(), name: "map", lat: lat, lon: lng });
      },
      zoomend: (event) => {
        const map = event.target;
        const zoom = map.getZoom();
        setZoom(zoom);
      },
    });
    return null;
  };

  return (
    <div className="weather-map-container">
      <h3>Weather Map</h3>

      <div className="map-controls">
        <div className="map-type-selector">
          <button
            className={mapType === "precipitation_new" ? "active" : ""}
            onClick={() => setMapType("precipitation_new")}
          >
            Precipitation
          </button>
          <button
            className={mapType === "temp_new" ? "active" : ""}
            onClick={() => setMapType("temp_new")}
          >
            Temperature
          </button>
          <button
            className={mapType === "wind_new" ? "active" : ""}
            onClick={() => setMapType("wind_new")}
          >
            Wind
          </button>
        </div>
      </div>

      <MapContainer
        key={`${coord.lat}-${coord.lon}`}
        center={[weatherData.location.lat, weatherData.location.lon]}
        zoom={10}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <TileLayer url={mapUrl} />
        <MapClickHandler />
      </MapContainer>

      <div className="map-footer">
        <p>
          Map showing {mapType.replace("_new", "")} for{" "}
          {weatherData.location.name}, {weatherData.location.country}
        </p>
        <p className="map-coordinates">
          Lat: {coord.lat.toFixed(4)}, Lon: {coord.lon.toFixed(4)}
        </p>
      </div>
    </div>
  );
};

export default WeatherMap;
