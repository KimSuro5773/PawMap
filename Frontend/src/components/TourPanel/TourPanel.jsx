import { useState } from "react";
import { FaArrowCircleLeft, FaArrowCircleRight, FaArrowCircleUp, FaArrowCircleDown } from "react-icons/fa";
import TourCard from "./TourCard";
import BusinessDetailPanel from "@/components/BusinessDetailPanel/BusinessDetailPanel";
import styles from "./TourPanel.module.scss";

export default function TourPanel({
  businesses = [],
  isLoading = false,
  onCardClick = null
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);

  const totalCount = businesses.length;

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  // 카드 클릭 시 상세 패널 열기
  const handleCardClick = (business) => {
    setSelectedBusiness(business);
    setIsDetailPanelOpen(true);

    // 기존 onCardClick 콜백도 호출 (지도 이동 등)
    if (onCardClick) {
      onCardClick(business);
    }
  };

  // 상세 패널 닫기
  const handleDetailPanelClose = () => {
    setIsDetailPanelOpen(false);
    setSelectedBusiness(null);
  };

  return (
    <div className={`${styles.tourPanel} ${isOpen ? styles.open : styles.closed}`}>
      {/* 패널 헤더 */}
      <div className={styles.panelHeader}>
        <button
          className={styles.toggleButton}
          onClick={togglePanel}
          aria-label={isOpen ? "패널 닫기" : "패널 열기"}
        >
          <span className={styles.toggleIcon}>
            {/* 데스크톱/태블릿용 좌우 화살표 */}
            <span className={styles.desktopIcon}>
              {isOpen ? <FaArrowCircleLeft /> : <FaArrowCircleRight />}
            </span>
            {/* 모바일용 상하 화살표 */}
            <span className={styles.mobileIcon}>
              {isOpen ? <FaArrowCircleDown /> : <FaArrowCircleUp />}
            </span>
          </span>
        </button>

        {isOpen && (
          <div className={styles.headerContent}>
            <h2 className={styles.panelTitle}>주변 관광정보</h2>
            <div className={styles.countInfo}>
              <span className={styles.totalCount}>총 {totalCount}개</span>
            </div>
          </div>
        )}
      </div>

      {/* 패널 내용 */}
      {isOpen && (
        <div className={styles.panelContent}>
          {isLoading ? (
            <div className={styles.loadingState}>
              <div className={styles.loadingSpinner}></div>
              <p>주변 관광정보를 검색중...</p>
            </div>
          ) : totalCount === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🔍</div>
              <p>이 지역에서 검색된 관광정보가 없습니다.</p>
              <span>다른 지역으로 이동해서 재검색해보세요.</span>
            </div>
          ) : (
            <div className={styles.cardList}>
              {businesses.map((business, index) => (
                <TourCard
                  key={`${business.contentid}-${index}`}
                  business={business}
                  onClick={handleCardClick}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 상세 정보 패널 */}
      <BusinessDetailPanel
        business={selectedBusiness}
        isOpen={isDetailPanelOpen}
        onClose={handleDetailPanelClose}
        tourPanelOpen={isOpen}
      />
    </div>
  );
}