import { AREA_CODES, AREA_CODE_NAMES } from "../api/types/tour";

// 국내 여행지 데이터 (이미지와 설명 추가)
export const DOMESTIC_REGIONS = [
  {
    id: "jeju",
    name: AREA_CODE_NAMES[AREA_CODES.JEJU],
    areaCode: AREA_CODES.JEJU,
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    description: "아름다운 자연과 함께하는 반려동물 여행",
  },
  {
    id: "busan",
    name: AREA_CODE_NAMES[AREA_CODES.BUSAN],
    areaCode: AREA_CODES.BUSAN,
    image:
      "https://images.unsplash.com/photo-1540607807351-c8e16ed5c13c?w=400&h=400&fit=crop",
    description: "바다와 도시의 매력이 있는 항구도시",
  },
  {
    id: "gyeongbuk",
    name: AREA_CODE_NAMES[AREA_CODES.GYEONGBUK],
    areaCode: AREA_CODES.GYEONGBUK,
    image:
      "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=400&h=400&fit=crop",
    description: "천년 고도 경주의 역사와 문화",
  },
  {
    id: "seoul",
    name: AREA_CODE_NAMES[AREA_CODES.SEOUL],
    areaCode: AREA_CODES.SEOUL,
    image:
      "https://images.unsplash.com/photo-1565992441121-4367c2967103?w=400&h=400&fit=crop",
    description: "다양한 반려동물 친화 시설이 있는 수도",
  },
  {
    id: "gyeonggi",
    name: AREA_CODE_NAMES[AREA_CODES.GYEONGGI],
    areaCode: AREA_CODES.GYEONGGI,
    image:
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
    description: "수도권 근교의 자연과 휴식",
  },
  {
    id: "incheon",
    name: AREA_CODE_NAMES[AREA_CODES.INCHEON],
    areaCode: AREA_CODES.INCHEON,
    image:
      "https://images.unsplash.com/photo-1568019959450-9113ff3d7d00?w=400&h=400&fit=crop",
    description: "공항과 항만이 있는 관문도시",
  },
];

// 지역코드별 매핑 객체
export const REGION_CODE_MAP = DOMESTIC_REGIONS.reduce((acc, region) => {
  acc[region.areaCode] = region;
  return acc;
}, {});

// 지역명으로 찾기
export const getRegionByName = (name) => {
  return DOMESTIC_REGIONS.find((region) => region.name === name);
};

// 지역코드로 찾기
export const getRegionByCode = (areaCode) => {
  return REGION_CODE_MAP[areaCode];
};
