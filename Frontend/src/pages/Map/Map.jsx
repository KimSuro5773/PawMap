import { useEffect, useState } from "react";
import styles from "./Map.module.scss";
import Header from "@/components/Header/Header";
import NaverMap from "@/components/NaverMap/NaverMap";
import { useCurrentLocation } from "@/api/hooks/useLocation";
import { useLocationBasedList } from "@/api/hooks/useTour";

const Map = () => {
  const [mapCenter, setMapCenter] = useState({ lat: 33.4821, lng: 126.435 }); // 기본 위치 (제주도)
  const [businesses, setBusinesses] = useState([]);
  const {
    location,
    isLoading: locationLoading,
    error: locationError,
    requestAccurateLocation,
  } = useCurrentLocation();

  // 위치 기반 관광정보 조회 (20km 반경)
  const { data: locationTourData } = useLocationBasedList(
    {
      mapX: location?.longitude,
      mapY: location?.latitude,
      radius: 20000, // 20km
      numOfRows: 30, // 최대 100개
      arrange: "S", // 이미지 있는 거리순
    },
    {
      enabled: !!(location?.longitude && location?.latitude),
    }
  );

  // 페이지 로드 시 위치 요청
  useEffect(() => {
    requestAccurateLocation();
  }, []); // 의존성 배열에서 함수 제거

  const handleMarkerClick = (markerData) => {
    console.log("마커 클릭:", markerData);
    // TODO: 상세 정보 모달
  };

  useEffect(() => {
    if (locationTourData?.response?.body?.items?.item) {
      const items = locationTourData.response.body.items.item;
      const businessList = Array.isArray(items) ? items : [items];

      const markers = businessList
        .map((business) => ({
          lat: parseFloat(business.mapy),
          lng: parseFloat(business.mapx),
          title: business.title,
          contentId: business.contentid,
          contentTypeId: business.contenttypeid,
        }))
        .filter(
          (marker) =>
            marker.lat && marker.lng && !isNaN(marker.lat) && !isNaN(marker.lng)
        );

      setBusinesses(markers);
    }
  }, [locationTourData]);

  return (
    <div className={styles.mapPageContainer}>
      <Header />
      <div className={styles.mapWrapper}>
        <NaverMap
          center={mapCenter}
          zoom={14}
          markers={businesses}
          onMarkerClick={handleMarkerClick}
          height="100%"
        />
      </div>
    </div>
  );
};

export { Map as Component };
