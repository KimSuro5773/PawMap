import styles from "./Pagination.module.scss";
import {
  MdOutlineKeyboardArrowLeft, // 이전
  MdOutlineKeyboardArrowRight, // 다음
  MdOutlineKeyboardDoubleArrowLeft, // 처음으로
  MdOutlineKeyboardDoubleArrowRight, // 끝으로
} from "react-icons/md";

const ITEMS_PER_PAGE = 15;

export default function Pagination({
  totalCount,
  currentPage = 1,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // 슬라이딩 윈도우로 5개 페이지 번호 계산
  const getPageNumbers = () => {
    const maxVisiblePages = 5;
    let startPage, endPage;

    if (totalPages <= maxVisiblePages) {
      // 전체 페이지가 5개 이하면 모두 표시
      startPage = 1;
      endPage = totalPages;
    } else {
      // 현재 페이지를 기준으로 슬라이딩 윈도우 계산
      if (currentPage <= 3) {
        // 처음 부분: 1, 2, 3, 4, 5
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - 2) {
        // 끝 부분: totalPages-4, ..., totalPages
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        // 중간: currentPage-2, ..., currentPage+2
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  const pageNumbers = getPageNumbers();

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  // 페이지가 1개 이하면 페이지네이션 숨김
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={styles.pagination}>
      {/* 처음으로 버튼 */}
      <button
        className={`${styles.pageButton} ${styles.navButton}`}
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        aria-label="첫 페이지로"
      >
        <MdOutlineKeyboardDoubleArrowLeft />
      </button>

      {/* 이전 버튼 */}
      <button
        className={`${styles.pageButton} ${styles.navButton}`}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="이전 페이지"
      >
        <MdOutlineKeyboardArrowLeft />
      </button>

      {/* 페이지 번호들 */}
      {pageNumbers.map((pageNum) => (
        <button
          key={pageNum}
          className={`${styles.pageButton} ${styles.numberButton} ${
            pageNum === currentPage ? styles.active : ""
          }`}
          onClick={() => handlePageChange(pageNum)}
          aria-label={`${pageNum}페이지로`}
          aria-current={pageNum === currentPage ? "page" : undefined}
        >
          {pageNum}
        </button>
      ))}

      {/* 다음 버튼 */}
      <button
        className={`${styles.pageButton} ${styles.navButton}`}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="다음 페이지"
      >
        <MdOutlineKeyboardArrowRight />
      </button>

      {/* 끝으로 버튼 */}
      <button
        className={`${styles.pageButton} ${styles.navButton}`}
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        aria-label="마지막 페이지로"
      >
        <MdOutlineKeyboardDoubleArrowRight />
      </button>
    </div>
  );
}
