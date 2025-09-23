import {
  MdPhone,
  MdAccessTime,
  MdLocalParking,
  MdRestaurantMenu,
  MdEventSeat,
  MdTakeoutDining,
  MdCreditCard,
  MdDateRange,
  MdSmokingRooms,
  MdChildFriendly,
  MdInfo,
  MdLocalOffer,
  MdBookOnline,
} from "react-icons/md";
import { useDetailIntro } from "@/api/hooks/useTour";
import styles from "./RestaurantInfo.module.scss";

export default function RestaurantInfo({ contentId, contentTypeId }) {
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

  const restaurant = introData?.response?.body?.items?.item?.[0] || {};

  // 로딩 상태
  if (isLoading) {
    return (
      <div className={styles.restaurantInfo}>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (isError || !restaurant.contentid) {
    return (
      <div className={styles.restaurantInfo}>
        <div className={styles.errorState}>
          <MdInfo className={styles.errorIcon} />
          <p>정보를 불러올 수 없습니다</p>
        </div>
      </div>
    );
  }

  // 정보 아이템 렌더링 헬퍼 함수
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
    <div className={styles.restaurantInfo}>
      {/* 연락처 정보 */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>연락처 정보</h3>
        <div className={styles.infoGrid}>
          {renderInfoItem(<MdPhone />, "전화번호", restaurant.infocenterfood)}
        </div>
      </div>

      {/* 메뉴 정보 */}
      {(restaurant.firstmenu || restaurant.treatmenu) && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>메뉴 정보</h3>
          <div className={styles.infoGrid}>
            {renderInfoItem(
              <MdRestaurantMenu />,
              "대표메뉴",
              restaurant.firstmenu
            )}
            {restaurant.treatmenu && (
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <MdRestaurantMenu />
                </div>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>메뉴</span>
                  <div className={styles.menuList}>
                    {restaurant.treatmenu.split(" / ").map((menu, index) => (
                      <span key={index} className={styles.menuItem}>
                        {menu.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 운영 정보 */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>운영 정보</h3>
        <div className={styles.infoGrid}>
          {renderInfoItem(
            <MdAccessTime />,
            "영업시간",
            restaurant.opentimefood
          )}
          {renderInfoItem(<MdDateRange />, "휴무일", restaurant.restdatefood)}
          {renderInfoItem(
            <MdLocalParking />,
            "주차시설",
            restaurant.parkingfood
          )}
          {renderInfoItem(<MdTakeoutDining />, "포장", restaurant.packing)}
        </div>
      </div>

      {/* 시설 정보 */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>시설 정보</h3>
        <div className={styles.infoGrid}>
          {renderInfoItem(<MdEventSeat />, "좌석수", restaurant.seat)}
          {restaurant.kidsfacility !== "0" &&
            renderInfoItem(
              <MdChildFriendly />,
              "어린이 놀이방",
              restaurant.kidsfacility === "1" ? "있음" : restaurant.kidsfacility
            )}
          {renderInfoItem(<MdSmokingRooms />, "흡연", restaurant.smoking)}
          {renderInfoItem(<MdInfo />, "규모", restaurant.scalefood)}
        </div>
      </div>

      {/* 추가 정보 */}
      {(restaurant.chkcreditcardfood ||
        restaurant.reservationfood ||
        restaurant.discountinfofood) && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>추가 정보</h3>
          <div className={styles.infoGrid}>
            {renderInfoItem(
              <MdCreditCard />,
              "신용카드",
              restaurant.chkcreditcardfood
            )}
            {renderInfoItem(
              <MdBookOnline />,
              "예약안내",
              restaurant.reservationfood
            )}
            {renderInfoItem(
              <MdLocalOffer />,
              "할인정보",
              restaurant.discountinfofood
            )}
          </div>
        </div>
      )}
    </div>
  );
}
