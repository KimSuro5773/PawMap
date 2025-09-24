import { Link } from "react-router-dom";
import { extractCityFromAddress } from "@/utils/addressUtils";
import styles from "./BusinessCard.module.scss";

export default function BusinessCard({
  id,
  title,
  image,
  category,
  address,
  contentTypeId,
  className,
}) {
  const getDetailPath = () => {
    switch (contentTypeId) {
      case "39":
        return `/restaurants/${id}?contentTypeId=${contentTypeId}`;
      case "12":
        return `/activities/${id}?contentTypeId=${contentTypeId}`;
      case "32":
        return `/accommodation/${id}?contentTypeId=${contentTypeId}`;
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
        {address && (
          <span className={styles.address}>
            {extractCityFromAddress(address)}
          </span>
        )}
        <h3 className={styles.title}>{title}</h3>

        {category && <span className={styles.category}>{category}</span>}
      </div>
    </Link>
  );
}
