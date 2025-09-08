import { useParams } from "react-router-dom";

const EventDetail = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>행사/공연/축제 상세정보</h1>
      <p>이벤트 ID: {id}</p>
    </div>
  );
};

export { EventDetail as Component };