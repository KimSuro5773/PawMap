// 지도 관련 API 함수들
import apiClient from "../axios/interceptors";

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
