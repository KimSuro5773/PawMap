import { MdArrowForwardIos } from "react-icons/md";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import styles from "./MainSlider.module.scss";

export default function MainSlider() {
  const navigate = useNavigate();

  const slides = [
    {
      id: 1,
      url: "/images/homeSlider1.webp",
      title: "반려동물과 함께하는 \n나들이!",
      description: "한국관광공사 데이터로 믿을 수 있는 \n 반려동물 여행지",
    },
    {
      id: 2,
      url: "/images/homeSlider2.webp",
      title: "너와 함께라서\n더 맛있는 오늘",
      description: "소중한 반려동물과 함께\n맛과 쉼을 나누는 공간.",
      route: "/restaurants",
    },
    {
      id: 3,
      url: "/images/homeSlider3.webp",
      title: "너와 함께라서\n더 즐거운 오늘",
      description: "반려동물과 함께 신나는 축제\n더 깊어지는 추억.",
      route: "/activities",
    },
    {
      id: 4,
      url: "/images/homeSlider4.webp",
      title: "너와 함께라서\n더 포근한 오늘",
      description: "우리의 하루를 완성시켜 줄\n행복한 쉼표.",
      route: "/accommodation",
    },
  ];

  return (
    <div className={styles.mainSliderContainer}>
      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={1}
        spaceBetween={0}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        className={styles.swiper}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id} className={styles.swiperSlide}>
            <img
              src={slide.url}
              alt={`슬라이드 ${index + 1}`}
              className={styles.slideImage}
            />
            <div className={styles.gradientOverlay}></div>
            <div className={styles.slideContent}>
              <h1 className={styles.slideTitle}>
                {slide.title.split("\n").map((line, lineIndex) => (
                  <span key={lineIndex}>
                    {line}
                    {lineIndex < slide.title.split("\n").length - 1 && <br />}
                  </span>
                ))}
              </h1>
              <p className={styles.slideSubtitle}>
                {slide.description.split("\n").map((line, lineIndex) => (
                  <span key={lineIndex}>
                    {line}
                    {lineIndex < slide.description.split("\n").length - 1 && (
                      <br />
                    )}
                  </span>
                ))}
              </p>
              {slide.route && (
                <button
                  className={styles.slideButton}
                  onClick={() => navigate(slide.route)}
                >
                  보러가기 <MdArrowForwardIos />
                </button>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
