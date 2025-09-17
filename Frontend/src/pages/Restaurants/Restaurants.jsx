import styles from "./Restaurants.module.scss";
import SearchBar from "@/components/SearchBar/SearchBar";

const Restaurants = () => {
  return (
    <div className={styles.restaurants}>
      {/* 검색바 */}
      <SearchBar size={"small"} />

      {/* 버튼 */}
    </div>
  );
};

export { Restaurants as Component };
