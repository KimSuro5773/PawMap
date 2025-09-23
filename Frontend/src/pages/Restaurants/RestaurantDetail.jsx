import { useParams, useSearchParams } from "react-router-dom";
import ImageSlider from "@/components/ImageSlider/ImageSlider";
import RestaurantInfo from "@/components/RestaurantInfo";
import PetCompanionInfo from "@/components/PetCompanionInfo";

const RestaurantDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const contentTypeId = searchParams.get("contentTypeId");

  return (
    <div>
      <ImageSlider contentId={id} />
      <RestaurantInfo contentId={id} contentTypeId={contentTypeId} />
      <PetCompanionInfo contentId={id} />
    </div>
  );
};

export { RestaurantDetail as Component };
