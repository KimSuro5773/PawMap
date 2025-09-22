import { useState } from "react";
import { MdOutlinePlace, MdMyLocation } from "react-icons/md";
import { IoMdRefresh } from "react-icons/io";
import { useCurrentLocation } from "@/api/hooks/useLocation";
import { useAreaCode } from "@/api/hooks/useTour";
import useFilterStore from "@/stores/filterStore";
import { AREA_CODE_NAMES, SORT_OPTION_NAMES } from "@/api/types/tour";
import { DOMESTIC_REGIONS } from "@/data/regions";
import styles from "./FilterBar.module.scss";

// =============================================================================
// 🎯 공통 필터 바 컴포넌트
// =============================================================================

const FilterBar = ({ pageName = "attractions" }) => {
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [selectedRegionForSigungu, setSelectedRegionForSigungu] =
    useState(null);

  // 필터 스토어
  const {
    selectedAreaCode,
    selectedSigunguCode,
    locationFilter,
    sortOption,
    setAreaFilter,
    setLocationFilter,
    setSortOption,
    clearAllFilters,
    getActiveFilterCount,
  } = useFilterStore();

  // 위치 관련 훅
  const { requestAccurateLocation, isLoading: locationLoading } =
    useCurrentLocation();

  // 시군구 데이터 조회
  const { data: sigunguData } = useAreaCode(
    { areaCode: selectedRegionForSigungu },
    { enabled: !!selectedRegionForSigungu }
  );

  // =============================================================================
  // 🔧 이벤트 핸들러
  // =============================================================================

  // 지역 필터 처리
  const handleRegionSelect = (areaCode, sigunguCode = null) => {
    setAreaFilter(areaCode, sigunguCode);
    setShowRegionModal(false);
    setSelectedRegionForSigungu(null);
  };

  // 내 위치 필터 처리
  const handleLocationFilter = async () => {
    try {
      const location = await requestAccurateLocation();
      setLocationFilter(location);
    } catch (error) {
      console.error("위치 가져오기 실패:", error);
      alert(`위치를 가져올 수 없습니다: ${error.message}`);
    }
  };

  // 정렬 옵션 변경
  const handleSortChange = (newSortOption) => {
    setSortOption(newSortOption);
  };

  // 모든 필터 초기화
  const handleClearAllFilters = () => {
    clearAllFilters();
    setShowRegionModal(false);
    setSelectedRegionForSigungu(null);
  };

  // =============================================================================
  // 🎨 렌더링 헬퍼
  // =============================================================================

  // 현재 지역 필터 표시 텍스트
  const getRegionFilterText = () => {
    if (!selectedAreaCode) return "지역 선택";

    const regionName = AREA_CODE_NAMES[selectedAreaCode];
    if (selectedSigunguCode && sigunguData?.response?.body?.items?.item) {
      const sigunguList = Array.isArray(sigunguData.response.body.items.item)
        ? sigunguData.response.body.items.item
        : [sigunguData.response.body.items.item];

      const sigungu = sigunguList.find(
        (item) => item.code === selectedSigunguCode
      );
      return sigungu ? `${regionName} > ${sigungu.name}` : regionName;
    }

    return regionName;
  };

  // 위치 필터 표시 텍스트
  const getLocationFilterText = () => {
    if (!locationFilter.enabled) return "내 위치";
    return locationFilter.coordinates?.source === "gps"
      ? "내 위치 (GPS)"
      : "내 위치 (IP)";
  };

  const activeFilterCount = getActiveFilterCount(pageName);

  return (
    <div className={styles.filterBar}>
      {/* 필터 버튼들 */}
      <div className={styles.filterButtons}>
        {/* 지역 필터 */}
        <button
          className={`${styles.filterButton} ${
            selectedAreaCode ? styles.active : ""
          }`}
          onClick={() => setShowRegionModal(true)}
        >
          <MdOutlinePlace className={styles.filterIcon} />
          {getRegionFilterText()}
        </button>

        {/* 내 위치 필터 */}
        <button
          className={`${styles.filterButton} ${
            locationFilter.enabled ? styles.active : ""
          }`}
          onClick={handleLocationFilter}
          disabled={locationLoading}
        >
          <MdMyLocation className={styles.filterIcon} />
          {locationLoading ? "위치 찾는 중..." : getLocationFilterText()}
        </button>

        {/* 정렬 필터 */}
        <div className={styles.sortDropdown}>
          <select
            value={sortOption}
            onChange={(e) => handleSortChange(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="O">제목순</option>
            <option value="Q">수정일순</option>
            <option value="R">생성일순</option>
          </select>
        </div>

        {/* 필터 초기화 */}
        {activeFilterCount > 0 && (
          <button
            className={styles.clearButton}
            onClick={handleClearAllFilters}
          >
            <IoMdRefresh className={styles.filterIcon} />
            초기화 ({activeFilterCount})
          </button>
        )}
      </div>

      {/* 지역 선택 모달 */}
      {showRegionModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowRegionModal(false)}
        >
          <div
            className={styles.regionModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>지역 선택</h3>
              <button
                className={styles.closeButton}
                onClick={() => setShowRegionModal(false)}
              >
                ✕
              </button>
            </div>

            <div className={styles.modalContent}>
              {/* 1단계: 시도 선택 */}
              {!selectedRegionForSigungu && (
                <div className={styles.regionGrid}>
                  {DOMESTIC_REGIONS.map((region) => (
                    <button
                      key={region.areaCode}
                      className={styles.regionItem}
                      onClick={() => {
                        // 직접 시도 선택 (시군구 없이)
                        if (region.areaCode === selectedAreaCode) {
                          handleRegionSelect(region.areaCode);
                        } else {
                          // 시군구 목록 보기
                          setSelectedRegionForSigungu(region.areaCode);
                        }
                      }}
                    >
                      <span className={styles.regionName}>{region.name}</span>
                      <span className={styles.regionArrow}>→</span>
                    </button>
                  ))}
                </div>
              )}

              {/* 2단계: 시군구 선택 */}
              {selectedRegionForSigungu && (
                <div className={styles.sigunguContainer}>
                  <div className={styles.breadcrumb}>
                    <button
                      className={styles.backButton}
                      onClick={() => setSelectedRegionForSigungu(null)}
                    >
                      ← 뒤로
                    </button>
                    <span>{AREA_CODE_NAMES[selectedRegionForSigungu]}</span>
                  </div>

                  <div className={styles.sigunguGrid}>
                    {/* 전체 지역 선택 */}
                    <button
                      className={styles.sigunguItem}
                      onClick={() =>
                        handleRegionSelect(selectedRegionForSigungu)
                      }
                    >
                      <span className={styles.sigunguName}>전체</span>
                    </button>

                    {/* 개별 시군구 */}
                    {sigunguData?.response?.body?.items?.item &&
                      (Array.isArray(sigunguData.response.body.items.item)
                        ? sigunguData.response.body.items.item
                        : [sigunguData.response.body.items.item]
                      ).map((sigungu) => (
                        <button
                          key={sigungu.code}
                          className={styles.sigunguItem}
                          onClick={() =>
                            handleRegionSelect(
                              selectedRegionForSigungu,
                              sigungu.code
                            )
                          }
                        >
                          <span className={styles.sigunguName}>
                            {sigungu.name}
                          </span>
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
