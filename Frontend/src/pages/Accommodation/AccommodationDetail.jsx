import { useParams, useSearchParams } from "react-router-dom";
import ImageSlider from "@/components/ImageSlider/ImageSlider";
import PetCompanionInfo from "@/components/PetCompanionInfo";
import PlaceDetail from "@/components/PlaceDetail";
import AccommodationInfo from "@/components/AccommodationInfo/AccommodationInfo";
import AccommodationRooms from "@/components/AccommodationRooms/AccommodationRooms";

const AccommodationDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const contentTypeId = searchParams.get("contentTypeId");

  return (
    <>
      <ImageSlider contentId={id} />
      <AccommodationInfo contentId={id} contentTypeId={contentTypeId} />
      <AccommodationRooms contentId={id} contentTypeId={contentTypeId} />
      <PetCompanionInfo contentId={id} />
      <PlaceDetail contentId={id} />
    </>
  );
};

export { AccommodationDetail as Component };
