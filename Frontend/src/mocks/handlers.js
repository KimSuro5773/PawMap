import { http, HttpResponse } from "msw";
import {
  MOCK_DATABASE,
  generateMockItem,
  generateDetailCommon,
  generateDetailIntro,
  generateDetailImages,
  generatePetTourInfo,
} from "./mockData";

const API_BASE_URL = "http://localhost:3001";

// 성공 응답 포맷
const createSuccessResponse = (items, totalCount = null) => {
  const count = totalCount !== null ? totalCount : (Array.isArray(items) ? items.length : 1);

  return {
    response: {
      header: {
        resultCode: "0000",
        resultMsg: "OK",
      },
      body: {
        items: {
          item: items,
        },
        numOfRows: 15,
        pageNo: 1,
        totalCount: count,
      },
    },
  };
};

// URL에서 쿼리 파라미터 추출 헬퍼
const getQueryParams = (url) => {
  const urlObj = new URL(url);
  return Object.fromEntries(urlObj.searchParams.entries());
};

// 거리 계산 함수 (단순 유클리드 거리)
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371000; // 지구 반지름 (m)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const handlers = [
  // 1. 지역기반 관광정보 조회
  http.get(`${API_BASE_URL}/api/tour/area-based`, ({ request }) => {
    const params = getQueryParams(request.url);
    const { contentTypeId, areaCode, numOfRows = 15, pageNo = 1 } = params;

    let items = [];

    // contentTypeId에 따라 데이터 필터링
    if (contentTypeId === "39") {
      items = MOCK_DATABASE.restaurants;
    } else if (contentTypeId === "32") {
      items = MOCK_DATABASE.accommodation;
    } else if (contentTypeId === "28") {
      items = MOCK_DATABASE.activities;
    } else if (contentTypeId === "12") {
      items = MOCK_DATABASE.attractions;
    } else {
      // 전체 조회
      items = [
        ...MOCK_DATABASE.restaurants,
        ...MOCK_DATABASE.accommodation,
        ...MOCK_DATABASE.activities,
        ...MOCK_DATABASE.attractions,
      ];
    }

    // areaCode로 필터링
    if (areaCode) {
      items = items.filter((item) => item.areacode === areaCode);
    }

    // 페이지네이션
    const start = (parseInt(pageNo) - 1) * parseInt(numOfRows);
    const end = start + parseInt(numOfRows);
    const paginatedItems = items.slice(start, end);

    return HttpResponse.json(createSuccessResponse(paginatedItems, items.length));
  }),

  // 2. 위치기반 관광정보 조회
  http.get(`${API_BASE_URL}/api/tour/location-based`, ({ request }) => {
    const params = getQueryParams(request.url);
    const { mapX, mapY, radius = 1000, contentTypeId, numOfRows = 15, pageNo = 1 } = params;

    if (!mapX || !mapY) {
      return HttpResponse.json(
        { error: "mapX and mapY are required" },
        { status: 400 }
      );
    }

    let items = [];

    // contentTypeId에 따라 데이터 선택
    if (contentTypeId === "39") {
      items = MOCK_DATABASE.restaurants;
    } else if (contentTypeId === "32") {
      items = MOCK_DATABASE.accommodation;
    } else if (contentTypeId === "28") {
      items = MOCK_DATABASE.activities;
    } else if (contentTypeId === "12") {
      items = MOCK_DATABASE.attractions;
    } else {
      items = [
        ...MOCK_DATABASE.restaurants,
        ...MOCK_DATABASE.accommodation,
        ...MOCK_DATABASE.activities,
        ...MOCK_DATABASE.attractions,
      ];
    }

    // 반경 내 필터링
    const centerLat = parseFloat(mapY);
    const centerLng = parseFloat(mapX);
    const radiusMeters = parseInt(radius);

    items = items.filter((item) => {
      const distance = calculateDistance(
        centerLat,
        centerLng,
        parseFloat(item.mapY),
        parseFloat(item.mapX)
      );
      return distance <= radiusMeters;
    });

    // 거리순 정렬
    items = items.map((item) => ({
      ...item,
      dist: calculateDistance(
        centerLat,
        centerLng,
        parseFloat(item.mapY),
        parseFloat(item.mapX)
      ).toFixed(0),
    }));
    items.sort((a, b) => parseFloat(a.dist) - parseFloat(b.dist));

    // 페이지네이션
    const start = (parseInt(pageNo) - 1) * parseInt(numOfRows);
    const end = start + parseInt(numOfRows);
    const paginatedItems = items.slice(start, end);

    return HttpResponse.json(createSuccessResponse(paginatedItems, items.length));
  }),

  // 3. 키워드 검색 조회
  http.get(`${API_BASE_URL}/api/tour/keyword`, ({ request }) => {
    const params = getQueryParams(request.url);
    const { keyword, contentTypeId, numOfRows = 15, pageNo = 1 } = params;

    if (!keyword) {
      return HttpResponse.json({ error: "keyword is required" }, { status: 400 });
    }

    let items = [];

    // contentTypeId에 따라 데이터 선택
    if (contentTypeId === "39") {
      items = MOCK_DATABASE.restaurants;
    } else if (contentTypeId === "32") {
      items = MOCK_DATABASE.accommodation;
    } else if (contentTypeId === "28") {
      items = MOCK_DATABASE.activities;
    } else if (contentTypeId === "12") {
      items = MOCK_DATABASE.attractions;
    } else {
      items = [
        ...MOCK_DATABASE.restaurants,
        ...MOCK_DATABASE.accommodation,
        ...MOCK_DATABASE.activities,
        ...MOCK_DATABASE.attractions,
      ];
    }

    // 키워드로 필터링 (title, addr1에서 검색)
    items = items.filter(
      (item) =>
        item.title.toLowerCase().includes(keyword.toLowerCase()) ||
        item.addr1.toLowerCase().includes(keyword.toLowerCase())
    );

    // 페이지네이션
    const start = (parseInt(pageNo) - 1) * parseInt(numOfRows);
    const end = start + parseInt(numOfRows);
    const paginatedItems = items.slice(start, end);

    return HttpResponse.json(createSuccessResponse(paginatedItems, items.length));
  }),

  // 4. 지역코드 조회
  http.get(`${API_BASE_URL}/api/tour/area-code`, ({ request }) => {
    const params = getQueryParams(request.url);
    const { areaCode } = params;

    // 시/도 목록
    const provinces = [
      { code: "1", name: "서울" },
      { code: "2", name: "인천" },
      { code: "3", name: "대전" },
      { code: "4", name: "대구" },
      { code: "5", name: "광주" },
      { code: "6", name: "부산" },
      { code: "31", name: "경기도" },
    ];

    // 시/군/구 목록 (예시)
    const districts = {
      "1": [
        { code: "1", name: "강남구" },
        { code: "2", name: "강동구" },
        { code: "3", name: "강서구" },
      ],
      "31": [
        { code: "1", name: "수원시" },
        { code: "2", name: "성남시" },
        { code: "3", name: "고양시" },
      ],
    };

    const items = areaCode ? districts[areaCode] || [] : provinces;

    return HttpResponse.json(createSuccessResponse(items));
  }),

  // 5. 서비스분류코드 조회
  http.get(`${API_BASE_URL}/api/tour/category-code`, () => {
    const categories = [
      { code: "A05", name: "음식점/카페" },
      { code: "B02", name: "숙박" },
      { code: "A03", name: "레포츠" },
      { code: "A01", name: "자연" },
      { code: "A02", name: "인문(문화/예술/역사)" },
    ];

    return HttpResponse.json(createSuccessResponse(categories));
  }),

  // 6. 공통정보 조회 (기본 정보)
  http.get(`${API_BASE_URL}/api/tour/detail/common/:contentId`, ({ params }) => {
    const { contentId } = params;

    if (!contentId) {
      return HttpResponse.json({ error: "contentId is required" }, { status: 400 });
    }

    // contentId에서 contentTypeId 추출 (첫 2자리)
    const contentTypeId = contentId.slice(0, 2);
    const detail = generateDetailCommon(contentId, contentTypeId);

    return HttpResponse.json(createSuccessResponse(detail));
  }),

  // 7. 소개정보 조회 (영업시간, 주차, 요금 등)
  http.get(`${API_BASE_URL}/api/tour/detail/intro/:contentId`, ({ params, request }) => {
    const { contentId } = params;
    const queryParams = getQueryParams(request.url);
    const { contentTypeId } = queryParams;

    if (!contentId || !contentTypeId) {
      return HttpResponse.json(
        { error: "contentId and contentTypeId are required" },
        { status: 400 }
      );
    }

    const intro = generateDetailIntro(contentId, contentTypeId);

    return HttpResponse.json(createSuccessResponse(intro));
  }),

  // 8. 반복정보 조회 (객실정보 등)
  http.get(`${API_BASE_URL}/api/tour/detail/info/:contentId`, ({ params }) => {
    const { contentId } = params;

    if (!contentId) {
      return HttpResponse.json({ error: "contentId is required" }, { status: 400 });
    }

    // 숙소 객실 정보 예시
    const rooms = [
      {
        contentid: contentId,
        roomtitle: "스탠다드룸",
        roomsize: "20m²",
        roomcount: "5",
        roombasecount: "2",
        roommaxcount: "4",
        roomoffseasonminfee: "80000",
        roompeakseasonminfee: "120000",
      },
      {
        contentid: contentId,
        roomtitle: "디럭스룸",
        roomsize: "30m²",
        roomcount: "3",
        roombasecount: "2",
        roommaxcount: "4",
        roomoffseasonminfee: "120000",
        roompeakseasonminfee: "180000",
      },
    ];

    return HttpResponse.json(createSuccessResponse(rooms));
  }),

  // 9. 이미지정보 조회
  http.get(`${API_BASE_URL}/api/tour/detail/images/:contentId`, ({ params }) => {
    const { contentId } = params;

    if (!contentId) {
      return HttpResponse.json({ error: "contentId is required" }, { status: 400 });
    }

    const images = generateDetailImages(contentId);

    return HttpResponse.json(createSuccessResponse(images));
  }),

  // 10. 반려동물 동반여행 조회
  http.get(`${API_BASE_URL}/api/tour/detail/pet/:contentId`, ({ params }) => {
    const { contentId } = params;

    if (!contentId) {
      return HttpResponse.json({ error: "contentId is required" }, { status: 400 });
    }

    const petInfo = generatePetTourInfo(contentId);

    return HttpResponse.json(createSuccessResponse(petInfo));
  }),

  // 11. 반려동물 동반여행 동기화 목록 조회
  http.get(`${API_BASE_URL}/api/tour/pet-sync-list`, () => {
    // 전체 데이터의 contentId 목록 반환
    const allItems = [
      ...MOCK_DATABASE.restaurants,
      ...MOCK_DATABASE.accommodation,
      ...MOCK_DATABASE.activities,
      ...MOCK_DATABASE.attractions,
    ];

    const syncList = allItems.map((item) => ({
      contentid: item.contentid,
      contenttypeid: item.contenttypeid,
      modifiedtime: item.modifiedtime,
    }));

    return HttpResponse.json(createSuccessResponse(syncList));
  }),
];
