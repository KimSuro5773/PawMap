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
        path: "search/:keyword", // 검색 결과 페이지
        lazy: () => import("@/pages/Search/Search"),
      },
      {
        path: "regions/:regionsId", // 검색 결과 페이지
        lazy: () => import("@/pages/Regions/Regions"),
      },
    ],
  },
  {
    path: "map", // 통합 지도뷰 (Layout 영향 받지 않음)
    lazy: () => import("@/pages/Map/Map"),
  },
]);

export default router;
