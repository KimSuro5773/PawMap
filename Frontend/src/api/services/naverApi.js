import apiClient from "../axios/interceptors";

// 네이버 지역 검색 API
export const searchPlaces = async (query, options = {}) => {
  const { display = 5, start = 1, sort = "random" } = options;

  try {
    const response = await apiClient.get("/api/naver/search", {
      params: {
        query,
        display,
        start,
        sort,
      },
    });
    return response.data;
  } catch (error) {
    console.error("장소 검색 오류:", error);
    throw error;
  }
};

// 동물병원 검색
export const searchHospitals = async (location, options = {}) => {
  const query = `${location} 동물병원`;
  return await searchPlaces(query, options);
};

// 애견카페 검색
export const searchCafes = async (location, options = {}) => {
  const query = `${location} 애견카페`;
  return await searchPlaces(query, options);
};

// 애견 미용샵 검색
export const searchGrooming = async (location, options = {}) => {
  const query = `${location} 애견미용`;
  return await searchPlaces(query, options);
};

// 지오코딩 (주소 → 좌표)
export const getCoordinates = async (address) => {
  try {
    const response = await apiClient.get("/api/naver/geocoding", {
      params: { query: address },
    });
    return response.data;
  } catch (error) {
    console.error("좌표 변환 오류:", error);
    throw error;
  }
};

// 역지오코딩 (좌표 → 주소)
export const getAddress = async (lng, lat) => {
  try {
    const response = await apiClient.get("/api/naver/reverse-geocoding", {
      params: { coords: `${lng},${lat}` },
    });
    return response.data;
  } catch (error) {
    console.error("주소 변환 오류:", error);
    throw error;
  }
};

// 현재 위치 기반 검색
export const searchNearby = async (searchType, position, options = {}) => {
  const { latitude, longitude } = position;

  try {
    // 현재 위치의 주소를 먼저 가져옴
    const addressData = await getAddress(longitude, latitude);
    const location =
      addressData.results?.[0]?.region?.area1?.name || "현재위치";

    // 검색 타입별 함수 매핑
    const searchFunctions = {
      hospital: searchHospitals,
      cafe: searchCafes,
      grooming: searchGrooming,
    };

    const searchFunction = searchFunctions[searchType];
    if (!searchFunction) {
      throw new Error("지원하지 않는 검색 타입입니다.");
    }

    return await searchFunction(location, options);
  } catch (error) {
    console.error("주변 검색 오류:", error);
    throw error;
  }
};
