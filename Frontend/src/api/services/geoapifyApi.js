import axios from "@/api/axios";

/**
 * Geoapify IP 기반 위치 조회
 * - 데스크톱 환경에서 Geolocation API가 동작하지 않을 때 사용
 * - IP 주소 기반으로 대략적인 위치 정보 제공 (도시 수준)
 */
export const getIpLocation = async () => {
  try {
    const response = await axios.get("/api/geoapify/ip-location");
    return response.data;
  } catch (error) {
    console.error("Geoapify IP Location API Error:", error);
    throw new Error(
      error.response?.data?.error || "위치 정보를 가져올 수 없습니다."
    );
  }
};

/**
 * 브라우저 Geolocation API 사용하여 정확한 위치 가져오기
 * - 모바일/GPS 지원 환경에서 우선 사용
 * - 사용자 권한 필요
 */
export const getBrowserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("브라우저에서 위치 서비스를 지원하지 않습니다."));
      return;
    }

    const options = {
      enableHighAccuracy: true, // 높은 정확도 요청
      timeout: 10000, // 10초 타임아웃
      maximumAge: 300000, // 5분간 캐시된 위치 사용
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: "high", // GPS 기반 높은 정확도
          timestamp: position.timestamp,
        };
        resolve(locationData);
      },
      (error) => {
        let errorMessage = "위치 정보를 가져올 수 없습니다.";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "위치 정보 접근이 거부되었습니다.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "위치 정보를 사용할 수 없습니다.";
            break;
          case error.TIMEOUT:
            errorMessage = "위치 정보 요청이 시간 초과되었습니다.";
            break;
        }

        reject(new Error(errorMessage));
      },
      options
    );
  });
};

/**
 * 자동 위치 감지 - 우선순위: Geolocation API → Geoapify IP
 * - 먼저 브라우저 Geolocation API 시도
 * - 실패 시 Geoapify IP 기반 위치로 대체
 */
export const getAutoLocation = async () => {
  try {
    // 1차: 브라우저 Geolocation API 시도
    const browserLocation = await getBrowserLocation();
    return {
      ...browserLocation,
      source: "gps",
      city: null, // GPS는 도시 정보 제공하지 않음
      country: null,
    };
  } catch (browserError) {
    console.warn("Browser Geolocation failed, trying IP location:", browserError.message);

    try {
      // 2차: Geoapify IP 기반 위치 시도
      const ipLocation = await getIpLocation();
      return {
        ...ipLocation,
        source: "ip",
      };
    } catch (ipError) {
      console.error("Both location methods failed:", {
        browserError: browserError.message,
        ipError: ipError.message,
      });

      throw new Error(
        `위치 정보를 가져올 수 없습니다. GPS: ${browserError.message}, IP: ${ipError.message}`
      );
    }
  }
};