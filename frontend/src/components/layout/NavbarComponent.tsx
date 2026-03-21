import { ChevronDown, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import styles from "./navbar.module.css";
import { menuList, type MenuItem } from "./MenuItemList";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { logout } from "../../redux/authSlice";


export default function NavBarComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  const data = useSelector((state: RootState) => state.auth);

  




  const [scrolled, setScrolled] = useState<boolean>(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);



  const dropdownRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menus: MenuItem[] = menuList;

  const handleMenuClick = (item: MenuItem): void => {
    if (!item.children) {
      navigate(item.path);
    }
  };

  const handleMouseEnter = (item: MenuItem): void => {
    if (item.children) {
      setOpenMenu(item.label);
    }
  };

  const handleMouseLeave = (): void => {
    setOpenMenu(null);
  };


  const dispatch = useDispatch();
  const handleLogOut = () : void => {
       dispatch(
            logout(),
          );

    navigate("/login");
  }

  return (
    <div>
      <nav className={`${styles["navbar-container"]} ${scrolled ? styles["scrolled"] : ""}`}>
        <div className={styles["navbar-brand"]}>Bank System</div>

        <div className={styles["navbar-menu"]} ref={dropdownRef}>
          {menus.map((item) => ( item.canAccess?.includes(data.user?.role || "") &&
            (<div 
              key={item.label} 
              className={styles["menu-wrapper"]}
              onMouseEnter={() => handleMouseEnter(item)}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className={`${styles["menu-item"]} ${
                  location.pathname.startsWith(item.path) ? styles["active"] : ""
                }`}
                onClick={() => handleMenuClick(item)}
              >
                <span>{item.label}</span>

                {item.children && (
                  <ChevronDown
                    size={14}
                    className={`${styles["chevron"]} ${
                      openMenu === item.label ? styles["rotate"] : ""
                    }`}
                  />
                )}

                <span className={styles["menu-underline"]} />
              </div>

              {item.children && openMenu === item.label && (
                <div className={styles["dropdown"]}>
                  {item.children.map((child) => ( child.canAccess?.includes(data.user?.role || "") &&
                    <div
                      key={child.label}
                      className={styles["dropdown-item"]}
                      onClick={() => {
                        navigate(child.path);
                        setOpenMenu(null);
                      }}
                    >
                      {child.label}
                    </div>
                  ))}
                </div>
              )}
            </div>)
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <div>{data.user?.fullName}</div>
          <div className={styles["navbar-user"]} style={{ marginLeft: "4px" }}>
            <div className={styles["user-avatar"]}>{data.user?.fullName?.[0]}</div>
          </div>
          <LogOut color="red" size={28}  className={styles["exit-icon"]}  onClick={handleLogOut}/>
        </div>
      </nav>

      <div className={styles["body"]}>
        <Outlet />
      </div>
    </div>
  );
}