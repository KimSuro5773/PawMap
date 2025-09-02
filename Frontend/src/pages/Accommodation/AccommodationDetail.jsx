import { useParams } from "react-router-dom";

const AccommodationDetail = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>숙소 상세정보</h1>
      <p>숙소 ID: {id}</p>
    </div>
  );
};

export { AccommodationDetail as Component };
