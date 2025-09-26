/**
 * 관광공사 API contentTypeId에 따른 관광 타입 매핑
 */
export const getTourTypeInfo = (contentTypeId) => {
  const typeMap = {
    12: {
      name: "관광지",
      icon: "🏞️",
      color: "#80B771",
      description: "관광지",
    },
    14: {
      name: "문화시설",
      icon: "🏛️",
      color: "#9B59B6",
      description: "문화시설",
    },
    15: {
      name: "축제/행사",
      icon: "🎪",
      color: "#FF6B9D",
      description: "축제/공연/행사",
    },
    28: {
      name: "레포츠",
      icon: "⚽",
      color: "#4CB4E0",
      description: "레포츠",
    },
    32: {
      name: "숙박",
      icon: "🏨",
      color: "#BD92DB",
      description: "숙박",
    },
    39: {
      name: "카페/식당",
      icon: "☕",
      color: "#E58A7C",
      description: "음식점",
    },
  };

  // 문자열로 받은 경우 숫자로 변환하여 매핑
  const numericId = parseInt(contentTypeId);

  return (
    typeMap[numericId] ||
    typeMap[contentTypeId] || {
      name: "기타",
      icon: "📍",
      color: "#6c757d",
      description: "기타",
    }
  );
};

/**
 * 이미지 URL 유효성 검사 및 기본 이미지 처리
 */
export const getValidImageUrl = (imageUrl) => {
  if (!imageUrl || imageUrl.trim() === "") {
    return null; // 기본 이미지는 CSS에서 처리
  }

  // http/https로 시작하지 않으면 유효하지 않은 것으로 처리
  if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
    return null;
  }

  return imageUrl;
};

/**
 * 제목 길이 제한 (더 이상 사용하지 않음 - CSS로 처리)
 */
export const truncateTitle = (title, maxLength = 50) => {
  if (!title) return "";
  // CSS에서 2줄 말줄임표 처리하므로 더 긴 제목도 허용
  return title.length > maxLength ? `${title.slice(0, maxLength)}...` : title;
};
