import { useState } from "react";
import { FiMapPin, FiClock, FiTrendingUp } from "react-icons/fi";
import FilterButton from "../FilterButton/FilterButton";
import styles from "./SortFilter.module.scss";

const SORT_OPTIONS = [
  {
    value: "distance",
    label: "가까운 순",
    icon: FiMapPin,
    description: "GPS 기반 거리순 정렬",
  },
  {
    value: "popular",
    label: "인기 순",
    icon: FiTrendingUp,
    description: "리뷰 수 및 인기도 기준",
  },
  {
    value: "recent",
    label: "최신 순",
    icon: FiClock,
    description: "최근 등록순으로 정렬",
  },
];

const SortFilter = ({
  value = "distance",
  onChange,
  disabled = false,
  showDropdown = true,
  availableOptions = null, // null이면 모든 옵션 표시
  size = "medium",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const options = availableOptions || SORT_OPTIONS;
  const selectedOption =
    options.find((option) => option.value === value) || options[0];

  const handleOptionClick = (optionValue) => {
    onChange?.(optionValue);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  // 드롭다운 형태가 아닌 경우 (모바일 등)
  if (!showDropdown) {
    return (
      <div
        className={`${styles.sortFilter} ${styles.inline} ${
          disabled ? styles.disabled : ""
        }`}
      >
        <div className={styles.label}>정렬</div>
        <div className={styles.options}>
          {options.map((option) => {
            const IconComponent = option.icon;
            return (
              <FilterButton
                key={option.value}
                isActive={value === option.value}
                onClick={() => handleOptionClick(option.value)}
                disabled={disabled}
                size={size}
                variant="outline"
              >
                <IconComponent />
                {option.label}
              </FilterButton>
            );
          })}
        </div>
      </div>
    );
  }

  const SelectedIcon = selectedOption.icon;

  return (
    <div
      className={`${styles.sortFilter} ${styles.dropdown} ${
        disabled ? styles.disabled : ""
      }`}
    >
      <FilterButton
        hasDropdown={true}
        isOpen={isOpen}
        onClick={toggleDropdown}
        disabled={disabled}
        size={size}
        variant="outline"
      >
        <SelectedIcon />
        {selectedOption.label}
      </FilterButton>

      {isOpen && (
        <>
          <div className={styles.backdrop} onClick={() => setIsOpen(false)} />
          <div className={styles.dropdownMenu}>
            <div className={styles.dropdownHeader}>
              <h4>정렬 방식</h4>
            </div>
            <div className={styles.dropdownOptions}>
              {options.map((option) => {
                const IconComponent = option.icon;
                const isSelected = value === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleOptionClick(option.value)}
                    className={`${styles.dropdownOption} ${
                      isSelected ? styles.selected : ""
                    }`}
                  >
                    <div className={styles.optionContent}>
                      <div className={styles.optionMain}>
                        <IconComponent className={styles.optionIcon} />
                        <span className={styles.optionLabel}>
                          {option.label}
                        </span>
                      </div>
                      <p className={styles.optionDescription}>
                        {option.description}
                      </p>
                    </div>
                    {isSelected && (
                      <div className={styles.selectedIndicator}>✓</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SortFilter;
