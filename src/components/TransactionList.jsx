import React, { useState, useMemo } from "react";
import { useFinance, DEFAULT_TRANSACTION_FILTERS } from "../context/FinanceContext";
import "../styles/TransactionList.css";

const formatYearMonthLabel = (ym) => {
  const [y, m] = ym.split("-");
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

const TransactionList = () => {
  const {
    transactions,
    getFilteredTransactions,
    filters,
    updateFilters,
    resetFilters,
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
    getCategories,
    getPaymentMethods,
    userRole,
    deleteTransaction,
    editTransaction,
    exportToCSV,
    resetData
  } = useFinance();

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const filteredTransactions = getFilteredTransactions();
  const categories = getCategories();
  const paymentMethods = getPaymentMethods();

  const availableMonths = useMemo(
    () => uniqueYearMonthsFromTransactions(transactions),
    [transactions]
  );

  const advancedActiveCount = useMemo(() => {
    let n = 0;
    if (filters.amountMin !== "") n += 1;
    if (filters.amountMax !== "") n += 1;
    if (filters.dateFrom) n += 1;
    if (filters.dateTo) n += 1;
    if (filters.paymentMethod !== "all") n += 1;
    return n;
  }, [filters]);

  const hasAnyFilterActive = useMemo(
    () =>
      Object.keys(DEFAULT_TRANSACTION_FILTERS).some(
        (key) => filters[key] !== DEFAULT_TRANSACTION_FILTERS[key]
      ),
    [filters]
  );

  const handleEdit = (transaction) => {
    if (userRole !== "admin") {
      alert("Only admins can edit the transactions");
      return;
    }
    setEditingId(transaction.id);
    setEditData({ ...transaction });
  };

  const handleSaveEdit = () => {
    editTransaction(editingId, editData);
    setEditingId(null);
    setEditData({});
  };

  const handleDelete = (id) => {
    if (userRole !== "admin") {
      alert("Only admins can delete transactions");
      return;
    }
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      deleteTransaction(id);
    }
  };

  const handleSortChange = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const toggleSort = (column) => {
    handleSortChange(column);
  };

  return (
    <div className="transaction-section">
      <h2 className="section-title">📝 Transactions</h2>

      <div className="filters-section">
        <div className="filters-section-header">
          <h3 className="filters-section-title">Filters</h3>
          {hasAnyFilterActive && (
            <button
              type="button"
              className="filters-clear-all"
              onClick={() => resetFilters()}
            >
              Clear all
            </button>
          )}
        </div>

        <div className="filters-container">
          <div className="filter-group">
            <label htmlFor="search">🔍 Search</label>
            <input
              id="search"
              type="text"
              placeholder="Description or category…"
              value={filters.searchTerm}
              onChange={(e) => updateFilters({ searchTerm: e.target.value })}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="category">📂 Category</label>
            <select
              id="category"
              value={filters.category}
              onChange={(e) => updateFilters({ category: e.target.value })}
              className="filter-select"
            >
              <option value="all">All categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="type">💳 Type</label>
            <select
              id="type"
              value={filters.type}
              onChange={(e) => updateFilters({ type: e.target.value })}
              className="filter-select"
            >
              <option value="all">All types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="month">📅 Month</label>
            <select
              id="month"
              value={filters.monthFilter}
              onChange={(e) => updateFilters({ monthFilter: e.target.value })}
              className="filter-select"
            >
              <option value="all">All months</option>
              <option value="thisMonth">This month</option>
              <option value="previousMonth">Previous month</option>
              {availableMonths.length > 0 && (
                <optgroup label="Months in your data">
                  {availableMonths.map((ym) => (
                    <option key={ym} value={ym}>
                      {formatYearMonthLabel(ym)}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>
        </div>

        <button
          type="button"
          className={`advanced-filters-toggle ${advancedOpen ? "is-open" : ""}`}
          onClick={() => setAdvancedOpen((o) => !o)}
          aria-expanded={advancedOpen}
        >
          <span>Advanced filters</span>
          {advancedActiveCount > 0 && (
            <span className="filter-active-badge">{advancedActiveCount}</span>
          )}
          <span className="advanced-filters-chevron" aria-hidden>
            ▼
          </span>
        </button>

        {advancedOpen && (
          <div className="advanced-filters-panel">
            <p className="advanced-filters-hint">
              Narrow further by amount, custom date range, or payment method. These combine with the
              filters above.
            </p>
            <div className="advanced-filters-grid">
              <div className="filter-group">
                <label htmlFor="amount-min">Min amount (₹)</label>
                <input
                  id="amount-min"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="No minimum"
                  value={filters.amountMin}
                  onChange={(e) => updateFilters({ amountMin: e.target.value })}
                  className="filter-input"
                />
              </div>
              <div className="filter-group">
                <label htmlFor="amount-max">Max amount (₹)</label>
                <input
                  id="amount-max"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="No maximum"
                  value={filters.amountMax}
                  onChange={(e) => updateFilters({ amountMax: e.target.value })}
                  className="filter-input"
                />
              </div>
              <div className="filter-group">
                <label htmlFor="date-from">From date</label>
                <input
                  id="date-from"
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => updateFilters({ dateFrom: e.target.value })}
                  className="filter-input"
                />
              </div>
              <div className="filter-group">
                <label htmlFor="date-to">To date</label>
                <input
                  id="date-to"
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => updateFilters({ dateTo: e.target.value })}
                  className="filter-input"
                />
              </div>
              <div className="filter-group filter-group-span-2">
                <label htmlFor="payment-method">Payment method</label>
                <select
                  id="payment-method"
                  value={filters.paymentMethod}
                  onChange={(e) => updateFilters({ paymentMethod: e.target.value })}
                  className="filter-select"
                >
                  <option value="all">All methods</option>
                  {paymentMethods.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="advanced-filters-actions">
              <button
                type="button"
                className="advanced-filters-clear-btn"
                onClick={() => resetFilters()}
                disabled={!hasAnyFilterActive}
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>


      {userRole === "admin" && (
        <div className="admin-actions">
          <button 
            className="add-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "✕ Cancel" : "➕ Add Transaction"}
          </button>
          <button 
            className="export-btn"
            onClick={() => exportToCSV()}
            title="Export transactions to CSV"
          >
            📥 Export CSV
          </button>
          <button 
            className="reset-btn"
            onClick={() => resetData()}
            title="Reset to default data"
          >
            🔄 Reset Data
          </button>
        </div>
      )}


      {showForm && userRole === "admin" && (
        <AddTransactionForm setShowForm={setShowForm} />
      )}


      <div className="transactions-table-container">
        {filteredTransactions.length > 0 ? (
          <table className="transactions-table">
            <thead>
              <tr>
                <th onClick={() => toggleSort('date')} className="sortable">
                  📅 Date {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th>📝 Description</th>
                <th>📂 Category</th>
                <th onClick={() => toggleSort('amount')} className="sortable">
                  ₹ Amount {sortBy === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th>💳 Type</th>
                {userRole === "admin" && <th>⚙️ Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(transaction => (
                <tr key={transaction.id} className={`row-${transaction.type}`}>
                  {editingId === transaction.id ? (
                    <>
                      <td>
                        <input
                          type="date"
                          value={editData.date}
                          onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                          className="edit-input"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={editData.description}
                          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                          className="edit-input"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={editData.category}
                          onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                          className="edit-input"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={editData.amount}
                          onChange={(e) => setEditData({ ...editData, amount: parseFloat(e.target.value) })}
                          className="edit-input"
                        />
                      </td>
                      <td>{editData.type}</td>
                      <td>
                        <button className="save-btn" onClick={handleSaveEdit}>Save</button>
                        <button className="cancel-btn" onClick={() => setEditingId(null)}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="date-cell">
                        {new Date(transaction.date).toLocaleDateString('en-US', {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </td>
                      <td className="description-cell">{transaction.description}</td>
                      <td className="category-cell">
                        <span className="category-badge">{transaction.category}</span>
                      </td>
                      <td className={`amount-cell ${transaction.type}`}>
                        {transaction.type === "income" ? "+" : "-"}₹{transaction.amount.toFixed(2)}
                      </td>
                      <td className="type-cell">
                        <span className={`type-badge ${transaction.type}`}>
                          {transaction.type === "income" ? "📈 Income" : "📉 Expense"}
                        </span>
                      </td>
                      {userRole === "admin" && (
                        <td className="actions-cell">
                          <button
                            className="edit-btn"
                            onClick={() => handleEdit(transaction)}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(transaction.id)}
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </td>
                      )}
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-transactions">
            <p> No transactions found. Try again with adjusting your filters.</p>
          </div>
        )}
      </div>


      <div className="transactions-footer">
        <p>Showing <strong>{filteredTransactions.length}</strong> transaction(s)</p>
      </div>
    </div>
  );
};


const AddTransactionForm = ({ setShowForm }) => {
  const { addTransaction, getCategories } = useFinance();
  const [formData, setFormData] = useState({
    description: '',
    category: "Food & Groceries",
    amount: '',
    type: "expense",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "Online Payment"
  });

  const categories = getCategories();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) {
      alert("Please fill in all fields");
      return;
    }
    addTransaction({
      ...formData,
      amount: parseFloat(formData.amount)
    });
    setFormData({
      description: '',
      category: "Food & Groceries",
      amount: '',
      type: "expense",
      date: new Date().toISOString().split("T")[0],
      paymentMethod: "Online Payment"
    });
    setShowForm(false);
  };

  return (
    <form className="add-transaction-form" onSubmit={handleSubmit}>
      <h3>➕ Add New Transaction</h3>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="form-date">Date</label>
          <input
            id="form-date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="form-type">Type</label>
          <select
            id="form-type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group full-width">
          <label htmlFor="form-desc">Description</label>
          <input
            id="form-desc"
            type="text"
            placeholder="Enter transaction description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="form-category">Category</label>
          <select
            id="form-category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="form-amount">Amount (₹)</label>
          <input
            id="form-amount"
            type="number"
            placeholder="0.00"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-btn">✓ Add Transaction</button>
        <button
          type="button"
          className="cancel-form-btn"
          onClick={() => setShowForm(false)}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TransactionList;