import { useParams } from "react-router-dom";
import CategoryListPage from "@/components/CategoryListPage/CategoryListPage";

const Regions = () => {
  const params = useParams();

  return (
    <CategoryListPage
      pageName="regions"
      urlPath="regions"
      areaCode={params.regionsId}
    />
  );
};

export { Regions as Component };
