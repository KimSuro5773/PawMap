import apiClient from "../axios";
import { API_ENDPOINTS, DEFAULT_PARAMS } from "../types/tour";

// =============================================================================
// 🔍 기본 검색 및 목록 조회 API
// =============================================================================

/**
 * 지역기반 관광정보 조회
 * @param {Object} params - 요청 파라미터
 * @param {string} [params.contentTypeId] - 컨텐츠 타입 ID (12:관광지, 32:숙박, 39:음식점)
 * @param {string} [params.areaCode] - 지역코드
 * @param {string} [params.sigunguCode] - 시군구코드
 * @param {number} [params.numOfRows=10] - 한 페이지 결과 수
 * @param {number} [params.pageNo=1] - 페이지 번호
 * @param {string} [params.arrange="A"] - 정렬 (A:제목순, C:수정일순, D:생성일순)
 */
export const getAreaBasedList = async (params = {}) => {
  const response = await apiClient.get(`/api/tour${API_ENDPOINTS.AREA_BASED}`, {
    params: { ...DEFAULT_PARAMS, ...params },
  });
  return response;
};

/**
 * 위치기반 관광정보 조회
 * @param {Object} params - 요청 파라미터
 * @param {number} params.mapX - 경도 (필수)
 * @param {number} params.mapY - 위도 (필수)
 * @param {number} [params.radius=1000] - 검색 반경(m)
 * @param {string} [params.contentTypeId] - 컨텐츠 타입 ID
 * @param {number} [params.numOfRows=10] - 한 페이지 결과 수
 * @param {number} [params.pageNo=1] - 페이지 번호
 */
export const getLocationBasedList = async (params) => {
  if (!params?.mapX || !params?.mapY) {
    throw new Error("mapX(경도)와 mapY(위도) 파라미터가 필요합니다.");
  }
  const response = await apiClient.get(
    `/api/tour${API_ENDPOINTS.LOCATION_BASED}`,
    {
      params: { ...DEFAULT_PARAMS, ...params },
    }
  );
  return response;
};

/**
 * 키워드 검색 조회
 * @param {Object} params - 요청 파라미터
 * @param {string} params.keyword - 검색 키워드 (필수)
 * @param {string} [params.contentTypeId] - 컨텐츠 타입 ID
 * @param {string} [params.areaCode] - 지역코드
 * @param {string} [params.sigunguCode] - 시군구코드
 * @param {number} [params.numOfRows=10] - 한 페이지 결과 수
 * @param {number} [params.pageNo=1] - 페이지 번호
 */
export const getSearchKeyword = async (params) => {
  if (!params?.keyword) {
    throw new Error("검색 키워드가 필요합니다.");
  }
  const response = await apiClient.get(
    `/api/tour${API_ENDPOINTS.KEYWORD_SEARCH}`,
    {
      params: { ...DEFAULT_PARAMS, ...params },
    }
  );
  return response;
};

// =============================================================================
// 📊 메타데이터 조회 API
// =============================================================================

/**
 * 지역코드 조회
 * @param {Object} [params] - 요청 파라미터
 * @param {string} [params.areaCode] - 지역코드 (없으면 시/도 목록, 있으면 시/군/구 목록)
 * @param {number} [params.numOfRows=100] - 한 페이지 결과 수
 */
export const getAreaCode = async (params = {}) => {
  const response = await apiClient.get(`/api/tour${API_ENDPOINTS.AREA_CODE}`, {
    params: { numOfRows: 100, ...params },
  });
  return response;
};

/**
 * 서비스분류코드 조회
 * @param {Object} [params] - 요청 파라미터
 * @param {string} [params.contentTypeId] - 컨텐츠 타입 ID
 * @param {string} [params.cat1] - 대분류 코드
 * @param {string} [params.cat2] - 중분류 코드
 * @param {number} [params.numOfRows=100] - 한 페이지 결과 수
 */
export const getCategoryCode = async (params = {}) => {
  const response = await apiClient.get(
    `/api/tour${API_ENDPOINTS.CATEGORY_CODE}`,
    {
      params: { numOfRows: 100, ...params },
    }
  );
  return response;
};

// =============================================================================
// 🏪 상세정보 조회 API
// =============================================================================

/**
 * 공통정보 조회 (기본 정보)
 * @param {string} contentId - 컨텐츠 ID (필수)
 * @param {Object} [params] - 추가 파라미터
 * @param {string} [params.contentTypeId] - 컨텐츠 타입 ID
 */
export const getDetailCommon = async (contentId, params = {}) => {
  if (!contentId) {
    throw new Error("contentId가 필요합니다.");
  }
  const response = await apiClient.get(
    `/api/tour${API_ENDPOINTS.DETAIL_COMMON}/${contentId}`,
    { params }
  );
  return response;
};

/**
 * 소개정보 조회 (영업시간, 주차, 요금 등)
 * @param {string} contentId - 컨텐츠 ID (필수)
 * @param {Object} params - 요청 파라미터
 * @param {string} params.contentTypeId - 컨텐츠 타입 ID (필수)
 */
export const getDetailIntro = async (contentId, params) => {
  if (!contentId || !params?.contentTypeId) {
    throw new Error("contentId와 contentTypeId가 필요합니다.");
  }
  const response = await apiClient.get(
    `/api/tour${API_ENDPOINTS.DETAIL_INTRO}/${contentId}`,
    { params }
  );
  return response;
};

/**
 * 반복정보 조회 (객실정보 등)
 * @param {string} contentId - 컨텐츠 ID (필수)
 * @param {Object} params - 요청 파라미터
 * @param {string} params.contentTypeId - 컨텐츠 타입 ID (필수)
 * @param {number} [params.numOfRows=10] - 한 페이지 결과 수
 * @param {number} [params.pageNo=1] - 페이지 번호
 */
export const getDetailInfo = async (contentId, params) => {
  if (!contentId || !params?.contentTypeId) {
    throw new Error("contentId와 contentTypeId가 필요합니다.");
  }
  const response = await apiClient.get(
    `/api/tour${API_ENDPOINTS.DETAIL_INFO}/${contentId}`,
    {
      params: { ...DEFAULT_PARAMS, ...params },
    }
  );
  return response;
};

/**
 * 이미지정보 조회
 * @param {string} contentId - 컨텐츠 ID (필수)
 * @param {Object} [params] - 요청 파라미터
 * @param {string} [params.imageYN="Y"] - 원본 이미지 조회 여부
 * @param {string} [params.subImageYN="Y"] - 썸네일 이미지 조회 여부
 * @param {number} [params.numOfRows=10] - 한 페이지 결과 수
 * @param {number} [params.pageNo=1] - 페이지 번호
 */
export const getDetailImage = async (contentId, params = {}) => {
  if (!contentId) {
    throw new Error("contentId가 필요합니다.");
  }
  const response = await apiClient.get(
    `/api/tour${API_ENDPOINTS.DETAIL_IMAGES}/${contentId}`,
    {
      params: { ...DEFAULT_PARAMS, ...params },
    }
  );
  return response;
};

// =============================================================================
// 🐕 반려동물 전용 API
// =============================================================================

/**
 * 반려동물 동반여행 조회 (핵심 API)
 * @param {string} contentId - 컨텐츠 ID (필수)
 */
export const getDetailPetTour = async (contentId) => {
  if (!contentId) {
    throw new Error("contentId가 필요합니다.");
  }
  const response = await apiClient.get(
    `/api/tour${API_ENDPOINTS.DETAIL_PET}/${contentId}`
  );
  return response;
};

/**
 * 반려동물 동반여행 동기화 목록 조회 (관리용)
 * @param {Object} [params] - 요청 파라미터
 * @param {number} [params.numOfRows=10] - 한 페이지 결과 수
 * @param {number} [params.pageNo=1] - 페이지 번호
 * @param {string} [params.syncModTime] - 동기화 시간 (YYYYMMDDHHMMSS)
 */
export const getPetTourSyncList = async (params = {}) => {
  const response = await apiClient.get(
    `/api/tour${API_ENDPOINTS.PET_SYNC_LIST}`,
    {
      params: { ...DEFAULT_PARAMS, ...params },
    }
  );
  return response;
};

// =============================================================================
// 🎯 TanStack Query에서 자주 사용할 조합 함수들
// =============================================================================

/**
 * 업체 완전한 정보 조회 (병렬 처리)
 * @param {string} contentId - 컨텐츠 ID
 * @param {string} contentTypeId - 컨텐츠 타입 ID
 */
export const getCompleteBusinessInfo = async (contentId, contentTypeId) => {
  const [common, intro, images, petInfo] = await Promise.all([
    getDetailCommon(contentId, { contentTypeId }),
    getDetailIntro(contentId, { contentTypeId }),
    getDetailImage(contentId),
    getDetailPetTour(contentId),
  ]);

  return {
    common,
    intro,
    images,
    petInfo,
  };
};

/**
 * 지역별 업체 목록 + 반려동물 정보 조회 (2단계 필터링용)
 * @param {Object} params - 지역 검색 파라미터
 */
export const getAreaBusinessWithPetInfo = async (params) => {
  const businesses = await getAreaBasedList(params);

  if (businesses?.response?.body?.items?.item) {
    const businessList = Array.isArray(businesses.response.body.items.item)
      ? businesses.response.body.items.item
      : [businesses.response.body.items.item];

    const businessesWithPetInfo = await Promise.all(
      businessList.map(async (business) => {
        try {
          const petInfo = await getDetailPetTour(business.contentid);
          return { ...business, petInfo: petInfo?.response?.body?.items?.item };
        } catch (error) {
          console.warn(
            `반려동물 정보 조회 실패 - contentId: ${business.contentid}`,
            error
          );
          return { ...business, petInfo: null };
        }
      })
    );

    return {
      ...businesses,
      response: {
        ...businesses.response,
        body: {
          ...businesses.response.body,
          items: {
            item: businessesWithPetInfo,
          },
        },
      },
    };
  }

  return businesses;
};
