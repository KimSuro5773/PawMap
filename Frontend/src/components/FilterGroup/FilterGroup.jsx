import { useState } from "react";
import FilterButton from "../FilterButton/FilterButton";
import styles from "./FilterGroup.module.scss";

const FilterGroup = ({
  title,
  options = [],
  value = [], // 다중 선택의 경우 배열, 단일 선택의 경우 문자열
  onChange,
  multiple = false,
  disabled = false,
  variant = "default",
  size = "medium",
  layout = "wrap", // wrap, scroll
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (optionValue) => {
    if (disabled) return;

    if (multiple) {
      const newValue = Array.isArray(value) ? [...value] : [];
      const index = newValue.indexOf(optionValue);

      if (index > -1) {
        newValue.splice(index, 1);
      } else {
        newValue.push(optionValue);
      }

      onChange?.(newValue);
    } else {
      const newValue = value === optionValue ? "" : optionValue;
      onChange?.(newValue);
    }
  };

  const isSelected = (optionValue) => {
    if (multiple) {
      return Array.isArray(value) && value.includes(optionValue);
    } else {
      return value === optionValue;
    }
  };

  const getSelectedCount = () => {
    if (multiple) {
      return Array.isArray(value) ? value.length : 0;
    } else {
      return value ? 1 : 0;
    }
  };

  const hasSelection = getSelectedCount() > 0;

  return (
    <div
      className={`${styles.filterGroup} ${styles[layout]} ${
        disabled ? styles.disabled : ""
      }`}
    >
      {title && (
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          {hasSelection && (
            <span className={styles.count}>{getSelectedCount()}개 선택</span>
          )}
        </div>
      )}

      <div className={styles.options}>
        {options.map((option) => {
          const optionValue =
            typeof option === "string" ? option : option.value;
          const optionLabel =
            typeof option === "string" ? option : option.label;
          const optionDisabled =
            typeof option === "object" ? option.disabled : false;

          return (
            <FilterButton
              key={optionValue}
              isActive={isSelected(optionValue)}
              onClick={() => handleOptionClick(optionValue)}
              disabled={disabled || optionDisabled}
              variant={variant}
              size={size}
            >
              {optionLabel}
            </FilterButton>
          );
        })}
      </div>

      {hasSelection && (
        <button
          type="button"
          onClick={() => onChange?.(multiple ? [] : "")}
          className={styles.clearButton}
          disabled={disabled}
        >
          전체 해제
        </button>
      )}
    </div>
  );
};

export default FilterGroup;
