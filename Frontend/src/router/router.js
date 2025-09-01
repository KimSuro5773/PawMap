import { createBrowserRouter } from "react-router-dom";

// 코드 분할을 개선하기 위한 lazy 로드 구성 요소
const Home = () => import("@/pages/Home");
const Hospitals = () => import("@/pages/Hospitals");
const HospitalsDetail = () => import("@/pages/HospitalsDetail");
const Cafes = () => import("@/pages/Cafes");
const CafesDetail = () => import("@/pages/CafesDetail");
const Activities = () => import("@/pages/Activities");
const ActivitiesDetail = () => import("@/pages/ActivitiesDetail");
const Grooming = () => import("@/pages/Grooming");
const GroomingDetail = () => import("@/pages/GroomingDetail");
const AccommodationList = () => import("@/pages/AccommodationList");
const AccommodationDetail = () => import("@/pages/AccommodationDetail");
const MapView = () => import("@/pages/MapView");

const router = createBrowserRouter([
  {
    path: "/", // 홈페이지
    lazy: Home,
  },
  {
    path: "/hospitals", // 동물병원 목록
    lazy: Hospitals,
  },
  {
    path: "/hospitals/:id", // 동물병원 상세정보
    lazy: HospitalsDetail,
  },
  {
    path: "/cafes", // 애견카페 목록
    lazy: Cafes,
  },
  {
    path: "/cafes/:id", // 애견카페 상세정보
    lazy: CafesDetail,
  },
  {
    path: "/activities", // 놀거리 목록
    lazy: Activities,
  },
  {
    path: "/activities/:id", // 놀거리 상세정보
    lazy: ActivitiesDetail,
  },
  {
    path: "/grooming", // 미용샵 목록
    lazy: Grooming,
  },
  {
    path: "/grooming/:id", // 미용샵 상세정보
    lazy: GroomingDetail,
  },
  {
    path: "/accommodation", // 숙소 목록
    lazy: AccommodationList,
  },
  {
    path: "/accommodation/:id", // 숙소 상세정보
    lazy: AccommodationDetail,
  },
  {
    path: "/map", // 통합 지도뷰
    lazy: MapView,
  },
]);

export default router;
