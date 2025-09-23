import { useState, useEffect } from "react";
import { useAreaBasedList, useLocationBasedList } from "@/api/hooks/useTour";
import useFilterStore from "@/stores/filterStore";
import styles from "./CategoryListPage.module.scss";
import SearchBar from "@/components/SearchBar/SearchBar";
import ContentCard from "@/components/ContentCard/ContentCard";
import Pagination from "@/components/Pagination/Pagination";
import FilterBar from "@/components/FilterBar/FilterBar";

// =============================================================================
// 🏷️ 공통 카테고리 목록 페이지 컴포넌트
// =============================================================================

const CategoryListPage = ({ pageName, urlPath = pageName }) => {
  const [pageNumber, setPageNumber] = useState(1);

  // 필터 상태 가져오기
  const {
    selectedAreaCode,
    selectedSigunguCode,
    locationFilter,
    sortOption,
    categoryFilter,
    getApiParams,
    pageFilters,
  } = useFilterStore();

  // 현재 페이지의 contentTypeId 가져오기
  const contentTypeId = pageFilters[pageName]?.contentTypeId;

  // 페이지 변경 핸들러
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
    categoryFilter.cat1,
    categoryFilter.cat2,
    categoryFilter.cat3,
  ]);

  // API 파라미터 구성
  const baseParams = getApiParams(pageName);
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
    data: areaData,
    isLoading: areaLoading,
    error: areaError,
  } = useAreaBasedList(apiParams, {
    enabled: !useLocationAPI,
  });

  // 위치 기반 검색
  const {
    data: locationData,
    isLoading: locationLoading,
    error: locationError,
  } = useLocationBasedList(apiParams, {
    enabled: useLocationAPI,
  });

  // 현재 사용 중인 데이터 선택
  const data = useLocationAPI ? locationData : areaData;
  const isLoading = useLocationAPI ? locationLoading : areaLoading;
  const error = useLocationAPI ? locationError : areaError;

  const itemsList = data?.response?.body?.items?.item || [];

  // 로딩 상태
  if (isLoading) {
    return (
      <div className={styles.categoryPage}>
        <div className={styles.controlsWrap}>
          <SearchBar size={"small"} />
        </div>
        <div className={styles.filterWrap}>
          <FilterBar pageName={pageName} />
        </div>
        <div className={styles.loading}>데이터를 불러오는 중...</div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className={styles.categoryPage}>
        <div className={styles.controlsWrap}>
          <SearchBar size={"small"} />
        </div>
        <div className={styles.filterWrap}>
          <FilterBar pageName={pageName} />
        </div>
        <div className={styles.error}>데이터를 불러오는데 실패했습니다.</div>
      </div>
    );
  }

  return (
    <div className={styles.categoryPage}>
      {/* 검색바 */}
      <div className={styles.controlsWrap}>
        <SearchBar size={"small"} />
      </div>

      {/* 필터바 */}
      <div className={styles.filterWrap}>
        <FilterBar pageName={pageName} />
      </div>

      {/* 카드 그리드 */}
      <div className={styles.cardGrid}>
        {itemsList.map((item) => (
          <ContentCard
            key={item.contentid}
            content={item}
            contentId={item.contentid}
            url={urlPath}
            contentTypeId={contentTypeId}
          />
        ))}
      </div>

      {/* 빈 상태 */}
      {itemsList.length === 0 && (
        <div className={styles.emptyState}>
          <p>검색 결과가 없습니다.</p>
        </div>
      )}

      {/* 페이지네이션 */}
      <Pagination
        totalCount={data?.response?.body?.totalCount}
        currentPage={pageNumber}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default CategoryListPage;