import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "swiper/css";
import "swiper/css/navigation";
import styles from "./HomeSection.module.scss";

export default function HomeSection({
  title,
  children,
  items = [],
  renderItem,
  slidesPerView = 4,
  className,
  customBreakpoints = null,
}) {
  // 네비게이션을 위한 고유 ID 생성
  const navigationId = `swiper-navigation-${Math.random().toString(36).substr(2, 9)}`;
  const defaultBreakpoints = {
    // 모바일
    320: {
      slidesPerView: 2,
      spaceBetween: 12,
    },
    // 태블릿
    865: {
      slidesPerView: 3,
      spaceBetween: 16,
    },
    // 데스크톱
    1024: {
      slidesPerView,
      spaceBetween: 24,
    },
  };

  const swiperOptions = {
    spaceBetween: 24,
    slidesPerView: "auto",
    breakpoints: customBreakpoints || defaultBreakpoints,
    modules: [Navigation],
    navigation: {
      nextEl: `.${navigationId}-next`,
      prevEl: `.${navigationId}-prev`,
    },
  };

  return (
    <section className={`${styles.homeSection} ${className || ""}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.navigation}>
          <button
            className={`${styles.navigationBtn} ${styles.prevBtn} ${navigationId}-prev`}
            type="button"
          >
            <IoIosArrowBack />
          </button>
          <button
            className={`${styles.navigationBtn} ${styles.nextBtn} ${navigationId}-next`}
            type="button"
          >
            <IoIosArrowForward />
          </button>
        </div>
      </div>

      <div className={styles.swiperContainer}>
        <Swiper {...swiperOptions} className={styles.swiper}>
          {items.map((item, index) => (
            <SwiperSlide key={item.id || index} className={styles.slide}>
              {renderItem ? renderItem(item) : children}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
