import { useParams } from "react-router-dom";
import styles from "./Search.module.scss";

const Search = () => {
  const params = useParams();
  console.log(params);

  return <div>검색 페이지: {params.keyword}</div>;
};

export { Search as Component };
