import { FiChevronDown } from 'react-icons/fi';
import styles from './FilterButton.module.scss';

const FilterButton = ({ 
  children, 
  isActive = false, 
  hasDropdown = false,
  isOpen = false,
  onClick, 
  disabled = false,
  variant = "default", // default, outline, ghost
  size = "medium", // small, medium, large
  badge = null // 선택된 개수 등을 표시
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`
        ${styles.filterButton} 
        ${styles[variant]} 
        ${styles[size]}
        ${isActive ? styles.active : ''} 
        ${isOpen ? styles.open : ''} 
        ${disabled ? styles.disabled : ''}
      `}
    >
      <span className={styles.content}>
        {children}
        {badge && (
          <span className={styles.badge}>
            {badge}
          </span>
        )}
      </span>
      {hasDropdown && (
        <FiChevronDown 
          className={`${styles.chevron} ${isOpen ? styles.rotated : ''}`} 
        />
      )}
    </button>
  );
};

export default FilterButton;