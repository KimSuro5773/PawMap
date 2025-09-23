// =============================================================================
// 🏷️ TourAPI 관련 타입 및 상수 정의
// =============================================================================

// Content Type ID 상수 (업종별 분류)
export const CONTENT_TYPES = {
  TOURIST_SPOT: "12", // 관광지
  CULTURAL_FACILITY: "14", // 문화시설
  FESTIVAL: "15", // 축제/공연/행사
  LEISURE_SPORTS: "28", // 레포츠
  ACCOMMODATION: "32", // 숙박
  RESTAURANT: "39", // 음식점
};

// Content Type 이름 매핑
export const CONTENT_TYPE_NAMES = {
  12: "관광지",
  14: "문화시설",
  15: "축제/공연/행사",
  28: "레포츠",
  32: "숙박",
  39: "음식점",
};

// 정렬 옵션 상수
export const SORT_OPTIONS = {
  TITLE: "O", // 제목순
  MODIFY_DATE: "Q", // 수정일순
  CREATE_DATE: "R", // 생성일순
};

// 정렬 옵션 이름 매핑
export const SORT_OPTION_NAMES = {
  O: "제목순",
  Q: "수정일순",
  R: "생성일순",
};

// 지역 코드 상수 (주요 지역)
export const AREA_CODES = {
  SEOUL: "1", // 서울
  INCHEON: "2", // 인천
  DAEJEON: "3", // 대전
  DAEGU: "4", // 대구
  GWANGJU: "5", // 광주
  BUSAN: "6", // 부산
  ULSAN: "7", // 울산
  SEJONG: "8", // 세종
  GYEONGGI: "31", // 경기
  GANGWON: "32", // 강원
  CHUNGBUK: "33", // 충북
  CHUNGNAM: "34", // 충남
  GYEONGBUK: "35", // 경북
  GYEONGNAM: "36", // 경남
  JEONBUK: "37", // 전북
  JEONNAM: "38", // 전남
  JEJU: "39", // 제주
};

// 지역 코드 이름 매핑
export const AREA_CODE_NAMES = {
  1: "서울",
  2: "인천",
  3: "대전",
  4: "대구",
  5: "광주",
  6: "부산",
  7: "울산",
  8: "세종",
  31: "경기",
  32: "강원",
  33: "충북",
  34: "충남",
  35: "경북",
  36: "경남",
  37: "전북",
  38: "전남",
  39: "제주",
};

// 서비스 분류코드 상수(cat1)
export const CATEGORY_CODES = {
  "음식점/카페": "A05",
  숙소: "B02",
  레포츠: "A03",
  자연: "A01", // 관광지 페이지에서 자연, 인문 둘 다 쓰임
  "인문(문화/예술/역사)": "A02",
};

export const CATEGORY_CODES_NAMES = {
  A05: "음식점/카페",
  B02: "숙소",
  A03: "레포츠",
  A01: "자연", // 관광지 페이지에서 자연, 인문 둘 다 쓰임
  A02: "인문(문화/예술/역사)",
};

// 페이지별 사용 가능한 cat1 코드 매핑
export const PAGE_CATEGORY_MAPPING = {
  restaurants: ["A05"], // 음식점/카페
  accommodation: ["B02"], // 숙소
  activities: ["A03"], // 레포츠
  attractions: ["A01", "A02"], // 관광지 (자연, 인문)
};

// API 응답 결과 코드
export const RESULT_CODES = {
  SUCCESS: "0000", // 정상 응답
  NO_DATA: "0001", // 데이터 없음
  SERVICE_ERROR: "0002", // 서비스 에러
  DATABASE_ERROR: "0003", // 데이터베이스 에러
  INVALID_REQUEST: "0004", // 잘못된 요청
  SYSTEM_ERROR: "9999", // 시스템 에러
};

// 필터링용 상수
export const PET_SIZE_OPTIONS = {
  SMALL: "small", // 소형견
  MEDIUM: "medium", // 중형견
  LARGE: "large", // 대형견
  ALL: "all", // 모든 크기
};

export const PET_SIZE_NAMES = {
  small: "소형견",
  medium: "중형견",
  large: "대형견",
  all: "모든 크기",
};

// 편의시설 옵션
export const FACILITY_OPTIONS = {
  PARKING: "parking", // 주차장
  INDOOR_ACCESS: "indoor", // 실내동반
  OUTDOOR_AREA: "outdoor", // 야외공간
  WATER_BOWL: "water_bowl", // 물그릇
  WASTE_BAG: "waste_bag", // 배변봉투
  LEASH: "leash", // 목줄
  PET_FOOD: "pet_food", // 사료
  PET_PLAYGROUND: "playground", // 애견놀이터
};

export const FACILITY_NAMES = {
  parking: "주차장",
  indoor: "실내동반 가능",
  outdoor: "야외공간",
  water_bowl: "물그릇 제공",
  waste_bag: "배변봉투 제공",
  leash: "목줄 대여",
  pet_food: "사료 판매",
  playground: "애견놀이터",
};

// API 엔드포인트 경로 상수
export const API_ENDPOINTS = {
  // 기본 검색
  AREA_BASED: "/area-based",
  LOCATION_BASED: "/location-based",
  KEYWORD_SEARCH: "/keyword",

  // 메타데이터
  AREA_CODE: "/area-code",
  CATEGORY_CODE: "/category-code",

  // 상세정보
  DETAIL_COMMON: "/detail/common",
  DETAIL_INTRO: "/detail/intro",
  DETAIL_INFO: "/detail/info",
  DETAIL_IMAGES: "/detail/images",

  // 반려동물 전용
  DETAIL_PET: "/detail/pet",
  PET_SYNC_LIST: "/pet-sync-list",
};

// 기본 요청 파라미터
export const DEFAULT_PARAMS = {
  numOfRows: 15,
  pageNo: 1,
};
