import { useState, useEffect, Suspense, lazy } from "react";
import { MdClose } from "react-icons/md";
import ImageSlider from "@/components/ImageSlider/ImageSlider";
import PetCompanionInfo from "@/components/PetCompanionInfo/PetCompanionInfo";
import {
  getInfoComponentType,
  getBusinessDisplayInfo,
} from "@/utils/businessDetailUtils";
import styles from "./BusinessDetailPanel.module.scss";

// Info 컴포넌트들을 lazy loading으로 import
const RestaurantInfo = lazy(() =>
  import("@/components/RestaurantInfo/RestaurantInfo")
);
const AccommodationInfo = lazy(() =>
  import("@/components/AccommodationInfo/AccommodationInfo")
);
const AttractionInfo = lazy(() =>
  import("@/components/AttractionInfo/AttractionInfo")
);
const ActivityInfo = lazy(() =>
  import("@/components/ActivityInfo/ActivityInfo")
);

export default function BusinessDetailPanel({
  business,
  isOpen = false,
  onClose = null,
  tourPanelOpen = true, // TourPanel의 열림/닫힘 상태
}) {
  const [InfoComponent, setInfoComponent] = useState(null);

  useEffect(() => {
    if (!business || !isOpen) return;

    const loadInfoComponent = () => {
      const componentType = getInfoComponentType(business.contenttypeid);

      switch (componentType) {
        case "RestaurantInfo":
          setInfoComponent(() => RestaurantInfo);
          break;
        case "AccommodationInfo":
          setInfoComponent(() => AccommodationInfo);
          break;
        case "AttractionInfo":
          setInfoComponent(() => AttractionInfo);
          break;
        case "ActivityInfo":
          setInfoComponent(() => ActivityInfo);
          break;
        default:
          setInfoComponent(() => AttractionInfo);
      }
    };

    loadInfoComponent();
  }, [business, isOpen]);

  if (!business || !isOpen) return null;

  const displayInfo = getBusinessDisplayInfo(business.contenttypeid);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div
        className={`${styles.detailPanel} ${isOpen ? styles.open : ""} ${
          tourPanelOpen ? styles.tourPanelOpen : styles.tourPanelClosed
        }`}
      >
        {/* 패널 헤더 */}
        <div className={styles.panelHeader}>
          <div className={styles.headerContent}>
            <span className={styles.businessIcon}>{displayInfo.icon}</span>
            <div className={styles.headerText}>
              <h2 className={styles.businessTitle}>{business.title}</h2>
              <span className={styles.businessType}>{displayInfo.title}</span>
            </div>
          </div>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="패널 닫기"
          >
            <MdClose />
          </button>
        </div>

        {/* 패널 컨텐츠 */}
        <div className={styles.panelContent}>
          <div className={styles.contentScroll}>
            {/* 이미지 슬라이더 */}
            <Suspense
              fallback={
                <div className={styles.imagePlaceholder}>
                  <div className={styles.loadingSpinner}></div>
                  <p>이미지를 불러오는 중...</p>
                </div>
              }
            >
              <ImageSlider contentId={business.contentid} />
            </Suspense>

            {/* 상세 정보 (contentTypeId별 다른 컴포넌트) */}
            {InfoComponent && (
              <Suspense
                fallback={
                  <div className={styles.infoPlaceholder}>
                    <div className={styles.loadingSpinner}></div>
                    <p>정보를 불러오는 중...</p>
                  </div>
                }
              >
                <InfoComponent
                  contentId={business.contentid}
                  contentTypeId={business.contenttypeid}
                />
              </Suspense>
            )}

            {/* 반려동물 동반 정보 */}
            <Suspense
              fallback={
                <div className={styles.petInfoPlaceholder}>
                  <div className={styles.loadingSpinner}></div>
                  <p>반려동물 정보를 불러오는 중...</p>
                </div>
              }
            >
              <PetCompanionInfo contentId={business.contentid} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
