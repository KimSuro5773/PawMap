import { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import LocationFilter from "../LocationFilter/LocationFilter";
import SortFilter from "../SortFilter/SortFilter";
import FilterGroup from "../FilterGroup/FilterGroup";
import styles from "./FilterDemo.module.scss";

const FACILITY_OPTIONS = [
  { value: "parking", label: "주차장" },
  { value: "reservation", label: "예약가능" },
  { value: "group", label: "단체석" },
];

const FilterDemo = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState({ type: "all", region: "all" });
  const [sortBy, setSortBy] = useState("distance");
  const [facilities, setFacilities] = useState([]);

  const handleSearch = (query) => {
    console.log("검색:", query);
  };

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
    console.log("위치 변경:", newLocation);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    console.log("정렬 변경:", newSort);
  };

  const handleFacilitiesChange = (newFacilities) => {
    setFacilities(newFacilities);
    console.log("편의시설 변경:", newFacilities);
  };

  return (
    <div className={styles.filterDemo}>
      <div className={styles.section}>
        <h3>검색바</h3>
        <SearchBar
          placeholder="동물병원, 애견카페 등을 검색해보세요"
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
        />
      </div>

      <div className={styles.section}>
        <h3>위치 필터</h3>
        <LocationFilter value={location} onChange={handleLocationChange} />
      </div>

      <div className={styles.section}>
        <h3>정렬 필터</h3>
        <div className={styles.filterRow}>
          <SortFilter
            value={sortBy}
            onChange={handleSortChange}
            showDropdown={true}
          />

          {/* 모바일용 인라인 버전 */}
          <div className={styles.mobileOnly}>
            <SortFilter
              value={sortBy}
              onChange={handleSortChange}
              showDropdown={false}
              size="small"
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3>편의시설 필터</h3>
        <FilterGroup
          title="편의시설"
          options={FACILITY_OPTIONS}
          value={facilities}
          onChange={handleFacilitiesChange}
          multiple={true}
          layout="wrap"
        />
      </div>

      <div className={styles.results}>
        <h3>현재 선택된 필터</h3>
        <div className={styles.selectedFilters}>
          <p>
            <strong>검색어:</strong> {searchQuery || "없음"}
          </p>
          <p>
            <strong>위치:</strong>{" "}
            {location.type === "nearby"
              ? "내 주변"
              : location.type === "region"
              ? `지역: ${location.region}`
              : "전체"}
          </p>
          <p>
            <strong>정렬:</strong> {sortBy}
          </p>
          <p>
            <strong>편의시설:</strong>{" "}
            {facilities.length > 0 ? facilities.join(", ") : "없음"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FilterDemo;
