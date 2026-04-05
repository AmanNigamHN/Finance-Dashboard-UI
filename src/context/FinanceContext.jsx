import React, { createContext, useState, useCallback, useEffect } from "react";
import { mockTransactions } from "../data/mockData";

export const DEFAULT_TRANSACTION_FILTERS = {
  category: "all",
  type: "all",
  searchTerm: "",
  monthFilter: "all",
  amountMin: "",
  amountMax: "",
  dateFrom: "",
  dateTo: "",
  paymentMethod: "all",
};

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
  const [filters, setFilters] = useState(() => ({ ...DEFAULT_TRANSACTION_FILTERS }));
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
      filtered = filtered.filter((tx) => {
        if (!tx.date || tx.date.length < 7) return false;
        if (filters.monthFilter === "thisMonth") {
          const txDate = new Date(tx.date);
          return (
            txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear
          );
        }
        if (filters.monthFilter === "previousMonth") {
          const txDate = new Date(tx.date);
          const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
          const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
          return txDate.getMonth() === prevMonth && txDate.getFullYear() === prevYear;
        }
        if (/^\d{4}-\d{2}$/.test(filters.monthFilter)) {
          return tx.date.slice(0, 7) === filters.monthFilter;
        }
        return true;
      });
    }

    if (filters.amountMin !== "") {
      const min = Number(filters.amountMin);
      if (!Number.isNaN(min)) {
        filtered = filtered.filter((tx) => Number(tx.amount) >= min);
      }
    }

    if (filters.amountMax !== "") {
      const max = Number(filters.amountMax);
      if (!Number.isNaN(max)) {
        filtered = filtered.filter((tx) => Number(tx.amount) <= max);
      }
    }

    if (filters.dateFrom) {
      filtered = filtered.filter((tx) => tx.date >= filters.dateFrom);
    }

    if (filters.dateTo) {
      filtered = filtered.filter((tx) => tx.date <= filters.dateTo);
    }

    if (filters.paymentMethod !== "all") {
      filtered = filtered.filter((tx) => tx.paymentMethod === filters.paymentMethod);
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

  const getPaymentMethods = useCallback(() => {
    const methods = [
      ...new Set(
        transactions.map((tx) => tx.paymentMethod).filter(Boolean)
      ),
    ];
    return methods.sort((a, b) => a.localeCompare(b));
  }, [transactions]);

  const resetFilters = useCallback(() => {
    setFilters({ ...DEFAULT_TRANSACTION_FILTERS });
  }, []);


  const exportToCSV = useCallback(() => {
    const filtered = getFilteredTransactions();
    
    if (filtered.length === 0) {
      alert("No transactions to export");
      return;
    }

    // ISO YYYY-MM-DD avoids Excel mis-reading M/D/Y vs D/M/Y; #### often appears when
    // Excel stores a serial date and the column is too narrow — ISO stays unambiguous.
    const toIsoDateOnly = (raw) => {
      if (typeof raw === "string" && /^\d{4}-\d{2}-\d{2}$/.test(raw.trim())) {
        return raw.trim();
      }
      const d = new Date(raw);
      if (Number.isNaN(d.getTime())) return String(raw);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    };

    const escapeCsvCell = (value) => {
      const s = String(value);
      if (/[",\n\r]/.test(s)) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };

    const headers = ["Date", "Description", "Category", "Amount", "Type"];

    const rows = filtered.map((tx) => [
      toIsoDateOnly(tx.date),
      escapeCsvCell(tx.description),
      escapeCsvCell(tx.category),
      Number(tx.amount).toFixed(2),
      escapeCsvCell(tx.type),
    ]);

    const csvBody = [headers.join(","), ...rows.map((row) => row.join(","))].join("\r\n");
    // UTF-8 BOM helps Excel on Windows detect encoding for descriptions with special characters
    const csvContent = `\uFEFF${csvBody}`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
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
    getPaymentMethods,
    resetFilters,
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