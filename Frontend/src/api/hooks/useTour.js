import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAreaBasedList,
  getLocationBasedList,
  getSearchKeyword,
  getAreaCode,
  getCategoryCode,
  getDetailCommon,
  getDetailIntro,
  getDetailInfo,
  getDetailImage,
  getDetailPetTour,
  getPetTourSyncList,
  getCompleteBusinessInfo,
  getAreaBusinessWithPetInfo,
} from "../services/tourApi";

// =============================================================================
// 🔍 기본 검색 및 목록 조회 훅
// =============================================================================

/**
 * 지역기반 관광정보 조회 훅
 */
export const useAreaBasedList = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["areaBasedList", params],
    queryFn: () => getAreaBasedList(params),
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
    ...options,
  });
};

/**
 * 위치기반 관광정보 조회 훅
 */
export const useLocationBasedList = (params, options = {}) => {
  return useQuery({
    queryKey: ["locationBasedList", params],
    queryFn: () => getLocationBasedList(params),
    enabled: !!(params?.mapX && params?.mapY),
    staleTime: 3 * 60 * 1000, // 3분
    cacheTime: 5 * 60 * 1000, // 5분
    ...options,
  });
};

/**
 * 키워드 검색 조회 훅
 */
export const useSearchKeyword = (params, options = {}) => {
  return useQuery({
    queryKey: ["searchKeyword", params],
    queryFn: () => getSearchKeyword(params),
    enabled: !!params?.keyword,
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
    ...options,
  });
};

// =============================================================================
// 📊 메타데이터 조회 훅
// =============================================================================

/**
 * 지역코드 조회 훅
 */
export const useAreaCode = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["areaCode", params],
    queryFn: () => getAreaCode(params),
    staleTime: 60 * 60 * 1000, // 1시간 (지역코드는 자주 변경되지 않음)
    cacheTime: 24 * 60 * 60 * 1000, // 24시간
    ...options,
  });
};

/**
 * 서비스분류코드 조회 훅
 */
export const useCategoryCode = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["categoryCode", params],
    queryFn: () => getCategoryCode(params),
    staleTime: 60 * 60 * 1000, // 1시간
    cacheTime: 24 * 60 * 60 * 1000, // 24시간
    ...options,
  });
};

// =============================================================================
// 🏪 상세정보 조회 훅
// =============================================================================

/**
 * 공통정보 조회 훅
 */
export const useDetailCommon = (contentId, params = {}, options = {}) => {
  return useQuery({
    queryKey: ["detailCommon", contentId, params],
    queryFn: () => getDetailCommon(contentId, params),
    enabled: !!contentId,
    staleTime: 10 * 60 * 1000, // 10분
    cacheTime: 30 * 60 * 1000, // 30분
    ...options,
  });
};

/**
 * 소개정보 조회 훅
 */
export const useDetailIntro = (contentId, params, options = {}) => {
  return useQuery({
    queryKey: ["detailIntro", contentId, params],
    queryFn: () => getDetailIntro(contentId, params),
    enabled: !!(contentId && params?.contentTypeId),
    staleTime: 10 * 60 * 1000, // 10분
    cacheTime: 30 * 60 * 1000, // 30분
    ...options,
  });
};

/**
 * 반복정보 조회 훅
 */
export const useDetailInfo = (contentId, params, options = {}) => {
  return useQuery({
    queryKey: ["detailInfo", contentId, params],
    queryFn: () => getDetailInfo(contentId, params),
    enabled: !!(contentId && params?.contentTypeId),
    staleTime: 10 * 60 * 1000, // 10분
    cacheTime: 30 * 60 * 1000, // 30분
    ...options,
  });
};

/**
 * 이미지정보 조회 훅
 */
export const useDetailImage = (contentId, params = {}, options = {}) => {
  return useQuery({
    queryKey: ["detailImage", contentId, params],
    queryFn: () => getDetailImage(contentId, params),
    enabled: !!contentId,
    staleTime: 15 * 60 * 1000, // 15분 (이미지는 변경이 적음)
    cacheTime: 60 * 60 * 1000, // 1시간
    ...options,
  });
};

// =============================================================================
// 🐕 반려동물 전용 훅
// =============================================================================

/**
 * 반려동물 동반여행 조회 훅
 */
export const useDetailPetTour = (contentId, options = {}) => {
  return useQuery({
    queryKey: ["detailPetTour", contentId],
    queryFn: () => getDetailPetTour(contentId),
    enabled: !!contentId,
    staleTime: 10 * 60 * 1000, // 10분
    cacheTime: 30 * 60 * 1000, // 30분
    ...options,
  });
};

/**
 * 반려동물 동반여행 동기화 목록 조회 훅
 */
export const usePetTourSyncList = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["petTourSyncList", params],
    queryFn: () => getPetTourSyncList(params),
    staleTime: 30 * 60 * 1000, // 30분
    cacheTime: 60 * 60 * 1000, // 1시간
    ...options,
  });
};

// =============================================================================
// 🎯 조합 훅 (2단계 필터링용)
// =============================================================================

/**
 * 업체 완전한 정보 조회 훅 (병렬 처리)
 */
export const useCompleteBusinessInfo = (
  contentId,
  contentTypeId,
  options = {}
) => {
  return useQuery({
    queryKey: ["completeBusinessInfo", contentId, contentTypeId],
    queryFn: () => getCompleteBusinessInfo(contentId, contentTypeId),
    enabled: !!(contentId && contentTypeId),
    staleTime: 10 * 60 * 1000, // 10분
    cacheTime: 30 * 60 * 1000, // 30분
    ...options,
  });
};

/**
 * 지역별 업체 목록 + 반려동물 정보 조회 훅 (2단계 필터링용)
 */
export const useAreaBusinessWithPetInfo = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["areaBusinessWithPetInfo", params],
    queryFn: () => getAreaBusinessWithPetInfo(params),
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
    ...options,
  });
};

// =============================================================================
// 🔄 뮤테이션 훅 (필요시 사용)
// =============================================================================

/**
 * 검색 뮤테이션 (사용자 액션 기반)
 */
export const useSearchMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ type, params }) => {
      switch (type) {
        case "area":
          return getAreaBasedList(params);
        case "location":
          return getLocationBasedList(params);
        case "keyword":
          return getSearchKeyword(params);
        default:
          throw new Error("Unknown search type");
      }
    },
    onSuccess: (data, variables) => {
      // 성공 시 관련 쿼리 무효화
      queryClient.setQueryData(
        [`${variables.type}BasedList`, variables.params],
        data
      );
    },
  });
};

// =============================================================================
// 🎨 커스텀 훅 (비즈니스 로직)
// =============================================================================

/**
 * 현재 위치 기반 주변 카페 조회 훅
 */
export const useNearbyCafes = (coords, radius = 1000, options = {}) => {
  return useLocationBasedList(
    {
      mapX: coords?.lng,
      mapY: coords?.lat,
      radius,
      contentTypeId: "39", // 음식점
      arrange: "E", // 거리순
    },
    {
      enabled: !!(coords?.lng && coords?.lat),
      ...options,
    }
  );
};

/**
 * 현재 위치 기반 주변 숙소 조회 훅
 */
export const useNearbyAccommodation = (coords, radius = 2000, options = {}) => {
  return useLocationBasedList(
    {
      mapX: coords?.lng,
      mapY: coords?.lat,
      radius,
      contentTypeId: "32", // 숙박
      arrange: "E", // 거리순
    },
    {
      enabled: !!(coords?.lng && coords?.lat),
      ...options,
    }
  );
};

/**
 * 현재 위치 기반 주변 관광지 조회 훅
 */
export const useNearbyAttractions = (coords, radius = 3000, options = {}) => {
  return useLocationBasedList(
    {
      mapX: coords?.lng,
      mapY: coords?.lat,
      radius,
      contentTypeId: "12", // 관광지
      arrange: "E", // 거리순
    },
    {
      enabled: !!(coords?.lng && coords?.lat),
      ...options,
    }
  );
};

/**
 * 지역별 카페 목록 조회 훅
 */
export const useRegionalCafes = (areaCode, sigunguCode, options = {}) => {
  return useAreaBasedList(
    {
      contentTypeId: "39", // 음식점
      areaCode,
      sigunguCode,
      arrange: "C", // 수정일순
      numOfRows: 50,
    },
    {
      enabled: !!areaCode,
      ...options,
    }
  );
};

/**
 * 지역별 숙소 목록 조회 훅
 */
export const useRegionalAccommodation = (
  areaCode,
  sigunguCode,
  options = {}
) => {
  return useAreaBasedList(
    {
      contentTypeId: "32", // 숙박
      areaCode,
      sigunguCode,
      arrange: "C", // 수정일순
      numOfRows: 50,
    },
    {
      enabled: !!areaCode,
      ...options,
    }
  );
};
