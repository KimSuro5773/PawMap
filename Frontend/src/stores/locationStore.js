import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

const useLocationStore = create(
  subscribeWithSelector((set, get) => ({
    // 사용자 위치 정보
    userLocation: {
      latitude: null,
      longitude: null,
      accuracy: null,
      timestamp: null,
      isLoading: false,
      error: null,
    },

    // 현재 선택된 필터 정보
    locationFilter: {
      type: 'all', // 'all', 'nearby', 'region'
      region: 'all',
      coordinates: null,
    },

    // 위치 설정 액션
    setUserLocation: (locationData) =>
      set((state) => ({
        userLocation: {
          ...state.userLocation,
          ...locationData,
        },
      })),

    // 위치 로딩 상태 설정
    setLocationLoading: (isLoading) =>
      set((state) => ({
        userLocation: {
          ...state.userLocation,
          isLoading,
        },
      })),

    // 위치 에러 설정
    setLocationError: (error) =>
      set((state) => ({
        userLocation: {
          ...state.userLocation,
          error,
          isLoading: false,
        },
      })),

    // 위치 필터 설정
    setLocationFilter: (filterData) =>
      set((state) => ({
        locationFilter: {
          ...state.locationFilter,
          ...filterData,
        },
      })),

    // 위치 초기화
    clearUserLocation: () =>
      set((state) => ({
        userLocation: {
          ...state.userLocation,
          latitude: null,
          longitude: null,
          accuracy: null,
          timestamp: null,
          error: null,
        },
      })),

    // 필터 초기화
    clearLocationFilter: () =>
      set({
        locationFilter: {
          type: 'all',
          region: 'all',
          coordinates: null,
        },
      }),
  }))
);

export default useLocationStore;