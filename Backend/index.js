const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS 설정
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// JSON 파싱
app.use(express.json());

// 기본 라우트
app.get("/", (req, res) => {
  res.json({ message: "PawMap API Server is running!" });
});

// 카카오 키워드 검색 API 프록시
app.get("/api/kakao/keyword", async (req, res) => {
  try {
    const { 
      query, 
      size = 15, 
      page = 1, 
      x, 
      y, 
      radius, 
      category_group_code 
    } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const params = {
      query,
      size: Math.min(size, 15), // 최대 15개
      page: Math.min(page, 3),   // 최대 3페이지
    };

    // 좌표가 제공된 경우 추가
    if (x && y) {
      params.x = x;
      params.y = y;
    }

    // 반경이 제공된 경우 추가 (최대 20km)
    if (radius) {
      params.radius = Math.min(radius, 20000);
    }

    // 카테고리 그룹 코드가 제공된 경우 추가
    if (category_group_code) {
      params.category_group_code = category_group_code;
    }

    const response = await axios.get(
      "https://dapi.kakao.com/v2/local/search/keyword.json",
      {
        params,
        headers: {
          Authorization: `KakaoAK ${process.env.KAKAO_API_KEY}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Kakao Keyword Search API Error:",
      error.response?.data || error.message
    );
    res.status(error.response?.status || 500).json({
      error: "Failed to fetch data from Kakao API",
      details: error.response?.data || error.message,
    });
  }
});

// 네이버 지오코딩 API 프록시
app.get("/api/naver/geocoding", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const response = await axios.get(
      "https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode",
      {
        params: { query },
        headers: {
          "X-NCP-APIGW-API-KEY-ID": process.env.NCP_CLIENT_ID,
          "X-NCP-APIGW-API-KEY": process.env.NCP_CLIENT_SECRET,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Naver Geocoding API Error:",
      error.response?.data || error.message
    );
    res.status(error.response?.status || 500).json({
      error: "Failed to fetch data from Naver Geocoding API",
      details: error.response?.data || error.message,
    });
  }
});

// 네이버 역지오코딩 API 프록시
app.get("/api/naver/reverse-geocoding", async (req, res) => {
  try {
    const { coords } = req.query;

    if (!coords) {
      return res
        .status(400)
        .json({ error: "Coords parameter is required (format: lng,lat)" });
    }

    const response = await axios.get(
      "https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc",
      {
        params: {
          coords,
          output: "json",
        },
        headers: {
          "X-NCP-APIGW-API-KEY-ID": process.env.NCP_CLIENT_ID,
          "X-NCP-APIGW-API-KEY": process.env.NCP_CLIENT_SECRET,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Naver Reverse Geocoding API Error:",
      error.response?.data || error.message
    );
    res.status(error.response?.status || 500).json({
      error: "Failed to fetch data from Naver Reverse Geocoding API",
      details: error.response?.data || error.message,
    });
  }
});

// 한국관광공사 TourAPI 프록시
app.get("/api/tour/search", async (req, res) => {
  try {
    const {
      contentTypeId = "39", // 음식점
      areaCode,
      sigunguCode,
      numOfRows = 10,
      pageNo = 1,
      arrange = "A", // A: 제목순, B: 인기도순, C: 수정일순, D: 생성일순
    } = req.query;

    const response = await axios.get(
      "http://apis.data.go.kr/B551011/KorService1/areaBasedList1",
      {
        params: {
          serviceKey: process.env.TOUR_API_KEY,
          numOfRows,
          pageNo,
          MobileOS: "ETC",
          MobileApp: "PawMap",
          _type: "json",
          listYN: "Y",
          arrange,
          contentTypeId,
          areaCode,
          sigunguCode,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Tour API Error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: "Failed to fetch data from Tour API",
      details: error.response?.data || error.message,
    });
  }
});

// 한국관광공사 상세정보 조회
app.get("/api/tour/detail/:contentId", async (req, res) => {
  try {
    const { contentId } = req.params;
    const { contentTypeId = "39" } = req.query;

    const response = await axios.get(
      "http://apis.data.go.kr/B551011/KorService1/detailCommon1",
      {
        params: {
          serviceKey: process.env.TOUR_API_KEY,
          MobileOS: "ETC",
          MobileApp: "PawMap",
          _type: "json",
          contentId,
          contentTypeId,
          defaultYN: "Y",
          firstImageYN: "Y",
          areacodeYN: "Y",
          catcodeYN: "Y",
          addrinfoYN: "Y",
          mapinfoYN: "Y",
          overviewYN: "Y",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Tour Detail API Error:",
      error.response?.data || error.message
    );
    res.status(error.response?.status || 500).json({
      error: "Failed to fetch detail from Tour API",
      details: error.response?.data || error.message,
    });
  }
});

// 반려동물 동반 정보 조회
app.get("/api/tour/pet-info/:contentId", async (req, res) => {
  try {
    const { contentId } = req.params;

    const response = await axios.get(
      "http://apis.data.go.kr/B551011/KorService1/detailWithTour1",
      {
        params: {
          serviceKey: process.env.TOUR_API_KEY,
          MobileOS: "ETC",
          MobileApp: "PawMap",
          _type: "json",
          contentId,
          contentTypeId: "39",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Tour Pet Info API Error:",
      error.response?.data || error.message
    );
    res.status(error.response?.status || 500).json({
      error: "Failed to fetch pet info from Tour API",
      details: error.response?.data || error.message,
    });
  }
});

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 핸들링
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`🚀 PawMap API Server is running on port ${PORT}`);
  console.log(
    `📍 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`
  );
});
