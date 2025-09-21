import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useDetailIntro } from "@/api/hooks/useTour";
import { getCategoryText } from "@/utils/categoryMapping";
import styles from "./ContentCard.module.scss";

const ContentCard = ({ content, contentId, url, contentTypeId }) => {
  // params 객체 메모이제이션으로 캐싱 문제 해결
  const detailParams = useMemo(
    () => ({
      contentTypeId: contentTypeId,
    }),
    [contentTypeId]
  );

  // 음식점(39)일 때만 useDetailIntro 호출하여 API 낭비 방지
  const shouldFetchDetail = contentTypeId === "39";

  const { data: detailIntro, isLoading: isDetailLoading } = useDetailIntro(
    content.contentid,
    detailParams,
    { enabled: !!(content.contentid && shouldFetchDetail) }
  );

  const items = detailIntro?.response?.body?.items;
  const introData = Array.isArray(items?.item) ? items?.item[0] : items?.item;
  const categoryText = getCategoryText(content.cat3);

  return (
    <Link to={`/${url}/${contentId}`} className={styles.contentCard}>
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
          <span className={styles.addressText}>{content.addr1}</span>
        </div>
      </div>
    </Link>
  );
};

export default ContentCard;
