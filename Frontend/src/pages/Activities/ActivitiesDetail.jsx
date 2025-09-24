import { useParams, useSearchParams } from "react-router-dom";
import ImageSlider from "@/components/ImageSlider/ImageSlider";
import PetCompanionInfo from "@/components/PetCompanionInfo";
import PlaceDetail from "@/components/PlaceDetail";
import ActivityInfo from "@/components/ActivityInfo/ActivityInfo";

const ActivitiesDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const contentTypeId = searchParams.get("contentTypeId");

  return (
    <>
      <ImageSlider contentId={id} />
      <ActivityInfo contentId={id} contentTypeId={contentTypeId} />
      <PetCompanionInfo contentId={id} />
      <PlaceDetail contentId={id} />
    </>
  );
};

export { ActivitiesDetail as Component };
