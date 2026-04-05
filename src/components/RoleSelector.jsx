import React from "react";
import { useFinance } from "../context/FinanceContext";
import "../styles/RoleSelector.css";

const RoleSelector = () => {
  const { userRole, setUserRole } = useFinance();

  return (
    <div className="role-selector">
      <div className="role-selector-container">
        <span className="role-label">Current Role :-</span>
        
        <div className="role-buttons">
          <button
            className={`role-btn ${userRole === "viewer" ? "active" : ''}`}
            onClick={() => setUserRole("viewer")}
          >
            Viewer
          </button>
          <button
            className={`role-btn ${userRole === "admin" ? "active" : ''}`}
            onClick={() => setUserRole("admin")}
          >
            Admin
          </button>
        </div>
        <p className="role-info">
          {userRole === "viewer" 
            ? "👀 You can Only view all data but cannot make any changes"
            : "🛠️ You can view, add, edit and delete transactions"
          }
        </p>
      </div>
    </div>
  );
};

export default RoleSelector;
