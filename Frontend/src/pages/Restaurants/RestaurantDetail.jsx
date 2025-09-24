import { useParams, useSearchParams } from "react-router-dom";
import ImageSlider from "@/components/ImageSlider/ImageSlider";
import RestaurantInfo from "@/components/RestaurantInfo";
import PetCompanionInfo from "@/components/PetCompanionInfo";
import PlaceDetail from "@/components/PlaceDetail";

const RestaurantDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const contentTypeId = searchParams.get("contentTypeId");

  return (
    <>
      <ImageSlider contentId={id} />
      <RestaurantInfo contentId={id} contentTypeId={contentTypeId} />
      <PetCompanionInfo contentId={id} />
      <PlaceDetail contentId={id} />
    </>
  );
};

export { RestaurantDetail as Component };
