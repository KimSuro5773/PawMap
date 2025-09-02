import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import { MdMenu, MdClose } from "react-icons/md";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const navigationItems = [
    { path: "/", label: "홈" },
    { path: "/hospitals", label: "동물병원" },
    { path: "/cafes", label: "애견카페" },
    { path: "/activities", label: "놀거리" },
    { path: "/grooming", label: "미용샵" },
    { path: "/accommodation", label: "숙소" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // 검색 로직 구현 예정
      console.log("검색어:", searchQuery);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <span className={styles.logoText}>
            Paw
            <br />
            Map
          </span>
        </Link>

        {/* Navigation - Desktop */}
        <nav className={styles.navigation}>
          <ul>
            {navigationItems.map((item) => (
              <Link to={item.path} key={item.path}>
                <li className={styles.navItem}>{item.label}</li>
              </Link>
            ))}
          </ul>
        </nav>

        {/* Search */}
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            placeholder="장소, 업체명 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            <CiSearch />
          </button>
        </form>

        {/* Mobile Menu Button */}
        <button
          className={styles.menuButton}
          onClick={toggleMenu}
          aria-label="메뉴 열기/닫기"
        >
          {isMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div className={styles.mobileOverlay} onClick={toggleMenu}>
          <nav
            className={styles.mobileNav}
            onClick={(e) => e.stopPropagation()}
          >
            <ul>
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <li className={styles.mobileNavItem}>{item.label}</li>
                </Link>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
