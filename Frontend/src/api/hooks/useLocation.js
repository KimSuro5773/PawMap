import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  getHybridLocation,
  getGPSLocation,
  getIPLocation,
} from "../services/geoapifyApi";
import useLocationStore from "@/stores/locationStore";

/**
 * 위치 정보 관련 TanStack Query 훅
 */
export const useLocation = () => {
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const {
    userLocation,
    setUserLocation,
    setLocationLoading,
    setLocationError: setStoreLocationError,
    setLocationFilter,
  } = useLocationStore();

  // 하이브리드 위치 획득 mutation (GPS + IP 대체)
  const hybridLocationMutation = useMutation({
    mutationFn: getHybridLocation,
    onMutate: () => {
      // 뮤테이션 시작 시 로딩 상태 설정
      setIsLocationLoading(true);
      setLocationLoading(true);
      setLocationError(null);
      setStoreLocationError(null);
    },
    onSuccess: (data) => {
      // 성공 시 스토어에 위치 정보 저장
      setUserLocation(data);
      setLocationFilter({
        type: "nearby",
        coordinates: { lat: data.latitude, lng: data.longitude },
      });
    },
    onError: (error) => {
      // 에러 시 에러 상태 설정
      const errorMessage = error.message || "위치 정보를 가져올 수 없습니다.";
      setLocationError(errorMessage);
      setStoreLocationError(errorMessage);
    },
    onSettled: () => {
      // 완료 시 로딩 상태 해제 (최소 500ms 보장)
      const minLoadingTime = 500;
      setTimeout(() => {
        setIsLocationLoading(false);
        setLocationLoading(false);
      }, minLoadingTime);
    },
  });

  // GPS 위치 획득 mutation
  const gpsLocationMutation = useMutation({
    mutationFn: getGPSLocation,
    onMutate: () => {
      setIsLocationLoading(true);
      setLocationLoading(true);
      setLocationError(null);
      setStoreLocationError(null);
    },
    onSuccess: (data) => {
      setUserLocation(data);
      setLocationFilter({
        type: "nearby",
        coordinates: { lat: data.latitude, lng: data.longitude },
      });
    },
    onError: (error) => {
      const errorMessage =
        error.message || "GPS 위치 정보를 가져올 수 없습니다.";
      setLocationError(errorMessage);
      setStoreLocationError(errorMessage);
    },
    onSettled: () => {
      setTimeout(() => {
        setIsLocationLoading(false);
        setLocationLoading(false);
      }, 500);
    },
  });

  // IP 위치 획득 mutation
  const ipLocationMutation = useMutation({
    mutationFn: getIPLocation,
    onMutate: () => {
      setIsLocationLoading(true);
      setLocationLoading(true);
      setLocationError(null);
      setStoreLocationError(null);
    },
    onSuccess: (data) => {
      setUserLocation(data);
      setLocationFilter({
        type: "nearby",
        coordinates: { lat: data.latitude, lng: data.longitude },
      });
    },
    onError: (error) => {
      const errorMessage =
        error.message || "IP 위치 정보를 가져올 수 없습니다.";
      setLocationError(errorMessage);
      setStoreLocationError(errorMessage);
    },
    onSettled: () => {
      setTimeout(() => {
        setIsLocationLoading(false);
        setLocationLoading(false);
      }, 500);
    },
  });

  // 현재 위치 조회 쿼리 (캐시된 위치 정보가 있으면 사용)
  const currentLocationQuery = useQuery({
    queryKey: ["userLocation"],
    queryFn: getHybridLocation,
    enabled: false, // 수동으로 실행
    staleTime: 5 * 60 * 1000, // 5분간 fresh
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지 (구 cacheTime)
    retry: 1,
  });

  // 위치 획득 함수들
  const getCurrentLocation = () => {
    return hybridLocationMutation.mutateAsync();
  };

  const getGPSLocationOnly = () => {
    return gpsLocationMutation.mutateAsync();
  };

  const getIPLocationOnly = () => {
    return ipLocationMutation.mutateAsync();
  };

  // 캐시된 위치 조회
  const refetchLocation = () => {
    return currentLocationQuery.refetch();
  };

  return {
    // 상태
    location: userLocation,
    isLoading: isLocationLoading || userLocation.isLoading,
    error: locationError || userLocation.error,

    // TanStack Query 상태
    isHybridLoading: hybridLocationMutation.isPending,
    isGPSLoading: gpsLocationMutation.isPending,
    isIPLoading: ipLocationMutation.isPending,

    // 에러 상태
    hybridError: hybridLocationMutation.error,
    gpsError: gpsLocationMutation.error,
    ipError: ipLocationMutation.error,

    // 위치 획득 함수들
    getCurrentLocation,
    getGPSLocationOnly,
    getIPLocationOnly,
    refetchLocation,

    // 에러 초기화
    clearError: () => {
      setLocationError(null);
      setStoreLocationError(null);
    },

    // 뮤테이션 초기화
    reset: () => {
      hybridLocationMutation.reset();
      gpsLocationMutation.reset();
      ipLocationMutation.reset();
      setLocationError(null);
      setStoreLocationError(null);
    },
  };
};

export default useLocation;
