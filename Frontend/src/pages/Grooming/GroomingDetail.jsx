import { useParams } from "react-router-dom";

const GroomingDetail = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>미용샵 상세정보</h1>
      <p>미용샵 ID: {id}</p>
    </div>
  );
};

export { GroomingDetail as Component };
