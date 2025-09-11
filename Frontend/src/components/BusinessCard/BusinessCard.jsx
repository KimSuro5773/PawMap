import { Link } from "react-router-dom";
import styles from "./BusinessCard.module.scss";

export default function BusinessCard({
  id,
  title,
  image,
  category,
  contentTypeId,
  className,
}) {
  const getDetailPath = () => {
    switch (contentTypeId) {
      case "39":
        return `/cafes/${id}`;
      case "12":
        return `/activities/${id}`;
      case "32":
        return `/accommodation/${id}`;
      default:
        return `/`;
    }
  };

  return (
    <Link
      to={getDetailPath()}
      className={`${styles.businessCard} ${className || ""}`}
    >
      <div className={styles.imageContainer}>
        {image ? (
          <img src={image} alt={title} className={styles.image} />
        ) : (
          <div className={styles.placeholder}>
            <span>이미지 없음</span>
          </div>
        )}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        {category && <span className={styles.category}>{category}</span>}
      </div>
    </Link>
  );
}
