import { useEffect, useRef, useState } from "react";
import { createCustomMarkerHtml } from "@/utils/markerUtils";
import styles from "./NaverMap.module.scss";

export default function NaverMap({
  center = { lat: 33.4821, lng: 126.435 },
  zoom = 15,
  markers = [],
  onMarkerClick = null,
  onCenterChanged = null,
  height = "500px",
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);

  // 지도 초기화 (한 번만 실행)
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

    // 지도 드래그 종료 이벤트 리스너 추가
    if (onCenterChanged) {
      naver.maps.Event.addListener(map, 'dragend', () => {
        const newCenter = map.getCenter();
        onCenterChanged({
          lat: newCenter.lat(),
          lng: newCenter.lng()
        });
      });
    }

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
    userMarkerRef.current = userMarker;
  }, []); // 빈 의존성 배열로 한 번만 실행

  // center 변경 시 지도 중심점 및 사용자 마커 업데이트
  useEffect(() => {
    if (mapInstanceRef.current && userMarkerRef.current) {
      const location = new naver.maps.LatLng(center.lat, center.lng);

      // 지도 중심점 업데이트 (줄 레벨 유지)
      mapInstanceRef.current.setCenter(location);

      // 사용자 위치 마커 업데이트
      userMarkerRef.current.setPosition(location);
    }
  }, [center.lat, center.lng]);

  // 업체 마커 렌더링
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // 기존 업체 마커들 제거
    markersRef.current.forEach((marker) => {
      marker.setMap(null);
    });
    markersRef.current = [];

    // 새로운 업체 마커들 생성
    markers.forEach((markerData) => {
      if (markerData.lat && markerData.lng) {
        const marker = new naver.maps.Marker({
          map: mapInstanceRef.current,
          position: new naver.maps.LatLng(markerData.lat, markerData.lng),
          title: markerData.title || "업체",
          icon: {
            content: createCustomMarkerHtml(markerData.contentTypeId),
            anchor: new naver.maps.Point(20, 48), // 마커의 중심점을 하단으로 설정
          },
        });

        // 마커 클릭 이벤트
        if (onMarkerClick) {
          naver.maps.Event.addListener(marker, "click", () => {
            onMarkerClick(markerData);
          });
        }

        markersRef.current.push(marker);
      }
    });
  }, [markers, onMarkerClick]);

  return <div ref={mapRef} className={styles.map} style={{ height }}></div>;
}
