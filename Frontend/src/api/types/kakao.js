// 카카오 로컬 API 응답 타입 정의

/**
 * 카카오 키워드 검색 응답 구조
 */
export const KakaoSearchResponse = {
  meta: {
    total_count: 0,      // 검색된 총 결과 수
    pageable_count: 0,   // 현재 검색 조건에서 노출 가능한 문서 수
    is_end: false,       // 현재 페이지가 마지막 페이지인지 여부
  },
  documents: [
    {
      id: "",                    // 장소 ID
      place_name: "",           // 장소명
      category_name: "",        // 카테고리 이름 (예: "음식점 > 카페")
      category_group_code: "",  // 중요 카테고리만 그룹핑한 카테고리 그룹 코드
      category_group_name: "",  // 중요 카테고리만 그룹핑한 카테고리 그룹명
      phone: "",               // 전화번호
      address_name: "",        // 전체 지번 주소
      road_address_name: "",   // 전체 도로명 주소
      place_url: "",          // 장소 상세페이지 URL
      distance: "",           // 중심좌표까지의 거리 (단, x,y 파라미터를 준 경우에만)
      x: "",                  // X 좌표값, 경위도인 경우 longitude (경도)
      y: "",                  // Y 좌표값, 경위도인 경우 latitude (위도)
    }
  ]
};

/**
 * 카테고리 그룹 코드
 */
export const CategoryGroupCode = {
  MT1: "대형마트",
  CS2: "편의점", 
  PS3: "어린이집, 유치원",
  SC4: "학교",
  AC5: "학원",
  PK6: "주차장",
  OL7: "주유소, 충전소",
  SW8: "지하철역", 
  BK9: "은행",
  CT1: "문화시설",
  AG2: "중개업소",
  PO3: "공공기관",
  AT4: "관광명소",
  AD5: "숙박",
  FD6: "음식점",
  CE7: "카페", 
  HP8: "병원",
  PM9: "약국"
};