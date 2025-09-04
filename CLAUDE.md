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

## 🗺 API 및 외부 서비스

### 주요 API

#### 1. 네이버 지도 API (NAVER CLOUD PLATFORM)

- **Web Dynamic Map**: 지도 표시 및 인터랙션
- **Geocoding**: 주소 ↔ 좌표 변환
- **Reverse Geocoding**: 좌표 → 주소 변환

**가입 과정**: NCP 회원가입 → 본인/사업자 인증 → Maps 서비스 신청 → 승인 대기 → API 키 발급

#### 2. 네이버 검색 API (네이버 개발자 센터)

- **지역 검색 API**: 업체 정보 검색 (동물병원, 애견카페, 미용샵 등)
- **실시간 업체 정보**: 전화번호, 주소, 영업시간, 카테고리 등 제공
- **좌표 정보**: 지도 표시용 위치 데이터 포함

**가입 과정**: 네이버 계정 → 개발자 센터 → 애플리케이션 등록 → 즉시 사용 가능

#### 3. 한국관광공사 TourAPI (공공데이터포털)

- **반려동물 동반여행 서비스**: 애견 동반 가능한 관광정보 제공
- **상세정보 조회**: 각 가게들의 상세 정보 (운영시간, 편의시설, 요금 등)
- **반려동물 동반 조건**: 동반 시 필요사항, 구비시설, 주의사항 등
- **다양한 컨텐츠 타입**: 관광지(12), 문화시설(14), 행사/축제(15), 레포츠(28), 숙박(32), 쇼핑(38), 음식점(39)

**가입 과정**: 공공데이터포털 회원가입 → 서비스 신청 → 승인 (약 30분) → 인증키 발급
**사용량**: 개발계정 일 1,000건 무료

### API 선택 이유

- **네이버 지도**: 한국 지역 정보의 높은 정확도, 상세한 지도 데이터
- **네이버 검색**: 실시간 업체 정보, 풍부한 상세 정보 (전화번호, 영업시간 등)
- **한국관광공사 TourAPI**: 공식 인증된 반려동물 동반 가능 업체 정보, 상세한 동반 조건 및 편의시설 정보
- **통합 생태계**: 네이버 서비스 간 데이터 호환성 우수
- **GPS 기반 거리순 정렬**: 사용자 위치 기반 정렬 지원

### API 사용량 및 비용

#### 네이버 지도 API (NCP)

- **무료 사용량**: Web Dynamic Map 월 6,000,000건 이하, Geocoding 월 3,000,000건 이하

- **유료**: 무료 사용량 초과 시 건당 과금(최대한 무료로 이용할 예정)

#### 네이버 검색 API

- **무료 사용량**: 일 25,000건
- **제한**: 시간당 1,000건

#### 한국관광공사 TourAPI

- **무료 사용량**: 개발계정 일 1,000건
- **자동승인**: 신청 후 약 30분 내 사용 가능

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

### 공통 필터 옵션

모든 조회 페이지에서 다음 필터들을 제공해야 함:

#### 지역 필터

- **내주변**: GPS 기반 현재 위치
- **전체 지역**: 제한 없음
- **세부 지역**: 강원, 경기, 경남, 경북, 제주 등

#### 검색 필터

- **가까운순**: GPS 기반 거리 정렬
- **인기순**: 평점/리뷰 기반 정렬 (네이버 검색 API 지원 범위 내)

#### 편의시설

**한국관광공사 TourAPI**

- **주차장**: 주차 가능 여부
- **예약가능**: 사전 예약 시스템
- **단체석**: 대규모 그룹 수용 가능
- 기타 시설별 특화 편의시설

### 필터 구현 패턴

각 조회 페이지는 다음 패턴을 따름:

1. 검색/조회 → 해당 라우터로 이동
2. 필터 버튼들이 상단에 배치
3. 필터 적용 시 실시간 결과 업데이트

## 📱 개발 가이드라인

### 코드 작성 시 주의사항

1. **애견 동반 가능 여부**: 네이버 검색 API 결과에서 추가 필터링 로직 구현 필요
2. **좌표 체계**: 네이버 검색 API 좌표(EPSG:5179) → 네이버 지도 API 좌표(WGS84) 변환 처리
3. **GPS 권한**: 위치 기반 기능 사용 시 사용자 권한 요청 처리
4. **반응형 디자인**: 모든 컴포넌트는 데스크톱/태블릿/모바일 대응
5. **API 에러 처리**: 네트워크 오류, API 한도 초과, NCP 서비스 승인 대기 등 예외 상황 고려
6. **로딩 상태**: 데이터 페칭 중 적절한 로딩 UI 제공
7. **CORS 처리**: 네이버 검색 API는 서버사이드 프록시 또는 백엔드 연동 필요
8. **TourAPI 데이터 활용**: 한국관광공사 API로 상세 정보 보강 및 반려동물 동반 조건 명시

### 상태 관리 (Zustand)

- 사용자 위치 정보
- 검색 필터 상태
- API 캐시 데이터
- 지도 상태 (중심점, 줌 레벨 등)

### 데이터 페칭 (TanStack Query)

- 네이버 검색 API 응답 캐싱
- 백그라운드 업데이트
- 오프라인 상태 처리
- 재시도 로직
- API 호출 제한 관리

## 🎯 개발 우선순위

### 1차 구현 목표

- 네이버 개발자 센터 및 NCP 계정 설정
- 한국관광공사 TourAPI 계정 설정 (공공데이터포털)
- 기본 라우팅 및 페이지 구조
- 네이버 지도 API 연동 (Web Dynamic Map)
- 네이버 검색 API 연동 (지역 검색)
- TourAPI 연동 (반려동물 동반여행 정보)
- GPS 기반 위치 검색
- 기본 필터 기능

### 2차 구현 목표

- 상세 페이지 구현
- Geocoding/Reverse Geocoding 연동
- 고급 필터 옵션
- 사용자 인터페이스 개선
- 성능 최적화

## 🚨 주의사항

### API 관련

1. **NCP 승인 대기**: 네이버 지도 API 사용을 위한 NCP 서비스 승인에 시간이 소요될 수 있음
2. **API 제한**: 네이버 검색 API 일 25,000건, TourAPI 일 1,000건 제한 고려
3. **CORS 이슈**: 네이버 검색 API는 브라우저에서 직접 호출 불가, 백엔드 프록시 필요
4. **좌표 변환**: 검색 API와 지도 API 간 좌표계 차이 처리 필요
5. **TourAPI 데이터 구조**: XML/JSON 응답 형태에 따른 파싱 로직 구현

### 기술적 고려사항

1. **크로스 브라우저**: 다양한 브라우저에서의 네이버 지도 API 호환성 확인
2. **모바일 최적화**: 터치 제스처, 지도 성능 등 모바일 환경 최적화
3. **API 키 보안**: 클라이언트 사이드 API 키 노출 방지

## 📝 추가 고려사항

- **오프라인 지원**: 기본적인 지도 기능의 오프라인 캐싱 (네이버 지도 API 지원 범위 내)
- **접근성**: 스크린 리더 및 키보드 내비게이션 지원
- **SEO**: 검색 엔진 최적화를 위한 메타 태그 및 구조화된 데이터
- **성능**: 이미지 최적화, 코드 스플리팅, 지연 로딩 등
- **백엔드 연동**: 네이버 검색 API CORS 문제 해결 및 TourAPI 데이터 캐싱을 위한 서버 구축 검토

## 🏗 프로젝트 구조

### 현재 상태

```
PawMap/
├── Backend/          # Node.js/Express 백엔드 (API 프록시 서버)
├── Frontend/         # React + Vite 프론트엔드
└── CLAUDE.md         # 개발 가이드 문서
```

### 개발 환경 설정

**프로젝트 초기 상태**: Frontend와 Backend 디렉토리가 생성되어 있으나 아직 초기화되지 않음

#### 프론트엔드 설정 (Frontend/)

```bash
cd Frontend
npm create vite@latest . -- --template react
npm install
npm install react-router-dom@7 zustand sass axios @tanstack/react-query
npm install swiper react-icons
```

#### 백엔드 설정 (Backend/)

```bash
cd Backend
npm init -y
npm install express cors dotenv axios
npm install -D nodemon
```

**Backend 주요 역할**: 네이버 검색 API CORS 문제 해결을 위한 프록시 서버

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

### 네이버 API 엔드포인트

#### 1. 지역 검색 API

```http
GET /api/naver/search?query={검색어}&display={개수}&start={시작}&sort={정렬}
```

**Parameters:**

- `query` (required): 검색 키워드 (예: "동물병원", "애견카페")
- `display` (optional): 검색 결과 개수 (기본값: 5, 최대: 5)
- `start` (optional): 검색 시작 위치 (기본값: 1)
- `sort` (optional): 정렬 순서 (`random`, `comment`)

**사용 예시:**

```javascript
// 동물병원 검색
const response = await axios.get("http://localhost:3001/api/naver/search", {
  params: {
    query: "강남 동물병원",
    display: 5,
    sort: "random",
  },
});
```

**Response 구조:**

```json
{
  "lastBuildDate": "Mon, 29 Aug 2025 13:28:37 +0900",
  "total": 5,
  "start": 1,
  "display": 5,
  "items": [
    {
      "title": "강남<b>동물병원</b>",
      "link": "http://example.com",
      "category": "의료,건강>동물병원",
      "description": "...",
      "telephone": "02-1234-5678",
      "address": "서울특별시 강남구 ...",
      "roadAddress": "서울특별시 강남구 ...",
      "mapx": "1270000000",
      "mapy": "374000000"
    }
  ]
}
```

#### 2. 지오코딩 API (주소 → 좌표)

```http
GET /api/naver/geocoding?query={주소}
```

**Parameters:**

- `query` (required): 주소 (예: "서울특별시 강남구 테헤란로 152")

**사용 예시:**

```javascript
const response = await axios.get("http://localhost:3001/api/naver/geocoding", {
  params: { query: "서울특별시 강남구 테헤란로 152" },
});
```

#### 3. 역지오코딩 API (좌표 → 주소)

```http
GET /api/naver/reverse-geocoding?coords={경도},{위도}
```

**Parameters:**

- `coords` (required): 좌표 (형식: "경도,위도")

**사용 예시:**

```javascript
const response = await axios.get(
  "http://localhost:3001/api/naver/reverse-geocoding",
  {
    params: { coords: "127.1058342,37.5033194" },
  }
);
```

### 한국관광공사 TourAPI 엔드포인트

#### 1. 관광정보 검색 API

```http
GET /api/tour/search?contentTypeId={타입}&areaCode={지역}&numOfRows={개수}&pageNo={페이지}
```

**Parameters:**

- `contentTypeId` (optional): 컨텐츠 타입 (기본값: 39-음식점)
  - `12`: 관광지, `14`: 문화시설, `15`: 축제/공연/행사
  - `28`: 레포츠, `32`: 숙박, `38`: 쇼핑, `39`: 음식점
- `areaCode` (optional): 지역코드 (1:서울, 2:인천, 3:대전, 4:대구, 5:광주, 6:부산, 7:울산, 8:세종, 31:경기, 32:강원, 33:충북, 34:충남, 35:경북, 36:경남, 37:전북, 38:전남, 39:제주)
- `sigunguCode` (optional): 시군구코드
- `numOfRows` (optional): 한 페이지 결과 수 (기본값: 10)
- `pageNo` (optional): 페이지번호 (기본값: 1)
- `arrange` (optional): 정렬 (A:제목순, B:인기도순, C:수정일순, D:생성일순)

**사용 예시:**

```javascript
// 서울 애견동반 음식점 검색
const response = await axios.get("http://localhost:3001/api/tour/search", {
  params: {
    contentTypeId: "39", // 음식점
    areaCode: "1", // 서울
    numOfRows: 10,
    arrange: "B", // 인기도순
  },
});
```

#### 2. 상세정보 조회 API

```http
GET /api/tour/detail/{contentId}?contentTypeId={타입}
```

**Parameters:**

- `contentId` (required): 컨텐츠ID (URL 파라미터)
- `contentTypeId` (optional): 컨텐츠타입ID (기본값: 39)

**사용 예시:**

```javascript
const response = await axios.get(
  "http://localhost:3001/api/tour/detail/123456",
  {
    params: { contentTypeId: "39" },
  }
);
```

#### 3. 반려동물 동반 정보 조회 API

```http
GET /api/tour/pet-info/{contentId}
```

**Parameters:**

- `contentId` (required): 컨텐츠ID

**사용 예시:**

```javascript
const response = await axios.get(
  "http://localhost:3001/api/tour/pet-info/123456"
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
- `500`: 서버 내부 오류 또는 외부 API 오류
- `404`: 존재하지 않는 경로

### Frontend에서 사용 시 주의사항

1. **Base URL 설정**: axios 설정 시 baseURL을 `http://localhost:3001`로 설정
2. **에러 핸들링**: TanStack Query의 에러 처리 활용
3. **좌표계 변환**: 네이버 검색 API의 mapx, mapy는 카텍좌표계이므로 지도 표시 시 변환 필요
4. **애견 동반 필터링**: 네이버 검색 결과에서 추가 필터링 로직 구현 필요
