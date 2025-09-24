import {
  MdLocationOn,
  MdPhone,
  MdHome,
  MdMap,
  MdInfo,
  MdNavigation,
} from "react-icons/md";
import { useDetailCommon } from "@/api/hooks/useTour";
import { useStaticMap } from "@/api/hooks/useMap";
import styles from "./PlaceDetail.module.scss";

const extractHomepageUrl = (homepage) => {
  if (!homepage) return null;

  const hrefMatch = homepage.match(/href=["']([^"']+)["']/);
  if (hrefMatch) {
    return hrefMatch[1];
  }

  if (
    homepage.startsWith("http://") ||
    homepage.startsWith("https://") ||
    homepage.startsWith("www.")
  ) {
    return homepage.startsWith("www.") ? `https://${homepage}` : homepage;
  }

  return null;
};

export default function PlaceDetail({ contentId }) {
  const {
    data: commonData,
    isLoading: isCommonLoading,
    isError: isCommonError,
  } = useDetailCommon(contentId, {}, { enabled: !!contentId });

  const place = commonData?.response?.body?.items?.item?.[0] || {};

  const mapParams =
    place.mapx && place.mapy
      ? {
          center: { lng: parseFloat(place.mapx), lat: parseFloat(place.mapy) },
          level: 13,
          width: 800,
          height: 450,
          markers: [
            {
              lng: parseFloat(place.mapx),
              lat: parseFloat(place.mapy),
            },
          ],
        }
      : null;

  const {
    data: mapUrl,
    isLoading: isMapLoading,
    isError: isMapError,
  } = useStaticMap(mapParams, { enabled: !!mapParams });

  if (isCommonLoading) {
    return (
      <div className={styles.placeDetail}>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>장소 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (isCommonError || !place.contentid) {
    return (
      <div className={styles.placeDetail}>
        <div className={styles.errorState}>
          <MdInfo className={styles.errorIcon} />
          <p>장소 정보를 불러올 수 없습니다</p>
        </div>
      </div>
    );
  }

  const homepageUrl = extractHomepageUrl(place.homepage);
  const fullAddress = `${place.addr1 || ""}${
    place.addr2 ? " " + place.addr2 : ""
  }`.trim();

  const openNaverMap = () => {
    if (place.mapx && place.mapy) {
      const url = `https://map.naver.com/v5/?c=${place.mapx},${place.mapy},15,0,0,0,dh`;
      window.open(url, "_blank");
    }
  };

  const openKakaoMap = () => {
    if (place.mapx && place.mapy && place.title) {
      const url = `https://map.kakao.com/link/map/${encodeURIComponent(
        place.title
      )},${place.mapy},${place.mapx}`;
      window.open(url, "_blank");
    }
  };

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
    <div className={styles.placeDetail}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>기본 정보</h3>
        <div className={styles.infoGrid}>
          {renderInfoItem(<MdLocationOn />, "주소", fullAddress)}
          {renderInfoItem(<MdPhone />, "전화번호", place.tel)}
          {homepageUrl && (
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <MdHome />
              </div>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>홈페이지</span>
                <a
                  href={homepageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.homepageLink}
                >
                  방문하기
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {place.overview && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <MdInfo className={styles.sectionIcon} />
            소개
          </h3>
          <p className={styles.overviewText}>{place.overview}</p>
        </div>
      )}

      {place.mapx && place.mapy && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <MdMap className={styles.sectionIcon} />
            위치
          </h3>

          <div className={styles.mapContainer}>
            {isMapLoading ? (
              <div className={styles.mapLoading}>
                <div className={styles.loadingSpinner}></div>
                <p>지도를 불러오는 중...</p>
              </div>
            ) : isMapError || !mapUrl ? (
              <div className={styles.mapError}>
                <MdMap className={styles.mapErrorIcon} />
                <p>지도를 불러올 수 없습니다</p>
              </div>
            ) : (
              <img
                src={mapUrl}
                alt={`${place.title} 위치`}
                className={styles.mapImage}
              />
            )}
          </div>

          {fullAddress && (
            <div className={styles.mapAddress}>
              <MdLocationOn className={styles.addressIcon} />
              <span>{fullAddress}</span>
            </div>
          )}

          <div className={styles.mapActions}>
            <button onClick={openNaverMap} className={styles.mapButton}>
              <MdNavigation />
              <span>네이버 지도</span>
            </button>
            <button onClick={openKakaoMap} className={styles.mapButton}>
              <MdNavigation />
              <span>카카오맵</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
