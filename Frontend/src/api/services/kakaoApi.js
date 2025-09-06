import apiClient from "../axios/interceptors";

// 카카오 키워드 검색 API
export const searchKeyword = async (query, options = {}) => {
  const { size = 15, page = 1, x, y, radius, category_group_code } = options;

  try {
    const params = {
      query,
      size: Math.min(size, 15), // 최대 15개
      page: Math.min(page, 3), // 최대 3페이지
    };

    // 좌표가 제공된 경우 추가
    if (x && y) {
      params.x = x;
      params.y = y;
    }

    // 반경이 제공된 경우 추가
    if (radius) {
      params.radius = radius;
    }

    // 카테고리 그룹 코드가 제공된 경우 추가
    if (category_group_code) {
      params.category_group_code = category_group_code;
    }

    const response = await apiClient.get("/api/kakao/keyword", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("키워드 검색 오류:", error);
    throw error;
  }
};

// 동물병원 검색
export const searchHospitals = async (location, options = {}) => {
  const query = `${location} 동물병원`;
  return await searchKeyword(query, {
    ...options,
    category_group_code: "HP8", // 병원 카테고리
  });
};

// 애견카페 검색
export const searchCafes = async (location, options = {}) => {
  const query = `${location} 애견카페`;
  return await searchKeyword(query, {
    ...options,
    category_group_code: "CE7", // 카페 카테고리
  });
};

// 애견 미용샵 검색
export const searchGrooming = async (location, options = {}) => {
  const query = `${location} 애견미용`;
  return await searchKeyword(query, options);
};

// 애견 숙박시설 검색
export const searchAccommodation = async (location, options = {}) => {
  const query = `${location} 애견 펜션`;
  return await searchKeyword(query, {
    ...options,
    category_group_code: "AD5", // 숙박 카테고리
  });
};

// 현재 위치 기반 검색
export const searchNearby = async (searchType, position, options = {}) => {
  const { latitude, longitude } = position;

  try {
    // 검색 타입별 함수 매핑
    const searchFunctions = {
      hospital: (opts) =>
        searchKeyword("동물병원", { ...opts, category_group_code: "HP8" }),
      cafe: (opts) =>
        searchKeyword("애견카페", { ...opts, category_group_code: "CE7" }),
      grooming: (opts) => searchKeyword("애견미용", opts),
      accommodation: (opts) =>
        searchKeyword("애견 펜션", { ...opts, category_group_code: "AD5" }),
    };

    const searchFunction = searchFunctions[searchType];
    if (!searchFunction) {
      throw new Error("지원하지 않는 검색 타입입니다.");
    }

    return await searchFunction({
      ...options,
      x: longitude,
      y: latitude,
      radius: options.radius || 5000, // 기본 5km 반경
    });
  } catch (error) {
    console.error("주변 검색 오류:", error);
    throw error;
  }
};
