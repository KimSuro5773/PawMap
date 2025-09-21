import { useState } from "react";
import { useAreaBasedList } from "@/api/hooks/useTour";
import styles from "./Attractions.module.scss";
import SearchBar from "@/components/SearchBar/SearchBar";
import ContentCard from "@/components/ContentCard/ContentCard";
import Pagination from "@/components/Pagination/Pagination";
import FilterButton from "@/components/FilterButton/FilterButton";

const Attractions = () => {
  const [pageNumber, setPageNumber] = useState(1);

  const onPageChange = (page) => {
    setPageNumber(page);
  };

  const {
    data: attractionsData,
    isLoading,
    error,
  } = useAreaBasedList({
    contentTypeId: 12,
    numOfRows: 15,
    arrange: "O",
    pageNo: pageNumber,
  });

  const attractionsList = attractionsData?.response?.body?.items?.item || [];

  if (isLoading) {
    return (
      <div className={styles.attractions}>
        <SearchBar size={"small"} />
        <div className={styles.loading}>관광지 목록을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.attractions}>
        <SearchBar size={"small"} />
        <div className={styles.error}>데이터를 불러오는데 실패했습니다.</div>
      </div>
    );
  }

  return (
    <div className={styles.attractions}>
      {/* 검색바, 필터버튼 */}
      <div className={styles.controlsWrap}>
        <FilterButton />
        <SearchBar size={"small"} />
      </div>

      {/* 카드 그리드 */}
      <div className={styles.cardGrid}>
        {attractionsList.map((attraction) => (
          <ContentCard
            key={attraction.contentid}
            content={attraction}
            contentId={attraction.contentid}
            url={"attractions"}
            contentTypeId={12}
          />
        ))}
      </div>

      {/* 빈 상태 */}
      {attractionsList.length === 0 && (
        <div className={styles.emptyState}>
          <p>검색 결과가 없습니다.</p>
        </div>
      )}

      <Pagination
        totalCount={attractionsData?.response?.body?.totalCount}
        currentPage={pageNumber}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export { Attractions as Component };
