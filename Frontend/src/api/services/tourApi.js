import apiClient from "../axios/interceptors";

// 한국관광공사 TourAPI 관련 함수들

// 관광정보 검색 (기본)
export const searchTourInfo = async (contentTypeId, options = {}) => {
  const {
    areaCode,
    sigunguCode,
    numOfRows = 10,
    pageNo = 1,
    arrange = "B", // 인기도순
  } = options;

  try {
    const response = await apiClient.get("/api/tour/search", {
      params: {
        contentTypeId,
        areaCode,
        sigunguCode,
        numOfRows,
        pageNo,
        arrange,
      },
    });
    return response.data;
  } catch (error) {
    console.error("관광정보 검색 오류:", error);
    throw error;
  }
};

// 놀거리 검색 (레포츠)
export const searchActivities = async (options = {}) => {
  return await searchTourInfo("28", options); // 28: 레포츠
};

// 숙박 검색
export const searchAccommodation = async (options = {}) => {
  return await searchTourInfo("32", options); // 32: 숙박
};

// 애견동반 음식점 검색
export const searchPetFriendlyRestaurants = async (options = {}) => {
  return await searchTourInfo("39", options); // 39: 음식점
};

// 관광지 검색
export const searchTouristSpots = async (options = {}) => {
  return await searchTourInfo("12", options); // 12: 관광지
};

// 문화시설 검색
export const searchCulturalFacilities = async (options = {}) => {
  return await searchTourInfo("14", options); // 14: 문화시설
};

// 상세정보 조회
export const getTourDetail = async (contentId, contentTypeId = "39") => {
  try {
    const response = await apiClient.get(`/api/tour/detail/${contentId}`, {
      params: { contentTypeId },
    });
    return response.data;
  } catch (error) {
    console.error("상세정보 조회 오류:", error);
    throw error;
  }
};

// 반려동물 동반 정보 조회
export const getPetInfo = async (contentId) => {
  try {
    const response = await apiClient.get(`/api/tour/pet-info/${contentId}`);
    return response.data;
  } catch (error) {
    console.error("반려동물 정보 조회 오류:", error);
    throw error;
  }
};

// 지역별 검색 (지역코드 매핑)
export const AREA_CODES = {
  서울: "1",
  인천: "2",
  대전: "3",
  대구: "4",
  광주: "5",
  부산: "6",
  울산: "7",
  세종: "8",
  경기: "31",
  강원: "32",
  충북: "33",
  충남: "34",
  경북: "35",
  경남: "36",
  전북: "37",
  전남: "38",
  제주: "39",
};

// 지역별 놀거리 검색
export const searchActivitiesByArea = async (areaName, options = {}) => {
  const areaCode = AREA_CODES[areaName];
  if (!areaCode) {
    throw new Error(`지원하지 않는 지역입니다: ${areaName}`);
  }

  return await searchActivities({
    areaCode,
    ...options,
  });
};

// 지역별 숙박 검색
export const searchAccommodationByArea = async (areaName, options = {}) => {
  const areaCode = AREA_CODES[areaName];
  if (!areaCode) {
    throw new Error(`지원하지 않는 지역입니다: ${areaName}`);
  }

  return await searchAccommodation({
    areaCode,
    ...options,
  });
};
