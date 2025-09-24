import {
  MdPhone,
  MdAccessTime,
  MdLocalParking,
  MdEventSeat,
  MdCreditCard,
  MdDateRange,
  MdInfo,
  MdPeople,
  MdTour,
  MdCalendarToday,
  MdHistoryEdu,
} from "react-icons/md";
import { useDetailIntro } from "@/api/hooks/useTour";
import styles from "./AttractionInfo.module.scss";

export default function AttractionInfo({ contentId, contentTypeId }) {
  const {
    data: introData,
    isLoading,
    isError,
  } = useDetailIntro(
    contentId,
    { contentTypeId },
    {
      enabled: !!(contentId && contentTypeId),
    }
  );

  const attraction = introData?.response?.body?.items?.item?.[0] || {};

  if (isLoading) {
    return (
      <div className={styles.attractionInfo}>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (isError || !attraction.contentid) {
    return (
      <div className={styles.attractionInfo}>
        <div className={styles.errorState}>
          <MdInfo className={styles.errorIcon} />
          <p>정보를 불러올 수 없습니다</p>
        </div>
      </div>
    );
  }

  const renderInfoItem = (icon, label, value, className = "") => {
    if (!value || value === "0" || value === "") return null;

    return (
      <div className={`${styles.infoItem} ${className}`}>
        <div className={styles.infoIcon}>{icon}</div>
        <div className={styles.infoContent}>
          <span className={styles.infoLabel}>{label}</span>
          <span className={styles.infoValue}>{value}</span>
        </div>
      </div>
    );
  };

  const hasHeritageInfo =
    attraction.heritage1 === "1" ||
    attraction.heritage2 === "1" ||
    attraction.heritage3 === "1";

  return (
    <div className={styles.attractionInfo}>
      {hasHeritageInfo && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>문화유산 정보</h3>
          <div className={styles.infoGrid}>
            {renderInfoItem(
              <MdHistoryEdu />,
              "세계문화유산",
              "지정됨",
              styles.primaryIcon
            )}
          </div>
        </div>
      )}

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>운영 정보</h3>
        <div className={styles.infoGrid}>
          {renderInfoItem(<MdAccessTime />, "이용시간", attraction.usetime)}
          {renderInfoItem(<MdDateRange />, "휴무일", attraction.restdate)}
          {renderInfoItem(
            <MdCalendarToday />,
            "개장일",
            attraction.opendate
          )}
          {renderInfoItem(
            <MdCalendarToday />,
            "이용시기",
            attraction.useseason
          )}
        </div>
      </div>

      {(attraction.expguide || attraction.expagerange) && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>체험 정보</h3>
          <div className={styles.infoGrid}>
            {renderInfoItem(<MdTour />, "체험안내", attraction.expguide)}
            {renderInfoItem(
              <MdPeople />,
              "체험가능연령",
              attraction.expagerange
            )}
          </div>
        </div>
      )}

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>시설 정보</h3>
        <div className={styles.infoGrid}>
          {renderInfoItem(<MdPhone />, "문의 및 안내", attraction.infocenter)}
          {renderInfoItem(<MdEventSeat />, "수용인원", attraction.accomcount)}
          {renderInfoItem(
            <MdLocalParking />,
            "주차시설",
            attraction.parking
          )}
        </div>
      </div>

      {attraction.chkcreditcard && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>추가 정보</h3>
          <div className={styles.infoGrid}>
            {renderInfoItem(
              <MdCreditCard />,
              "신용카드",
              attraction.chkcreditcard
            )}
          </div>
        </div>
      )}
    </div>
  );
}