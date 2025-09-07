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

// Geoapify IP Geolocation API 프록시
app.get("/api/geoapify/ip-location", async (req, res) => {
  try {
    const response = await axios.get("https://api.geoapify.com/v1/ipinfo", {
      params: {
        apiKey: process.env.GEOAPIFY_API_KEY,
      },
    });

    // 필요한 데이터만 반환 (위도, 경도)
    const locationData = {
      latitude: response.data.location?.latitude || null,
      longitude: response.data.location?.longitude || null,
      city: response.data.city?.name || null,
      country: response.data.country?.name || null,
      accuracy: "city-level", // IP 기반이므로 도시 수준의 정확도
    };

    res.json(locationData);
  } catch (error) {
    console.error(
      "Geoapify IP Location API Error:",
      error.response?.data || error.message
    );
    res.status(error.response?.status || 500).json({
      error: "Failed to fetch location from Geoapify IP Location API",
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
