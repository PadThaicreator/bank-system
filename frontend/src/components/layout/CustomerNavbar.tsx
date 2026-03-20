import {  ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import styles from "./navbar.module.css";

export default function NavBarComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (!token) navigate("/login");
  // });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const menus = [
    { label: "Home", path: "/home", hasDropdown: true },
    { label: "Account", path: "/account", hasDropdown: true },
    { label: "Dashboard", path: "/dashboard", hasDropdown: true },
  ];

  return (
    <div>
      <nav className={`${styles["navbar-container"]} ${scrolled ? styles.scrolled : ""}`}>

        {/* Brand */}
        <div className={styles["navbar-brand"]}>Bank System</div>

        {/* Menu */}
        <div className={styles["navbar-menu"]}>
          {menus.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <div
                key={item.label}
                className={`${styles["menu-item"]} ${isActive ? styles.active : ""}`}
                onClick={() => navigate(item.path)}
              >
                <span>{item.label}</span>
                {item.hasDropdown && <ChevronDown size={14} className={styles.chevron} />}
                <span className={styles["menu-underline"]} />
              </div>
            );
          })}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <div>John Doe</div>
          <div className={styles["navbar-user"]} style={{ marginLeft: "4px" }}>
            <div className={styles["user-avatar"]}>J</div>
          </div>
        </div>

      </nav>
      <div className={styles.body}><Outlet /></div>
    </div>
  );
}