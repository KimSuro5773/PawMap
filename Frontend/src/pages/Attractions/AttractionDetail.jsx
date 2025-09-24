import { useParams, useSearchParams } from "react-router-dom";
import ImageSlider from "@/components/ImageSlider/ImageSlider";
import PetCompanionInfo from "@/components/PetCompanionInfo";
import PlaceDetail from "@/components/PlaceDetail";
import AttractionInfo from "@/components/AttractionInfo/AttractionInfo";

const AttractionDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const contentTypeId = searchParams.get("contentTypeId");

  return (
    <>
      <ImageSlider contentId={id} />
      <AttractionInfo contentId={id} contentTypeId={contentTypeId} />
      <PetCompanionInfo contentId={id} />
      <PlaceDetail contentId={id} />
    </>
  );
};

export { AttractionDetail as Component };
