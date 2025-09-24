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

// 네이버 Static Map API 프록시
app.get("/api/naver/static-map", async (req, res) => {
  try {
    const {
      center,
      level = 13,
      w = 600,
      h = 400,
      markers,
      format = "png",
    } = req.query;

    if (!center) {
      return res.status(400).json({
        error: "center parameter is required (format: lng,lat)",
      });
    }

    const response = await axios.get(
      "https://maps.apigw.ntruss.com/map-static/v2/raster",
      {
        params: {
          center,
          level,
          w,
          h,
          markers,
          format,
        },
        headers: {
          "X-NCP-APIGW-API-KEY-ID": process.env.NCP_CLIENT_ID,
          "X-NCP-APIGW-API-KEY": process.env.NCP_CLIENT_SECRET,
        },
        responseType: "arraybuffer",
      }
    );

    const contentType = format === "jpg" ? "image/jpeg" : "image/png";
    res.set("Content-Type", contentType);
    res.send(response.data);
  } catch (error) {
    console.error(
      "Naver Static Map API Error:",
      error.response?.data || error.message
    );
    res.status(error.response?.status || 500).json({
      error: "Failed to fetch static map from Naver API",
      details: error.response?.data || error.message,
    });
  }
});

// 한국관광공사 TourAPI 공통 파라미터
const TOUR_API_BASE_PARAMS = {
  serviceKey: process.env.TOUR_API_KEY,
  MobileOS: "ETC",
  MobileApp: "PawMap",
  _type: "json",
};

const TOUR_API_BASE_URL = "http://apis.data.go.kr/B551011/KorPetTourService";

// =============================================================================
// 🔍 기본 검색 및 목록 조회 API
// =============================================================================

// 1. 지역기반 관광정보 조회
app.get("/api/tour/area-based", async (req, res) => {
  try {
    const {
      contentTypeId,
      areaCode,
      sigunguCode,
      cat1,
      cat2,
      cat3,
      numOfRows = 10,
      pageNo = 1,
      arrange = "O", // O: 제목순, Q: 수정일순, R: 생성일순
    } = req.query;

    const response = await axios.get(`${TOUR_API_BASE_URL}/areaBasedList`, {
      params: {
        ...TOUR_API_BASE_PARAMS,
        numOfRows,
        pageNo,
        listYN: "Y",
        arrange,
        contentTypeId,
        areaCode,
        sigunguCode,
        cat1,
        cat2,
        cat3,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(
      "Tour Area Based API Error:",
      error.response?.data || error.message
    );
    res.status(error.response?.status || 500).json({
      error: "Failed to fetch area-based data from Tour API",
      details: error.response?.data || error.message,
    });
  }
});

// 2. 위치기반 관광정보 조회
app.get("/api/tour/location-based", async (req, res) => {
  try {
    const {
      mapX, // 경도
      mapY, // 위도
      radius = 1000, // 반경(m)
      contentTypeId,
      cat1,
      cat2,
      cat3,
      numOfRows = 10,
      pageNo = 1,
    } = req.query;

    if (!mapX || !mapY) {
      return res.status(400).json({
        error: "mapX (longitude) and mapY (latitude) parameters are required",
      });
    }

    const response = await axios.get(`${TOUR_API_BASE_URL}/locationBasedList`, {
      params: {
        ...TOUR_API_BASE_PARAMS,
        mapX,
        mapY,
        radius,
        contentTypeId,
        cat1,
        cat2,
        cat3,
        numOfRows,
        pageNo,
        listYN: "Y",
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(
      "Tour Location Based API Error:",
      error.response?.data || error.message
    );
    res.status(error.response?.status || 500).json({
      error: "Failed to fetch location-based data from Tour API",
      details: error.response?.data || error.message,
    });
  }
});

// 3. 키워드 검색 조회
app.get("/api/tour/keyword", async (req, res) => {
  try {
    const {
      keyword,
      contentTypeId,
      areaCode,
      sigunguCode,
      cat1,
      cat2,
      cat3,
      numOfRows = 10,
      pageNo = 1,
    } = req.query;

    if (!keyword) {
      return res.status(400).json({ error: "keyword parameter is required" });
    }

    const response = await axios.get(`${TOUR_API_BASE_URL}/searchKeyword`, {
      params: {
        ...TOUR_API_BASE_PARAMS,
        keyword,
        contentTypeId,
        areaCode,
        sigunguCode,
        cat1,
        cat2,
        cat3,
        numOfRows,
        pageNo,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(
      "Tour Keyword Search API Error:",
      error.response?.data || error.message
    );
    res.status(error.response?.status || 500).json({
      error: "Failed to fetch keyword search data from Tour API",
      details: error.response?.data || error.message,
    });
  }
});

// =============================================================================
// 📊 메타데이터 조회 API
// =============================================================================

// 4. 지역코드 조회
app.get("/api/tour/area-code", async (req, res) => {
  try {
    const { areaCode, numOfRows = 100 } = req.query;

    const response = await axios.get(`${TOUR_API_BASE_URL}/areaCode`, {
      params: {
        ...TOUR_API_BASE_PARAMS,
        areaCode, // 없으면 시/도 목록, 있으면 해당 시/도의 시/군/구 목록
        numOfRows,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(
      "Tour Area Code API Error:",
      error.response?.data || error.message
    );
    res.status(error.response?.status || 500).json({
      error: "Failed to fetch area code data from Tour API",
      details: error.response?.data || error.message,
    });
  }
});

// 5. 서비스분류코드 조회
app.get("/api/tour/category-code", async (req, res) => {
  try {
    const { contentTypeId, cat1, cat2, numOfRows = 100 } = req.query;

    const response = await axios.get(`${TOUR_API_BASE_URL}/categoryCode`, {
      params: {
        ...TOUR_API_BASE_PARAMS,
        contentTypeId,
        cat1, // 대분류
        cat2, // 중분류
        numOfRows,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(
      "Tour Category Code API Error:",
      error.response?.data || error.message
    );
    res.status(error.response?.status || 500).json({
      error: "Failed to fetch category code data from Tour API",
      details: error.response?.data || error.message,
    });
  }
});

// =============================================================================
// 🏪 상세정보 조회 API
// =============================================================================

// 6. 공통정보 조회 (기본 정보)
app.get("/api/tour/detail/common/:contentId", async (req, res) => {
  try {
    const { contentId } = req.params;
    const { contentTypeId } = req.query;

    if (!contentId) {
      return res.status(400).json({ error: "contentId parameter is required" });
    }

    const response = await axios.get(`${TOUR_API_BASE_URL}/detailCommon`, {
      params: {
        ...TOUR_API_BASE_PARAMS,
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
    });

    res.json(response.data);
  } catch (error) {
    console.error(
      "Tour Detail Common API Error:",
      error.response?.data || error.message
    );
    res.status(error.response?.status || 500).json({
      error: "Failed to fetch common detail from Tour API",
      details: error.response?.data || error.message,
    });
  }
});

// 7. 소개정보 조회 (영업시간, 주차, 요금 등)
app.get("/api/tour/detail/intro/:contentId", async (req, res) => {
  try {
    const { contentId } = req.params;
    const { contentTypeId } = req.query;

    if (!contentId || !contentTypeId) {
      return res.status(400).json({
        error: "contentId and contentTypeId parameters are required",
      });
    }

    const response = await axios.get(`${TOUR_API_BASE_URL}/detailIntro`, {
      params: {
        ...TOUR_API_BASE_PARAMS,
        contentId,
        contentTypeId,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(
      "Tour Detail Intro API Error:",
      error.response?.data || error.message
    );
    res.status(error.response?.status || 500).json({
      error: "Failed to fetch intro detail from Tour API",
      details: error.response?.data || error.message,
    });
  }
});

// 8. 반복정보 조회 (객실정보 등)
app.get("/api/tour/detail/info/:contentId", async (req, res) => {
  try {
    const { contentId } = req.params;
    const { contentTypeId, numOfRows = 10, pageNo = 1 } = req.query;

    if (!contentId || !contentTypeId) {
      return res.status(400).json({
        error: "contentId and contentTypeId parameters are required",
      });
    }

    const response = await axios.get(`${TOUR_API_BASE_URL}/detailInfo`, {
      params: {
        ...TOUR_API_BASE_PARAMS,
        contentId,
        contentTypeId,
        numOfRows,
        pageNo,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(
      "Tour Detail Info API Error:",
      error.response?.data || error.message
    );
    res.status(error.response?.status || 500).json({
      error: "Failed to fetch info detail from Tour API",
      details: error.response?.data || error.message,
    });
  }
});

// 9. 이미지정보 조회
app.get("/api/tour/detail/images/:contentId", async (req, res) => {
  try {
    const { contentId } = req.params;
    const { imageYN = "Y", numOfRows = 10, pageNo = 1 } = req.query;

    if (!contentId) {
      return res.status(400).json({ error: "contentId parameter is required" });
    }

    const response = await axios.get(`${TOUR_API_BASE_URL}/detailImage`, {
      params: {
        ...TOUR_API_BASE_PARAMS,
        contentId,
        imageYN,
        numOfRows,
        pageNo,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(
      "Tour Detail Images API Error:",
      error.response?.data || error.message
    );
    res.status(error.response?.status || 500).json({
      error: "Failed to fetch images from Tour API",
      details: error.response?.data || error.message,
    });
  }
});

// =============================================================================
// 🐕 반려동물 전용 API
// =============================================================================

// 10. 반려동물 동반여행 조회 (핵심 API)
app.get("/api/tour/detail/pet/:contentId", async (req, res) => {
  try {
    const { contentId } = req.params;

    if (!contentId) {
      return res.status(400).json({ error: "contentId parameter is required" });
    }

    const response = await axios.get(`${TOUR_API_BASE_URL}/detailPetTour`, {
      params: {
        ...TOUR_API_BASE_PARAMS,
        contentId,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(
      "Tour Pet Detail API Error:",
      error.response?.data || error.message
    );
    res.status(error.response?.status || 500).json({
      error: "Failed to fetch pet detail from Tour API",
      details: error.response?.data || error.message,
    });
  }
});

// 11. 반려동물 동반여행 동기화 목록 조회 (관리용)
app.get("/api/tour/pet-sync-list", async (req, res) => {
  try {
    const {
      numOfRows = 10,
      pageNo = 1,
      syncModTime, // 동기화 시간 (YYYYMMDDHHMMSS)
    } = req.query;

    const response = await axios.get(`${TOUR_API_BASE_URL}/syncList`, {
      params: {
        ...TOUR_API_BASE_PARAMS,
        numOfRows,
        pageNo,
        syncModTime,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(
      "Tour Pet Sync List API Error:",
      error.response?.data || error.message
    );
    res.status(error.response?.status || 500).json({
      error: "Failed to fetch pet sync list from Tour API",
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
