import apiClient from "../axios";

const buildMarkersParam = (markers) => {
  if (!markers || markers.length === 0) return null;

  const groupedMarkers = {};

  markers.forEach((marker) => {
    const key = `${marker.type || 'd'}:${marker.color || 'red'}`;
    if (!groupedMarkers[key]) {
      groupedMarkers[key] = [];
    }
    groupedMarkers[key].push(`${marker.lng},${marker.lat}`);
  });

  return Object.entries(groupedMarkers)
    .map(([typeColor, coords]) => `${typeColor}|${coords.join('|')}`)
    .join('&markers=');
};

export const getStaticMapUrl = (params) => {
  const {
    center,
    level = 13,
    width = 600,
    height = 400,
    markers,
    format = 'png'
  } = params;

  if (!center || !center.lng || !center.lat) {
    throw new Error('center with lng and lat is required');
  }

  const queryParams = new URLSearchParams({
    center: `${center.lng},${center.lat}`,
    level,
    w: width,
    h: height,
    format
  });

  const markersParam = buildMarkersParam(markers);
  if (markersParam) {
    queryParams.append('markers', markersParam);
  }

  return `${apiClient.defaults.baseURL}/api/naver/static-map?${queryParams.toString()}`;
};
