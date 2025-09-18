import { Link } from "react-router-dom";
import styles from "./RegionCard.module.scss";

export default function RegionCard({ name, areaCode, image, className }) {
  return (
    <Link
      to={`/regions/${areaCode}`}
      className={`${styles.regionCard} ${className || ""}`}
    >
      <div className={styles.imageContainer}>
        {image ? (
          <img src={image} alt={name} className={styles.image} loading="lazy" />
        ) : (
          <div className={styles.placeholder}>
            <span>{name.charAt(0)}</span>
          </div>
        )}
      </div>
      <span className={styles.name}>{name}</span>
    </Link>
  );
}
