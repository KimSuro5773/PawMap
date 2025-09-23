import {
  MdPets,
  MdRule,
  MdHomeRepairService,
  MdInventory,
  MdInfo,
  MdWarning,
  MdShoppingCart,
  MdOutlineAssignment,
} from "react-icons/md";
import { useDetailPetTour } from "@/api/hooks/useTour";
import styles from "./PetCompanionInfo.module.scss";

export default function PetCompanionInfo({ contentId }) {
  const {
    data: petData,
    isLoading,
    isError,
  } = useDetailPetTour(contentId, {
    enabled: !!contentId,
  });

  const petInfo = petData?.response?.body?.items?.item?.[0] || {};

  // 로딩 상태
  if (isLoading) {
    return (
      <div className={styles.petCompanionInfo}>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>반려동물 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태 또는 데이터가 없는 경우
  if (isError || !petInfo.contentid) {
    return (
      <div className={styles.petCompanionInfo}>
        <div className={styles.errorState}>
          <MdPets className={styles.errorIcon} />
          <p>반려동물 동반 정보를 불러올 수 없습니다</p>
        </div>
      </div>
    );
  }

  // 정보 아이템 렌더링 헬퍼 함수
  const renderInfoItem = (icon, label, value, className = "") => {
    if (!value || value === "0" || value === "") return null;

    return (
      <div className={`${styles.infoItem} ${className}`}>
        <div className={styles.infoIcon}>{icon}</div>
        <div className={styles.infoContent}>
          <span className={styles.infoLabel}>{label}</span>
          <span className={styles.infoValue}>{value}</span>
        </div>
      </div>
    );
  };

  // 리스트 형태로 렌더링하는 헬퍼 함수
  const renderListInfo = (icon, label, value) => {
    if (!value || value === "0" || value === "") return null;

    const items = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    if (items.length === 0) return null;

    return (
      <div className={styles.infoItem}>
        <div className={styles.infoIcon}>{icon}</div>
        <div className={styles.infoContent}>
          <span className={styles.infoLabel}>{label}</span>
          <div className={styles.listContainer}>
            {items.map((item, index) => (
              <span key={index} className={styles.listItem}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 모든 필드가 비어있는지 확인
  const hasAnyInfo = Object.values(petInfo).some(
    (value) => value && value !== "" && value !== "0"
  );

  if (!hasAnyInfo) {
    return (
      <div className={styles.petCompanionInfo}>
        <div className={styles.noDataState}>
          <MdPets className={styles.noDataIcon} />
          <p>반려동물 동반 정보가 없습니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.petCompanionInfo}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <MdPets className={styles.titleIcon} />
          반려동물 동반 정보
        </h3>
      </div>

      <div className={styles.infoGrid}>
        {/* 기본 동반 정보 */}
        {renderInfoItem(<MdPets />, "동반 구분", petInfo.acmpyTypeCd)}

        {renderInfoItem(<MdPets />, "동반 가능 동물", petInfo.acmpyPsblCpam)}

        {renderInfoItem(<MdRule />, "동반시 필요사항", petInfo.acmpyNeedMtr)}

        {/* 시설 및 용품 정보 */}
        {renderListInfo(
          <MdHomeRepairService />,
          "구비 시설",
          petInfo.relaPosesFclty
        )}

        {renderListInfo(<MdInventory />, "비치 품목", petInfo.relaFrnshPrdlst)}

        {renderListInfo(
          <MdShoppingCart />,
          "구매 가능 품목",
          petInfo.relaPurcPrdlst
        )}

        {renderListInfo(
          <MdOutlineAssignment />,
          "렌탈 가능 품목",
          petInfo.relaRntlPrdlst
        )}

        {/* 주의사항 및 기타 정보 */}
        {renderInfoItem(
          <MdWarning />,
          "사고 대비사항",
          petInfo.relaAcdntRiskMtr
        )}
      </div>

      {/* 기타 동반 정보 (별도 섹션) */}
      {petInfo.etcAcmpyInfo && (
        <div className={styles.additionalInfo}>
          <div className={styles.infoItem}>
            <div className={styles.infoIcon}>
              <MdInfo />
            </div>
            <div className={styles.infoContent}>
              <span className={styles.infoLabel}>기타 동반 정보</span>
              <div className={styles.multilineText}>
                {petInfo.etcAcmpyInfo.split("\n").map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
