import { useState } from "react";
import { useAreaBasedList } from "@/api/hooks/useTour";
import styles from "./Restaurants.module.scss";
import SearchBar from "@/components/SearchBar/SearchBar";
import ContentCard from "@/components/ContentCard/ContentCard";
import Pagination from "@/components/Pagination/Pagination";
import FilterButton from "@/components/FilterButton/FilterButton";

const Restaurants = () => {
  const [pageNumber, setPageNumber] = useState(1);

  const onPageChange = (page) => {
    setPageNumber(page);
  };

  const {
    data: restaurantsData,
    isLoading,
    error,
  } = useAreaBasedList({
    contentTypeId: 39,
    numOfRows: 15,
    arrange: "O",
    pageNo: pageNumber,
  });

  const restaurantsList = restaurantsData?.response?.body?.items?.item || [];

  if (isLoading) {
    return (
      <div className={styles.restaurants}>
        <SearchBar size={"small"} />
        <div className={styles.loading}>레스토랑 목록을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.restaurants}>
        <SearchBar size={"small"} />
        <div className={styles.error}>데이터를 불러오는데 실패했습니다.</div>
      </div>
    );
  }

  return (
    <div className={styles.restaurants}>
      {/* 검색바, 필터버튼 */}
      <div className={styles.controlsWrap}>
        <FilterButton />
        <SearchBar size={"small"} />
      </div>

      {/* 카드 그리드 */}
      <div className={styles.cardGrid}>
        {restaurantsList.map((restaurant) => (
          <ContentCard
            key={restaurant.contentid}
            content={restaurant}
            contentId={restaurant.contentid}
            url={"restaurants"}
            contentTypeId={39}
          />
        ))}
      </div>

      {/* 빈 상태 */}
      {restaurantsList.length === 0 && (
        <div className={styles.emptyState}>
          <p>검색 결과가 없습니다.</p>
        </div>
      )}

      <Pagination
        totalCount={restaurantsData?.response?.body?.totalCount}
        currentPage={pageNumber}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export { Restaurants as Component };
