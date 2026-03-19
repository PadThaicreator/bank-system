import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./navbar.css";

interface MenuItem {
  label: string;
  path: string;
  children?: MenuItem[];
}

export default function NavBarComponent() {
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState<boolean>(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ปิด dropdown เมื่อคลิกข้างนอก
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

  const menus: MenuItem[] = [
    { label: "Home", path: "/home" },
    {
      label: "Account",
      path: "/account",
      children: [
        { label: "Open Account", path: "/account/open" },
        { label: "Account List", path: "/account/list" },
      ],
    },
    {
      label: "Dashboard",
      path: "/dashboard",
      children: [
        { label: "Overview", path: "/dashboard" },
        { label: "Analytics", path: "/dashboard/analytics" },
      ],
    },
  ];

  const handleMenuClick = (item: MenuItem): void => {
    if (item.children) {
      setOpenMenu(openMenu === item.label ? null : item.label);
    } else {
      navigate(item.path);
    }
  };

  return (
    <div>
      <nav className={`navbar-container ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-brand">Bank System</div>

        <div className="navbar-menu" ref={dropdownRef}>
          {menus.map((item) => (
            <div key={item.label} className="menu-wrapper">
              <div
                className={`menu-item ${
                  location.pathname.startsWith(item.path) ? "active" : ""
                }`}
                onClick={() => handleMenuClick(item)}
              >
                <span>{item.label}</span>

                {item.children && (
                  <ChevronDown
                    size={14}
                    className={`chevron ${
                      openMenu === item.label ? "rotate" : ""
                    }`}
                  />
                )}

                <span className="menu-underline" />
              </div>

              {item.children && openMenu === item.label && (
                <div className="dropdown">
                  {item.children.map((child) => (
                    <div
                      key={child.label}
                      className="dropdown-item"
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
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <div>John Doe</div>
          <div className="navbar-user" style={{ marginLeft: "4px" }}>
            <div className="user-avatar">J</div>
          </div>
        </div>
      </nav>

      <div className="body">
        <Outlet />
      </div>
    </div>
  );
}