import { useParams } from "react-router-dom";

const AttractionDetail = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>관광지 상세정보</h1>
      <p>관광지 ID: {id}</p>
    </div>
  );
};

export { AttractionDetail as Component };