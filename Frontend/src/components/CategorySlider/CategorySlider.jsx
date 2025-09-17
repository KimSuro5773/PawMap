import {
  FaCoffee,
  FaLandmark,
  FaShoppingCart,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { IoMdBed } from "react-icons/io";
import { MdSportsSoccer } from "react-icons/md";
import { GiDramaMasks, GiPartyPopper } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import styles from "./CategorySlider.module.scss";

export default function CategorySlider() {
  const navigate = useNavigate();

  const categories = [
    { icon: <FaCoffee />, label: "음식점/카페", path: "/restaurants" },
    { icon: <IoMdBed />, label: "숙소", path: "/accommodation" },
    { icon: <FaLandmark />, label: "관광지", path: "/attractions" },
    { icon: <MdSportsSoccer />, label: "레포츠/체험", path: "/activities" },
    { icon: <GiDramaMasks />, label: "문화시설", path: "/culture" },
    { icon: <GiPartyPopper />, label: "행사/축제", path: "/events" },
    { icon: <FaShoppingCart />, label: "쇼핑", path: "/shopping" },
    { icon: <FaMapMarkerAlt />, label: "내주변", path: "/map" },
  ];

  const handleCategoryClick = (path) => {
    navigate(path);
  };

  return (
    <div className={styles.categorySlider}>
      <Swiper slidesPerView="auto" spaceBetween={16} className={styles.swiper}>
        {categories.map((category, index) => (
          <SwiperSlide key={index} className={styles.slide}>
            <div
              className={styles.categoryItem}
              onClick={() => handleCategoryClick(category.path)}
            >
              <div className={styles.iconContainer}>{category.icon}</div>
              <span className={styles.label}>{category.label}</span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
