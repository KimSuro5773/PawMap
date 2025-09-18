import styles from "./Restaurants.module.scss";
import SearchBar from "@/components/SearchBar/SearchBar";

const Restaurants = () => {
  return (
    <div className={styles.restaurants}>
      {/* 검색바 */}
      <SearchBar size={"small"} />

      {/* 필터 버튼 */}

      {/* 데이터 정보들 */}
    </div>
  );
};

export { Restaurants as Component };
