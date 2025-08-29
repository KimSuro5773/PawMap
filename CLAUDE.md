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
- 즐겨찾기 목록
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

## 백엔드 관련

### 프록시 서버 구현 필요사항

- **목적**: 네이버 검색 API CORS 문제 해결
- **주요 엔드포인트**:
  - `/api/naver/search` - 네이버 지역 검색 API 프록시
  - `/api/tour` - 한국관광공사 TourAPI 프록시
- **환경변수 설정**: API 키들을 .env 파일로 관리
- **CORS 설정**: Frontend(localhost:5173)에서의 요청 허용

## 🔄 Git 설정 및 GitHub 배포

### 초기 Git 설정

#### 1. Git 저장소 초기화

```bash
# 프로젝트 루트에서
git init
git branch -M main
```

#### 2. .gitignore 파일 생성

**루트 디렉토리**에 `.gitignore` 파일 생성:

```gitignore
# 의존성 모듈
node_modules/
*/node_modules/

# 환경변수 파일
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
Backend/.env

# 빌드 파일
Frontend/dist/
Frontend/build/
Backend/dist/
Backend/build/

# 로그 파일
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE 설정 파일
.vscode/
.idea/
*.swp
*.swo

# OS 생성 파일
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# 임시 파일
*.tmp
*.temp
```

#### 3. 환경변수 관리

**Backend/.env.example** 파일 생성 (실제 API 키는 제외):

```env
# 네이버 개발자 센터
NAVER_CLIENT_ID=your_client_id
NAVER_CLIENT_SECRET=your_client_secret

# 네이버 클라우드 플랫폼 (NCP)
NCP_CLIENT_ID=your_ncp_client_id
NCP_CLIENT_SECRET=your_ncp_client_secret

# 한국관광공사 TourAPI
TOUR_API_KEY=your_tour_api_key

# 서버 설정
PORT=3001
FRONTEND_URL=http://localhost:5173
```

#### 4. README.md 파일 생성

**루트 디렉토리**에 `README.md` 생성:

````markdown
# 🐾 PawMap - 애견 동반 서비스

애견과 함께 즐길 수 있는 다양한 시설들을 검색하고 조회할 수 있는 웹 애플리케이션

## 🚀 시작하기

### 필수 조건

- Node.js 18+
- npm 또는 yarn

### 설치 및 실행

#### 1. 저장소 클론

\`\`\`bash
git clone https://github.com/your-username/PawMap.git
cd PawMap
\`\`\`

#### 2. 백엔드 설정

\`\`\`bash
cd Backend
npm install
cp .env.example .env

# .env 파일에 실제 API 키 입력

npm run dev
\`\`\`

#### 3. 프론트엔드 설정

\`\`\`bash
cd Frontend
npm install
npm run dev
\`\`\`

### API 키 설정

1. **네이버 개발자 센터**: https://developers.naver.com
2. **네이버 클라우드 플랫폼**: https://console.ncloud.com
3. **공공데이터포털**: https://data.go.kr

## 🛠 기술 스택

- Frontend: React 19 + Vite + Zustand + SASS
- Backend: Node.js + Express
- APIs: 네이버 지도/검색 API, 한국관광공사 TourAPI

## 📝 라이선스

MIT License
\`\`\`

### GitHub 저장소 생성 및 연결

#### 1. GitHub 저장소 생성

1. GitHub에서 "New repository" 클릭
2. 저장소 이름: `PawMap`
3. **Public** 또는 **Private** 선택
4. **Initialize with README 체크하지 않음** (이미 로컬에 있음)
5. **Create repository** 클릭

#### 2. 로컬과 GitHub 연결

```bash
# GitHub 저장소와 연결 (본인 username 사용)
git remote add origin https://github.com/your-username/PawMap.git

# 첫 커밋 및 푸시
git add .
git commit -m "Initial project setup

- Frontend 및 Backend 디렉토리 구조 생성
- React + Vite 기반 프론트엔드 환경 설정
- Express 기반 프록시 서버 백엔드 환경 설정
- 네이버 API 및 TourAPI 연동을 위한 기본 구조

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push -u origin main
```
````

### 배포 전 체크리스트

#### 보안 검토

- [ ] `.env` 파일이 `.gitignore`에 포함되어 있는지 확인
- [ ] 실제 API 키가 코드에 하드코딩되어 있지 않은지 확인
- [ ] `.env.example` 파일에 실제 키가 아닌 예시값이 들어있는지 확인

#### 코드 검토

- [ ] `console.log()` 등 디버그 코드 제거
- [ ] 주석 정리 및 코드 정리
- [ ] 에러 핸들링 구현 여부 확인

#### 문서화

- [ ] README.md 작성 완료
- [ ] API 키 발급 방법 안내
- [ ] 로컬 개발환경 설정 방법 명시

### 지속적인 개발을 위한 Git 워크플로우

#### 기본 작업 흐름

```bash
# 작업 전 최신 코드 동기화
git pull origin main

# 새로운 기능 개발 시 브랜치 생성
git checkout -b feature/hospital-search
# 작업 완료 후
git add .
git commit -m "feat: 동물병원 검색 기능 구현"
git push origin feature/hospital-search

# GitHub에서 Pull Request 생성
# 리뷰 후 main 브랜치에 merge
```

#### 커밋 메시지 규칙

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 스타일 변경 (코드 포맷팅)
refactor: 코드 리팩토링
test: 테스트 코드 추가
chore: 빌드 설정 등 기타 변경사항
```

### GitHub Pages 또는 Vercel 배포 (선택사항)

#### Vercel 배포 설정

1. Vercel 계정 생성 및 GitHub 연동
2. 프로젝트 import
3. 빌드 설정:
   - Framework Preset: **Vite**
   - Root Directory: **Frontend**
   - Build Command: `npm run build`
   - Output Directory: `dist`

#### 환경변수 설정 (배포 환경)

- Vercel Dashboard에서 Environment Variables 설정
- 백엔드 배포는 별도 서비스 (Railway, Render 등) 사용
