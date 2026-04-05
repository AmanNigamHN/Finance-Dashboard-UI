import React, { useState, useContext } from "react";
import { useFinance } from "../context/FinanceContext";
import "../styles/Header.css";

const Header = () => {
  const { isDarkMode, setIsDarkMode } = useFinance();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // const handleLogout = () => {
  //   logout();
  //   setMobileMenuOpen(false);
  // };

  return (
    <header className="dashboard-header">

      <div className="header-mobile-toggle">
        <button
          className="hamburger-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>


      <div className="header-content">
        <h1 className="app-title">Finance Dashboard</h1>
        <p className="app-subtitle">View, Track, Analyse & Manage Your Income & Expenses</p>
      </div>


      <div className={`header-toolbar ${mobileMenuOpen ? 'active' : ''}`}>


        <button
          className="header-btn dark-mode-btn"
          onClick={() => setIsDarkMode(!isDarkMode)}
          title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
        >
          {isDarkMode ? 'Light ☼' : 'Dark ☾'}
        </button>

        <button
          className="header-btn menu-close-btn"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>

      {mobileMenuOpen && (
        <div
          className="menu-overlay"
          onClick={() => setMobileMenuOpen(false)}>
        </div>
      )}
    </header>
  );
};

export default Header;
