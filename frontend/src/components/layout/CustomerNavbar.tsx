import {  ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./navbar.css";

export default function NavBarComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  });

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
      <nav className={`navbar-container ${scrolled ? "scrolled" : ""}`}>

        {/* Brand */}
        <div className="navbar-brand">Bank System</div>

        {/* Menu */}
        <div className="navbar-menu">
          {menus.map((item) => (
            <div
              key={item.label}
              className={`menu-item ${location.pathname.startsWith(item.path) ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span>{item.label}</span>
              {item.hasDropdown && <ChevronDown size={14} className="chevron" />}
              <span className="menu-underline" />
            </div>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {/* <div className="icon-btn"><FileText size={18} /></div> */}
          {/* <div className="icon-btn"><Search size={18} /></div> */}
          {/* <div className="icon-btn"><MessageSquare size={18} /></div> */}
          {/* <div className="icon-btn">
            <Bell size={18} />
            <span className="badge" />
          </div> */}
          <div>John Doe</div>
          <div className="navbar-user" style={{ marginLeft: "4px" }}>
            <div className="user-avatar">J</div>
          </div>
        </div>

      </nav>
      <div className="body"><Outlet /></div>
    </div>
  );
}