import {
  getTourTypeInfo,
  getValidImageUrl,
  truncateTitle,
} from "@/utils/tourUtils";
import styles from "./TourPanel.module.scss";

export default function TourCard({ business, onClick }) {
  const typeInfo = getTourTypeInfo(business.contenttypeid);

  const imageUrl = getValidImageUrl(
    business.firstimage || business.firstimage2
  );
  const title = truncateTitle(business.title);

  const handleClick = () => {
    if (onClick) {
      onClick(business);
    }
  };

  return (
    <div className={styles.tourCard} onClick={handleClick}>
      <div className={styles.cardImageWrapper}>
        <div className={styles.cardImage}>
          {imageUrl ? (
            <img src={imageUrl} alt={title} />
          ) : (
            <div className={styles.placeholderImage}>
              <div className={styles.noImageContent}>
                <span className={styles.noImageText}>이미지 없음</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle} title={business.title}>
            {title}
          </h3>
          <span
            className={styles.cardType}
            style={{ backgroundColor: typeInfo.color }}
          >
            {typeInfo.name}
          </span>
        </div>
        {business.addr1 && (
          <p className={styles.cardAddress} title={business.addr1}>
            {business.addr1}
          </p>
        )}
      </div>
    </div>
  );
}
