import React, { useState } from "react";
import { useFinance } from "../context/FinanceContext";
import "../styles/Header.css";

const IconPlus = () => (
  <svg className="header-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M12 5v14M5 12h14"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
    />
  </svg>
);

const IconSun = () => (
  <svg className="header-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
    <path
      d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const IconMoon = () => (
  <svg className="header-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BrandMark = () => (
  <div className="brand-mark" aria-hidden>
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <rect x="4" y="18" width="5" height="10" rx="1" fill="currentColor" opacity="0.9" />
      <rect x="13.5" y="12" width="5" height="16" rx="1" fill="currentColor" opacity="0.95" />
      <rect x="23" y="6" width="5" height="22" rx="1" fill="currentColor" />
    </svg>
  </div>
);

const Header = () => {
  const { isDarkMode, setIsDarkMode, userRole } = useFinance();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="dashboard-header">
      <div className="header-container">
        <div className="header-mobile-toggle">
          <button
            type="button"
            className="hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="header-toolbar"
            aria-label="Toggle menu"
          >
            <span className={`hamburger ${mobileMenuOpen ? "active" : ""}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>

        <div className="header-brand">
          <BrandMark />
          <div className="header-content">

            <h1 className="app-title">Finance Dashboard</h1>
            <p className="app-subtitle">
              View, track, analyse, and manage your income & expenses
            </p>
          </div>
        </div>

        <div
          id="header-toolbar"
          className={`header-toolbar ${mobileMenuOpen ? "active" : ""}`}
        >
          <div className="header-left-actions">
            {userRole === "admin" && (
              <button
                type="button"
                className="header-btn cta-btn"
                onClick={() => {
                  const el = document.querySelector(".transaction-section");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  setMobileMenuOpen(false);
                }}
              >
                <IconPlus />
                <span className="btn-text">Add transaction</span>
              </button>
            )}
          </div>

          <div className="header-right-actions">
            <button
              type="button"
              className="header-btn dark-mode-btn"
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-pressed={isDarkMode}
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              <span className="btn-text">{isDarkMode ? "Light" : "Dark"}</span>
              {isDarkMode ? <IconSun /> : <IconMoon />}
            </button>

            <button
              type="button"
              className="header-btn menu-close-btn"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              hidden={!mobileMenuOpen}
            >
              <span className="btn-icon" aria-hidden>
                ✕
              </span>
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          className="menu-overlay"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden
        />
      )}
    </header>
  );
};

export default Header;