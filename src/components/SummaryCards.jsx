import React from "react";
import { useFinance } from "../context/FinanceContext";
import { calculateSummary } from "../data/mockData";
import "../styles/SummaryCards.css";

const SummaryCards = () => {
  const { transactions } = useFinance();
  const { totalBalance, totalIncome, totalExpenses } = calculateSummary(transactions);

  const cards = [
    {
      id: "balance",
      title: "Total Balance",
      amount: totalBalance,
      icon: "₹",
      color: "blue",
      bgColor: "#e3f2fd"
    },
    {
      id: "income",
      title: "Total Income",
      amount: totalIncome,
      icon: "📈",
      color: "green",
      bgColor: "#e8f5e9"
    },
    {
      id: "expenses",
      title: "Total Expenses",
      amount: totalExpenses,
      icon: "📉",
      color: "red",
      bgColor: "#ffebee"
    }
  ];

  return (
    <div className="summary-cards">
      {cards.map(card => (
        <div key={card.id} className="card">
          <div className="card-header">
            <span className="card-icon">{card.icon}</span>
            <h3 className="card-title">{card.title}</h3>
          </div>
          <p className="card-amount">
            ₹{card.amount.toFixed(2)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
