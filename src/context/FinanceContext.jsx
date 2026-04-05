import React, { createContext, useState, useCallback, useEffect } from "react";
import { mockTransactions } from "../data/mockData";


export const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {

  // Load all the transactions from localStorage or from mock data
  const getInitialTransactions = () => {
    try {
      const saved = localStorage.getItem("financeTransactions");
      return saved ? JSON.parse(saved) : mockTransactions;
    } catch {
      return mockTransactions;
    }
  };

  const getInitialDarkMode = () => {
    try {
      const saved = localStorage.getItem("darkMode");
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  };

  const [transactions, setTransactions] = useState(getInitialTransactions());
  const [userRole, setUserRole] = useState("viewer");
  const [isDarkMode, setIsDarkMode] = useState(getInitialDarkMode());
  const [filters, setFilters] = useState({
    category: "all",
    type: "all",
    searchTerm: '',
    monthFilter: "all"
  });
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");


  
  useEffect(() => {
    localStorage.setItem("financeTransactions", JSON.stringify(transactions));
  }, [transactions]);


  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [isDarkMode]);


  const getFilteredTransactions = useCallback(() => {
    let filtered = [...transactions];


    if (filters.category !== "all") {
      filtered = filtered.filter(tx => tx.category === filters.category);
    }


    if (filters.type !== "all") {
      filtered = filtered.filter(tx => tx.type === filters.type);
    }


    if (filters.searchTerm) {
      const search = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        tx =>
          tx.description.toLowerCase().includes(search) ||
          tx.category.toLowerCase().includes(search)
      );
    }


    if (filters.monthFilter !== "all") {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      filtered = filtered.filter(tx => {
        const txDate = new Date(tx.date);
        const txMonth = txDate.getMonth();
        const txYear = txDate.getFullYear();
        if (filters.monthFilter === "thisMonth") {
          return txMonth === currentMonth && txYear === currentYear;
        } else if (filters.monthFilter === "previousMonth") {
          const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
          const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
          return txMonth === prevMonth && txYear === prevYear;
        }
        return true;
      });
    }


    filtered.sort((a, b) => {
      let compareValue = 0;

      if (sortBy === "date") {
        compareValue = new Date(a.date) - new Date(b.date);
      } else if (sortBy === "amount") {
        compareValue = a.amount - b.amount;
      }

      return sortOrder === "desc" ? -compareValue : compareValue;
    });

    return filtered;
  }, [transactions, filters, sortBy, sortOrder]);


  const addTransaction = useCallback((transaction) => {
    if (userRole !== "admin") {
      alert("Only admins can add transactions");
      return;
    }

    const newTransaction = {
      ...transaction,
      id: Math.max(...transactions.map(t => t.id), 0) + 1
    };

    setTransactions([...transactions, newTransaction]);
  }, [transactions, userRole]);


  const editTransaction = useCallback((id, updatedData) => {
    if (userRole !== "admin") {
      alert("Only admins can edit the transactions");
      return;
    }

    setTransactions(transactions.map(tx => 
      tx.id === id ? { ...tx, ...updatedData } : tx
    ));
  }, [transactions, userRole]);


  const deleteTransaction = useCallback((id) => {
    if (userRole !== "admin") {
      alert("Only admins can delete transactions");
      return;
    }

    setTransactions(transactions.filter(tx => tx.id !== id));
  }, [transactions, userRole]);


  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);


  const getCategories = useCallback(() => {
    const categories = [...new Set(transactions.map(tx => tx.category))];
    return categories.sort();
  }, [transactions]);


  const exportToCSV = useCallback(() => {
    const filtered = getFilteredTransactions();
    
    if (filtered.length === 0) {
      alert("No transactions to export");
      return;
    }


    const headers = ["Date", "Description", "Category", "Amount", "Type"];
    

    const rows = filtered.map(tx => [
      new Date(tx.date).toLocaleDateString('en-US'),
      `"${tx.description}"`,
      tx.category,
      tx.amount.toFixed(2),
      tx.type
    ]);


    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');


    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  }, [getFilteredTransactions]);


  const resetData = useCallback(() => {
    if (window.confirm("Are you sure you want to reset all transactions to default? This cannot be undone.")) {
      setTransactions(mockTransactions);
      localStorage.removeItem("financeTransactions");
    }
  }, []);

  const value = {
    // State

    transactions,
    userRole,
    filters,
    sortBy,
    sortOrder,
    isDarkMode,

    // Methods

    setUserRole,
    getFilteredTransactions,
    addTransaction,
    editTransaction,
    deleteTransaction,
    updateFilters,
    setSortBy,
    setSortOrder,
    getCategories,
    setIsDarkMode,
    exportToCSV,
    resetData
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};


export const useFinance = () => {
  const context = React.useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance must be used within FinanceProvider");
  }
  return context;
};
