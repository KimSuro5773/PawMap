import { useEffect, useRef } from "react";
import styles from "./NaverMap.module.scss";

export default function NaverMap() {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!window.naver || !window.naver.maps) {
      console.error("네이버 지도 API가 로드되지 않았습니다.");
      return;
    }

    const location = new naver.maps.LatLng(33.4821, 126.435);

    const mapOptions = {
      center: location,
      zoom: 17,
    };

    const map = new naver.maps.Map(mapRef.current, mapOptions);

    const marker = new naver.maps.Marker({
      map,
      position: location,
    });
  }, []);

  return <div ref={mapRef} className={styles.map}></div>;
}
