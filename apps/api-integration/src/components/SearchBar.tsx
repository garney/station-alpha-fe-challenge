import { useState, useEffect, FormEvent } from "react";
import { SearchData } from "../App";
import { searchLocations } from "../services/weatherApi";

interface SearchBarProps {
  onSearch: (location: SearchData) => void;
  mapValue: string;
}
interface HistoryData {
  id: string | number;
  lat: number;
  lon: number;
  name: string;
  timestamp: number;
}
const SearchBar = ({ onSearch, mapValue }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState<HistoryData[]>([]);

  const addToSearchHistory = (query: SearchData) => {
    setSearchHistory(
      [
        ...searchHistory.filter((item) => item.name !== query.name),
        { ...query, timestamp: Date.now() },
      ].sort((a, b) => b?.timestamp - a?.timestamp),
    );
  };
  const fetchSuggestions = async () => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const results = await searchLocations(query);
      setSuggestions(results);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  useEffect(() => {
    fetchSuggestions();
    const debounceTimer = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const hideModal = () => {
    setShowSuggestions(false);
    setShowHistory(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (suggestions.length && query.trim()) {
      onSearch(suggestions[0]);
      addToSearchHistory(suggestions[0]);
      hideModal();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestions[0]);
    addToSearchHistory(suggestions[0]);
    hideModal();
  };

  const handleHistoryClick = (historyItem: SearchData) => {
    setQuery(historyItem.name);
    onSearch(historyItem);
    hideModal();
  };

  useEffect(() => {
    setQuery("");
  }, [mapValue]);

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <input
            type="text"
            value={query || mapValue || ""}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setShowSuggestions(true);
              setShowHistory(searchHistory.length > 0);
            }}
            placeholder="Search for a city or zip code..."
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </div>
        <div className="suggestion-list">
          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="sugestion">
              <ul className="suggestions-list">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion.name)}
                    className="suggestion-item"
                  >
                    {suggestion.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Search history dropdown */}
          {showHistory && searchHistory.length > 0 && (
            <div className="search-history">
              <h4>Recent Searches</h4>
              <ul className="history-list">
                {searchHistory.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => handleHistoryClick(item)}
                    className="history-item"
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
