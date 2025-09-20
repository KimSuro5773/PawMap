// 카테고리 코드 매핑 유틸리티

/**
 * 음식점 카테고리 매핑 (A05 관련)
 */

const RESTAURANT_CATEGORIES = {
  A05020100: "한식",
  A05020200: "서양식",
  A05020300: "일식",
  A05020400: "중식",
  A05020700: "이색음식점",
  A05020900: "카페",
  A05021000: "클럽",
};

/**
 * 카테고리 코드를 텍스트로 변환
 * @param {string} cat3 - 소분류 코드 (예: "A05021000")
 * @returns {string} - 카테고리 텍스트 (예: "카페/디저트")
 */
export const getCategoryText = (cat3) => {
  if (!cat3) return "음식점";

  return RESTAURANT_CATEGORIES[cat3] || "음식점";
};

