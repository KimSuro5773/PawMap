import { useParams } from "react-router-dom";
import { useAreaBasedList } from "../../api/hooks/useTour";
import styles from "./Regions.module.scss";
import SearchBar from "@/components/SearchBar/SearchBar";

const Regions = () => {
  const params = useParams();
  const { data: regionsData } = useAreaBasedList({
    areaCode: params.regionsId,
    numOfRows: 10,
  });

  return (
    <div className={styles.regions}>
      {/* 검색바 */}
      <SearchBar size={"small"} />
    </div>
  );
};

export { Regions as Component };
