import React, { useMemo, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { useFinance } from "../context/FinanceContext";
import { getMonthlyBalance, getCategorySpending } from "../data/mockData";
import "../styles/Charts.css";

const RECENT_POINT_COUNT = 7;

const formatMonthLabel = (yearMonth) => {
  const [y, m] = yearMonth.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
};

const uniqueYearMonthsFromTransactions = (txs) => {
  const set = new Set();
  txs.forEach((tx) => {
    if (tx.date && tx.date.length >= 7) set.add(tx.date.slice(0, 7));
  });
  return Array.from(set).sort().reverse();
};

const formatBalanceYAxis = (v) => {
  const n = Number(v);
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  if (abs >= 100000) {
    const lakhs = abs / 100000;
    const dec = abs % 100000 === 0 ? 0 : 1;
    return `${sign}₹${lakhs.toFixed(dec)}L`;
  }
  if (abs >= 1000) {
    const k = abs / 1000;
    const dec = abs % 1000 === 0 ? 0 : 1;
    return `${sign}₹${k.toFixed(dec)}k`;
  }
  return `${sign}₹${abs}`;
};

const Charts = () => {
  const { transactions } = useFinance();
  const [balanceMonthKey, setBalanceMonthKey] = useState("recent");

  const fullBalanceSeries = useMemo(
    () => getMonthlyBalance(transactions),
    [transactions]
  );

  const balanceMonthOptions = useMemo(
    () => uniqueYearMonthsFromTransactions(transactions),
    [transactions]
  );

  const balanceChartData = useMemo(() => {
    if (fullBalanceSeries.length === 0) return [];
    if (balanceMonthKey === "recent") {
      return fullBalanceSeries.slice(-RECENT_POINT_COUNT);
    }
    return fullBalanceSeries.filter(
      (row) => row.fullDate && row.fullDate.slice(0, 7) === balanceMonthKey
    );
  }, [fullBalanceSeries, balanceMonthKey]);

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

      <div className="chart-box balance-trend-box">
        <div className="balance-trend-heading">
          <div className="balance-trend-title-block">
            <h3 className="chart-title balance-trend-title">
              <span className="chart-title-rupee" aria-hidden>
                ₹
              </span>
              <span>Balance trend</span>
            </h3>
            <p className="chart-subtitle">
              Running balance trend
              {balanceMonthKey === "recent" && fullBalanceSeries.length > RECENT_POINT_COUNT
                ? ` for showing the latest activity within ${RECENT_POINT_COUNT} days`
                : balanceMonthKey !== "recent"
                  ? ` — ${formatMonthLabel(balanceMonthKey)}`
                  : ""}
            </p>
          </div>
          {fullBalanceSeries.length > 0 && (
            <div className="balance-trend-filter">
              <label className="balance-trend-filter-label" htmlFor="balance-month-filter">
                Days / Month:
              </label>
              <select
                id="balance-month-filter"
                className="balance-trend-select"
                value={balanceMonthKey}
                onChange={(e) => setBalanceMonthKey(e.target.value)}
              >
                <option value="recent">
                  Recent ({Math.min(RECENT_POINT_COUNT, fullBalanceSeries.length)} of{" "}
                  {fullBalanceSeries.length} days)
                </option>
                {balanceMonthOptions.map((ym) => (
                  <option key={ym} value={ym}>
                    {formatMonthLabel(ym)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        {balanceChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={balanceChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={formatBalanceYAxis} width={56} />
              <Tooltip
                contentStyle={{ backgroundColor: "#f9f9f9", border: "1px solid #ccc" }}
                formatter={(value) => [`₹${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, "Balance"]}/>
              
              <Legend />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#2E7D32"
                strokeWidth={2}
                dot={{ fill: "#2E7D32", r: 4 }}
                activeDot={{ r: 6 }}
                name="Balance (₹)"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : fullBalanceSeries.length > 0 ? (
          <p className="no-data">No activity in this month</p>
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