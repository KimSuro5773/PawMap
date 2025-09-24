import {
  MdPeople,
  MdAttachMoney,
  MdBathtub,
  MdAcUnit,
  MdTv,
  MdKitchen,
  MdLocalLaundryService,
  MdWeekend,
  MdTableRestaurant,
  MdDry,
  MdInfo,
} from "react-icons/md";
import { useDetailInfo } from "@/api/hooks/useTour";
import styles from "./AccommodationRooms.module.scss";

export default function AccommodationRooms({ contentId, contentTypeId }) {
  const {
    data: roomData,
    isLoading,
    isError,
  } = useDetailInfo(
    contentId,
    { contentTypeId },
    {
      enabled: !!(contentId && contentTypeId),
    }
  );

  const rooms = roomData?.response?.body?.items?.item || [];

  if (isLoading) {
    return (
      <div className={styles.accommodationRooms}>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>객실 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (isError || !Array.isArray(rooms) || rooms.length === 0) {
    return null;
  }

  const formatPrice = (price) => {
    if (!price || price === "0") return null;
    return `${parseInt(price).toLocaleString()}원`;
  };

  const getRoomFacilities = (room) => {
    const facilities = [];
    if (room.roombathfacility === "Y")
      facilities.push({ icon: <MdBathtub />, label: "욕실" });
    if (room.roomaircondition === "Y")
      facilities.push({ icon: <MdAcUnit />, label: "에어컨" });
    if (room.roomtv === "Y")
      facilities.push({ icon: <MdTv />, label: "TV" });
    if (room.roomrefrigerator === "Y")
      facilities.push({ icon: <MdKitchen />, label: "냉장고" });
    if (room.roomtoiletries === "Y")
      facilities.push({ icon: <MdLocalLaundryService />, label: "세면도구" });
    if (room.roomsofa === "Y")
      facilities.push({ icon: <MdWeekend />, label: "소파" });
    if (room.roomcook === "Y")
      facilities.push({ icon: <MdKitchen />, label: "취사용품" });
    if (room.roomtable === "Y")
      facilities.push({ icon: <MdTableRestaurant />, label: "테이블" });
    if (room.roomhairdryer === "Y")
      facilities.push({ icon: <MdDry />, label: "드라이기" });
    return facilities;
  };

  const getRoomImages = (room) => {
    const images = [];
    for (let i = 1; i <= 5; i++) {
      const imgUrl = room[`roomimg${i}`];
      const imgAlt = room[`roomimg${i}alt`];
      if (imgUrl) {
        images.push({ url: imgUrl, alt: imgAlt || `객실 이미지 ${i}` });
      }
    }
    return images;
  };

  return (
    <div className={styles.accommodationRooms}>
      <h3 className={styles.title}>객실 안내</h3>
      <div className={styles.roomsGrid}>
        {rooms.map((room, index) => {
          const facilities = getRoomFacilities(room);
          const images = getRoomImages(room);
          const hasPrice =
            room.roomoffseasonminfee1 ||
            room.roomoffseasonminfee2 ||
            room.roompeakseasonminfee1 ||
            room.roompeakseasonminfee2;

          return (
            <div key={index} className={styles.roomCard}>
              {images.length > 0 && (
                <div className={styles.roomImageContainer}>
                  <img
                    src={images[0].url}
                    alt={images[0].alt}
                    className={styles.roomImage}
                    loading="lazy"
                  />
                  {images.length > 1 && (
                    <div className={styles.imageCount}>+{images.length - 1}</div>
                  )}
                </div>
              )}

              <div className={styles.roomContent}>
                <h4 className={styles.roomTitle}>{room.roomtitle}</h4>

                {room.roomintro && (
                  <p className={styles.roomIntro}>{room.roomintro}</p>
                )}

                <div className={styles.roomInfo}>
                  {room.roomsize1 && (
                    <div className={styles.infoItem}>
                      <MdInfo className={styles.infoIcon} />
                      <span>
                        {room.roomsize1}평
                        {room.roomsize2 && ` (${room.roomsize2}㎡)`}
                      </span>
                    </div>
                  )}

                  <div className={styles.infoItem}>
                    <MdPeople className={styles.infoIcon} />
                    <span>
                      기준 {room.roombasecount}명 / 최대 {room.roommaxcount}명
                    </span>
                  </div>
                </div>

                <div className={styles.priceSection}>
                  <div className={styles.priceHeader}>
                    <MdAttachMoney className={styles.priceIcon} />
                    <span className={styles.priceLabel}>객실 요금</span>
                  </div>
                  {hasPrice ? (
                    <div className={styles.priceGrid}>
                      {(room.roomoffseasonminfee1 ||
                        room.roomoffseasonminfee2) && (
                        <div className={styles.priceRow}>
                          <span className={styles.seasonLabel}>비수기</span>
                          <div className={styles.prices}>
                            {room.roomoffseasonminfee1 && (
                              <span className={styles.price}>
                                주중 {formatPrice(room.roomoffseasonminfee1)}
                              </span>
                            )}
                            {room.roomoffseasonminfee2 && (
                              <span className={styles.price}>
                                주말 {formatPrice(room.roomoffseasonminfee2)}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      {(room.roompeakseasonminfee1 ||
                        room.roompeakseasonminfee2) && (
                        <div className={styles.priceRow}>
                          <span className={styles.seasonLabel}>성수기</span>
                          <div className={styles.prices}>
                            {room.roompeakseasonminfee1 && (
                              <span className={styles.price}>
                                주중 {formatPrice(room.roompeakseasonminfee1)}
                              </span>
                            )}
                            {room.roompeakseasonminfee2 && (
                              <span className={styles.price}>
                                주말 {formatPrice(room.roompeakseasonminfee2)}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className={styles.noPriceText}>요금 정보는 직접 문의해주세요</p>
                  )}
                </div>

                {facilities.length > 0 && (
                  <div className={styles.facilitiesSection}>
                    <span className={styles.facilitiesLabel}>편의시설</span>
                    <div className={styles.facilities}>
                      {facilities.map((facility, idx) => (
                        <div key={idx} className={styles.facility}>
                          {facility.icon}
                          <span>{facility.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}