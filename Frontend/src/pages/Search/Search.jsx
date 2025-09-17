import { useParams } from "react-router-dom";
import styles from "./Search.module.scss";
import SearchBar from "@/components/SearchBar/SearchBar";

const Search = () => {
  const params = useParams();
  console.log(params);

  return (
    <div>
      검색 페이지: {params.keyword}
      {/* 검색바 */}
      <SearchBar size={"small"} />
    </div>
  );
};

export { Search as Component };
