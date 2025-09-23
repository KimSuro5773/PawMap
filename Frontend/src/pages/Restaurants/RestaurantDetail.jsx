import { useParams } from "react-router-dom";
import ImageSlider from "@/components/ImageSlider/ImageSlider";

const RestaurantDetail = () => {
  const { id } = useParams();

  return (
    <div>
      <ImageSlider contentId={id} />
    </div>
  );
};

export { RestaurantDetail as Component };
