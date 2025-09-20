import { useDetailIntro } from "../../api/hooks/useTour";
import { getCategoryText } from "../../utils/categoryMapping";
import styles from "./ContentCard.module.scss";

const ContentCard = ({ content }) => {
  const { data: detailIntro, isLoading: isDetailLoading } = useDetailIntro(
    content.contentid,
    { contentTypeId: 39 },
    { enabled: !!content.contentid }
  );

  const items = detailIntro?.response?.body?.items;
  const introData = Array.isArray(items?.item) ? items?.item[0] : items?.item;
  const categoryText = getCategoryText(content.cat3);

  return (
    <div className={styles.contentCard}>
      {/* 이미지 섹션 */}
      <div className={styles.imageSection}>
        {content.firstimage ? (
          <img
            src={content.firstimage}
            alt={content.title}
            className={styles.cardImage}
          />
        ) : (
          <div className={styles.noImage}>
            <span>이미지 없음</span>
          </div>
        )}

        {/* 카테고리 태그 */}
        <div className={styles.categoryTag}>{categoryText}</div>
      </div>

      {/* 정보 섹션 */}
      <div className={styles.infoSection}>
        {/* 제목 */}
        <h3 className={styles.title}>{content.title}</h3>

        {/* 대표메뉴 */}
        {introData?.firstmenu && (
          <div className={styles.menuInfo}>
            <span className={styles.menuText}>
              대표메뉴 : {introData.firstmenu}
            </span>
          </div>
        )}

        {/* 상세주소 */}
        <div className={styles.addressInfo}>
          <span className={styles.locationIcon}>📍</span>
          <span className={styles.addressText}>{content.addr1}</span>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;