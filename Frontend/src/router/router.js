import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/Layout/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true, // 홈페이지
        lazy: () => import("@/pages/Home/Home"),
      },
      {
        path: "restaurants", // 애견 음식점/카페 목록 (ContentTypeId: 39)
        lazy: () => import("@/pages/Restaurants/Restaurants"),
      },
      {
        path: "restaurants/:id", // 음식점/카페 상세정보
        lazy: () => import("@/pages/Restaurants/RestaurantDetail"),
      },
      {
        path: "accommodation", // 애견 숙박 목록 (ContentTypeId: 32)
        lazy: () => import("@/pages/Accommodation/Accommodation"),
      },
      {
        path: "accommodation/:id", // 숙박 상세정보
        lazy: () => import("@/pages/Accommodation/AccommodationDetail"),
      },
      {
        path: "attractions", // 관광지 목록 (ContentTypeId: 12)
        lazy: () => import("@/pages/Attractions/Attractions"),
      },
      {
        path: "attractions/:id", // 관광지 상세정보
        lazy: () => import("@/pages/Attractions/AttractionDetail"),
      },
      {
        path: "activities", // 레포츠/체험 목록 (ContentTypeId: 28)
        lazy: () => import("@/pages/Activities/Activities"),
      },
      {
        path: "activities/:id", // 레포츠/체험 상세정보
        lazy: () => import("@/pages/Activities/ActivitiesDetail"),
      },
      {
        path: "culture", // 문화시설 목록 (ContentTypeId: 14)
        lazy: () => import("@/pages/Culture/Culture"),
      },
      {
        path: "culture/:id", // 문화시설 상세정보
        lazy: () => import("@/pages/Culture/CultureDetail"),
      },
      {
        path: "events", // 행사/공연/축제 목록 (ContentTypeId: 15)
        lazy: () => import("@/pages/Events/Events"),
      },
      {
        path: "events/:id", // 행사/공연/축제 상세정보
        lazy: () => import("@/pages/Events/EventDetail"),
      },
      {
        path: "shopping", // 쇼핑 목록 (ContentTypeId: 38)
        lazy: () => import("@/pages/Shopping/Shopping"),
      },
      {
        path: "shopping/:id", // 쇼핑 상세정보
        lazy: () => import("@/pages/Shopping/ShoppingDetail"),
      },
      {
        path: "map", // 통합 지도뷰
        lazy: () => import("@/pages/Map/Map"),
      },
      {
        path: "search/:keyword", // 검색 결과 페이지
        lazy: () => import("@/pages/Search/Search"),
      },
    ],
  },
]);

export default router;
