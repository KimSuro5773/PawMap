import { useParams } from "react-router-dom";

const CafesDetail = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>애견카페 상세정보</h1>
      <p>카페 ID: {id}</p>
    </div>
  );
};

export { CafesDetail as Component };
