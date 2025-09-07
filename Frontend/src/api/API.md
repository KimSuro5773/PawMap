# PawMap Frontend API 사용 가이드

## 📋 개요

PawMap 프론트엔드에서 사용하는 API들의 사용법을 정리한 문서입니다.

## 🏗 API 구조

```
src/api/
├── axios/
│   ├── index.js           # Axios 기본 설정
│   └── interceptors.js    # 요청/응답 인터셉터
├── services/
│   ├── tourApi.js         # 한국관광공사 API 함수들
│   ├── naverApi.js        # 네이버 지도 API 함수들
│   └── geoapifyApi.js     # Geoapify 위치 API 함수들
├── hooks/
│   ├── useNaver.js        # 네이버 API React Query 훅
│   ├── useTour.js         # 관광공사 API React Query 훅
│   ├── useLocation.js     # 위치 관련 React Query 훅
│   └── useMap.js          # 지도 API React Query 훅
├── types/
│   ├── naver.js           # 네이버 API 타입 정의
│   └── tour.js            # 관광공사 API 타입 정의
└── README.md             # 이 문서
```

## 🗺 1. 네이버 지도/지오코딩 API

### 사용 목적

- 주소 ↔ 좌표 변환
- 지도 표시용 좌표 데이터 제공

### API 함수 사용법

```javascript
import { getCoordinates, getAddress } from "../api/services/naverApi";

// 지오코딩: 주소 → 좌표
const coordData = await getCoordinates("서울특별시 강남구 테헤란로 123");
console.log(coordData.addresses[0]); // { x: "126.9780", y: "37.5665", ... }

// 역지오코딩: 좌표 → 주소
const addressData = await getAddress(126.978, 37.5665);
console.log(addressData.results[0].region); // 지역 정보
```

### React Query 훅 사용법

```javascript
import { useGetCoordinates, useGetAddress } from "../api/hooks/useNaver";

function LocationComponent() {
  // 주소로 좌표 찾기
  const coordQuery = useGetCoordinates("서울특별시 강남구 테헤란로 123");

  // 좌표로 주소 찾기
  const addressQuery = useGetAddress(126.978, 37.5665);

  return (
    <div>
      {coordQuery.data && (
        <p>
          좌표: {coordQuery.data.addresses[0].x},{" "}
          {coordQuery.data.addresses[0].y}
        </p>
      )}
      {addressQuery.data && (
        <p>주소: {addressQuery.data.results[0].region.area1.name}</p>
      )}
    </div>
  );
}
```

## 🏛 2. 한국관광공사 TourAPI

### 사용 목적

- 공식 인증된 반려동물 동반 가능 업체 정보
- 상세한 반려동물 동반 조건 제공
- 제한: 일 1,000건

### API 함수 사용법

```javascript
import {
  searchTourPlaces,
  getTourDetail,
  getPetTourInfo,
} from "../api/services/tourApi";

// 지역 기반 관광정보 조회
const tourPlaces = await searchTourPlaces({
  contentTypeId: "39", // 39: 음식점, 32: 숙박, 28: 레포츠
  areaCode: "39", // 39: 제주도, 1: 서울
  sigunguCode: "1", // 시군구코드
  numOfRows: 50, // 결과 수 (최대 100)
  pageNo: 1, // 페이지 번호
  arrange: "C", // C: 수정일순, A: 제목순
});

// 상세 정보 조회
const detail = await getTourDetail("123456", {
  contentTypeId: "39",
});

// 반려동물 동반 정보 조회
const petInfo = await getPetTourInfo("123456");
```

### React Query 훅 사용법

```javascript
import {
  useSearchTourPlaces,
  useTourDetail,
  usePetTourInfo,
} from "../api/hooks/useTour";

function TourComponent() {
  // 관광지 검색
  const tourQuery = useSearchTourPlaces({
    contentTypeId: "39",
    areaCode: "39",
    numOfRows: 20,
  });

  // 상세 정보 조회 (contentId가 있을 때만)
  const detailQuery = useTourDetail(
    "123456",
    {
      contentTypeId: "39",
    },
    {
      enabled: !!contentId,
    }
  );

  // 반려동물 정보 조회
  const petQuery = usePetTourInfo("123456");

  return (
    <div>
      {tourQuery.data?.response.body.items.item?.map((place) => (
        <div key={place.contentid}>
          <h3>{place.title}</h3>
          <p>{place.addr1}</p>

          {/* 반려동물 정보가 있으면 표시 */}
          {petQuery.data && (
            <div>
              <p>
                반려동물 동반:{" "}
                {petQuery.data.response.body.items.item[0].acmpyPsblCpam}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

## 🔄 3. 위치 기반 검색 전략

### Geoapify + GPS 하이브리드 위치 획득

```javascript
import { useLocation } from "../api/hooks/useLocation";

function LocationSearch() {
  const { location, isLoading, getCurrentLocation } = useLocation();

  const handleGetLocation = async () => {
    try {
      const locationData = await getCurrentLocation();
      console.log("Current location:", locationData);
      // GPS 정확하면 GPS 사용, 아니면 IP 기반 위치 사용
    } catch (error) {
      console.error("Location error:", error);
    }
  };

  return (
    <div>
      <button onClick={handleGetLocation} disabled={isLoading}>
        {isLoading ? "위치 확인 중..." : "내 위치 찾기"}
      </button>

      {location.latitude && (
        <p>
          현재 위치: {location.latitude}, {location.longitude}
        </p>
      )}
    </div>
  );
}
```

### 관광공사 API 기반 2단계 필터링

```javascript
// 1단계: 관광공사 API로 지역별 검색
const tourResults = await searchTourPlaces({
  contentTypeId: "39", // 카페
  areaCode: "39", // 제주도
  numOfRows: 50,
});

// 2단계: 상세 정보 및 반려동물 정보 조회
const enrichedResults = await Promise.all(
  tourResults.response.body.items.item.map(async (place) => {
    try {
      const [detail, petInfo, images] = await Promise.all([
        getTourDetail(place.contentid, { contentTypeId: "39" }),
        getPetTourInfo(place.contentid),
        getTourImages(place.contentid),
      ]);

      return {
        ...place,
        detail: detail.response.body.items.item?.[0],
        petInfo: petInfo.response.body.items.item?.[0],
        images: images.response.body.items.item || [],
        dataSource: "official", // 공식 인증
      };
    } catch (error) {
      return {
        ...place,
        dataSource: "official",
      };
    }
  })
);
```

### 클라이언트 필터링

```javascript
// 반려동물 관련 필터 적용
const applyPetFilters = (places, filters) => {
  return places.filter((place) => {
    // 대형견 가능 필터
    if (filters.largeDog && place.petInfo) {
      if (!place.petInfo.acmpyPsblCpam?.includes("대형견")) {
        return false;
      }
    }

    // 실내 동반 가능 필터
    if (filters.indoorAccess && place.petInfo) {
      if (!place.petInfo.acmpyPsblCpam?.includes("실내")) {
        return false;
      }
    }

    // 주차장 필터
    if (filters.parking && place.tourInfo) {
      if (!place.tourInfo.parking?.includes("가능")) {
        return false;
      }
    }

    return true;
  });
};
```

## 🚀 5. 사용 예시

### 완전한 검색 컴포넌트

```javascript
import React, { useState } from "react";
import {
  useSearchTourPlaces,
  useTourDetail,
  usePetTourInfo,
} from "../api/hooks/useTour";
import { useLocation } from "../api/hooks/useLocation";

function PetFriendlySearchComponent() {
  const [areaCode, setAreaCode] = useState("39"); // 제주도
  const [contentTypeId, setContentTypeId] = useState("39"); // 카페
  const [filters, setFilters] = useState({
    largeDog: false,
    parking: false,
    indoor: false,
  });

  const { location, getCurrentLocation } = useLocation();

  // 관광공사 API로 검색
  const {
    data: places,
    isLoading: isSearching,
    error: searchError,
  } = useSearchTourPlaces({
    contentTypeId,
    areaCode,
    numOfRows: 20,
  });

  const toggleFilter = (filterKey) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: !prev[filterKey],
    }));
  };

  if (isSearching) return <div>검색 중...</div>;
  if (searchError) return <div>검색 오류: {searchError.message}</div>;

  return (
    <div>
      {/* 지역 선택 */}
      <select value={areaCode} onChange={(e) => setAreaCode(e.target.value)}>
        <option value="39">제주도</option>
        <option value="1">서울</option>
        <option value="6">부산</option>
      </select>

      {/* 카테고리 선택 */}
      <select
        value={contentTypeId}
        onChange={(e) => setContentTypeId(e.target.value)}
      >
        <option value="39">카페</option>
        <option value="32">숙소</option>
        <option value="12">관광지</option>
        <option value="28">레포츠</option>
      </select>

      {/* 위치 버튼 */}
      <button onClick={getCurrentLocation}>내 위치 찾기</button>

      {/* 필터 버튼들 */}
      <div>
        <button
          onClick={() => toggleFilter("largeDog")}
          className={filters.largeDog ? "active" : ""}
        >
          대형견 가능
        </button>
        <button
          onClick={() => toggleFilter("parking")}
          className={filters.parking ? "active" : ""}
        >
          주차장
        </button>
        <button
          onClick={() => toggleFilter("indoor")}
          className={filters.indoor ? "active" : ""}
        >
          실내동반
        </button>
      </div>

      {/* 검색 결과 */}
      <div>
        {places?.response?.body?.items?.item?.map((place) => (
          <PlaceCard key={place.contentid} place={place} />
        ))}
      </div>
    </div>
  );
}

function PlaceCard({ place }) {
  const { data: petInfo } = usePetTourInfo(place.contentid);

  return (
    <div className="place-card">
      <img src={place.firstimage || "/default-image.jpg"} alt={place.title} />
      <h3>{place.title}</h3>
      <p>{place.addr1}</p>
      <p>{place.tel}</p>
      <span className="badge official">✅ 정부 공인 인증</span>
      {petInfo?.response?.body?.items?.item?.[0] && (
        <div>
          <p>🐕 {petInfo.response.body.items.item[0].acmpyPsblCpam}</p>
          <p>🏠 {petInfo.response.body.items.item[0].restroomCpam}</p>
          <p>🅿️ {petInfo.response.body.items.item[0].parkingCpam}</p>
        </div>
      )}
    </div>
  );
}
```

## ⚠️ 6. 주의사항

### API 제한사항

- **관광공사 API**: 일 1,000건 제한
- **네이버 지도 API**: 월 사용량 제한
- **Geoapify API**: 월 $200 크레딧 (무료 할당량)

### 에러 처리

```javascript
// API 에러 처리 예시
const { data, error, isError } = useSearchTourPlaces({
  contentTypeId: "39",
  areaCode: "39",
});

if (isError) {
  if (error.response?.status === 429) {
    // API 한도 초과
    return <div>일일 사용량을 초과했습니다. 내일 다시 시도해주세요.</div>;
  } else if (error.response?.status === 400) {
    // 잘못된 요청
    return <div>검색 조건을 확인해주세요.</div>;
  } else {
    // 기타 오류
    return <div>서비스에 일시적인 문제가 발생했습니다.</div>;
  }
}
```

### 성능 최적화

```javascript
// React Query 캐싱 설정
const queryOptions = {
  staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
  cacheTime: 10 * 60 * 1000, // 10분간 캐시 유지
  refetchOnWindowFocus: false, // 창 포커스시 자동 재요청 비활성화
  retry: 2, // 실패시 2번까지 재시도
};
```

## 📞 7. 문제 해결

### 자주 발생하는 문제들

1. **CORS 오류**: 모든 외부 API는 백엔드 프록시를 통해 호출
2. **좌표계 일관성**: 관광공사, 네이버 모두 WGS84 좌표계 사용
3. **빈 결과**: 지역코드나 컨텐츠타입 확인 필요
4. **API 키 오류**: 백엔드 환경변수 설정 확인
5. **일일 할당량 초과**: 관광공사 API 1,000건 제한 관리

### 디버깅 팁

```javascript
// 개발 환경에서 API 응답 로깅
if (process.env.NODE_ENV === "development") {
  console.log("API Response:", data);
  console.log("Search params:", { location, options });
}
```

이 가이드를 참고하여 PawMap의 다양한 API를 효과적으로 활용하세요! 🐾
