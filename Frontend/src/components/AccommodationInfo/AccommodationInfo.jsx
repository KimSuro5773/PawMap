import {
  MdPhone,
  MdAccessTime,
  MdLocalParking,
  MdEventSeat,
  MdInfo,
  MdPeople,
  MdHouse,
  MdRestaurant,
  MdSpa,
  MdFitnessCenter,
  MdComputer,
  MdLocalFireDepartment,
  MdDirectionsBike,
  MdMic,
  MdOutdoorGrill,
  MdCasino,
  MdLocalLaundryService,
  MdDirectionsCar,
  MdAttachMoney,
} from "react-icons/md";
import { useDetailIntro } from "@/api/hooks/useTour";
import styles from "./AccommodationInfo.module.scss";

export default function AccommodationInfo({ contentId, contentTypeId }) {
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

  const accommodation = introData?.response?.body?.items?.item?.[0] || {};

  if (isLoading) {
    return (
      <div className={styles.accommodationInfo}>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (isError || !accommodation.contentid) {
    return (
      <div className={styles.accommodationInfo}>
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

  const renderYesNo = (value) => {
    if (value === "1") return "있음";
    if (value === "0") return null;
    return value;
  };

  const facilities = [];
  if (accommodation.seminar === "1")
    facilities.push({ icon: <MdCasino />, label: "세미나실" });
  if (accommodation.sports === "1")
    facilities.push({ icon: <MdFitnessCenter />, label: "스포츠시설" });
  if (accommodation.sauna === "1")
    facilities.push({ icon: <MdSpa />, label: "사우나" });
  if (accommodation.beauty === "1")
    facilities.push({ icon: <MdLocalLaundryService />, label: "뷰티시설" });
  if (accommodation.beverage === "1")
    facilities.push({ icon: <MdRestaurant />, label: "식음료장" });
  if (accommodation.karaoke === "1")
    facilities.push({ icon: <MdMic />, label: "노래방" });
  if (accommodation.barbecue === "1")
    facilities.push({ icon: <MdOutdoorGrill />, label: "바비큐장" });
  if (accommodation.campfire === "1")
    facilities.push({ icon: <MdLocalFireDepartment />, label: "캠프파이어" });
  if (accommodation.bicycle === "1")
    facilities.push({ icon: <MdDirectionsBike />, label: "자전거대여" });
  if (accommodation.fitness === "1")
    facilities.push({ icon: <MdFitnessCenter />, label: "휘트니스센터" });
  if (accommodation.publicpc === "1")
    facilities.push({ icon: <MdComputer />, label: "공용PC실" });
  if (accommodation.publicbath === "1")
    facilities.push({ icon: <MdSpa />, label: "공용샤워실" });
  if (accommodation.subfacility)
    facilities.push({ icon: <MdInfo />, label: accommodation.subfacility });

  const types = [];
  if (accommodation.goodstay === "1") types.push("굿스테이");
  if (accommodation.benikia === "1") types.push("베니키아");
  if (accommodation.hanok === "1") types.push("한옥");

  return (
    <div className={styles.accommodationInfo}>
      {types.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>숙소 유형</h3>
          <div className={styles.typeBadges}>
            {types.map((type, index) => (
              <span key={index} className={styles.typeBadge}>
                {type}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>기본 정보</h3>
        <div className={styles.infoGrid}>
          {renderInfoItem(
            <MdHouse />,
            "객실 수",
            accommodation.roomcount,
            styles.primaryIcon
          )}
          {renderInfoItem(
            <MdHouse />,
            "객실 유형",
            accommodation.roomtype
          )}
          {renderInfoItem(
            <MdAccessTime />,
            "입실 시간",
            accommodation.checkintime
          )}
          {renderInfoItem(
            <MdAccessTime />,
            "퇴실 시간",
            accommodation.checkouttime
          )}
          {renderInfoItem(
            <MdRestaurant />,
            "객실내 취사",
            accommodation.chkcooking
          )}
          {renderInfoItem(
            <MdDirectionsCar />,
            "픽업 서비스",
            accommodation.pickup
          )}
        </div>
      </div>

      {facilities.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>부대시설</h3>
          <div className={styles.facilitiesGrid}>
            {facilities.map((facility, index) => (
              <div key={index} className={styles.facilityItem}>
                <div className={styles.facilityIcon}>{facility.icon}</div>
                <span className={styles.facilityLabel}>{facility.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>시설 정보</h3>
        <div className={styles.infoGrid}>
          {renderInfoItem(
            <MdPhone />,
            "문의 및 안내",
            accommodation.infocenterlodging
          )}
          {renderInfoItem(
            <MdPeople />,
            "수용인원",
            accommodation.accomcountlodging
          )}
          {renderInfoItem(<MdInfo />, "규모", accommodation.scalelodging)}
          {renderInfoItem(
            <MdLocalParking />,
            "주차시설",
            accommodation.parkinglodging
          )}
        </div>
      </div>

      {accommodation.refundregulation && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>환불 규정</h3>
          <div className={styles.refundPolicy}>
            <MdAttachMoney className={styles.refundIcon} />
            <p className={styles.refundText}>
              {accommodation.refundregulation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}