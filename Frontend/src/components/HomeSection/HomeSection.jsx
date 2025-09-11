import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import styles from "./HomeSection.module.scss";

export default function HomeSection({
  title,
  children,
  items = [],
  renderItem,
  slidesPerView = 5,
  className,
}) {
  const swiperOptions = {
    spaceBetween: 12,
    slidesPerView: "auto",
    breakpoints: {
      // 모바일
      320: {
        slidesPerView: 2,
        spaceBetween: 8,
      },
      // 태블릿
      865: {
        slidesPerView: 4,
        spaceBetween: 12,
      },
      // 데스크톱
      1024: {
        slidesPerView,
        spaceBetween: 16,
      },
    },
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
