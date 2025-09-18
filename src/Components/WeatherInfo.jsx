import React, { useState } from "react";
import {
  Sun,
  Cloud,
  CloudRain,
  Wind,
  Droplets,
  MapPin,
  Search,
} from "lucide-react";
import axios from "axios";

// Weather Icon Component
const WeatherIcon = ({ condition, size = "w-8 h-8" }) => {
  const getIconColor = (condition) => {
    switch (condition) {
      case "sunny":
        return "text-yellow-400";
      case "cloudy":
        return "text-gray-400";
      case "rainy":
        return "text-blue-400";
      default:
        return "text-yellow-400";
    }
  };

  const iconProps = { className: `${size} ${getIconColor(condition)}` };

  switch (condition) {
    case "sunny":
      return <Sun {...iconProps} />;
    case "cloudy":
      return <Cloud {...iconProps} />;
    case "rainy":
      return <CloudRain {...iconProps} />;
    default:
      return <Sun {...iconProps} />;
  }
};

export default function WeatherInfo() {
  const [searchQuery, setSearchQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setSearchQuery(e.target.value);
  }

  async function getLocation(location) {
    const res = await axios.get(
      `https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=1&language=en&format=json`
    );
    if (!res.data.results || res.data.results.length === 0) {
      throw new Error("Location not found");
    }
    const data = res.data.results[0];
    return {
      name: data.name,
      lat: data.latitude,
      long: data.longitude,
    };
  }

  async function getWeatherData(location) {
    try {
      setLoading(true);
      setError("");
      const { name, lat, long } = await getLocation(location);

      const res = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,relative_humidity_2m,is_day,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=7&timezone=auto`
      );

      const current = res.data.current;
      const daily = res.data.daily;
      const hourly = res.data.hourly;

      const mappedForecast = daily.time.map((day, i) => ({
        day,
        high: daily.temperature_2m_max[i],
        low: daily.temperature_2m_min[i],
        condition: mapWeatherCode(daily.weather_code[i]),
      }));

      const mappedHourly = hourly.time.slice(0, 24).map((time, i) => ({
        time,
        temp: hourly.temperature_2m[i],
        condition: mapWeatherCode(hourly.weather_code[i]),
      }));

      setWeather({
        location: name,
        temperature: current.temperature_2m,
        condition: mapWeatherCode(current.weather_code),
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        forecast: mappedForecast,
        hourly: mappedHourly,
      });
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch() {
    if (searchQuery.trim() !== "") {
      getWeatherData(searchQuery.trim());
    }
  }

  function mapWeatherCode(code) {
    if ([0].includes(code)) return "sunny";
    if ([1, 2, 3].includes(code)) return "cloudy";
    if ([51, 61, 80].includes(code)) return "rainy";
    return "sunny";
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 p-4 sm:p-6 flex items-center justify-center">
      <div>
    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
  🌤️ SkyCast <span className="text-slate-400 font-medium text-lg">Your Weather Guide</span>
</h1>
      </div>
      <div className="bg-black rounded-3xl p-6 sm:p-8 text-white w-full max-w-md sm:max-w-lg md:max-w-2xl shadow-2xl">
        {/* Search Bar */}
        <div className="bg-slate-800 rounded-2xl p-3 sm:p-4 shadow-xl mb-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center gap-2 flex-1 bg-slate-900 rounded-lg px-3">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search for a city..."
                value={searchQuery}
                onChange={handleChange}
                className="flex-1 bg-transparent text-white placeholder-slate-400 focus:outline-none text-lg py-2"
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white px-4 py-2 rounded-lg transition-colors font-medium w-full sm:w-auto"
            >
              Search
            </button>
          </div>
        </div>

        {loading && <p className="text-center text-slate-400">Loading...</p>}
        {error && <p className="text-center text-red-400">{error}</p>}

        {weather && !loading && !error && (
          <>
            {/* Location & Temp */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-8">
              <div className="mb-4 sm:mb-0">
                <h2 className="text-2xl sm:text-3xl font-semibold flex items-center gap-2 mb-1">
                  <MapPin className="w-5 h-5" />
                  {weather.location}
                </h2>
                <p className="text-slate-400 text-sm">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-5xl sm:text-6xl font-light">
                  {weather.temperature}°
                </div>
              </div>
            </div>

            {/* Icon & Condition */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 sm:gap-0">
              <WeatherIcon condition={weather.condition} size="w-20 h-20" />
              <div className="text-center sm:text-right">
                <p className="capitalize text-xl font-medium mb-1">
                  {weather.condition}
                </p>
                <p className="text-slate-400">
                  Feels like {weather.temperature}°
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-700/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wind className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-400 text-sm">Wind speed</span>
                </div>
                <span className="text-xl font-medium">
                  {weather.windSpeed} km/h
                </span>
              </div>

              <div className="bg-slate-700/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-400 text-sm">Humidity</span>
                </div>
                <span className="text-xl font-medium">{weather.humidity}%</span>
              </div>
            </div>

            {/* Hourly Forecast */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Hourly Forecast</h3>
              <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
                {weather.hourly.map((hour, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center bg-slate-700/50 p-3 rounded-xl min-w-[70px]"
                  >
                    <span className="text-sm text-slate-300">
                      {new Date(hour.time).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        hour12: true,
                      })}
                    </span>
                    <WeatherIcon condition={hour.condition} size="w-6 h-6" />
                    <span className="mt-1 text-lg font-medium">
                      {hour.temp}°
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Forecast */}
            <div>
              <h3 className="text-lg font-semibold mb-4">7-day forecast</h3>
              <div className="space-y-3">
                {weather.forecast.map((day, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-2 sm:px-0"
                  >
                    <span className="text-slate-300 w-20 text-sm sm:text-base">
                      {new Date(day.day).toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </span>
                    <div className="flex-1 flex justify-center">
                      <WeatherIcon condition={day.condition} size="w-5 h-5" />
                    </div>
                    <div className="flex gap-4 text-right text-sm sm:text-base">
                      <span className="font-medium">{day.high}°</span>
                      <span className="text-slate-400">{day.low}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
