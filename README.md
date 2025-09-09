# 🐾 PawMap - 애견 동반 서비스

애견과 함께 즐길 수 있는 다양한 시설들을 검색하고 조회할 수 있는 웹 애플리케이션

## 🚀 시작하기

### 필수 조건

- Node.js 18+
- npm 또는 yarn

### 설치 및 실행

#### 1. 저장소 클론

```bash
git clone https://github.com/your-username/PawMap.git
cd PawMap
```

#### 2. 백엔드 설정

```bash
cd Backend
npm install
cp .env.example .env

# .env 파일에 실제 API 키 입력

npm run dev
```

#### 3. 프론트엔드 설정

```bash
cd Frontend
npm install
npm run dev
```

### API 키 설정

1. **네이버 클라우드 플랫폼**: https://console.ncloud.com
2. **공공데이터포털**: https://data.go.kr

## 🛠 기술 스택

- Frontend: React 19 + Vite + Zustand + SASS
- Backend: Node.js + Express
- APIs: 네이버 Maps API, 한국관광공사 TourAPI

## 📝 라이선스

MIT License
