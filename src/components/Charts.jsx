import React from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { useFinance } from "../context/FinanceContext";
import { getMonthlyBalance, getCategorySpending } from "../data/mockData";
import "../styles/Charts.css";

const Charts = () => {
  const { transactions } = useFinance();
  
  const monthlyData = getMonthlyBalance(transactions);
  const categoryData = getCategorySpending(transactions);
  

  const totalSpent = categoryData.reduce((sum, cat) => sum + cat.value, 0);
  const categoryDataWithPercentage = categoryData.map(cat => ({
    ...cat,
    percentage: totalSpent > 0 ? ((cat.value / totalSpent) * 100).toFixed(1) : 0
  }));


  const COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8B195'
  ];

  return (
    <div className="charts-container">

      <div className="chart-box">
        <h3 className="chart-title">💹 Balance Trend</h3>
        <p className="chart-subtitle">Your Amount balance related over time</p>
        {monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                contentStyle={{ backgroundColor: '#f9f9f9', border: '1px solid #ccc' }}
                formatter={(value) => `₹${value.toFixed(2)}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#2E7D32"
                strokeWidth={2}
                dot={{ fill: '#2E7D32', r: 4 }}
                activeDot={{ r: 6 }}
                name="Balance"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="no-data">No balance data available</p>
        )}
      </div>


      <div className="chart-box">
        <h3 className="chart-title">📊 Spending Breakdown</h3>
        <p className="chart-subtitle">All expenses by category</p>
        {categoryDataWithPercentage.length > 0 ? (
          <div className="category-breakdown">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryDataWithPercentage}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryDataWithPercentage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `₹${value.toFixed(2)}`}
                  contentStyle={{ backgroundColor: '#f9f9f9', border: '1px solid #ccc' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="category-list">
              {categoryDataWithPercentage.map((cat, index) => (
                <div key={cat.name} className="category-item">
                  <div 
                    className="category-color"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <div className="category-info">
                    <span className="category-name">{cat.name}</span>
                    <span className="category-amount">₹{cat.value.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="no-data">No expense data available</p>
        )}
      </div>
    </div>
  );
};

export default Charts;
