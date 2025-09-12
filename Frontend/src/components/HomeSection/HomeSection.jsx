import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
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
  };

  return (
    <section className={`${styles.homeSection} ${className || ""}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
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
