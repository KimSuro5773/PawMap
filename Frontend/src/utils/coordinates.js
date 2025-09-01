// 좌표 변환 유틸리티 - 네이버 검색 API mapx,mapy → 네이버 지도 API 좌표

/**
 * 네이버 검색 API의 mapx, mapy를 지도 API용 좌표로 변환
 * @param {string|number} mapx - 네이버 검색 API의 X 좌표
 * @param {string|number} mapy - 네이버 검색 API의 Y 좌표
 * @returns {Object} { lng: number, lat: number }
 */
export const convertNaverCoords = (mapx, mapy) => {
  // 네이버 지도 API가 로드된 경우 정확한 변환 사용
  if (typeof naver !== "undefined" && naver.maps && naver.maps.TransCoord) {
    try {
      const x = typeof mapx === "string" ? parseInt(mapx, 10) : mapx;
      const y = typeof mapy === "string" ? parseInt(mapy, 10) : mapy;

      const tm128Point = new naver.maps.Point(x, y);
      const latlng = naver.maps.TransCoord.fromTM128ToLatLng(tm128Point);

      return {
        lng: latlng.lng(),
        lat: latlng.lat(),
      };
    } catch (error) {
      console.error("좌표 변환 오류:", error);
    }
  }

  // 네이버 지도 API 미로드 시 근사치 변환
  const x = typeof mapx === "string" ? parseInt(mapx, 10) : mapx;
  const y = typeof mapy === "string" ? parseInt(mapy, 10) : mapy;

  return {
    lng: x / 10000000,
    lat: y / 10000000,
  };
};
