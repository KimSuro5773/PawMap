import { useParams } from "react-router-dom";

const CultureDetail = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>문화시설 상세정보</h1>
      <p>문화시설 ID: {id}</p>
    </div>
  );
};

export { CultureDetail as Component };