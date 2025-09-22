import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SORT_OPTIONS } from "@/api/types/tour";

// =============================================================================
// 🎯 필터 상태 관리 스토어
// =============================================================================

const useFilterStore = create(
  persist(
    (set, get) => ({
      // =============================================================================
      // 📊 필터 상태
      // =============================================================================

      // 지역 필터
      selectedAreaCode: null, // 선택된 지역 코드 (시도)
      selectedSigunguCode: null, // 선택된 시군구 코드

      // 위치 필터
      locationFilter: {
        enabled: false, // 내 위치 필터 활성화 여부
        coordinates: null, // { latitude, longitude, source, accuracy }
        radius: 3000, // 검색 반경 (미터)
      },

      // 정렬 필터
      sortOption: SORT_OPTIONS.TITLE, // 기본: 제목순 (O, Q, R)

      // 페이지별 필터 상태 (각 페이지별로 독립적으로 관리)
      pageFilters: {
        attractions: {
          contentTypeId: "12",
          activeFilters: [], // 활성화된 필터 목록
        },
        restaurants: {
          contentTypeId: "39",
          activeFilters: [],
        },
        accommodation: {
          contentTypeId: "32",
          activeFilters: [],
        },
        activities: {
          contentTypeId: "28",
          activeFilters: [],
        },
      },

      // =============================================================================
      // 🔧 지역 필터 액션
      // =============================================================================

      setAreaFilter: (areaCode, sigunguCode = null) => set((state) => ({
        selectedAreaCode: areaCode,
        selectedSigunguCode: sigunguCode,
        // 지역 필터 선택 시 위치 필터는 비활성화
        locationFilter: {
          ...state.locationFilter,
          enabled: false,
        },
      })),

      clearAreaFilter: () => set({
        selectedAreaCode: null,
        selectedSigunguCode: null,
      }),

      // =============================================================================
      // 📍 위치 필터 액션
      // =============================================================================

      setLocationFilter: (coordinates, radius = 3000) => set((state) => ({
        locationFilter: {
          enabled: true,
          coordinates,
          radius,
        },
        // 위치 필터 선택 시 지역 필터는 비활성화
        selectedAreaCode: null,
        selectedSigunguCode: null,
      })),

      updateLocationRadius: (radius) => set((state) => ({
        locationFilter: {
          ...state.locationFilter,
          radius,
        },
      })),

      clearLocationFilter: () => set((state) => ({
        locationFilter: {
          ...state.locationFilter,
          enabled: false,
          coordinates: null,
        },
      })),

      // =============================================================================
      // 🔄 정렬 필터 액션
      // =============================================================================

      setSortOption: (sortOption) => set({ sortOption }),

      // =============================================================================
      // 📄 페이지별 필터 액션
      // =============================================================================

      setPageFilter: (pageName, filterData) => set((state) => ({
        pageFilters: {
          ...state.pageFilters,
          [pageName]: {
            ...state.pageFilters[pageName],
            ...filterData,
          },
        },
      })),

      addActiveFilter: (pageName, filterKey) => set((state) => {
        const currentFilters = state.pageFilters[pageName]?.activeFilters || [];
        if (!currentFilters.includes(filterKey)) {
          return {
            pageFilters: {
              ...state.pageFilters,
              [pageName]: {
                ...state.pageFilters[pageName],
                activeFilters: [...currentFilters, filterKey],
              },
            },
          };
        }
        return state;
      }),

      removeActiveFilter: (pageName, filterKey) => set((state) => ({
        pageFilters: {
          ...state.pageFilters,
          [pageName]: {
            ...state.pageFilters[pageName],
            activeFilters: (state.pageFilters[pageName]?.activeFilters || [])
              .filter(filter => filter !== filterKey),
          },
        },
      })),

      // =============================================================================
      // 🧹 필터 초기화 액션
      // =============================================================================

      clearAllFilters: () => set((state) => ({
        selectedAreaCode: null,
        selectedSigunguCode: null,
        locationFilter: {
          enabled: false,
          coordinates: null,
          radius: 3000,
        },
        sortOption: SORT_OPTIONS.TITLE,
        pageFilters: Object.keys(state.pageFilters).reduce((acc, key) => {
          acc[key] = {
            ...state.pageFilters[key],
            activeFilters: [],
          };
          return acc;
        }, {}),
      })),

      clearPageFilters: (pageName) => set((state) => ({
        pageFilters: {
          ...state.pageFilters,
          [pageName]: {
            ...state.pageFilters[pageName],
            activeFilters: [],
          },
        },
      })),

      // =============================================================================
      // 📊 필터 상태 조회 헬퍼
      // =============================================================================

      // API 호출용 파라미터 생성
      getApiParams: (pageName) => {
        const state = get();
        const params = {};

        // 컨텐츠 타입
        if (state.pageFilters[pageName]?.contentTypeId) {
          params.contentTypeId = state.pageFilters[pageName].contentTypeId;
        }

        // 지역 필터
        if (state.selectedAreaCode) {
          params.areaCode = state.selectedAreaCode;
          if (state.selectedSigunguCode) {
            params.sigunguCode = state.selectedSigunguCode;
          }
        }

        // 위치 필터
        if (state.locationFilter.enabled && state.locationFilter.coordinates) {
          params.mapX = state.locationFilter.coordinates.longitude;
          params.mapY = state.locationFilter.coordinates.latitude;
          params.radius = state.locationFilter.radius;
        }

        // 정렬
        params.arrange = state.sortOption;

        return params;
      },

      // 활성화된 필터 개수
      getActiveFilterCount: (pageName) => {
        const state = get();
        let count = 0;

        // 지역 필터
        if (state.selectedAreaCode) count++;

        // 위치 필터
        if (state.locationFilter.enabled) count++;

        // 정렬 필터 (기본값이 아닌 경우)
        if (state.sortOption !== SORT_OPTIONS.TITLE) count++;

        // 페이지별 필터
        if (state.pageFilters[pageName]?.activeFilters?.length > 0) {
          count += state.pageFilters[pageName].activeFilters.length;
        }

        return count;
      },

      // 필터 활성화 여부 확인
      hasActiveFilters: (pageName) => {
        return get().getActiveFilterCount(pageName) > 0;
      },

      // 특정 필터가 활성화되어 있는지 확인
      isFilterActive: (pageName, filterKey) => {
        const state = get();
        return state.pageFilters[pageName]?.activeFilters?.includes(filterKey) || false;
      },
    }),
    {
      name: "pawmap-filter-storage", // localStorage 키
      partialize: (state) => ({
        // 위치 정보는 세션별로 관리하므로 localStorage에 저장하지 않음
        selectedAreaCode: state.selectedAreaCode,
        selectedSigunguCode: state.selectedSigunguCode,
        sortOption: state.sortOption,
        pageFilters: state.pageFilters,
        locationFilter: {
          ...state.locationFilter,
          coordinates: null, // 좌표는 저장하지 않음
          enabled: false, // 위치 필터는 세션별로 초기화
        },
      }),
    }
  )
);

export default useFilterStore;