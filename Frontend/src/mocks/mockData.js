// =============================================================================
// 🎭 Mock 데이터 생성 유틸리티
// =============================================================================

// 한국 지역별 대표 장소명 샘플
const PLACE_NAMES = {
  restaurants: [
    "멍멍카페", "포포카페", "댕댕이네", "펫프렌즈카페", "꼬물꼬물",
    "바우하우스", "펫츠파크", "도그런", "위드펫", "해피독",
    "반려동물카페 봄", "애견카페 여름", "펫카페 가을", "도기파크", "멍뭉이네",
    "푸들하우스", "리트리버카페", "비글비글", "시바견카페", "웰시코기네",
    "골든하우스", "말티즈카페", "슈나우저파크", "스피츠네", "포메라니안",
  ],
  accommodation: [
    "펫앤조이", "반려견펜션", "애견동반숙소", "도그호텔", "펫파크리조트",
    "강아지랑호텔", "반려동물펜션", "댕댕이펜션", "멍멍빌리지", "애견리조트",
    "펫프렌들리호텔", "도그스테이", "위드독펜션", "반려동물호텔", "애견하우스",
    "펫월드리조트", "도기파크펜션", "강아지천국", "반려견리조트", "멍뭉스테이",
  ],
  activities: [
    "반려견수영장", "애견놀이터", "도그런파크", "펫놀이공원", "강아지체험장",
    "반려동물테마파크", "애견운동장", "도그풀", "펫파크", "멍멍랜드",
    "반려견캠핑장", "애견해수욕장", "도그비치", "펫스파", "강아지훈련장",
  ],
  attractions: [
    "반려동물공원", "애견동반산책로", "펫프렌들리공원", "도그파크", "반려견숲길",
    "애견동반관광지", "반려동물정원", "펫가든", "강아지동산", "멍멍공원",
  ],
};

const AREA_NAMES = {
  1: ["강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구"],
  31: ["수원시", "성남시", "고양시", "용인시", "부천시", "안산시", "남양주시", "안양시", "평택시", "의정부시"],
  6: ["해운대구", "남구", "동구", "서구", "부산진구", "동래구", "금정구", "연제구", "수영구", "사상구"],
};

// 실제같은 설명 생성
const DESCRIPTIONS = {
  restaurants: [
    "반려견과 함께 즐길 수 있는 아늑한 카페입니다. 넓은 실내 공간과 야외 테라스를 갖추고 있어 반려견이 자유롭게 놀 수 있습니다.",
    "반려동물 동반 가능한 프렌들리한 분위기의 음식점입니다. 반려견을 위한 전용 메뉴와 깨끗한 물그릇이 준비되어 있습니다.",
    "대형견도 입장 가능한 넓은 공간의 카페입니다. 반려견 놀이터가 별도로 마련되어 있어 안전하게 즐길 수 있습니다.",
  ],
  accommodation: [
    "반려동물과 함께하는 편안한 휴식처입니다. 전 객실 반려동물 동반 가능하며, 애견 운동장과 산책로가 마련되어 있습니다.",
    "반려견 전용 수영장과 놀이터를 갖춘 펜션입니다. 반려동물 용품 대여 서비스도 제공합니다.",
    "깨끗하고 쾌적한 반려동물 동반 숙소입니다. 주변에 산책하기 좋은 공원과 숲길이 있습니다.",
  ],
  activities: [
    "반려견과 함께 즐기는 다양한 액티비티를 제공합니다. 수영장, 놀이터, 훈련장 등의 시설을 갖추고 있습니다.",
    "안전하고 즐거운 반려견 전용 체험 공간입니다. 전문 트레이너가 상주하여 안전하게 이용할 수 있습니다.",
  ],
  attractions: [
    "반려동물과 함께 산책하기 좋은 아름다운 공원입니다. 잘 정돈된 산책로와 넓은 잔디밭이 있습니다.",
    "반려견 동반 가능한 관광 명소입니다. 사진 찍기 좋은 포토존과 휴게 공간이 마련되어 있습니다.",
  ],
};

// contentId를 기반으로 일관된 데이터 생성
const mockDatabase = new Map();

// 랜덤 좌표 생성 (한국 영역 내)
const generateCoordinates = (areaCode) => {
  const baseCoords = {
    1: { lat: 37.5665, lng: 126.9780 }, // 서울
    2: { lat: 37.4563, lng: 126.7052 }, // 인천
    6: { lat: 35.1796, lng: 129.0756 }, // 부산
    31: { lat: 37.4138, lng: 127.5183 }, // 경기
  };

  const base = baseCoords[areaCode] || { lat: 37.5665, lng: 126.9780 };

  return {
    mapY: (base.lat + (Math.random() - 0.5) * 0.5).toFixed(6),
    mapX: (base.lng + (Math.random() - 0.5) * 0.5).toFixed(6),
  };
};

// Mock 데이터 항목 생성
export const generateMockItem = (contentId, contentTypeId, areaCode = "1") => {
  // 이미 생성된 데이터가 있으면 재사용 (일관성 유지)
  if (mockDatabase.has(contentId)) {
    return mockDatabase.get(contentId);
  }

  const typeMap = {
    "12": "attractions",
    "28": "activities",
    "32": "accommodation",
    "39": "restaurants",
  };

  const type = typeMap[contentTypeId] || "restaurants";
  const names = PLACE_NAMES[type];
  const nameIndex = parseInt(contentId) % names.length;
  const title = `${names[nameIndex]} ${contentId.slice(-2)}`;

  const coords = generateCoordinates(areaCode);
  const areaName = AREA_NAMES[areaCode]?.[parseInt(contentId) % 10] || "강남구";

  const item = {
    contentid: contentId,
    contenttypeid: contentTypeId,
    title,
    addr1: `${getAreaName(areaCode)} ${areaName} ${getRandomStreet()}`,
    addr2: "",
    ...coords,
    tel: `02-${1000 + parseInt(contentId) % 9000}-${1000 + parseInt(contentId.slice(-4)) % 9000}`,
    firstimage: `https://picsum.photos/seed/${contentId}/800/600`,
    firstimage2: `https://picsum.photos/seed/${contentId}/400/300`,
    areacode: areaCode,
    cat1: getCat1(contentTypeId),
    cat2: getCat2(contentTypeId),
    cat3: getCat3(contentTypeId),
    mlevel: "1",
    modifiedtime: "20241001000000",
    sigungucode: (parseInt(contentId) % 20 + 1).toString(),
  };

  mockDatabase.set(contentId, item);
  return item;
};

// 상세 공통 정보 생성
export const generateDetailCommon = (contentId, contentTypeId) => {
  const basicItem = generateMockItem(contentId, contentTypeId);
  const typeMap = {
    "12": "attractions",
    "28": "activities",
    "32": "accommodation",
    "39": "restaurants",
  };
  const type = typeMap[contentTypeId] || "restaurants";
  const descriptions = DESCRIPTIONS[type];

  return {
    ...basicItem,
    homepage: `<a href="http://www.example.com/${contentId}">홈페이지 바로가기</a>`,
    overview: descriptions[parseInt(contentId) % descriptions.length],
    zipcode: `${10000 + parseInt(contentId) % 90000}`,
  };
};

// 상세 소개 정보 생성
export const generateDetailIntro = (contentId, contentTypeId) => {
  const intros = {
    "39": { // 음식점
      firstmenu: "대표메뉴: 아메리카노, 라떼, 케이크",
      opentimefood: "10:00",
      restdatefood: "매주 월요일",
      treatmenu: "반려견 전용 간식 무료 제공",
      parkingfood: "가능 (10대)",
      discountinfofood: "반려동물 동반 시 10% 할인",
    },
    "32": { // 숙박
      checkintime: "15:00",
      checkouttime: "11:00",
      roomcount: (parseInt(contentId) % 20 + 5).toString(),
      parkinglodging: "가능 (무료)",
      pickup: "가능 (사전 예약 필수)",
      barbecue: "가능",
      subfacility: "반려견 전용 수영장, 애견 놀이터, 산책로",
    },
    "28": { // 레포츠
      usetime: "10:00~18:00",
      parking: "가능 (20대)",
      restdate: "연중무휴",
      accomcount: "수용인원: 100명",
      useseason: "연중 이용 가능",
    },
    "12": { // 관광지
      usetime: "상시 개방",
      parking: "가능",
      restdate: "연중무휴",
      chkpet: "반려동물 동반 가능 (목줄 필수)",
    },
  };

  return intros[contentTypeId] || intros["39"];
};

// 이미지 정보 생성
export const generateDetailImages = (contentId) => {
  const imageCount = 3 + (parseInt(contentId) % 5);
  const images = [];

  for (let i = 0; i < imageCount; i++) {
    images.push({
      contentid: contentId,
      originimgurl: `https://picsum.photos/seed/${contentId}-${i}/1200/800`,
      smallimageurl: `https://picsum.photos/seed/${contentId}-${i}/400/300`,
      serialnum: (i + 1).toString(),
    });
  }

  return images;
};

// 반려동물 동반 정보 생성
export const generatePetTourInfo = (contentId) => {
  const petSizes = ["소형견", "중형견", "대형견"];
  const allowedSizes = petSizes.slice(0, (parseInt(contentId) % 3) + 1);

  return {
    contentid: contentId,
    petsize: allowedSizes.join(", "),
    petguide: "입장 시 목줄 착용 필수, 배변봉투 지참, 다른 반려견과 거리 유지",
    petfacility: "물그릇, 배변봉투, 반려견 전용 공간",
    petplace: "실내 및 야외 모두 가능",
    petprice: parseInt(contentId) % 2 === 0 ? "무료" : "반려견 1마리당 5,000원",
  };
};

// 유틸리티 함수들
const getAreaName = (areaCode) => {
  const names = {
    "1": "서울특별시",
    "2": "인천광역시",
    "3": "대전광역시",
    "4": "대구광역시",
    "5": "광주광역시",
    "6": "부산광역시",
    "31": "경기도",
  };
  return names[areaCode] || "서울특별시";
};

const getRandomStreet = () => {
  const streets = ["반려로", "펫프렌들리길", "애견길", "강아지로", "도그로", "멍멍길", "댕댕로"];
  return streets[Math.floor(Math.random() * streets.length)] + " " + (Math.floor(Math.random() * 100) + 1);
};

const getCat1 = (contentTypeId) => {
  const map = { "12": "A01", "28": "A03", "32": "B02", "39": "A05" };
  return map[contentTypeId] || "A05";
};

const getCat2 = (contentTypeId) => {
  const map = { "12": "A0101", "28": "A0301", "32": "B0201", "39": "A0502" };
  return map[contentTypeId] || "A0502";
};

const getCat3 = (contentTypeId) => {
  const map = { "12": "A01010100", "28": "A03010200", "32": "B02010100", "39": "A05020900" };
  return map[contentTypeId] || "A05020900";
};

// 전체 Mock 데이터 생성 (100개씩)
export const generateMockDatabase = () => {
  const database = {
    restaurants: [],
    accommodation: [],
    activities: [],
    attractions: [],
  };

  // 음식점 100개
  for (let i = 1; i <= 100; i++) {
    const contentId = `3900${String(i).padStart(4, "0")}`;
    database.restaurants.push(generateMockItem(contentId, "39", getRandomAreaCode()));
  }

  // 숙박 100개
  for (let i = 1; i <= 100; i++) {
    const contentId = `3200${String(i).padStart(4, "0")}`;
    database.accommodation.push(generateMockItem(contentId, "32", getRandomAreaCode()));
  }

  // 레포츠 50개
  for (let i = 1; i <= 50; i++) {
    const contentId = `2800${String(i).padStart(4, "0")}`;
    database.activities.push(generateMockItem(contentId, "28", getRandomAreaCode()));
  }

  // 관광지 100개
  for (let i = 1; i <= 100; i++) {
    const contentId = `1200${String(i).padStart(4, "0")}`;
    database.attractions.push(generateMockItem(contentId, "12", getRandomAreaCode()));
  }

  return database;
};

const getRandomAreaCode = () => {
  const areaCodes = ["1", "2", "6", "31"];
  return areaCodes[Math.floor(Math.random() * areaCodes.length)];
};

// 초기 데이터베이스 생성
export const MOCK_DATABASE = generateMockDatabase();
