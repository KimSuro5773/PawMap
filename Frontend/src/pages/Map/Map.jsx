import styles from "./Map.module.scss";
import Header from "@/components/Header/Header";
import NaverMap from "@/components/NaverMap/NaverMap";

const Map = () => {
  return (
    <div>
      <Header />
      {/* 지도 */}
      <NaverMap />
    </div>
  );
};

export { Map as Component };
