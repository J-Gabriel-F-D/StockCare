import { useNavigate } from "react-router-dom";
import "./searchBar.css";
import searchIcon from "../../assets/material-symbols_search.svg";
import {
  useState,
  type KeyboardEvent,
  type ChangeEvent,
  useRef,
  useEffect,
} from "react";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  onInputChange?: (value: string) => void;
  placeholder?: string;
  debounceDelay?: number;
  link: string;
  searchBtn: string;
}

const SearchBar = ({
  onSearch,
  onInputChange,
  placeholder,
  link,
  debounceDelay = 300,
  searchBtn,
}: SearchBarProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Debounce para evitar buscas excessivas
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (onInputChange) {
        onInputChange(value);
      }
    }, debounceDelay);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      onSearch(searchTerm);
    }
  };

  const handleSearchClick = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    onSearch(searchTerm);
  };

  const goingTo = () => {
    navigate(link);
  };

  // Cleanup do timeout ao desmontar o componente
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <img
          src={searchIcon}
          className="search-img"
          alt="Ícone de busca"
          onClick={handleSearchClick}
          style={{ cursor: "pointer" }}
        />
        <input
          placeholder={placeholder}
          className="input-search"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="container-btn">
        <button onClick={goingTo} className="cadastro-btn">
          {searchBtn}
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
