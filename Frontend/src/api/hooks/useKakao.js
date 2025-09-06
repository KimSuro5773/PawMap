// 카카오 API Tanstack Query 훅
import { useQuery } from "@tanstack/react-query";
import {
  searchKeyword,
  searchHospitals,
  searchCafes,
  searchGrooming,
  searchAccommodation,
  searchNearby,
} from "../services/kakaoApi";

// 키워드 검색 훅
export const useSearchKeyword = (query, options = {}, queryOptions = {}) => {
  return useQuery({
    queryKey: ["kakao", "search", query, options],
    queryFn: () => searchKeyword(query, options),
    enabled: !!query,
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 30 * 60 * 1000, // 30분
    ...queryOptions,
  });
};

// 동물병원 검색 훅
export const useSearchHospitals = (
  location,
  options = {},
  queryOptions = {}
) => {
  return useQuery({
    queryKey: ["kakao", "hospitals", location, options],
    queryFn: () => searchHospitals(location, options),
    enabled: !!location,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    ...queryOptions,
  });
};

// 애견카페 검색 훅
export const useSearchCafes = (location, options = {}, queryOptions = {}) => {
  return useQuery({
    queryKey: ["kakao", "cafes", location, options],
    queryFn: () => searchCafes(location, options),
    enabled: !!location,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    ...queryOptions,
  });
};

// 애견 미용샵 검색 훅
export const useSearchGrooming = (
  location,
  options = {},
  queryOptions = {}
) => {
  return useQuery({
    queryKey: ["kakao", "grooming", location, options],
    queryFn: () => searchGrooming(location, options),
    enabled: !!location,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    ...queryOptions,
  });
};

// 애견 숙박시설 검색 훅
export const useSearchAccommodation = (
  location,
  options = {},
  queryOptions = {}
) => {
  return useQuery({
    queryKey: ["kakao", "accommodation", location, options],
    queryFn: () => searchAccommodation(location, options),
    enabled: !!location,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    ...queryOptions,
  });
};

// 현재 위치 기반 검색 훅
export const useSearchNearby = (
  searchType,
  position,
  options = {},
  queryOptions = {}
) => {
  return useQuery({
    queryKey: ["kakao", "nearby", searchType, position, options],
    queryFn: () => searchNearby(searchType, position, options),
    enabled: !!searchType && !!position,
    staleTime: 2 * 60 * 1000, // 2분 (위치 기반이라 더 짧게)
    cacheTime: 5 * 60 * 1000, // 5분
    ...queryOptions,
  });
};
