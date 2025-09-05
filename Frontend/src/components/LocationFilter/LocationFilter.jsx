import { useState, useEffect } from 'react';
import { FiMapPin, FiLoader } from 'react-icons/fi';
import FilterGroup from '../FilterGroup/FilterGroup';
import FilterButton from '../FilterButton/FilterButton';
import styles from './LocationFilter.module.scss';

const REGIONS = [
  { value: 'all', label: '전체 지역' },
  { value: 'seoul', label: '서울' },
  { value: 'gyeonggi', label: '경기' },
  { value: 'incheon', label: '인천' },
  { value: 'gangwon', label: '강원' },
  { value: 'chungbuk', label: '충북' },
  { value: 'chungnam', label: '충남' },
  { value: 'sejong', label: '세종' },
  { value: 'daejeon', label: '대전' },
  { value: 'gyeongbuk', label: '경북' },
  { value: 'gyeongnam', label: '경남' },
  { value: 'daegu', label: '대구' },
  { value: 'ulsan', label: '울산' },
  { value: 'busan', label: '부산' },
  { value: 'jeonbuk', label: '전북' },
  { value: 'jeonnam', label: '전남' },
  { value: 'gwangju', label: '광주' },
  { value: 'jeju', label: '제주' }
];

const LocationFilter = ({ 
  value = { type: 'all', region: 'all' }, 
  onChange, 
  disabled = false,
  showNearby = true 
}) => {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const handleLocationTypeChange = (type) => {
    if (type === 'nearby') {
      getCurrentLocation();
    } else {
      onChange?.({ ...value, type, region: type === 'all' ? 'all' : value.region });
    }
  };

  const handleRegionChange = (region) => {
    onChange?.({ ...value, region, type: region === 'all' ? 'all' : 'region' });
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('위치 서비스가 지원되지 않는 브라우저입니다.');
      return;
    }

    setIsGettingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onChange?.({ 
          ...value, 
          type: 'nearby', 
          coordinates: { lat: latitude, lng: longitude } 
        });
        setIsGettingLocation(false);
      },
      (error) => {
        let errorMessage = '';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '위치 정보 접근이 거부되었습니다. 브라우저 설정에서 위치 접근을 허용해주세요.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = '위치 정보를 사용할 수 없습니다.';
            break;
          case error.TIMEOUT:
            errorMessage = '위치 정보 요청 시간이 초과되었습니다.';
            break;
          default:
            errorMessage = '위치 정보를 가져올 수 없습니다.';
        }
        setLocationError(errorMessage);
        setIsGettingLocation(false);
        
        // 오류 발생 시 전체 지역으로 되돌림
        onChange?.({ ...value, type: 'all', region: 'all' });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5분
      }
    );
  };

  const getLocationTypeLabel = () => {
    switch (value.type) {
      case 'nearby':
        return isGettingLocation ? '위치 확인 중...' : '내 주변';
      case 'region':
        const selectedRegion = REGIONS.find(r => r.value === value.region);
        return selectedRegion ? selectedRegion.label : '지역 선택';
      case 'all':
      default:
        return '전체 지역';
    }
  };

  return (
    <div className={`${styles.locationFilter} ${disabled ? styles.disabled : ''}`}>
      <div className={styles.locationTypes}>
        <FilterButton
          isActive={value.type === 'all'}
          onClick={() => handleLocationTypeChange('all')}
          disabled={disabled}
          variant="outline"
        >
          전체 지역
        </FilterButton>

        {showNearby && (
          <FilterButton
            isActive={value.type === 'nearby'}
            onClick={() => handleLocationTypeChange('nearby')}
            disabled={disabled || isGettingLocation}
            variant="outline"
          >
            {isGettingLocation && <FiLoader className={styles.spinner} />}
            <FiMapPin />
            내 주변
          </FilterButton>
        )}

        <FilterButton
          isActive={value.type === 'region'}
          onClick={() => handleLocationTypeChange('region')}
          disabled={disabled}
          variant="outline"
        >
          지역 선택
        </FilterButton>
      </div>

      {value.type === 'region' && (
        <div className={styles.regionSelector}>
          <FilterGroup
            options={REGIONS}
            value={value.region}
            onChange={handleRegionChange}
            multiple={false}
            disabled={disabled}
            variant="default"
            size="small"
            layout="wrap"
          />
        </div>
      )}

      {locationError && (
        <div className={styles.error}>
          <p className={styles.errorMessage}>{locationError}</p>
          <button
            type="button"
            onClick={() => setLocationError(null)}
            className={styles.dismissButton}
          >
            닫기
          </button>
        </div>
      )}

      {value.type === 'nearby' && value.coordinates && (
        <div className={styles.locationInfo}>
          <FiMapPin />
          <span>
            현재 위치: {value.coordinates.lat.toFixed(4)}, {value.coordinates.lng.toFixed(4)}
          </span>
        </div>
      )}
    </div>
  );
};

export default LocationFilter;