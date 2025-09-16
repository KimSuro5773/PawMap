import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import styles from "./MainSlider.module.scss";

export default function MainSlider() {
  const slides = [
    "/images/homeSlider1.webp",
    "/images/homeSlider2.webp",
    "/images/homeSlider3.webp",
    "/images/homeSlider4.webp",
  ];

  return (
    <div className={styles.mainSliderContainer}>
      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={1}
        spaceBetween={0}
        pagination={{
          clickable: true,
          bulletClass: styles.swiperBullet,
          bulletActiveClass: styles.swiperBulletActive,
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        className={styles.swiper}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className={styles.swiperSlide}>
            <img
              src={slide}
              alt={`슬라이드 ${index + 1}`}
              className={styles.slideImage}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
