import styles from "./SkeletonCard.module.scss";

export default function SkeletonCard({ variant = "business", className }) {
  if (variant === "region") {
    return (
      <div className={`${styles.skeletonCard} ${styles.regionVariant} ${className || ''}`}>
        <div className={styles.regionImage}></div>
        <div className={styles.regionName}></div>
      </div>
    );
  }

  return (
    <div className={`${styles.skeletonCard} ${styles.businessVariant} ${className || ''}`}>
      <div className={styles.imageContainer}></div>
      <div className={styles.content}>
        <div className={styles.title}></div>
        <div className={styles.category}></div>
      </div>
    </div>
  );
}