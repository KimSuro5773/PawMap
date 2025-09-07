# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# 애견 동반 서비스 프로젝트 - Claude 참고 문서

## 📋 프로젝트 개요

애견과 함께 즐길 수 있는 여가 및 관광 시설들을 검색하고 조회할 수 있는 웹 애플리케이션

### 핵심 기능

- 애견 동반 카페 조회
- 애견 동반 숙소 조회 (펜션, 호텔, 캠핑장 등)
- 애견 동반 놀거리 조회 (운동장, 수영장, 관광지 등)
- 애견 동반 체험 활동 조회

**중요**: 모든 조회 기능은 **반려동물 동반 가능**한 곳만 표시하며, 정부 공인 정보를 기반으로 제공

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

### 1. 네이버 지도 API (Maps)

```
용도: 지도 표시, 마커 표시, 경로 안내
장점: 정확한 한국 지도 데이터
연동: 관광공사 좌표 데이터와 연동
```

### 2. 한국관광공사 반려동물 동반여행 API (주력)

```
용도: 공식 인증된 반려동물 동반 가능 업체
제한: 일 1,000건 (무료)
장점: 상세한 반려동물 동반 조건 정보
포함: 카페, 숙소, 관광지, 레포츠 시설
데이터 품질: 정부 공인 신뢰성 높은 정보
```

## 🎯 API 사용 전략

### 업종별 데이터 소스

| 업종          | 사용 API     | 컨텐츠 타입 ID | 특징                    |
| ------------- | ------------ | -------------- | ----------------------- |
| 애견 카페     | 관광공사 API | 39 (음식점)    | 상세한 동반 조건 정보   |
| 애견 숙소     | 관광공사 API | 32 (숙박)      | 객실별 반려동물 정책    |
| 놀거리/관광지 | 관광공사 API | 12 (관광지)    | 공식 인증 관광 정보     |
| 체험 활동     | 관광공사 API | 28 (레포츠)    | 반려동물 전용 시설 정보 |
| 문화 시설     | 관광공사 API | 14 (문화시설)  | 반려동물 동반 가능 여부 |

### 서비스 포지셔닝

**"반려동물 여가/관광 전문 플랫폼"**

- 병원, 미용샵 등 필수 서비스 제외
- 여가, 관광, 체험 중심의 전문화된 서비스
- 모든 정보가 공식 인증된 고품질 데이터

## 🧭 라우팅 구조

### 페이지 구성 (React Router DOM v7 DATA MODE)

```
/ → Home.jsx                                    # 홈페이지
/cafes → Cafes.jsx                             # 애견카페 목록
/cafes/:id → CafesDetail.jsx                   # 카페 상세정보
/accommodation → AccommodationList.jsx          # 숙소 목록
/accommodation/:id → AccommodationDetail.jsx   # 숙소 상세정보
/activities → Activities.jsx                    # 놀거리/관광지 목록
/activities/:id → ActivitiesDetail.jsx         # 놀거리 상세정보
/experiences → Experiences.jsx                 # 체험활동 목록
/experiences/:id → ExperiencesDetail.jsx       # 체험활동 상세정보
/map → MapView.jsx                             # 통합 지도뷰
```

## 🔍 필터 기능 명세

### API 레벨 필터 (즉시 적용)

```javascript
const apiFilters = {
  category: "업종별 (카페, 숙소, 관광지, 체험활동)",
  region: "지역별 (시/도 → 시/군/구 2단계)",
  contentType: "관광공사 컨텐츠 타입별 필터링",
  sorting: "정렬 (거리순, 수정일순, 이름순)",
};
```

### 클라이언트 레벨 필터 (2차 필터링)

```javascript
const clientFilters = {
  // 운영 상태
  operatingStatus: "영업중만 / 24시간 / 주말영업",

  // 반려동물 관련
  petSize: "대형견 가능 / 소형견만",
  indoorAccess: "실내 동반 가능",
  facilities: "주차장, 물그릇, 배변봉투 제공",
  restrictions: "목줄 착용, 입마개 필요",

  // 시설별 특화 필터
  accommodation: "객실 타입, 부대시설",
  activities: "체험 프로그램, 이용 연령",
  cafes: "테라스 유무, 전용 놀이공간",
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
      const [intro, petInfo, images] = await Promise.all([
        tourAPI.detailIntro({
          contentId: cafe.contentid,
          contentTypeId: 39,
        }),
        tourAPI.detailPetTour({
          contentId: cafe.contentid,
        }),
        tourAPI.detailImage({
          contentId: cafe.contentid,
        }),
      ]);

      return {
        ...cafe,
        intro, // 영업시간, 주차장 정보
        petInfo, // 반려동물 동반 조건
        images, // 업체 사진들
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

    // 실내 동반 가능 필터
    if (selectedFilters.indoor) {
      if (!cafe.petInfo?.acmpyTypeCd?.includes("실내")) {
        return false;
      }
    }

    return true;
  });
};
```

## 📱 개발 가이드라인

### 코드 작성 시 주의사항

1. **반려동물 동반 전용**: 모든 데이터가 반려동물 동반 가능한 곳만 표시
2. **좌표 체계**: 관광공사 API 좌표 → 네이버 지도 API 좌표 호환성 확인
3. **GPS 권한**: 위치 기반 기능 사용 시 사용자 권한 요청 처리
4. **반응형 디자인**: 모든 컴포넌트는 데스크톱/태블릿/모바일 대응
5. **API 에러 처리**: 네트워크 오류, API 한도 초과 등 예외 상황 고려
6. **로딩 상태**: 데이터 페칭 중 적절한 로딩 UI 제공
7. **TourAPI 활용**: 관광공사 API의 풍부한 반려동물 정보 최대한 활용

### 상태 관리 (Zustand)

- 사용자 위치 정보
- 검색 필터 상태
- API 캐시 데이터
- 지도 상태 (중심점, 줌 레벨 등)

### 데이터 페칭 (TanStack Query)

- 관광공사 API 응답 캐싱
- 백그라운드 업데이트
- 오프라인 상태 처리
- 재시도 로직
- API 호출 제한 관리 (일 1,000건)

## 🎯 개발 우선순위

### 1차 구현 목표

- 네이버 지도 API 계정 설정 (NCP)
- 한국관광공사 TourAPI 계정 설정 (공공데이터포털)
- 기본 라우팅 및 페이지 구조
- 네이버 지도 API 연동 (Web Dynamic Map)
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
   - 관광공사 API: 1,000건/일 (무료)
   - 네이버 지도 API: 월 사용량 제한
2. **좌표 변환**: WGS84 좌표계 사용 (호환성 양호)
3. **TourAPI 데이터 구조**: XML/JSON 응답 형태에 따른 파싱 로직 구현

### 데이터 품질 장점

```javascript
const dataQualityAdvantages = {
  official: "정부 공인 관광공사 API로 신뢰성 높은 정보",
  detailed: "상세한 반려동물 동반 조건 및 편의시설 정보",
  verified: "모든 업체가 실제 반려동물 동반 가능 업체",
  comprehensive: "사진, 요금, 시설 정보 등 완전한 데이터",
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

**Backend 주요 역할**: 관광공사 API와 네이버 지도 API 프록시 서버

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

- `contentTypeId` (optional): 컨텐츠 타입
  - `12`: 관광지, `14`: 문화시설, `15`: 축제/공연/행사
  - `28`: 레포츠, `32`: 숙박, `39`: 음식점
- `areaCode` (optional): 지역코드 (1:서울, 39:제주 등)
- `sigunguCode` (optional): 시군구코드
- `numOfRows` (optional): 한 페이지 결과 수 (기본값: 10, 최대: 100)
- `pageNo` (optional): 페이지번호 (기본값: 1)
- `arrange` (optional): 정렬 (A:제목순, C:수정일순, D:생성일순)

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
3. **좌표계 확인**: 관광공사 API와 네이버 지도 API 모두 WGS84 사용
4. **2단계 필터링**: 관광공사 API 상세 정보 조회 후 클라이언트에서 필터링
5. **API 할당량 관리**: 일 1,000건 제한 고려한 효율적 호출

## 💡 사용자 경험 설계

### 정보 신뢰성

```javascript
const informationReliability = {
  // 관광공사 데이터만 사용
  official: {
    badge: "✅ 정부 공인 인증",
    petInfo: "🐕 상세한 반려동물 동반 조건 제공",
    reliability: "한국관광공사 공식 정보",
    completeness: "사진, 요금, 시설 정보 완전 제공",
  },
};
```

### 서비스 차별화

```javascript
const serviceFeatures = {
  specialization: "반려동물 여가/관광 전문 플랫폼",
  dataQuality: "모든 정보가 공식 인증된 고품질 데이터",
  completeness: "상세한 반려동물 동반 조건 및 편의시설 정보",
  reliability: "정부 공인 정보로 100% 신뢰 가능",
};
```

## 🎯 차별화 포인트

1. **전문성**: 반려동물 여가/관광에 특화된 서비스
2. **신뢰성**: 정부 공인 관광공사 API만 사용한 고품질 정보
3. **완성도**: 모든 업체에 상세한 반려동물 동반 조건 제공
4. **일관성**: 데이터 품질과 정보 완성도의 일관성 보장
5. **실용성**: 예약 연결, 길찾기 등 즉시 사용 가능한 기능
