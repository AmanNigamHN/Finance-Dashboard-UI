import React from "react";
import { useFinance } from "../context/FinanceContext";
import { calculateSummary, getCategorySpending } from "../data/mockData";
import "../styles/InsightsSection.css";

const InsightsSection = () => {
  const { transactions } = useFinance();
  const { totalBalance, totalIncome, totalExpenses } = calculateSummary(transactions);
  

  const getInsights = () => {
    const insights = [];

  
    const categorySpending = getCategorySpending(transactions);
    if (categorySpending.length > 0) {
      const highestCategory = categorySpending.reduce((prev, current) =>
        prev.value > current.value ? prev : current
      );
      insights.push({
        icon: "🏆",
        title: "Highest Spending",
        description: `${highestCategory.name} is your top expense category at ₹${highestCategory.value.toFixed(2)}`,
        color: "#ea0b0b"
      });
    }

  
    if (totalIncome > 0 && totalExpenses > 0) {
      const savingsRate = ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1);
      if (totalIncome > totalExpenses) {
        insights.push({
          icon: "💚",
          title: "Great Savings Rate",
          description: `You're saving ${savingsRate}% of your income. Keep it up! 🎯`,
          color: "#4ECDC4"
        });
      } else {
        insights.push({
          icon: "⚠️",
          title: "Warning",
          description: `Your expenses exceed your income. Budget more carefully.`,
          color: "#FFB347"
        });
      }
    }

  
    if (transactions.length > 0) {
      const avgAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0) / transactions.length;
      insights.push({
        icon: "📊",
        title: "Average Transaction",
        description: `Your average transaction amount is ₹${avgAmount.toFixed(2)}`,
        color: "#45B7D1"
      });
    }

  
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentTransactions = transactions.filter(
      tx => new Date(tx.date) >= weekAgo
    );

    if (recentTransactions.length > 0) {
      insights.push({
        icon: "📅",
        title: "Recent Activity",
        description: `You had ${recentTransactions.length} transaction(s) in the last 7 days`,
        color: "#F7DC6F"
      });
    }

  
    if (totalExpenses > 0) {
      const avgDaily = (totalExpenses / Math.max(1, transactions.filter(t => t.type === 'expense').length)).toFixed(2);
      insights.push({
        icon:"💸",
        title: "Daily Average Spending",
        description: `You spend an average of ₹${avgDaily} per transaction`,
        color: "#BB8FCE"
      });
    }


    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const thisMonthTxns = transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
    });
    const prevMonthTxns = transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate.getMonth() === prevMonth && txDate.getFullYear() === prevYear;
    });

    const thisMonthIncome = thisMonthTxns.filter(tx => tx.type === "income").reduce((sum, tx) => sum + tx.amount, 0);
    const thisMonthExpenses = thisMonthTxns.filter(tx => tx.type === "expense").reduce((sum, tx) => sum + tx.amount, 0);
    const prevMonthIncome = prevMonthTxns.filter(tx => tx.type === "income").reduce((sum, tx) => sum + tx.amount, 0);
    const prevMonthExpenses = prevMonthTxns.filter(tx => tx.type === "expense").reduce((sum, tx) => sum + tx.amount, 0);

    if (thisMonthTxns.length > 0 || prevMonthTxns.length > 0) {
      const incomeChange = prevMonthIncome > 0 ? ((thisMonthIncome - prevMonthIncome) / prevMonthIncome * 100).toFixed(1) : 0;
      const expenseChange = prevMonthExpenses > 0 ? ((thisMonthExpenses - prevMonthExpenses) / prevMonthExpenses * 100).toFixed(1) : 0;

      let comparisonText = '';
      let icon = "📈";
      let color = "#4ECDC4";

      if (thisMonthIncome > prevMonthIncome && thisMonthExpenses <= prevMonthExpenses) {
        comparisonText = `Income up ${incomeChange}%, expenses stable/down. Great progress!`;
      } else if (thisMonthIncome < prevMonthIncome) {
        comparisonText = `Income up ${Math.abs(incomeChange)}% from last month.`;
        icon = "📈";
        color = "#18ea29";
      } else if (thisMonthExpenses > prevMonthExpenses) {
        comparisonText = `Expenses up ${expenseChange}% from last month.`;
        icon = "⚠️";
        color = "#FFB347";
      } else {
        comparisonText = `Monthly finances stable compared to last month.`;
      }

      insights.push({
        icon: icon,
        title: "Monthly Comparison",
        description: comparisonText,
        color: color
      });
    }

    return insights;
  };

  const insights = getInsights();

  return (
    <div className="insights-section">
      <h2 className="section-title">💡 Insights & Analytics</h2>
      
      {insights.length > 0 ? (
        <div className="insights-grid">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="insight-card"
              style={{ borderLeftColor: insight.color }}
            >
              <div className="insight-header">
                <span className="insight-icon">{insight.icon}</span>
                <h3 className="insight-title">{insight.title}</h3>
              </div>
              <p className="insight-description">{insight.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-insights">
          <p> Not enough data to generate insights. Keep on adding transactions!</p>
        </div>
      )}


      <div className="quick-stats">
        <h3>📈 Quick Overview</h3>
        <div className="stats-grid">
          <div className="stat-box">
            <span className="stat-label">Total Transactions</span>
            <span className="stat-value">{transactions.length}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Income Count</span>
            <span className="stat-value">{transactions.filter(t => t.type === "income").length}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Expense Count</span>
            <span className="stat-value">{transactions.filter(t => t.type === "expense").length}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Budget Ratio</span>
            <span className="stat-value">
              {totalIncome > 0 ? ((totalExpenses / totalIncome) * 100).toFixed(1) : 0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsSection;
