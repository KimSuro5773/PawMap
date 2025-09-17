import { useParams } from "react-router-dom";
import styles from "./Search.module.scss";
import SearchBar from "@/components/SearchBar/SearchBar";

const Search = () => {
  const params = useParams();

  return (
    <div>
      {/* 검색바 */}
      <SearchBar size={"small"} />
      검색 페이지: {params.keyword}
    </div>
  );
};

export { Search as Component };
