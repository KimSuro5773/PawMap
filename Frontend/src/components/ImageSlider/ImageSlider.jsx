import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import {
  MdArrowBackIos,
  MdArrowForwardIos,
  MdImageNotSupported,
} from "react-icons/md";
import { useDetailImage } from "@/api/hooks/useTour";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import styles from "./ImageSlider.module.scss";

export default function ImageSlider({
  contentId,
  autoplay = false,
  showNavigation = false,
  className = "",
}) {
  const [imageLoadErrors, setImageLoadErrors] = useState(new Set());

  const {
    data: imageData,
    isLoading,
    isError,
  } = useDetailImage(
    contentId,
    {},
    {
      enabled: !!contentId,
    }
  );

  console.log(imageData?.response?.body?.items?.item);

  const images = imageData?.response?.body?.items?.item || [];
  const validImages = images.filter((_, index) => !imageLoadErrors.has(index));

  const handleImageError = (index) => {
    setImageLoadErrors((prev) => new Set(prev).add(index));
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className={`${styles.imageSlider} ${styles.loading} ${className}`}>
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
          <p>이미지를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태 또는 이미지가 없는 경우
  if (isError || !images.length || validImages.length === 0) {
    return (
      <div className={`${styles.imageSlider} ${styles.noImage} ${className}`}>
        <div className={styles.noImageContent}>
          <MdImageNotSupported className={styles.noImageIcon} />
          <p>이미지를 불러올 수 없습니다</p>
        </div>
      </div>
    );
  }

  // 이미지가 1개인 경우 슬라이더 없이 표시
  if (validImages.length === 1) {
    const image = validImages[0];
    return (
      <div
        className={`${styles.imageSlider} ${styles.singleImage} ${className}`}
      >
        <img
          src={image.originimgurl}
          alt={image.imgname || "상세 이미지"}
          className={styles.image}
          onError={() => handleImageError(0)}
        />
      </div>
    );
  }

  return (
    <div className={`${styles.imageSlider} ${className}`}>
      <Swiper
        modules={[Pagination, Navigation, ...(autoplay ? [Autoplay] : [])]}
        slidesPerView={1}
        spaceBetween={0}
        pagination={{
          clickable: true,
          dynamicBullets: true,
          dynamicMainBullets: 3,
        }}
        navigation={
          showNavigation
            ? {
                prevEl: `.${styles.prevButton}`,
                nextEl: `.${styles.nextButton}`,
              }
            : false
        }
        autoplay={
          autoplay
            ? {
                delay: 4000,
                disableOnInteraction: false,
              }
            : false
        }
        loop={validImages.length > 1}
        className={styles.swiper}
      >
        {validImages.map((image, index) => (
          <SwiperSlide
            key={`${image.serialnum || index}`}
            className={styles.swiperSlide}
          >
            <img
              src={image.originimgurl}
              alt={image.imgname || `이미지 ${index + 1}`}
              className={styles.image}
              onError={() => handleImageError(index)}
              loading="lazy"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 커스텀 네비게이션 버튼 */}
      {showNavigation && validImages.length > 1 && (
        <>
          <button
            className={`${styles.navButton} ${styles.prevButton}`}
            aria-label="이전 이미지"
          >
            <MdArrowBackIos />
          </button>
          <button
            className={`${styles.navButton} ${styles.nextButton}`}
            aria-label="다음 이미지"
          >
            <MdArrowForwardIos />
          </button>
        </>
      )}

      {/* 이미지 카운터 */}
      <div className={styles.imageCounter}>
        <span>{validImages.length}장의 이미지</span>
      </div>
    </div>
  );
}
