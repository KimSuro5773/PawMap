import { useParams } from "react-router-dom";

const ActivitiesDetail = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>레포츠/체험 상세정보</h1>
      <p>레포츠/체험 ID: {id}</p>
    </div>
  );
};

export { ActivitiesDetail as Component };
