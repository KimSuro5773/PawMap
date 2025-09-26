import { useEffect, useState } from "react";
import styles from "./Map.module.scss";
import Header from "@/components/Header/Header";
import NaverMap from "@/components/NaverMap/NaverMap";
import { useCurrentLocation } from "@/api/hooks/useLocation";
import { useLocationBasedList } from "@/api/hooks/useTour";

const Map = () => {
  const [mapCenter, setMapCenter] = useState({ lat: 33.4821, lng: 126.435 }); // 기본 위치 (제주도)
  const [searchCenter, setSearchCenter] = useState(null); // 검색 기준 위치
  const [businesses, setBusinesses] = useState([]);
  const [showResearchButton, setShowResearchButton] = useState(false);
  const {
    location,
    isLoading: locationLoading,
    error: locationError,
    requestAccurateLocation,
  } = useCurrentLocation();

  // 검색 중심점 기반 관광정보 조회 (20km 반경)
  const { data: locationTourData, isLoading: tourDataLoading } = useLocationBasedList(
    {
      mapX: searchCenter?.lng,
      mapY: searchCenter?.lat,
      radius: 20000, // 20km
      numOfRows: 30, // 최대 100개
      arrange: "S", // 이미지 있는 거리순
    },
    {
      enabled: !!(searchCenter?.lng && searchCenter?.lat),
    }
  );

  // 페이지 로드 시 위치 요청
  useEffect(() => {
    requestAccurateLocation();
  }, []); // 의존성 배열에서 함수 제거

  // 사용자 위치가 가져와지면 지도 중심점 및 검색 중심점 업데이트
  useEffect(() => {
    if (location?.longitude && location?.latitude) {
      const newCenter = {
        lat: location.latitude,
        lng: location.longitude,
      };
      setMapCenter(newCenter);
      setSearchCenter(newCenter);
    }
  }, [location]);

  const handleMarkerClick = (markerData) => {
    console.log("마커 클릭:", markerData);
    // TODO: 상세 정보 모달
  };

  // 지도 중심점 변경 시 호출되는 콜백
  const handleCenterChanged = (newCenter) => {
    console.log('지도 중심점 변경:', newCenter);
    setMapCenter(newCenter);
    // 검색 중심점과 다르면 재검색 버튼 표시
    if (searchCenter && (Math.abs(newCenter.lat - searchCenter.lat) > 0.001 || Math.abs(newCenter.lng - searchCenter.lng) > 0.001)) {
      setShowResearchButton(true);
    }
  };

  // 현재 위치에서 재검색
  const handleResearch = () => {
    setSearchCenter(mapCenter);
    setShowResearchButton(false);
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
      {showResearchButton && (
        <div className={styles.researchButtonContainer}>
          <button
            className={styles.researchButton}
            onClick={handleResearch}
            disabled={tourDataLoading}
          >
            {tourDataLoading ? '검색 중...' : '현재 위치에서 재검색'}
          </button>
        </div>
      )}
      <div className={styles.mapWrapper}>
        <NaverMap
          center={mapCenter}
          zoom={12}
          markers={businesses}
          onMarkerClick={handleMarkerClick}
          onCenterChanged={handleCenterChanged}
          height="100%"
        />
      </div>
    </div>
  );
};

export { Map as Component };
