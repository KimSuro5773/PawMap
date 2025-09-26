import React from "react";
import { renderToString } from "react-dom/server";
import { FaCoffee, FaLandmark, FaShoppingCart } from "react-icons/fa";
import { IoMdBed } from "react-icons/io";
import { MdSportsSoccer } from "react-icons/md";
import { GiDramaMasks, GiPartyPopper } from "react-icons/gi";

// 마커 타입별 스타일 상수
export const MARKER_TYPE_STYLE = {
  // 기본 관광공사 API contentTypeId
  12: { color: "#80B771", icon: FaLandmark, subTitle: "관광지" },
  14: { color: "#9B59B6", icon: GiDramaMasks, subTitle: "문화시설" },
  15: { color: "#FF6B9D", icon: GiPartyPopper, subTitle: "축제/공연/행사" },
  28: { color: "#4CB4E0", icon: MdSportsSoccer, subTitle: "레포츠" },
  32: { color: "#BD92DB", icon: IoMdBed, subTitle: "숙박" },
  39: { color: "#E58A7C", icon: FaCoffee, subTitle: "음식점/카페" },

  // 추가 카테고리 (확장 가능)
  38: { color: "#FFB347", icon: FaShoppingCart, subTitle: "쇼핑" },

  // 기타 가능한 업종 분류
  25: { color: "#DDA0DD", icon: FaLandmark, subTitle: "여행코스" },
  76: { color: "#98FB98", icon: MdSportsSoccer, subTitle: "스포츠시설" },
  80: { color: "#F0E68C", icon: GiDramaMasks, subTitle: "체험관광" },
};

// CustomMarker 로직을 HTML 문자열로 변환하는 함수
export function createCustomMarkerHtml(contentTypeId, size = 40) {
  const style = MARKER_TYPE_STYLE[contentTypeId] || MARKER_TYPE_STYLE[12];
  const IconComponent = style.icon;

  // React 아이콘을 HTML 문자열로 변환
  const iconHtml = renderToString(
    React.createElement(IconComponent, { size: 16 })
  );

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
          ${iconHtml}
        </div>
      </foreignObject>
    </svg>
  `;
}
