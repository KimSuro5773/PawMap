import { Link } from "react-router-dom";
import { useMemo } from "react";
import CategoryTag from "@/components/CategoryTag";
import styles from "./ContentCard.module.scss";
import { useDetailCommon } from "@/api/hooks/useTour";

const ContentCard = ({ content, contentId, url, contentTypeId }) => {
  const { data: detailCommon, isLoading: isDetailLoading } = useDetailCommon(
    content.contentid,
    contentTypeId,
    { enabled: !!content.contentid }
  );

  const items = detailCommon?.response?.body?.items;
  const introData = Array.isArray(items?.item) ? items?.item[0] : items?.item;

  return (
    <Link to={`/${url}/${contentId}?contentTypeId=${contentTypeId}`} className={styles.contentCard}>
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
        <CategoryTag
          cat1={introData?.cat1}
          cat2={introData?.cat2}
          cat3={introData?.cat3}
        />
      </div>

      {/* 정보 섹션 */}
      <div className={styles.infoSection}>
        {/* 제목 */}
        <h3 className={styles.title}>{content.title}</h3>

        {/* 상세주소 */}
        <div className={styles.addressInfo}>
          <span className={styles.addressText}>{content.addr1}</span>
        </div>
      </div>
    </Link>
  );
};

export default ContentCard;
