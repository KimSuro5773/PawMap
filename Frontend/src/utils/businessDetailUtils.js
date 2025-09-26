/**
 * contentTypeId별로 다른 API 응답 필드를 공통된 형태로 매핑하는 유틸리티
 */

/**
 * contentTypeId에 따른 Info 컴포넌트 매핑
 */
export const getInfoComponentType = (contentTypeId) => {
  const typeMap = {
    12: 'AttractionInfo',    // 관광지
    14: 'AttractionInfo',    // 문화시설 (관광지와 유사)
    15: 'AttractionInfo',    // 축제/행사 (관광지와 유사)
    28: 'ActivityInfo',      // 레포츠
    32: 'AccommodationInfo', // 숙박
    39: 'RestaurantInfo',    // 음식점/카페
  };

  return typeMap[parseInt(contentTypeId)] || 'AttractionInfo';
};

/**
 * 각 contentTypeId별로 공통 정보를 표준화된 형태로 매핑
 */
export const mapCommonBusinessInfo = (data, contentTypeId) => {
  const numericId = parseInt(contentTypeId);

  // 공통 정보 구조
  const commonInfo = {
    phone: null,
    openingHours: null,
    restDay: null,
    parking: null,
    address: null,
    website: null,
    fee: null,
  };

  if (!data) return commonInfo;

  switch (numericId) {
    case 39: // 음식점/카페
      return {
        ...commonInfo,
        phone: data.infocenterfood,
        openingHours: data.opentimefood,
        restDay: data.restdatefood,
        parking: data.parkingfood,
        fee: data.treatmenu, // 메뉴 정보를 fee 대신 사용
        specialInfo: {
          menu: data.firstmenu,
          treatMenu: data.treatmenu,
          packing: data.packing,
          seat: data.seat,
        }
      };

    case 32: // 숙박
      return {
        ...commonInfo,
        phone: data.infocenterlodging,
        openingHours: `체크인: ${data.checkintime || '정보없음'} / 체크아웃: ${data.checkouttime || '정보없음'}`,
        parking: data.parkinglodging,
        fee: data.reservationfood, // 예약 정보
        specialInfo: {
          roomCount: data.roomcount,
          roomType: data.roomtype,
          cooking: data.chkcooking,
          pickup: data.pickup,
        }
      };

    case 12: // 관광지
    case 14: // 문화시설
    case 15: // 축제/행사
      return {
        ...commonInfo,
        phone: data.infocenter,
        openingHours: data.usetime,
        restDay: data.restdate,
        parking: data.parking,
        fee: data.usefee,
        specialInfo: {
          season: data.useseason,
          experience: data.expguide,
          ageRange: data.expagerange,
        }
      };

    case 28: // 레포츠
      return {
        ...commonInfo,
        phone: data.infocenterleports,
        openingHours: data.usetimeleports,
        restDay: data.restdateleports,
        parking: data.parkingleports,
        fee: data.usefeeleports,
        specialInfo: {
          ageRange: data.expagerangeleports,
          program: data.program,
          scale: data.scaleleports,
        }
      };

    default:
      return commonInfo;
  }
};

/**
 * 컴포넌트 동적 import를 위한 헬퍼 함수
 */
export const getInfoComponent = async (contentTypeId) => {
  const componentType = getInfoComponentType(contentTypeId);

  try {
    switch (componentType) {
      case 'RestaurantInfo':
        const RestaurantInfo = await import('@/components/RestaurantInfo/RestaurantInfo');
        return RestaurantInfo.default;

      case 'AccommodationInfo':
        const AccommodationInfo = await import('@/components/AccommodationInfo/AccommodationInfo');
        return AccommodationInfo.default;

      case 'AttractionInfo':
        const AttractionInfo = await import('@/components/AttractionInfo/AttractionInfo');
        return AttractionInfo.default;

      case 'ActivityInfo':
        const ActivityInfo = await import('@/components/ActivityInfo/ActivityInfo');
        return ActivityInfo.default;

      default:
        const DefaultInfo = await import('@/components/AttractionInfo/AttractionInfo');
        return DefaultInfo.default;
    }
  } catch (error) {
    console.error('컴포넌트 로딩 실패:', error);
    // fallback으로 기본 컴포넌트 반환
    const DefaultInfo = await import('@/components/AttractionInfo/AttractionInfo');
    return DefaultInfo.default;
  }
};

/**
 * 비즈니스 타입별 아이콘 및 제목 매핑
 */
export const getBusinessDisplayInfo = (contentTypeId) => {
  const numericId = parseInt(contentTypeId);

  const displayMap = {
    12: { title: '관광지 정보', icon: '🏞️' },
    14: { title: '문화시설 정보', icon: '🏛️' },
    15: { title: '축제/행사 정보', icon: '🎪' },
    28: { title: '레포츠 정보', icon: '⚽' },
    32: { title: '숙박 정보', icon: '🏨' },
    39: { title: '음식점 정보', icon: '☕' },
  };

  return displayMap[numericId] || { title: '상세 정보', icon: '📍' };
};