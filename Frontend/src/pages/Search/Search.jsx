import { useParams } from "react-router-dom";
import CategoryListPage from "@/components/CategoryListPage/CategoryListPage";

const Search = () => {
  const params = useParams();

  return (
    <CategoryListPage
      pageName="search"
      urlPath="search"
      keyword={params.keyword}
    />
  );
};

export { Search as Component };
