import { AREA_CODES, AREA_CODE_NAMES } from "../api/types/tour";

// 국내 여행지 데이터 (로컬 이미지와 설명)
export const DOMESTIC_REGIONS = [
  {
    id: "seoul",
    name: AREA_CODE_NAMES[AREA_CODES.SEOUL],
    areaCode: AREA_CODES.SEOUL,
    image: "/images/서울.webp",
    description: "다양한 반려동물 친화 시설이 있는 수도",
  },
  {
    id: "incheon",
    name: AREA_CODE_NAMES[AREA_CODES.INCHEON],
    areaCode: AREA_CODES.INCHEON,
    image: "/images/인천.webp",
    description: "공항과 항만이 있는 관문도시",
  },
  {
    id: "daejeon",
    name: AREA_CODE_NAMES[AREA_CODES.DAEJEON],
    areaCode: AREA_CODES.DAEJEON,
    image: "/images/대전.webp",
    description: "과학과 교육의 중심 도시",
  },
  {
    id: "daegu",
    name: AREA_CODE_NAMES[AREA_CODES.DAEGU],
    areaCode: AREA_CODES.DAEGU,
    image: "/images/대구.webp",
    description: "영남의 중심 도시",
  },
  {
    id: "gwangju",
    name: AREA_CODE_NAMES[AREA_CODES.GWANGJU],
    areaCode: AREA_CODES.GWANGJU,
    image: "/images/광주.webp",
    description: "예술과 문화의 고장",
  },
  {
    id: "busan",
    name: AREA_CODE_NAMES[AREA_CODES.BUSAN],
    areaCode: AREA_CODES.BUSAN,
    image: "/images/부산.webp",
    description: "바다와 도시의 매력이 있는 항구도시",
  },
  {
    id: "ulsan",
    name: AREA_CODE_NAMES[AREA_CODES.ULSAN],
    areaCode: AREA_CODES.ULSAN,
    image: "/images/울산.webp",
    description: "산업과 자연이 조화를 이루는 도시",
  },
  {
    id: "sejong",
    name: AREA_CODE_NAMES[AREA_CODES.SEJONG],
    areaCode: AREA_CODES.SEJONG,
    image: "/images/세종.webp",
    description: "균형발전을 이끄는 행정수도",
  },
  {
    id: "gyeonggi",
    name: AREA_CODE_NAMES[AREA_CODES.GYEONGGI],
    areaCode: AREA_CODES.GYEONGGI,
    image: "/images/경기.webp",
    description: "수도권 근교의 자연과 휴식",
  },
  {
    id: "gangwon",
    name: AREA_CODE_NAMES[AREA_CODES.GANGWON],
    areaCode: AREA_CODES.GANGWON,
    image: "/images/강원.webp",
    description: "아름다운 산과 바다가 있는 청정지역",
  },
  {
    id: "chungbuk",
    name: AREA_CODE_NAMES[AREA_CODES.CHUNGBUK],
    areaCode: AREA_CODES.CHUNGBUK,
    image: "/images/충북.webp",
    description: "내륙 중심부의 자연과 역사",
  },
  {
    id: "chungnam",
    name: AREA_CODE_NAMES[AREA_CODES.CHUNGNAM],
    areaCode: AREA_CODES.CHUNGNAM,
    image: "/images/충남.webp",
    description: "서해안의 풍부한 자연과 온천",
  },
  {
    id: "gyeongbuk",
    name: AREA_CODE_NAMES[AREA_CODES.GYEONGBUK],
    areaCode: AREA_CODES.GYEONGBUK,
    image: "/images/경북.webp",
    description: "천년 고도 경주의 역사와 문화",
  },
  {
    id: "gyeongnam",
    name: AREA_CODE_NAMES[AREA_CODES.GYEONGNAM],
    areaCode: AREA_CODES.GYEONGNAM,
    image: "/images/경남.webp",
    description: "산과 바다를 모두 즐길 수 있는 지역",
  },
  {
    id: "jeonbuk",
    name: AREA_CODE_NAMES[AREA_CODES.JEONBUK],
    areaCode: AREA_CODES.JEONBUK,
    image: "/images/전북.webp",
    description: "전통 문화와 맛의 고장",
  },
  {
    id: "jeonnam",
    name: AREA_CODE_NAMES[AREA_CODES.JEONNAM],
    areaCode: AREA_CODES.JEONNAM,
    image: "/images/전남.webp",
    description: "섬과 갯벌의 아름다운 자연경관",
  },
  {
    id: "jeju",
    name: AREA_CODE_NAMES[AREA_CODES.JEJU],
    areaCode: AREA_CODES.JEJU,
    image: "/images/제주.webp",
    description: "아름다운 자연과 함께하는 반려동물 여행",
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
