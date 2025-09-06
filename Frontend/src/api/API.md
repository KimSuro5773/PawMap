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
│   ├── kakaoApi.js        # 카카오 로컬 API 함수들
│   ├── naverApi.js        # 네이버 지오코딩 API 함수들
│   ├── tourApi.js         # 한국관광공사 API 함수들
│   └── mapApi.js          # 지도 관련 API 함수들
├── hooks/
│   ├── useKakao.js        # 카카오 API React Query 훅
│   ├── useNaver.js        # 네이버 API React Query 훅
│   ├── useTour.js         # 관광공사 API React Query 훅
│   └── useMap.js          # 지도 API React Query 훅
├── types/
│   ├── kakao.js           # 카카오 API 타입 정의
│   ├── naver.js           # 네이버 API 타입 정의
│   └── tour.js            # 관광공사 API 타입 정의
└── README.md             # 이 문서
```

## 🔍 1. 카카오 로컬 API (키워드 검색)

### 사용 목적

- 동물병원, 미용샵 등 일반 업체 검색
- 실시간 정보 및 정확한 연락처 제공
- 제한: 검색당 45개 (15개 × 3페이지)

### API 함수 사용법

#### 기본 키워드 검색

```javascript
import { searchKeyword } from "../api/services/kakaoApi";

// 기본 검색
const searchResult = await searchKeyword("제주도 동물병원");

// 옵션을 포함한 검색
const searchResult = await searchKeyword("애견카페", {
  size: 10, // 결과 개수 (최대 15)
  page: 1, // 페이지 번호 (최대 3)
  x: 126.5219, // 경도 (중심 좌표)
  y: 33.4996, // 위도 (중심 좌표)
  radius: 5000, // 반경 (미터, 최대 20km)
  category_group_code: "CE7", // 카테고리 코드 (카페)
});
```

#### 업종별 검색 함수

```javascript
import {
  searchHospitals,
  searchCafes,
  searchGrooming,
  searchAccommodation,
} from "../api/services/kakaoApi";

// 동물병원 검색 (HP8 카테고리 자동 적용)
const hospitals = await searchHospitals("제주시", { size: 15 });

// 애견카페 검색 (CE7 카테고리 자동 적용)
const cafes = await searchCafes("강남구", { size: 10 });

// 애견 미용샵 검색
const grooming = await searchGrooming("부산", { size: 8 });

// 애견 숙박시설 검색 (AD5 카테고리 자동 적용)
const accommodation = await searchAccommodation("제주도", { size: 12 });
```

#### 현재 위치 기반 검색

```javascript
import { searchNearby } from "../api/services/kakaoApi";

// 사용자 위치 정보
const position = {
  latitude: 37.5665,
  longitude: 126.978,
};

// 주변 동물병원 검색
const nearbyHospitals = await searchNearby("hospital", position, {
  radius: 3000, // 3km 반경
});

// 주변 애견카페 검색
const nearbyCafes = await searchNearby("cafe", position, {
  radius: 5000, // 5km 반경
});
```

### React Query 훅 사용법

```javascript
import {
  useSearchKeyword,
  useSearchHospitals,
  useSearchCafes,
  useSearchNearby,
} from "../api/hooks/useKakao";

function SearchComponent() {
  // 기본 검색 훅
  const { data, isLoading, error } = useSearchKeyword("제주도 동물병원", {
    size: 15,
    page: 1,
  });

  // 동물병원 검색 훅
  const hospitalsQuery = useSearchHospitals("강남구", { size: 10 });

  // 현재 위치 기반 검색 훅
  const nearbyQuery = useSearchNearby(
    "cafe",
    userPosition,
    {
      radius: 5000,
    },
    {
      enabled: !!userPosition, // 위치 정보가 있을 때만 실행
    }
  );

  if (isLoading) return <div>검색 중...</div>;
  if (error) return <div>오류 발생: {error.message}</div>;

  return (
    <div>
      {data?.documents?.map((place) => (
        <div key={place.id}>
          <h3>{place.place_name}</h3>
          <p>{place.address_name}</p>
          <p>{place.phone}</p>
        </div>
      ))}
    </div>
  );
}
```

### 응답 데이터 구조

```javascript
{
  "meta": {
    "total_count": 45,        // 검색된 총 결과 수
    "pageable_count": 45,     // 노출 가능한 문서 수
    "is_end": false           // 마지막 페이지 여부
  },
  "documents": [
    {
      "id": "123456789",
      "place_name": "해피독 동물병원",
      "category_name": "의료,건강 > 동물병원",
      "category_group_code": "HP8",
      "phone": "02-123-4567",
      "address_name": "서울 강남구 ...",
      "road_address_name": "서울 강남구 ...",
      "place_url": "http://place.map.kakao.com/123456789",
      "distance": "1234",      // 중심좌표까지의 거리(미터)
      "x": "126.9780",         // 경도
      "y": "37.5665"           // 위도
    }
  ]
}
```

## 🗺 2. 네이버 지도/지오코딩 API

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

## 🏛 3. 한국관광공사 TourAPI

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

## 🔄 4. 통합 검색 전략

### 2단계 필터링 구현

```javascript
// 1단계: 카카오 API로 기본 검색
const kakaoResults = await searchCafes("제주시", { size: 15 });

// 2단계: 관광공사 API로 반려동물 동반 정보 보강
const enrichedResults = await Promise.all(
  kakaoResults.documents.map(async (place) => {
    try {
      // 관광공사 API에서 동일한 장소 찾기 (이름 매칭)
      const tourResults = await searchTourPlaces({
        contentTypeId: "39",
        keyword: place.place_name,
      });

      if (tourResults.response.body.items.item?.length > 0) {
        const tourPlace = tourResults.response.body.items.item[0];
        const petInfo = await getPetTourInfo(tourPlace.contentid);

        return {
          ...place,
          tourInfo: tourPlace,
          petInfo: petInfo.response.body.items.item?.[0],
          dataSource: "official", // 공식 인증
        };
      }

      return {
        ...place,
        dataSource: "general", // 일반 정보
      };
    } catch (error) {
      return {
        ...place,
        dataSource: "general",
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
import { useSearchCafes } from "../api/hooks/useKakao";
import { useTourDetail, usePetTourInfo } from "../api/hooks/useTour";

function CafeSearchComponent() {
  const [location, setLocation] = useState("");
  const [filters, setFilters] = useState({
    largeDog: false,
    parking: false,
    indoor: false,
  });

  // 카카오 API로 기본 검색
  const {
    data: cafes,
    isLoading: isSearching,
    error: searchError,
  } = useSearchCafes(location, { size: 15 });

  const handleSearch = (searchLocation) => {
    setLocation(searchLocation);
  };

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
      {/* 검색 입력 */}
      <input
        placeholder="지역을 입력하세요"
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleSearch(e.target.value);
          }
        }}
      />

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
        {cafes?.documents?.map((cafe) => (
          <CafeCard key={cafe.id} cafe={cafe} />
        ))}
      </div>
    </div>
  );
}

function CafeCard({ cafe }) {
  return (
    <div className="cafe-card">
      <h3>{cafe.place_name}</h3>
      <p>{cafe.address_name}</p>
      <p>{cafe.phone}</p>
      <span className="badge">📱 실시간 정보</span>
      {cafe.petInfo && (
        <div>
          <span className="badge official">✅ 공식 인증</span>
          <p>🐕 {cafe.petInfo.acmpyPsblCpam}</p>
        </div>
      )}
    </div>
  );
}
```

## ⚠️ 6. 주의사항

### API 제한사항

- **카카오 API**: 검색당 45개 제한 (15개 × 3페이지)
- **관광공사 API**: 일 1,000건 제한
- **네이버 지도 API**: 월 사용량 제한

### 에러 처리

```javascript
// API 에러 처리 예시
const { data, error, isError } = useSearchCafes(location);

if (isError) {
  if (error.response?.status === 429) {
    // API 한도 초과
    return <div>잠시 후 다시 시도해주세요.</div>;
  } else if (error.response?.status === 400) {
    // 잘못된 요청
    return <div>검색어를 확인해주세요.</div>;
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
2. **좌표계 불일치**: 카카오, 네이버 모두 WGS84 좌표계 사용
3. **빈 결과**: 검색어나 지역명 확인 필요
4. **API 키 오류**: 백엔드 환경변수 설정 확인

### 디버깅 팁

```javascript
// 개발 환경에서 API 응답 로깅
if (process.env.NODE_ENV === "development") {
  console.log("API Response:", data);
  console.log("Search params:", { location, options });
}
```

이 가이드를 참고하여 PawMap의 다양한 API를 효과적으로 활용하세요! 🐾
