import { useParams } from "react-router-dom";

const ActivitiesDetail = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>놀거리 상세정보</h1>
      <p>놀거리 ID: {id}</p>
    </div>
  );
};

export { ActivitiesDetail as Component };
