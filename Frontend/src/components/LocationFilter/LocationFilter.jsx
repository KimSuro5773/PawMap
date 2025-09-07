import { useState } from "react";
import { FiMapPin, FiLoader } from "react-icons/fi";
import FilterGroup from "../FilterGroup/FilterGroup";
import FilterButton from "../FilterButton/FilterButton";
import useLocationStore from "../../stores/locationStore";
import useLocation from "../../api/hooks/useLocation";
import styles from "./LocationFilter.module.scss";

const REGIONS = [
  { value: "all", label: "전체 지역" },
  { value: "seoul", label: "서울" },
  { value: "gyeonggi", label: "경기" },
  { value: "incheon", label: "인천" },
  { value: "gangwon", label: "강원" },
  { value: "chungbuk", label: "충북" },
  { value: "chungnam", label: "충남" },
  { value: "sejong", label: "세종" },
  { value: "daejeon", label: "대전" },
  { value: "gyeongbuk", label: "경북" },
  { value: "gyeongnam", label: "경남" },
  { value: "daegu", label: "대구" },
  { value: "ulsan", label: "울산" },
  { value: "busan", label: "부산" },
  { value: "jeonbuk", label: "전북" },
  { value: "jeonnam", label: "전남" },
  { value: "gwangju", label: "광주" },
  { value: "jeju", label: "제주" },
];

const LocationFilter = ({
  value = { type: "all", region: "all" },
  onChange,
  disabled = false,
  showNearby = true,
}) => {
  const [locationError, setLocationError] = useState(null);

  // TanStack Query 훅 사용
  const { location, isLoading, error, getCurrentLocation, clearError } =
    useLocation();

  // Zustand store 사용 (필터 상태만)
  const { userLocation } = useLocationStore();

  const handleLocationTypeChange = async (type) => {
    if (type === "nearby") {
      // UI 상태를 먼저 변경
      onChange?.({
        ...value,
        type: "nearby",
        region: "all",
      });
      // 에러 초기화
      setLocationError(null);
      clearError();

      // 위치 획득 시작
      try {
        const locationData = await getCurrentLocation();
        // 성공 시 좌표 정보 업데이트
        onChange?.({
          ...value,
          type: "nearby",
          coordinates: {
            lat: locationData.latitude,
            lng: locationData.longitude,
          },
        });
      } catch (error) {
        // 에러 발생 시 전체 지역으로 되돌림
        setLocationError(error.message);
        onChange?.({ ...value, type: "all", region: "all" });
      }
    } else {
      onChange?.({
        ...value,
        type,
        region: type === "all" ? "all" : value.region,
      });
    }
  };

  const handleRegionChange = (region) => {
    onChange?.({ ...value, region, type: region === "all" ? "all" : "region" });
  };

  const getLocationTypeLabel = () => {
    switch (value.type) {
      case "nearby":
        return isLoading ? "위치 확인 중..." : "내 주변";
      case "region":
        const selectedRegion = REGIONS.find((r) => r.value === value.region);
        return selectedRegion ? selectedRegion.label : "지역 선택";
      case "all":
      default:
        return "전체 지역";
    }
  };

  return (
    <div
      className={`${styles.locationFilter} ${disabled ? styles.disabled : ""}`}
    >
      <div className={styles.locationTypes}>
        <FilterButton
          isActive={value.type === "all"}
          onClick={() => handleLocationTypeChange("all")}
          disabled={disabled}
          variant="outline"
        >
          전체 지역
        </FilterButton>

        {showNearby && (
          <FilterButton
            isActive={value.type === "nearby"}
            onClick={() => handleLocationTypeChange("nearby")}
            disabled={disabled}
            variant="outline"
          >
            {value.type === "nearby" && isLoading && (
              <FiLoader className={styles.spinner} />
            )}
            <FiMapPin />내 주변
          </FilterButton>
        )}

        <FilterButton
          isActive={value.type === "region"}
          onClick={() => handleLocationTypeChange("region")}
          disabled={disabled}
          variant="outline"
        >
          지역 선택
        </FilterButton>
      </div>

      {value.type === "region" && (
        <div className={styles.regionSelector}>
          <FilterGroup
            options={REGIONS}
            value={value.region}
            onChange={handleRegionChange}
            multiple={false}
            disabled={disabled}
            variant="default"
            size="small"
            layout="wrap"
          />
        </div>
      )}

      {(locationError || error) && (
        <div className={styles.error}>
          <p className={styles.errorMessage}>
            {locationError || error?.message}
          </p>
          <button
            type="button"
            onClick={() => {
              setLocationError(null);
              clearError();
            }}
            className={styles.dismissButton}
          >
            닫기
          </button>
        </div>
      )}

      {value.type === "nearby" && value.coordinates && (
        <div className={styles.locationInfo}>
          <FiMapPin />
          <span>
            {location.city && location.country
              ? `현재 위치: ${location.city}, ${location.country} (${
                  location.source === "gps" ? "GPS" : "IP 기반"
                })`
              : `현재 위치: 위도 ${value.coordinates.lat.toFixed(
                  4
                )}, 경도 ${value.coordinates.lng.toFixed(4)}`}
          </span>
        </div>
      )}
    </div>
  );
};

export default LocationFilter;
