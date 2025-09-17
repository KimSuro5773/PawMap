import { useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import styles from "./SearchBar.module.scss";
import { useNavigate } from "react-router-dom";

const SearchBar = ({
  placeholder = "검색어를 입력하세요",
  value = "",
  onChange,
  onSearch,
  onClear,
  disabled = false,
  size = "medium", // small, medium, large
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    onChange?.(e.target.value);
  };

  const handleSearch = () => {
    onSearch?.(value);

    navigate(`search/${value}`);
  };

  const handleClear = () => {
    onChange?.("");
    onClear?.();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div
      className={`${styles.searchBar} ${styles[size]} ${
        isFocused ? styles.focused : ""
      } ${disabled ? styles.disabled : ""}`}
    >
      <div className={styles.inputWrapper}>
        <FiSearch className={styles.searchIcon} />
        <input
          type="text"
          id="search-input"
          name="search"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className={styles.input}
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className={styles.clearButton}
            disabled={disabled}
            aria-label="검색어 지우기"
          >
            <FiX />
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={handleSearch}
        disabled={disabled || !value.trim()}
        className={styles.searchButton}
      >
        검색
      </button>
    </div>
  );
};

export default SearchBar;
