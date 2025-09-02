import { useParams } from "react-router-dom";

const HospitalsDetail = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>동물병원 상세정보</h1>
      <p>병원 ID: {id}</p>
    </div>
  );
};

export { HospitalsDetail as Component };
