import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/Layout/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true, // 홈페이지
        lazy: () => import("@/pages/Home"),
      },
      {
        path: "hospitals", // 동물병원 목록
        lazy: () => import("@/pages/Hospitals"),
      },
      {
        path: "hospitals/:id", // 동물병원 상세정보
        lazy: () => import("@/pages/HospitalsDetail"),
      },
      {
        path: "cafes", // 애견카페 목록
        lazy: () => import("@/pages/Cafes"),
      },
      {
        path: "cafes/:id", // 애견카페 상세정보
        lazy: () => import("@/pages/CafesDetail"),
      },
      {
        path: "activities", // 놀거리 목록
        lazy: () => import("@/pages/Activities"),
      },
      {
        path: "activities/:id", // 놀거리 상세정보
        lazy: () => import("@/pages/ActivitiesDetail"),
      },
      {
        path: "grooming", // 미용샵 목록
        lazy: () => import("@/pages/Grooming"),
      },
      {
        path: "grooming/:id", // 미용샵 상세정보
        lazy: () => import("@/pages/GroomingDetail"),
      },
      {
        path: "accommodation", // 숙소 목록
        lazy: () => import("@/pages/AccommodationList"),
      },
      {
        path: "accommodation/:id", // 숙소 상세정보
        lazy: () => import("@/pages/AccommodationDetail"),
      },
      {
        path: "map", // 통합 지도뷰
        lazy: () => import("@/pages/MapView"),
      },
    ],
  },
]);

export default router;
