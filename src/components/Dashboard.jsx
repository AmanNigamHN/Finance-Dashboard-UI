import React from "react";
import Header from "./Header";
import RoleSelector from "./RoleSelector";
import SummaryCards from "./SummaryCards";
import Charts from "./Charts";
import TransactionList from "./TransactionList";
import InsightsSection from "./InsightsSection";
import "../styles/Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard">

      <Header />

      <RoleSelector />

      <main className="dashboard-content">

        <section className="section">
          <SummaryCards />
        </section>


        <section className="section">
          <Charts />
        </section>


        <section className="section">
          <InsightsSection />
        </section>


        <section className="section">
          <TransactionList />
        </section>
      </main>


      <footer className="dashboard-footer">
        <p>© April 2026 Finance Dashboard</p>
      </footer>
    </div>
  );
};

export default Dashboard;
