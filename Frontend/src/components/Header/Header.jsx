import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { MdMenu, MdClose, MdSearch } from "react-icons/md";
import styles from "./Header.module.scss";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: 검색 기능 구현
      console.log("검색어:", searchQuery);
    }
  };

  const routeList = [
    { path: "/", text: "홈" },
    { path: "/hospitals", text: "동물병원" },
    { path: "/cafes", text: "카페" },
    { path: "/activities", text: "놀거리" },
    { path: "/grooming", text: "미용샵" },
    { path: "/accommodation", text: "숙소" },
    { path: "/explore", text: "내주변" },
  ];

  return (
    <header className={styles.header}>
      {/* Logo */}
      <div className={styles.logo}>
        <Link to="/">
          <h1>
            <span>Paw</span>
            <span>Map</span>
          </h1>
        </Link>
      </div>

      {/* Navigation */}
      <nav className={styles.navigation}>
        <ul>
          {routeList.map((nav) => (
            <li key={nav.path}>
              <NavLink
                to={nav.path}
                className={({ isActive }) =>
                  isActive ? styles.routedActive : ""
                }
              >
                {nav.text}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* SearchBar */}
      <div className={styles.searchContainer}>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            <MdSearch />
          </button>
        </form>
      </div>

      {/* Mobile Menu Button */}
      <button
        className={styles.mobileMenuButton}
        onClick={toggleMobileMenu}
        aria-label="메뉴 토글"
      >
        {isMobileMenuOpen ? <MdClose /> : <MdMenu />}
      </button>

      {/* Mobile Sidebar Navigation */}
      <nav
        className={`${styles.mobileNavigation} ${
          isMobileMenuOpen ? styles.open : ""
        }`}
      >
        {/* Sidebar Header */}
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarLogo}>
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
              <h1>
                <span>Paw</span>
                <span>Map</span>
              </h1>
            </Link>
          </div>
          <button
            className={styles.sidebarCloseButton}
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="메뉴 닫기"
          >
            <MdClose />
          </button>
        </div>

        {/* Navigation Links */}
        <ul>
          {routeList.map((nav) => (
            <li key={nav.path}>
              <NavLink
                to={nav.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  isActive ? styles.routedActive : ""
                }
              >
                {nav.text}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Overlay Background */}
      <div
        className={`${styles.overlay} ${isMobileMenuOpen ? styles.open : ""}`}
        onClick={() => setIsMobileMenuOpen(false)} // 오버레이 클릭 시 메뉴 닫기
      />
    </header>
  );
}
