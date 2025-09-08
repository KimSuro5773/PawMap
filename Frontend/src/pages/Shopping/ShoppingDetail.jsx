import { useParams } from "react-router-dom";

const ShoppingDetail = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>쇼핑 상세정보</h1>
      <p>쇼핑 ID: {id}</p>
    </div>
  );
};

export { ShoppingDetail as Component };