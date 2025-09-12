/**
 * 주소에서 시/도와 시/군/구 부분만 추출하는 유틸 함수
 * @param {string} fullAddress - 전체 주소 (예: "강원특별자치도 강릉시 해안로 341 (강문동)")
 * @returns {string} 시/도 + 시/군/구 (예: "강원특별자치도 강릉시")
 */
export const extractCityFromAddress = (fullAddress) => {
  // 주소가 없거나 빈 문자열인 경우
  if (!fullAddress || typeof fullAddress !== 'string') {
    return '';
  }

  // 공백으로 분리하여 배열로 만들기
  const addressParts = fullAddress.trim().split(' ');
  
  // 최소 2개 부분이 있어야 함 (시/도, 시/군/구)
  if (addressParts.length < 2) {
    return fullAddress;
  }

  // 첫 번째: 시/도, 두 번째: 시/군/구
  const province = addressParts[0]; // 강원특별자치도, 서울특별시, 경기도 등
  const city = addressParts[1]; // 강릉시, 종로구, 수원시 등

  return `${province} ${city}`;
};

/**
 * 주소 배열에서 각 주소의 시/도 + 시/군/구만 추출
 * @param {Array} addresses - 주소 배열
 * @returns {Array} 변환된 주소 배열
 */
export const extractCitiesFromAddresses = (addresses) => {
  if (!Array.isArray(addresses)) {
    return [];
  }

  return addresses.map(address => extractCityFromAddress(address));
};