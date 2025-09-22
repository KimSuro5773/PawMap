import { useState, useEffect } from "react";
import { useAreaBasedList, useLocationBasedList } from "@/api/hooks/useTour";
import useFilterStore from "@/stores/filterStore";
import styles from "./Attractions.module.scss";
import SearchBar from "@/components/SearchBar/SearchBar";
import ContentCard from "@/components/ContentCard/ContentCard";
import Pagination from "@/components/Pagination/Pagination";
import FilterBar from "@/components/FilterBar/FilterBar";

const Attractions = () => {
  const [pageNumber, setPageNumber] = useState(1);

  // 필터 상태 가져오기
  const {
    selectedAreaCode,
    selectedSigunguCode,
    locationFilter,
    sortOption,
    getApiParams,
  } = useFilterStore();

  // 페이지 변경 시 1페이지로 리셋
  const onPageChange = (page) => {
    setPageNumber(page);
  };

  // 필터 변경 시 1페이지로 리셋
  useEffect(() => {
    setPageNumber(1);
  }, [
    selectedAreaCode,
    selectedSigunguCode,
    locationFilter.enabled,
    sortOption,
  ]);

  // API 파라미터 구성
  const baseParams = getApiParams("attractions");
  const apiParams = {
    ...baseParams,
    numOfRows: 15,
    pageNo: pageNumber,
  };

  // 위치 기반 검색과 지역 기반 검색 분기
  const useLocationAPI = Boolean(
    locationFilter.enabled && locationFilter.coordinates
  );

  // 지역 기반 검색
  const {
    data: areaAttractionsData,
    isLoading: areaLoading,
    error: areaError,
  } = useAreaBasedList(apiParams, {
    enabled: !useLocationAPI,
  });

  // 위치 기반 검색
  const {
    data: locationAttractionsData,
    isLoading: locationLoading,
    error: locationError,
  } = useLocationBasedList(apiParams, {
    enabled: useLocationAPI,
  });

  // 현재 사용 중인 데이터 선택
  const attractionsData = useLocationAPI
    ? locationAttractionsData
    : areaAttractionsData;
  const isLoading = useLocationAPI ? locationLoading : areaLoading;
  const error = useLocationAPI ? locationError : areaError;

  const attractionsList = attractionsData?.response?.body?.items?.item || [];

  if (isLoading) {
    return (
      <div className={styles.attractions}>
        <SearchBar size={"small"} />
        <div className={styles.loading}>관광지 목록을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.attractions}>
        <SearchBar size={"small"} />
        <div className={styles.error}>데이터를 불러오는데 실패했습니다.</div>
      </div>
    );
  }

  return (
    <div className={styles.attractions}>
      {/* 검색바 */}
      <div className={styles.controlsWrap}>
        <SearchBar size={"small"} />
      </div>

      {/* 필터바 */}
      <div className={styles.filterWrap}>
        <FilterBar pageName="attractions" />
      </div>

      {/* 카드 그리드 */}
      <div className={styles.cardGrid}>
        {attractionsList.map((attraction) => (
          <ContentCard
            key={attraction.contentid}
            content={attraction}
            contentId={attraction.contentid}
            url={"attractions"}
            contentTypeId={12}
          />
        ))}
      </div>

      {/* 빈 상태 */}
      {attractionsList.length === 0 && (
        <div className={styles.emptyState}>
          <p>검색 결과가 없습니다.</p>
        </div>
      )}

      <Pagination
        totalCount={attractionsData?.response?.body?.totalCount}
        currentPage={pageNumber}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export { Attractions as Component };
