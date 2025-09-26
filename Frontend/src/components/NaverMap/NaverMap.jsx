import { useEffect, useRef, useState } from "react";
import { renderToString } from "react-dom/server";
import {
  FaCoffee,
  FaLandmark,
  FaShoppingCart,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { IoMdBed } from "react-icons/io";
import { MdSportsSoccer } from "react-icons/md";
import { GiDramaMasks, GiPartyPopper } from "react-icons/gi";
import styles from "./NaverMap.module.scss";

// CustomMarker 로직을 HTML 문자열로 변환하는 함수
function createCustomMarkerHtml(contentTypeId, size = 40) {
  const MARKER_TYPE_STYLE = {
    // 기본 관광공사 API contentTypeId
    12: { color: "#80B771", icon: FaLandmark, subTitle: "관광지" },
    14: { color: "#9B59B6", icon: GiDramaMasks, subTitle: "문화시설" },
    15: { color: "#FF6B9D", icon: GiPartyPopper, subTitle: "축제/공연/행사" },
    28: { color: "#4CB4E0", icon: MdSportsSoccer, subTitle: "레포츠" },
    32: { color: "#BD92DB", icon: IoMdBed, subTitle: "숙박" },
    39: { color: "#E58A7C", icon: FaCoffee, subTitle: "음식점/카페" },

    // 추가 카테고리 (확장 가능)
    38: { color: "#FFB347", icon: FaShoppingCart, subTitle: "쇼핑" },

    15: { color: "#F0E68C", icon: GiDramaMasks, subTitle: "문화시설" },
  };

  const style = MARKER_TYPE_STYLE[contentTypeId] || MARKER_TYPE_STYLE[12];
  const IconComponent = style.icon;

  return `
    <svg width="${size}" height="${
    size * 1.2
  }" viewBox="0 0 40 48" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow-${contentTypeId}" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="rgba(0,0,0,0.4)"/>
        </filter>
      </defs>
      <path
        d="M20 4 C12 4, 6 10, 6 18 C6 26, 20 44, 20 44 C20 44, 34 26, 34 18 C34 10, 28 4, 20 4 Z"
        fill="${style.color}"
        stroke="#FFFFFF"
        stroke-width="2"
        filter="url(#shadow-${contentTypeId})"
      />
      <foreignObject x="10" y="8" width="20" height="20">
        <div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; color: #FFFFFF;">
          ${renderToString(<IconComponent size={16} />)}
        </div>
      </foreignObject>
    </svg>
  `;
}

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
