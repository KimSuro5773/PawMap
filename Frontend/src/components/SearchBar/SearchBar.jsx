import { useState, useRef, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import styles from "./SearchBar.module.scss";
import { useNavigate } from "react-router-dom";
import useSearchStore from "../../stores/searchStore";

const SearchBar = ({
  placeholder = "검색어를 입력하세요",
  initialValue = "",
  onSearchComplete, // 검색 완료 시 콜백 (선택적)
  onClear,
  disabled = false,
  size = "medium", // small, medium, large
}) => {
  const [value, setValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const { searchHistory, setLastSearchKeyword, removeFromHistory } =
    useSearchStore();
  const navigate = useNavigate();
  const searchBarRef = useRef(null);

  const handleInputChange = (e) => {
    setValue(e.target.value);
  };

  const handleSearch = (keyword = value) => {
    const trimmedValue = keyword.trim();
    if (trimmedValue) {
      setLastSearchKeyword(trimmedValue);
      navigate(`/search/${trimmedValue}`);
      onSearchComplete?.(trimmedValue);
      setShowHistory(false);
      setValue("");
    }
  };

  const handleClear = () => {
    setValue("");
    onClear?.();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      setShowHistory(false);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (searchHistory.length > 0) {
      setShowHistory(true);
    }
  };

  const handleBlur = (e) => {
    // 히스토리 영역을 클릭한 경우가 아닐 때만 blur 처리
    if (!searchBarRef.current?.contains(e.relatedTarget)) {
      setIsFocused(false);
      setTimeout(() => setShowHistory(false), 150); // 클릭 이벤트가 먼저 실행되도록 지연
    }
  };

  const handleHistoryItemClick = (keyword) => {
    setValue(keyword);
    setShowHistory(false);
  };

  const handleRemoveHistory = (e, keyword) => {
    e.stopPropagation();
    removeFromHistory(keyword);
  };

  // 외부 클릭 시 히스토리 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target)
      ) {
        setShowHistory(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={searchBarRef}
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
          onFocus={handleFocus}
          onBlur={handleBlur}
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
        onClick={() => handleSearch()}
        disabled={disabled || !value.trim()}
        className={styles.searchButton}
      >
        검색
      </button>

      {/* 검색 히스토리 드롭다운 */}
      {showHistory && searchHistory.length > 0 && (
        <div className={styles.historyDropdown}>
          <div className={styles.historyHeader}>최근 검색어 (최대 5개)</div>
          {searchHistory.map((keyword, index) => (
            <div
              key={`${keyword}-${index}`}
              className={styles.historyItem}
              onClick={() => handleHistoryItemClick(keyword)}
            >
              <span className={styles.historyKeyword}>{keyword}</span>
              <button
                type="button"
                className={styles.historyRemove}
                onClick={(e) => handleRemoveHistory(e, keyword)}
                aria-label={`${keyword} 검색 기록 삭제`}
              >
                <FiX />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
