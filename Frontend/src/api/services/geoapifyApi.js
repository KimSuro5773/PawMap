import axios from 'axios';

// Geoapify API 서비스
const GEOAPIFY_BASE_URL = 'http://localhost:3001/api/geoapify';

// GPS 설정 상수
export const GPS_CONFIG = {
  ACCURACY_THRESHOLD: 100, // 100m 이내
  TIMEOUT: 5000, // 5초
  MAX_AGE: 300000, // 5분
};

/**
 * GPS 위치 정보를 가져오는 함수
 * @returns {Promise<{latitude: number, longitude: number, accuracy: number}>}
 */
export const getGPSLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('위치 서비스가 지원되지 않는 브라우저입니다.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        resolve({
          latitude,
          longitude,
          accuracy,
          timestamp: Date.now(),
          source: 'gps'
        });
      },
      (error) => {
        let errorMessage = '';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '위치 정보 접근이 거부되었습니다. 브라우저 설정에서 위치 접근을 허용해주세요.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = '위치 정보를 사용할 수 없습니다.';
            break;
          case error.TIMEOUT:
            errorMessage = '위치 정보 요청 시간이 초과되었습니다.';
            break;
          default:
            errorMessage = '위치 정보를 가져올 수 없습니다.';
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: GPS_CONFIG.TIMEOUT,
        maximumAge: GPS_CONFIG.MAX_AGE,
      }
    );
  });
};

/**
 * IP 기반 위치 정보를 가져오는 함수
 * @returns {Promise<{latitude: number, longitude: number, city: string, country: string}>}
 */
export const getIPLocation = async () => {
  try {
    const response = await axios.get(`${GEOAPIFY_BASE_URL}/ip-location`);
    const { latitude, longitude, city, country, accuracy } = response.data;

    if (!latitude || !longitude) {
      throw new Error('위치 정보를 가져올 수 없습니다.');
    }

    return {
      latitude,
      longitude,
      city,
      country,
      accuracy,
      timestamp: Date.now(),
      source: 'ip'
    };
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message || '위치 정보를 가져올 수 없습니다.';
    throw new Error(errorMessage);
  }
};

/**
 * 하이브리드 위치 획득 (GPS 우선, 정확도 낮으면 IP로 대체)
 * @returns {Promise<LocationData>}
 */
export const getHybridLocation = async () => {
  try {
    // 먼저 GPS 시도
    const gpsLocation = await getGPSLocation();
    
    // GPS 정확도가 높으면 GPS 사용
    if (gpsLocation.accuracy <= GPS_CONFIG.ACCURACY_THRESHOLD) {
      return gpsLocation;
    }
    
    // GPS 정확도가 낮으면 IP Geolocation으로 대체
    console.warn('GPS 정확도가 낮아서 IP 기반 위치로 대체');
    return await getIPLocation();
  } catch (gpsError) {
    // GPS 실패 시 IP Geolocation 사용
    console.warn('GPS 위치 획득 실패, IP 기반 위치로 대체:', gpsError.message);
    return await getIPLocation();
  }
};

/**
 * GPS 정확도 체크 함수
 * @param {number} accuracy - GPS 정확도 (미터)
 * @returns {boolean} - 정확도가 충분한지 여부
 */
export const isGPSAccurate = (accuracy) => {
  return accuracy <= GPS_CONFIG.ACCURACY_THRESHOLD;
};

/**
 * 좌표 포맷팅 함수
 * @param {number} lat - 위도
 * @param {number} lng - 경도
 * @returns {string} - 포맷된 좌표 문자열
 */
export const formatCoordinates = (lat, lng) => {
  return `위도 ${lat.toFixed(4)}, 경도 ${lng.toFixed(4)}`;
};
