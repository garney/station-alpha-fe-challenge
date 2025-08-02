# API Integration Challenge - Questions

Please answer the following questions about your weather application implementation:

1. **API Implementation**: Describe your approach to integrating the weather API:

   - Which API did you choose and why?
     I chose two different APIs because the map doesn't work on one, and the other doesn't have alerts.
     "https://api.openweathermap.org/"
     "https://api.weatherapi.com"

   - How did you structure your API service layer?
     getCurrentWeather fetches and transforms data.
     getWeatherForecast deals with the raw API call.
     transformWeatherData handles data shaping.
     cacheWeatherData / getCachedWeatherData manage local caching.
     searchLocations handles geolocation queries.
     getWeatherMapUrl generates map tiles.

   - How did you handle error cases and rate limiting?
     I used handling abstraction: the handleApiError method and the ApiError class.

2. **User Experience**: Explain your key UX decisions:

   - How did you present the weather data effectively?
   - How did you handle loading states and errors?
   - What accessibility features did you implement?
     cacheWeatherData() + getCachedWeatherData() reduce unnecessary re-fetching and show stale-but-available data on error.
     The loader is only displayed if data is loading for longer than 1 second to avoid causing a flickering effect for the user.

3. **Technical Decisions**: What were your main technical considerations?

   - How did you optimize API calls and performance?
   - How did you handle state management?
   - How did you ensure the application works well across different devices?
     Using cacheWeatherData() and getCachedWeatherData() reduces unnecessary API calls.
     Expiration logic (expiry key) ensures data freshness within a set time window (default: 30 min).
     Debounced API requests to avoid excessive API calls as users type.
     Minimal state updates with conditional logic (if (!searchQuery) return) and only fetch when necessary.

4. **Challenges**: What was the most challenging aspect of this project and how did you overcome it?

5. **Improvements**: If you had more time, what would be the top 2-3 improvements you would make to the application?
