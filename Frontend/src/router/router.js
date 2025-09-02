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
        path: "hospitals", // 동물병원 목록
        lazy: () => import("@/pages/Hospitals/Hospitals"),
      },
      {
        path: "hospitals/:id", // 동물병원 상세정보
        lazy: () => import("@/pages/Hospitals/HospitalsDetail"),
      },
      {
        path: "cafes", // 애견카페 목록
        lazy: () => import("@/pages/Cafes/Cafes"),
      },
      {
        path: "cafes/:id", // 애견카페 상세정보
        lazy: () => import("@/pages/Cafes/CafesDetail"),
      },
      {
        path: "activities", // 놀거리 목록
        lazy: () => import("@/pages/Activities/Activities"),
      },
      {
        path: "activities/:id", // 놀거리 상세정보
        lazy: () => import("@/pages/Activities/ActivitiesDetail"),
      },
      {
        path: "grooming", // 미용샵 목록
        lazy: () => import("@/pages/Grooming/Grooming"),
      },
      {
        path: "grooming/:id", // 미용샵 상세정보
        lazy: () => import("@/pages/Grooming/GroomingDetail"),
      },
      {
        path: "accommodation", // 숙소 목록
        lazy: () => import("@/pages/Accommodation/Accommodation"),
      },
      {
        path: "accommodation/:id", // 숙소 상세정보
        lazy: () => import("@/pages/Accommodation/AccommodationDetail"),
      },
      {
        path: "map", // 통합 지도뷰
        lazy: () => import("@/pages/Map/Map"),
      },
    ],
  },
]);

export default router;
