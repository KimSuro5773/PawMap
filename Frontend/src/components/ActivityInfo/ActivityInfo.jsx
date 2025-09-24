import {
  MdPhone,
  MdAccessTime,
  MdLocalParking,
  MdEventSeat,
  MdCreditCard,
  MdDateRange,
  MdInfo,
  MdPeople,
  MdAttachMoney,
  MdLocalOffer,
  MdCalendarToday,
} from "react-icons/md";
import { useDetailIntro } from "@/api/hooks/useTour";
import styles from "./ActivityInfo.module.scss";

export default function ActivityInfo({ contentId, contentTypeId }) {
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

  const activity = introData?.response?.body?.items?.item?.[0] || {};

  if (isLoading) {
    return (
      <div className={styles.activityInfo}>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (isError || !activity.contentid) {
    return (
      <div className={styles.activityInfo}>
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

  return (
    <div className={styles.activityInfo}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>운영 정보</h3>
        <div className={styles.infoGrid}>
          {renderInfoItem(
            <MdAccessTime />,
            "이용시간",
            activity.usetimeleports
          )}
          {renderInfoItem(<MdCalendarToday />, "개장시간", activity.openperiod)}
          {renderInfoItem(<MdDateRange />, "휴무일", activity.restdateleports)}
        </div>
      </div>

      {(activity.expagerangeleports || activity.usefeeleports) && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>이용 정보</h3>
          <div className={styles.infoGrid}>
            {renderInfoItem(
              <MdPeople />,
              "체험가능연령",
              activity.expagerangeleports,
              styles.primaryIcon
            )}
            {renderInfoItem(
              <MdAttachMoney />,
              "입장료",
              activity.usefeeleports
            )}
          </div>
        </div>
      )}

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>시설 정보</h3>
        <div className={styles.infoGrid}>
          {renderInfoItem(
            <MdPhone />,
            "문의 및 안내",
            activity.infocenterleports
          )}
          {renderInfoItem(<MdInfo />, "규모", activity.scaleleports)}
          {renderInfoItem(
            <MdEventSeat />,
            "수용인원",
            activity.accomcountleports
          )}
          {renderInfoItem(
            <MdLocalParking />,
            "주차시설",
            activity.parkingleports
          )}
          {renderInfoItem(
            <MdLocalOffer />,
            "주차요금",
            activity.parkingfeeleports
          )}
        </div>
      </div>

      {activity.chkcreditcardleports && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>추가 정보</h3>
          <div className={styles.infoGrid}>
            {renderInfoItem(
              <MdCreditCard />,
              "신용카드",
              activity.chkcreditcardleports
            )}
          </div>
        </div>
      )}
    </div>
  );
}
