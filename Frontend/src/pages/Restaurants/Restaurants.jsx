import { useAreaBasedList } from "../../api/hooks/useTour";
import styles from "./Restaurants.module.scss";
import SearchBar from "@/components/SearchBar/SearchBar";
import ContentCard from "@/components/ContentCard/ContentCard";
import { Link } from "react-router-dom";

const Restaurants = () => {
  const {
    data: restaurantsData,
    isLoading,
    error,
  } = useAreaBasedList({
    contentTypeId: 39,
    numOfRows: 15,
    arrange: "O",
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
      {/* 검색바 */}
      <SearchBar size={"small"} />

      {/* 필터 버튼 */}

      {/* 결과 정보 */}

      {/* 카드 그리드 */}
      <div className={styles.cardGrid}>
        {restaurantsList.map((restaurant) => (
          <Link to={`/restaurants/${restaurant.contentid}`}>
            <ContentCard
              key={restaurant.contentid}
              content={restaurant}
            />
          </Link>
        ))}
      </div>

      {/* 빈 상태 */}
      {restaurantsList.length === 0 && (
        <div className={styles.emptyState}>
          <p>검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export { Restaurants as Component };
