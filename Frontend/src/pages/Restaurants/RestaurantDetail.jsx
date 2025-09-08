import { useParams } from "react-router-dom";

const RestaurantDetail = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>음식점/카페 상세정보</h1>
      <p>음식점 ID: {id}</p>
    </div>
  );
};

export { RestaurantDetail as Component };