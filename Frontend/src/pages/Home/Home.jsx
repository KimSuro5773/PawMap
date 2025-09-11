import { useAreaBasedList } from "@/api/hooks/useTour";
import { CONTENT_TYPES } from "@/api/types/tour";
import { DOMESTIC_REGIONS } from "@/data/regions";
import HomeSection from "@/components/HomeSection/HomeSection";
import BusinessCard from "@/components/BusinessCard/BusinessCard";
import RegionCard from "@/components/RegionCard/RegionCard";
import SkeletonCard from "@/components/SkeletonCard/SkeletonCard";
import styles from "./Home.module.scss";

const Home = () => {
  // API 데이터 페칭
  const { data: cafesData, isLoading: cafesLoading } = useAreaBasedList({
    contentTypeId: CONTENT_TYPES.RESTAURANT,
    numOfRows: 10,
    arrange: "Q",
  });

  const { data: attractionsData, isLoading: attractionsLoading } =
    useAreaBasedList({
      contentTypeId: CONTENT_TYPES.TOURIST_SPOT,
      numOfRows: 10,
      arrange: "Q",
    });

  const { data: accommodationData, isLoading: accommodationLoading } =
    useAreaBasedList({
      contentTypeId: CONTENT_TYPES.ACCOMMODATION,
      numOfRows: 10,
      arrange: "Q",
    });

  // 데이터 변환 함수
  const transformApiData = (apiData) => {
    if (!apiData?.response?.body?.items?.item) return [];

    const items = apiData.response.body.items.item;
    return Array.isArray(items) ? items : [items];
  };

  const cafes = transformApiData(cafesData);
  const attractions = transformApiData(attractionsData);
  const accommodation = transformApiData(accommodationData);

  // 스켈레톤 데이터 생성
  const skeletonItems = Array.from({ length: 8 }, (_, index) => ({
    id: index,
  }));

  // 카드 렌더링 함수
  const renderBusinessCard = (item) => (
    <BusinessCard
      id={item.contentid}
      title={item.title}
      image={item.firstimage || item.firstimage2}
      contentTypeId={item.contenttypeid}
      key={item.contentid}
    />
  );

  const renderRegionCard = (region) => (
    <RegionCard
      name={region.name}
      areaCode={region.areaCode}
      image={region.image}
      key={region.id}
    />
  );

  const renderBusinessSkeleton = (item) => (
    <SkeletonCard variant="business" key={item.id} />
  );

  const renderRegionSkeleton = (item) => (
    <SkeletonCard variant="region" key={item.id} />
  );

  return (
    <div className={styles.home}>
      {/* 음식점/카페 섹션 */}
      <HomeSection
        title="음식점 / 카페"
        items={cafesLoading ? skeletonItems : cafes}
        renderItem={cafesLoading ? renderBusinessSkeleton : renderBusinessCard}
      />

      {/* 관광지 섹션 */}
      <HomeSection
        title="관광지"
        items={attractionsLoading ? skeletonItems : attractions}
        renderItem={
          attractionsLoading ? renderBusinessSkeleton : renderBusinessCard
        }
      />

      {/* 국내 여행지 섹션 */}
      <HomeSection
        title="국내 여행지"
        items={DOMESTIC_REGIONS}
        renderItem={renderRegionCard}
        slidesPerView={6}
      />

      {/* 숙소 섹션 */}
      <HomeSection
        title="숙소"
        items={accommodationLoading ? skeletonItems : accommodation}
        renderItem={
          accommodationLoading ? renderBusinessSkeleton : renderBusinessCard
        }
      />
    </div>
  );
};

export { Home as Component };
