import { useState } from "react";
import { MdOutlinePlace, MdMyLocation, MdCategory } from "react-icons/md";
import { IoMdRefresh } from "react-icons/io";
import { useCurrentLocation } from "@/api/hooks/useLocation";
import { useAreaCode, useCategoryCode } from "@/api/hooks/useTour";
import useFilterStore from "@/stores/filterStore";
import {
  AREA_CODE_NAMES,
  SORT_OPTION_NAMES,
  PAGE_CATEGORY_MAPPING,
  CATEGORY_CODES_NAMES,
} from "@/api/types/tour";
import { DOMESTIC_REGIONS } from "@/data/regions";
import styles from "./FilterBar.module.scss";

// =============================================================================
// 🎯 공통 필터 바 컴포넌트
// =============================================================================

const FilterBar = ({ pageName = "attractions" }) => {
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedRegionForSigungu, setSelectedRegionForSigungu] =
    useState(null);
  const [selectedCat1ForCat2, setSelectedCat1ForCat2] = useState(null);
  const [selectedCat2ForCat3, setSelectedCat2ForCat3] = useState(null);

  // 필터 스토어
  const {
    selectedAreaCode,
    selectedSigunguCode,
    locationFilter,
    sortOption,
    categoryFilter,
    setAreaFilter,
    setLocationFilter,
    setSortOption,
    setCategoryFilter,
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

  // 카테고리 데이터 조회 (cat2, cat3)
  const { data: cat2Data } = useCategoryCode(
    { cat1: selectedCat1ForCat2 },
    { enabled: !!selectedCat1ForCat2 }
  );

  const { data: cat3Data } = useCategoryCode(
    { cat1: selectedCat1ForCat2, cat2: selectedCat2ForCat3 },
    { enabled: !!(selectedCat1ForCat2 && selectedCat2ForCat3) }
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

  // 카테고리 필터 처리
  const handleCategorySelect = (cat1, cat2 = null, cat3 = null) => {
    setCategoryFilter(cat1, cat2, cat3);
    setShowCategoryModal(false);
    setSelectedCat1ForCat2(null);
    setSelectedCat2ForCat3(null);
  };

  // 모든 필터 초기화
  const handleClearAllFilters = () => {
    clearAllFilters();
    setShowRegionModal(false);
    setShowCategoryModal(false);
    setSelectedRegionForSigungu(null);
    setSelectedCat1ForCat2(null);
    setSelectedCat2ForCat3(null);
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

  // 카테고리 필터 표시 텍스트
  const getCategoryFilterText = () => {
    if (!categoryFilter.cat1) return "카테고리 선택";

    let text = CATEGORY_CODES_NAMES[categoryFilter.cat1];

    if (categoryFilter.cat2 && cat2Data?.response?.body?.items?.item) {
      const cat2List = Array.isArray(cat2Data.response.body.items.item)
        ? cat2Data.response.body.items.item
        : [cat2Data.response.body.items.item];

      const cat2Item = cat2List.find(
        (item) => item.code === categoryFilter.cat2
      );
      if (cat2Item) {
        text += ` > ${cat2Item.name}`;

        if (categoryFilter.cat3 && cat3Data?.response?.body?.items?.item) {
          const cat3List = Array.isArray(cat3Data.response.body.items.item)
            ? cat3Data.response.body.items.item
            : [cat3Data.response.body.items.item];

          const cat3Item = cat3List.find(
            (item) => item.code === categoryFilter.cat3
          );
          if (cat3Item) {
            text += ` > ${cat3Item.name}`;
          }
        }
      }
    }

    return text;
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

        {/* 카테고리 필터 */}
        <button
          className={`${styles.filterButton} ${
            categoryFilter.cat1 ? styles.active : ""
          }`}
          onClick={() => setShowCategoryModal(true)}
        >
          <MdCategory className={styles.filterIcon} />
          {getCategoryFilterText()}
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

      {/* 카테고리 선택 모달 */}
      {showCategoryModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowCategoryModal(false)}
        >
          <div
            className={styles.regionModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>카테고리 선택</h3>
              <button
                className={styles.closeButton}
                onClick={() => setShowCategoryModal(false)}
              >
                ✕
              </button>
            </div>

            <div className={styles.modalContent}>
              {/* 1단계: cat1 선택 */}
              {!selectedCat1ForCat2 && (
                <div className={styles.regionGrid}>
                  {PAGE_CATEGORY_MAPPING[pageName]?.map((cat1Code) => (
                    <button
                      key={cat1Code}
                      className={styles.regionItem}
                      onClick={() => {
                        // 직접 cat1 선택 (cat2 없이)
                        if (cat1Code === categoryFilter.cat1) {
                          handleCategorySelect(cat1Code);
                        } else {
                          // cat2 목록 보기
                          setSelectedCat1ForCat2(cat1Code);
                        }
                      }}
                    >
                      <span className={styles.regionName}>
                        {CATEGORY_CODES_NAMES[cat1Code]}
                      </span>
                      <span className={styles.regionArrow}>→</span>
                    </button>
                  ))}
                </div>
              )}

              {/* 2단계: cat2 선택 */}
              {selectedCat1ForCat2 && !selectedCat2ForCat3 && (
                <div className={styles.sigunguContainer}>
                  <div className={styles.breadcrumb}>
                    <button
                      className={styles.backButton}
                      onClick={() => setSelectedCat1ForCat2(null)}
                    >
                      ← 뒤로
                    </button>
                    <span>{CATEGORY_CODES_NAMES[selectedCat1ForCat2]}</span>
                  </div>

                  <div className={styles.sigunguGrid}>
                    {/* 전체 선택 */}
                    <button
                      className={styles.sigunguItem}
                      onClick={() => handleCategorySelect(selectedCat1ForCat2)}
                    >
                      <span className={styles.sigunguName}>전체</span>
                    </button>

                    {/* 개별 cat2 */}
                    {cat2Data?.response?.body?.items?.item &&
                      (Array.isArray(cat2Data.response.body.items.item)
                        ? cat2Data.response.body.items.item
                        : [cat2Data.response.body.items.item]
                      ).map((cat2Item) => (
                        <button
                          key={cat2Item.code}
                          className={styles.sigunguItem}
                          onClick={() => {
                            // cat3이 있는지 확인하기 위해 다음 단계로
                            setSelectedCat2ForCat3(cat2Item.code);
                          }}
                        >
                          <span className={styles.sigunguName}>
                            {cat2Item.name}
                          </span>
                          <span className={styles.regionArrow}>→</span>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* 3단계: cat3 선택 */}
              {selectedCat1ForCat2 && selectedCat2ForCat3 && (
                <div className={styles.sigunguContainer}>
                  <div className={styles.breadcrumb}>
                    <button
                      className={styles.backButton}
                      onClick={() => setSelectedCat2ForCat3(null)}
                    >
                      ← 뒤로
                    </button>
                    <span>
                      {`${CATEGORY_CODES_NAMES[selectedCat1ForCat2]} > ${
                        (cat2Data?.response?.body?.items?.item &&
                          (Array.isArray(cat2Data.response.body.items.item)
                            ? cat2Data.response.body.items.item
                            : [cat2Data.response.body.items.item]
                          ).find((item) => item.code === selectedCat2ForCat3)
                            ?.name) ||
                        ""
                      }`}
                    </span>
                  </div>

                  <div className={styles.sigunguGrid}>
                    {/* 전체 선택 */}
                    <button
                      className={styles.sigunguItem}
                      onClick={() =>
                        handleCategorySelect(
                          selectedCat1ForCat2,
                          selectedCat2ForCat3
                        )
                      }
                    >
                      <span className={styles.sigunguName}>전체</span>
                    </button>

                    {/* 개별 cat3 */}
                    {cat3Data?.response?.body?.items?.item &&
                      (Array.isArray(cat3Data.response.body.items.item)
                        ? cat3Data.response.body.items.item
                        : [cat3Data.response.body.items.item]
                      ).map((cat3Item) => (
                        <button
                          key={cat3Item.code}
                          className={styles.sigunguItem}
                          onClick={() =>
                            handleCategorySelect(
                              selectedCat1ForCat2,
                              selectedCat2ForCat3,
                              cat3Item.code
                            )
                          }
                        >
                          <span className={styles.sigunguName}>
                            {cat3Item.name}
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
