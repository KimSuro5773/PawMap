# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# 애견 동반 서비스 프로젝트 - Claude 참고 문서

## 📋 프로젝트 개요

애견과 함께 즐길 수 있는 다양한 시설들을 검색하고 조회할 수 있는 웹 애플리케이션

### 핵심 기능

- 동물병원 검색 및 GPS 기반 가까운 동물병원 조회
- 애견 동반 카페 조회
- 애견 동반 놀거리 조회 (운동장, 수영장 등)
- 애견 미용샵 검색 및 GPS 기반 조회
- 애견 동반 가능한 숙소 조회

**중요**: 모든 조회 기능에는 필터 기능이 포함되어 있으며, 모든 장소는 **애견 동반 가능**한 곳만 필터링되어야 함

## 🛠 기술 스택

### Frontend

- **Framework**: React 19 + Vite
- **Routing**: React Router DOM v7 (DATA MODE 기준)
- **State Management**: Zustand
- **Styling**: SASS + CSS Modules
- **HTTP Client**: Axios
- **Data Fetching**: TanStack Query (React Query)
- **UI Components**: Swiper, react-icons

### 스타일링 구조

```
src/styles/
├── base/
│   ├── _font.scss        # 폰트 관련 스타일
│   ├── _reset.scss       # 브라우저 스타일 초기화
│   └── _variables.scss   # 스타일 변수
└── index.scss           # 모든 scss 파일 통합 (@use 사용)
```

- **Architecture**: SCSS Modules 패턴
- **반응형**: 데스크톱, 태블릿, 모바일 지원
- **import**: main.jsx에서 index.scss import

## 🗺 사용 API 및 특징

### 1. 카카오 로컬 API (Keyword Search)

```
용도: 일반 업체 검색 (동물병원, 미용샵 등)
제한: 한 번에 15개, 총 45개 (3페이지)
장점: 실시간 정보, 정확한 연락처
단점: 반려동물 동반 조건 정보 없음
```

### 2. 네이버 지도 API (Maps)

```
용도: 지도 표시, 마커 표시, 경로 안내
장점: 정확한 한국 지도 데이터
연동: 카카오/관광공사 좌표 데이터와 연동
```

### 3. 한국관광공사 반려동물 동반여행 API

```
용도: 공식 인증된 반려동물 동반 가능 업체
제한: 일 1,000건 (무료)
장점: 상세한 반려동물 동반 조건 정보
포함: 카페, 숙소, 관광지, 레포츠 시설
```

## 🎯 API 사용 전략

### 업종별 API 선택

| 업종          | 주 사용 API  | 보조 API   | 이유                   |
| ------------- | ------------ | ---------- | ---------------------- |
| 동물병원      | 카카오 API   | -          | 관광공사에 데이터 없음 |
| 애견 미용샵   | 카카오 API   | -          | 관광공사에 데이터 없음 |
| 애견 카페     | 관광공사 API | 카카오 API | 공식 인증 정보 우선    |
| 애견 숙소     | 관광공사 API | 카카오 API | 상세 숙박 정보         |
| 놀거리/관광지 | 관광공사 API | -          | 전문 관광 정보         |

## 🧭 라우팅 구조

### 페이지 구성 (React Router DOM v7 DATA MODE)

```
/ → Home.jsx                                    # 홈페이지
/hospitals → Hospitals.jsx                      # 동물병원 목록
/hospitals/:id → HospitalsDetail.jsx           # 병원 상세정보
/cafes → Cafes.jsx                             # 애견카페 목록
/cafes/:id → CafesDetail.jsx                   # 카페 상세정보
/activities → Activities.jsx                    # 놀거리 목록
/activities/:id → ActivitiesDetail.jsx         # 놀거리 상세정보
/grooming → Grooming.jsx                       # 미용샵 목록
/grooming/:id → GroomingDetail.jsx             # 미용샵 상세정보
/accommodation → AccommodationList.jsx          # 숙소 목록
/accommodation/:id → AccommodationDetail.jsx   # 숙소 상세정보
/map → MapView.jsx                             # 통합 지도뷰
```

## 🔍 필터 기능 명세

### API 레벨 필터 (즉시 적용)

```javascript
const apiFilters = {
  category: "업종별 (동물병원, 카페, 숙소, 미용샵, 놀거리)",
  region: "지역별 (시/도 → 시/군/구 2단계)",
  distance: "거리 반경 (1km, 3km, 5km, 10km)",
  dataSource: "데이터 소스 (공식인증만 / 모든업체)",
  sorting: "정렬 (거리순, 수정일순, 이름순)",
};
```

### 클라이언트 레벨 필터 (2차 필터링)

```javascript
const clientFilters = {
  // 운영 상태
  operatingStatus: "영업중만 / 24시간 / 주말영업",

  // 반려동물 관련 (관광공사 데이터만)
  petSize: "대형견 가능 / 소형견만",
  indoorAccess: "실내 동반 가능",
  facilities: "주차장, 물그릇, 배변봉투 제공",
  restrictions: "목줄 착용, 입마개 필요",
};
```

### 필터 구현 패턴

각 조회 페이지는 다음 패턴을 따름:

1. 검색/조회 → 해당 라우터로 이동
2. 필터 버튼들이 상단에 배치
3. 필터 적용 시 실시간 결과 업데이트

**중요**: 관광공사 API는 편의시설(주차장, 반려동물 시설)로 직접 필터링 불가능하므로 **2단계 필터링** 방식 사용

## 🔄 2단계 필터링 구현 방식

### 1단계: API에서 전체 데이터 수집

```javascript
// 제주도 모든 카페 데이터 받기
const getAllCafes = async () => {
  const tourCafes = await tourAPI.areaBasedList({
    contentTypeId: 39, // 음식점
    areaCode: 39, // 제주도
    numOfRows: 100, // 최대한 많이
  });

  return tourCafes.items;
};
```

### 2단계: 상세 정보 조회

```javascript
// 각 카페의 상세 정보 병렬 조회
const getDetailedInfo = async (cafes) => {
  const detailedCafes = await Promise.all(
    cafes.map(async (cafe) => {
      const [intro, petInfo] = await Promise.all([
        tourAPI.detailIntro({
          contentId: cafe.contentid,
          contentTypeId: 39,
        }),
        tourAPI.detailPetTour({
          contentId: cafe.contentid,
        }),
      ]);

      return {
        ...cafe,
        intro, // 영업시간, 주차장 정보
        petInfo, // 반려동물 동반 조건
      };
    })
  );

  return detailedCafes;
};
```

### 3단계: 클라이언트 필터링

```javascript
// 사용자가 필터 선택시 클라이언트에서 즉시 필터링
const applyFilters = (cafes, selectedFilters) => {
  return cafes.filter((cafe) => {
    // 주차장 필터
    if (selectedFilters.parking) {
      if (!cafe.intro?.parking?.includes("가능")) {
        return false;
      }
    }

    // 대형견 가능 필터
    if (selectedFilters.largeDog) {
      if (!cafe.petInfo?.acmpyPsblCpam?.includes("대형견")) {
        return false;
      }
    }

    return true;
  });
};
```

## 📱 개발 가이드라인

### 코드 작성 시 주의사항

1. **애견 동반 가능 여부**: 카카오 검색 API 결과에서 추가 필터링 로직 구현 필요
2. **좌표 체계**: 카카오 API 좌표 → 네이버 지도 API 좌표 변환 처리
3. **GPS 권한**: 위치 기반 기능 사용 시 사용자 권한 요청 처리
4. **반응형 디자인**: 모든 컴포넌트는 데스크톱/태블릿/모바일 대응
5. **API 에러 처리**: 네트워크 오류, API 한도 초과 등 예외 상황 고려
6. **로딩 상태**: 데이터 페칭 중 적절한 로딩 UI 제공
7. **CORS 처리**: 카카오 검색 API는 서버사이드 프록시 또는 백엔드 연동 필요
8. **TourAPI 데이터 활용**: 한국관광공사 API로 상세 정보 보강 및 반려동물 동반 조건 명시

### 상태 관리 (Zustand)

- 사용자 위치 정보
- 검색 필터 상태
- API 캐시 데이터
- 지도 상태 (중심점, 줌 레벨 등)

### 데이터 페칭 (TanStack Query)

- 카카오 검색 API 응답 캐싱
- 관광공사 API 응답 캐싱
- 백그라운드 업데이트
- 오프라인 상태 처리
- 재시도 로직
- API 호출 제한 관리

## 🎯 개발 우선순위

### 1차 구현 목표

- 카카오 개발자 계정 설정
- 네이버 지도 API 계정 설정 (NCP)
- 한국관광공사 TourAPI 계정 설정 (공공데이터포털)
- 기본 라우팅 및 페이지 구조
- 네이버 지도 API 연동 (Web Dynamic Map)
- 카카오 로컬 API 연동 (지역 검색)
- TourAPI 연동 (반려동물 동반여행 정보)
- GPS 기반 위치 검색
- 기본 필터 기능

### 2차 구현 목표

- 상세 페이지 구현
- 2단계 필터링 시스템 구현
- 고급 필터 옵션
- 사용자 인터페이스 개선
- 성능 최적화

## 🚨 주의사항

### API 관련

1. **API 제한사항**:
   - 카카오 로컬 API: 45개/검색 (15개 × 3페이지)
   - 관광공사 API: 1,000건/일
   - 네이버 지도 API: 월 사용량 제한
2. **CORS 이슈**: 카카오 검색 API는 브라우저에서 직접 호출 불가, 백엔드 프록시 필요
3. **좌표 변환**: 각 API 간 좌표계 차이 처리 필요
4. **TourAPI 데이터 구조**: XML/JSON 응답 형태에 따른 파싱 로직 구현

### 데이터 품질 이슈

```javascript
const dataQualityStrategy = {
  missing: "정보 없음을 명확히 표시",
  outdated: "최종 업데이트 시간 표시",
  incomplete: "사용자 제보 기능으로 보완",
  verification: "공식 인증 여부 명확 구분",
};
```

### 기술적 고려사항

1. **크로스 브라우저**: 다양한 브라우저에서의 네이버 지도 API 호환성 확인
2. **모바일 최적화**: 터치 제스처, 지도 성능 등 모바일 환경 최적화
3. **API 키 보안**: 클라이언트 사이드 API 키 노출 방지

## 🏗 프로젝트 구조

### root 상태

```
PawMap/
├── Backend/          # Node.js/Express 백엔드 (API 프록시 서버)
├── Frontend/         # React + Vite 프론트엔드
└── CLAUDE.md         # 개발 가이드 문서
```

**Backend 주요 역할**: 카카오 로컬 API CORS 문제 해결을 위한 프록시 서버

## 🔧 개발 명령어

### 프론트엔드 개발

```bash
cd Frontend
npm run dev          # 개발 서버 실행 (http://localhost:5173)
npm run build        # 프로덕션 빌드
npm run preview      # 빌드 결과 미리보기
npm run lint         # ESLint 실행 (설정 시)
```

### 백엔드 개발

```bash
cd Backend
npm run dev          # 개발 서버 실행 (nodemon 사용)
npm start           # 프로덕션 서버 실행
```

### 전체 개발환경 실행

1. Backend 터미널: `cd Backend && npm run dev` (포트 3001)
2. Frontend 터미널: `cd Frontend && npm run dev` (포트 5173)

## 🔗 Backend API 엔드포인트

### 서버 정보

- **서버 주소**: `http://localhost:3001`
- **환경**: Express 4.x, CORS 설정 완료
- **인증**: API 키를 환경변수로 관리

### 카카오 로컬 API 엔드포인트

#### 1. 키워드 검색 API

```http
GET /api/kakao/keyword?query={검색어}&size={개수}&page={페이지}&x={경도}&y={위도}&radius={반경}
```

**Parameters:**

- `query` (required): 검색 키워드 (예: "동물병원", "애견카페")
- `size` (optional): 검색 결과 개수 (기본값: 15, 최대: 15)
- `page` (optional): 페이지 번호 (기본값: 1, 최대: 3)
- `x` (optional): 중심 좌표 경도 (WGS84)
- `y` (optional): 중심 좌표 위도 (WGS84)
- `radius` (optional): 검색 반경 (단위: 미터, 최대: 20000)
- `category_group_code` (optional) : (group_code 내용 참조)

**group_code**
| 코드 | 카테고리 |
|------|-----------|
| MT1 | 대형마트 |
| CS2 | 편의점 |
| PS3 | 어린이집, 유치원 |
| SC4 | 학교 |
| AC5 | 학원 |
| PK6 | 주차장 |
| OL7 | 주유소, 충전소 |
| SW8 | 지하철역 |
| BK9 | 은행 |
| CT1 | 문화시설 |
| AG2 | 중개업소 |
| PO3 | 공공기관 |
| AT4 | 관광명소 |
| AD5 | 숙박 |
| FD6 | 음식점 |
| CE7 | 카페 |
| HP8 | 병원 |
| PM9 | 약국 |

**사용 예시:**

```javascript
// 제주도 애견카페 검색
const response = await axios.get("http://localhost:3001/api/kakao/keyword", {
  params: {
    query: "제주도 애견카페",
    size: 15,
    x: 126.5219,
    y: 33.4996,
    radius: 10000,
  },
});
```

**Response 구조:**

```json
{
  "meta": {
    "total_count": 45,
    "pageable_count": 45,
    "is_end": false
  },
  "documents": [
    {
      "id": "123456789",
      "place_name": "해피독 카페",
      "category_name": "음식점 > 카페",
      "category_group_code": "FD6",
      "category_group_name": "음식점",
      "phone": "064-123-4567",
      "address_name": "제주특별자치도 제주시 ...",
      "road_address_name": "제주특별자치도 제주시 ...",
      "place_url": "http://place.map.kakao.com/123456789",
      "distance": "1234",
      "x": "126.5219",
      "y": "33.4996"
    }
  ]
}
```

### 네이버 지도 API 엔드포인트

#### 1. 지오코딩 API (주소 → 좌표)

```http
GET /api/naver/geocoding?query={주소}
```

#### 2. 역지오코딩 API (좌표 → 주소)

```http
GET /api/naver/reverse-geocoding?coords={경도},{위도}
```

### 한국관광공사 TourAPI 엔드포인트

#### 1. 지역기반 관광정보 조회 API

```http
GET /api/tour/area-based?contentTypeId={타입}&areaCode={지역}&sigunguCode={시군구}&numOfRows={개수}&pageNo={페이지}
```

**Parameters:**

- `contentTypeId` (optional): 컨텐츠 타입 (기본값: 39-음식점)
  - `12`: 관광지, `14`: 문화시설, `15`: 축제/공연/행사
  - `28`: 레포츠, `32`: 숙박, `38`: 쇼핑, `39`: 음식점
- `areaCode` (optional): 지역코드 (1:서울, 39:제주 등)
- `sigunguCode` (optional): 시군구코드
- `numOfRows` (optional): 한 페이지 결과 수 (기본값: 10, 최대: 100)
- `pageNo` (optional): 페이지번호 (기본값: 1)
- `arrange` (optional): 정렬 (A:제목순, C:수정일순, D:생성일순, E:거리순)

#### 2. 키워드 검색 조회 API

```http
GET /api/tour/keyword?keyword={키워드}&contentTypeId={타입}&areaCode={지역}
```

#### 3. 위치기반 관광정보 조회 API

```http
GET /api/tour/location-based?mapX={경도}&mapY={위도}&radius={반경}&contentTypeId={타입}
```

#### 4. 상세정보 조회 API

```http
GET /api/tour/detail/common/{contentId}?contentTypeId={타입}
GET /api/tour/detail/intro/{contentId}?contentTypeId={타입}
GET /api/tour/detail/info/{contentId}?contentTypeId={타입}
GET /api/tour/detail/images/{contentId}
```

#### 5. 반려동물 동반 정보 조회 API

```http
GET /api/tour/detail/pet/{contentId}
```

**사용 예시:**

```javascript
// 제주도 애견동반 카페 검색
const response = await axios.get("http://localhost:3001/api/tour/area-based", {
  params: {
    contentTypeId: "39", // 음식점
    areaCode: "39", // 제주도
    numOfRows: 50,
    arrange: "C", // 수정일순
  },
});

// 반려동물 동반 상세 정보 조회
const petInfo = await axios.get(
  `http://localhost:3001/api/tour/detail/pet/${contentId}`
);
```

### 에러 처리

모든 API는 다음과 같은 에러 형식을 반환합니다:

```json
{
  "error": "에러 메시지",
  "details": "상세 에러 정보"
}
```

**HTTP 상태 코드:**

- `400`: 필수 파라미터 누락
- `429`: API 요청 한도 초과
- `500`: 서버 내부 오류 또는 외부 API 오류
- `404`: 존재하지 않는 경로

### Frontend에서 사용 시 주의사항

1. **Base URL 설정**: axios 설정 시 baseURL을 `http://localhost:3001`로 설정
2. **에러 핸들링**: TanStack Query의 에러 처리 활용
3. **좌표계 확인**: 카카오 API는 WGS84, 네이버 지도도 WGS84 사용
4. **애견 동반 필터링**: 카카오 검색 결과에서 추가 필터링 로직 구현 필요
5. **2단계 필터링**: 관광공사 API 상세 정보 조회 후 클라이언트에서 필터링

## 💡 사용자 경험 설계

### 정보 투명성

```javascript
const transparentInfo = {
  // 관광공사 데이터
  official: {
    badge: "✅ 공식 인증",
    petInfo: "🐕 상세한 반려동물 동반 조건 제공",
    reliability: "정부 공인 정보",
  },

  // 카카오 데이터
  general: {
    badge: "📱 실시간 정보",
    petInfo: "📞 반려동물 동반 조건은 전화 문의",
    reliability: "실시간 업체 정보",
  },
};
```

## 🎯 차별화 포인트

1. **공식 인증 정보**: 관광공사 API로 신뢰할 수 있는 반려동물 동반 정보
2. **통합 검색**: 여러 API를 조합한 포괄적 검색 결과
3. **투명한 정보**: 데이터 소스와 신뢰도를 명확히 표시
4. **전문성**: 반려동물 동반에 특화된 필터와 정보
5. **실용성**: 전화 연결, 길찾기 등 즉시 사용 가능한 기능

이 구조를 통해 기존 일반 지도 서비스와 차별화된 **전문적인 반려동물 동반 서비스**를 제공할 수 있습니다.
