import { useState } from "react";
import { useAreaBasedList } from "@/api/hooks/useTour";
import { CONTENT_TYPES } from "@/api/types/tour";
import { DOMESTIC_REGIONS } from "@/data/regions";
import HomeSection from "@/components/HomeSection/HomeSection";
import BusinessCard from "@/components/BusinessCard/BusinessCard";
import RegionCard from "@/components/RegionCard/RegionCard";
import SkeletonCard from "@/components/SkeletonCard/SkeletonCard";
import MainSlider from "@/components/MainSlider/MainSlider";
import CategorySlider from "@/components/CategorySlider/CategorySlider";
import SearchBar from "@/components/SearchBar/SearchBar";
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
  const renderBusinessCard = (item) => {
    return (
      <BusinessCard
        id={item.contentid}
        title={item.title}
        image={item.firstimage || item.firstimage2}
        address={item.addr1}
        contentTypeId={item.contenttypeid}
        key={item.contentid}
      />
    );
  };

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
    <>
      {/* 메인 슬라이더 */}
      <MainSlider />
      <div className={styles.home}>
        {/* 검색바 */}
        <SearchBar size={"medium"} />

        {/* 카테고리 섹션 */}
        <CategorySlider />

        {/* 음식점/카페 섹션 */}
        <HomeSection
          title="음식점 / 카페"
          items={cafesLoading ? skeletonItems : cafes}
          renderItem={
            cafesLoading ? renderBusinessSkeleton : renderBusinessCard
          }
          viewAllUrl="/restaurants"
        />

        {/* 관광지 섹션 */}
        <HomeSection
          title="관광지"
          items={attractionsLoading ? skeletonItems : attractions}
          renderItem={
            attractionsLoading ? renderBusinessSkeleton : renderBusinessCard
          }
          viewAllUrl="/attractions"
        />

        {/* 국내 여행지 섹션 */}
        <HomeSection
          title="국내 여행지"
          items={DOMESTIC_REGIONS}
          renderItem={renderRegionCard}
          customBreakpoints={{
            // 모바일
            320: {
              slidesPerView: 3,
              spaceBetween: 12,
            },
            // 태블릿
            865: {
              slidesPerView: 4,
              spaceBetween: 16,
            },
            // 데스크톱
            1024: {
              slidesPerView: 6,
              spaceBetween: 24,
            },
          }}
        />

        {/* 숙소 섹션 */}
        <HomeSection
          title="숙소"
          items={accommodationLoading ? skeletonItems : accommodation}
          renderItem={
            accommodationLoading ? renderBusinessSkeleton : renderBusinessCard
          }
          viewAllUrl="/accommodation"
        />
      </div>
    </>
  );
};

export { Home as Component };
