import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useAppContext } from "../context/useAppContext";
import { useToast } from "../context/ToastContext";
import { GOLD } from "../constants";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { state, logout } = useAppContext();
  const toast = useToast();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/lessons", label: "Lessons" },
    { path: "/rates", label: "Rates" },
    { path: "/ranking", label: "Rankings" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    toast("Logged out successfully", "success");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span
            style={{
              color: GOLD,
              fontFamily: "serif",
              fontSize: "1.25rem",
              lineHeight: 1,
            }}
          >
            T
          </span>
          <span>Tennis with Daniil</span>
        </Link>

        {/* Desktop links */}
        <ul className="navbar-links">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`navbar-link ${isActive(link.path) ? "active" : ""}`}
              >
                {link.label}
              </Link>
            </li>
          ))}

          {state.isAuthenticated ? (
            <>
              <li style={{ marginLeft: "0.5rem" }}>
                {state.authUser?.role === 'admin' || state.authUser?.role === 'coach' ? (
                  <Link
                    to="/admin"
                    className={`navbar-link ${isActive("/admin") ? "active" : ""}`}
                    style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}
                  >
                    <LayoutDashboard size={14} />
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/my-progress"
                    className={`navbar-link ${isActive("/my-progress") ? "active" : ""}`}
                    style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}
                  >
                    My Progress
                  </Link>
                )}
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    padding: "0.375rem 0.875rem",
                    background: "none",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "9999px",
                    color: "#666",
                    fontSize: "0.8125rem",
                    cursor: "pointer",
                    fontFamily: "Inter, sans-serif",
                    transition: "color 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#f87171";
                    e.currentTarget.style.borderColor = "rgba(248,113,113,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#666";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                >
                  <LogOut size={13} />
                  Sign out
                </button>
              </li>
            </>
          ) : (
            <li style={{ marginLeft: "0.75rem" }}>
              <Link
                to="/login"
                className="btn btn-primary"
                style={{
                  padding: "0.4375rem 1.125rem",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                }}
              >
                Sign In
              </Link>
            </li>
          )}
        </ul>

        {/* Mobile hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#f0f0f0",
            padding: "0.25rem",
          }}
          className="mobile-menu-btn"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
