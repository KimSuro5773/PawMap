import { useEffect, useRef, useState } from "react";
import styles from "./NaverMap.module.scss";

export default function NaverMap({
  center = { lat: 33.4821, lng: 126.435 },
  zoom = 15,
  markers = [],
  onMarkerClick = null,
  height = "500px",
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!window.naver || !window.naver.maps) {
      console.error("네이버 지도 API가 로드되지 않았습니다.");
      return;
    }

    const location = new naver.maps.LatLng(center.lat, center.lng);

    const mapOptions = {
      center: location,
      zoom: zoom,
    };

    const map = new naver.maps.Map(mapRef.current, mapOptions);
    mapInstanceRef.current = map;

    // 사용자 위치 마커 (다른 마커와 구분되도록)
    const userMarker = new naver.maps.Marker({
      map,
      position: location,
      icon: {
        content:
          '<div style="background: #4285f4; width: 12px; height: 12px; border: 2px solid white; border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,0.3)"></div>',
        anchor: new naver.maps.Point(8, 8),
      },
      title: "내 위치",
    });
  }, [center.lat, center.lng, zoom]);

  return <div ref={mapRef} className={styles.map} style={{ height }}></div>;
}
