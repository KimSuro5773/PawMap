import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getIpLocation,
  getBrowserLocation,
  getAutoLocation,
} from "../services/geoapifyApi";

// =============================================================================
// 🌍 위치 정보 조회 훅들
// =============================================================================

/**
 * IP 기반 위치 조회 훅
 * - 데스크톱 환경에서 GPS가 안될 때 사용
 * - 도시 수준의 정확도
 */
export const useIpLocation = (options = {}) => {
  return useQuery({
    queryKey: ["ipLocation"],
    queryFn: getIpLocation,
    staleTime: 30 * 60 * 1000, // 30분 (IP 위치는 자주 변하지 않음)
    cacheTime: 60 * 60 * 1000, // 1시간
    retry: 2, // 실패 시 2번까지 재시도
    ...options,
  });
};

/**
 * 브라우저 Geolocation API 조회 훅 (뮤테이션 방식)
 * - 사용자 권한이 필요하므로 버튼 클릭 등의 액션 후 호출
 * - 모바일/GPS 환경에서 정확한 위치 제공
 */
export const useBrowserLocation = () => {
  return useMutation({
    mutationFn: getBrowserLocation,
    retry: false, // 위치 권한은 재시도하면 안됨
  });
};

/**
 * 자동 위치 감지 훅 (뮤테이션 방식)
 * - GPS 우선 시도 → IP 백업
 * - 필터의 "내 위치" 버튼 클릭 시 사용
 */
export const useAutoLocation = () => {
  return useMutation({
    mutationFn: getAutoLocation,
    retry: 1, // 1번 재시도
  });
};

// =============================================================================
// 🎯 비즈니스 로직 훅들
// =============================================================================

/**
 * 현재 위치 상태 관리 훅
 * - 위치 정보 + 로딩/에러 상태를 함께 관리
 * - 필터 컴포넌트에서 직접 사용
 */
export const useCurrentLocation = () => {
  const autoLocationMutation = useAutoLocation();
  const ipLocationQuery = useIpLocation({
    enabled: false, // 수동으로 트리거
  });

  // 정확한 위치 요청 (GPS + IP 백업)
  const requestAccurateLocation = async () => {
    try {
      const result = await autoLocationMutation.mutateAsync();
      return result;
    } catch (error) {
      throw error;
    }
  };

  // IP 위치 요청 (백업용)
  const requestIpLocation = async () => {
    try {
      const result = await ipLocationQuery.refetch();
      return result.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    // 위치 데이터
    location: autoLocationMutation.data || ipLocationQuery.data,

    // 상태
    isLoading: autoLocationMutation.isPending || ipLocationQuery.isFetching,
    error: autoLocationMutation.error || ipLocationQuery.error,

    // 액션 함수들
    requestAccurateLocation,
    requestIpLocation,

    // 개별 상태 (디버깅용)
    autoLocation: {
      data: autoLocationMutation.data,
      isLoading: autoLocationMutation.isPending,
      error: autoLocationMutation.error,
    },
    ipLocation: {
      data: ipLocationQuery.data,
      isLoading: ipLocationQuery.isFetching,
      error: ipLocationQuery.error,
    },
  };
};

/**
 * 위치 기반 필터링을 위한 좌표 변환 훅
 * - 위치 정보를 관광공사 API 파라미터로 변환
 */
export const useLocationForFilter = (location) => {
  if (!location?.latitude || !location?.longitude) {
    return null;
  }

  return {
    mapX: location.longitude, // 경도
    mapY: location.latitude,  // 위도
    source: location.source,
    accuracy: location.accuracy,
    city: location.city,
  };
};

// =============================================================================
// 🛠 유틸리티 훅들
// =============================================================================

/**
 * 위치 권한 상태 확인 훅
 * - 브라우저의 위치 권한 상태를 확인
 */
export const useLocationPermission = () => {
  return useQuery({
    queryKey: ["locationPermission"],
    queryFn: async () => {
      if (!navigator.permissions) {
        return { state: "unsupported" };
      }

      try {
        const permission = await navigator.permissions.query({ name: "geolocation" });
        return { state: permission.state };
      } catch (error) {
        return { state: "unknown", error: error.message };
      }
    },
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
  });
};

/**
 * 위치 기반 검색 히스토리 관리 (선택사항)
 * - 사용자가 검색한 위치들을 localStorage에 저장
 */
export const useLocationHistory = () => {
  const STORAGE_KEY = "pawmap_location_history";
  const MAX_HISTORY = 5;

  const getHistory = () => {
    try {
      const history = localStorage.getItem(STORAGE_KEY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error("Location history read error:", error);
      return [];
    }
  };

  const addToHistory = (location) => {
    try {
      const history = getHistory();
      const newLocation = {
        ...location,
        timestamp: Date.now(),
        id: `${location.latitude}_${location.longitude}`,
      };

      // 중복 제거
      const filteredHistory = history.filter(item => item.id !== newLocation.id);

      // 새 위치를 맨 앞에 추가
      const updatedHistory = [newLocation, ...filteredHistory].slice(0, MAX_HISTORY);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
      return updatedHistory;
    } catch (error) {
      console.error("Location history save error:", error);
      return getHistory();
    }
  };

  const clearHistory = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return [];
    } catch (error) {
      console.error("Location history clear error:", error);
      return getHistory();
    }
  };

  return {
    history: getHistory(),
    addToHistory,
    clearHistory,
  };
};