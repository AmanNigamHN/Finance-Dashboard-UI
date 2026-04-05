// Mock data for Finance Dashboard, for future developments in project can take real financial data from a backend

export const mockTransactions = [
  {
    id: 1,
    date: "2026-03-31",
    description: "Salary Deposited",
    category: "Income",
    amount: 95000,
    type: "income",
    paymentMethod: "Bank Transfer"
  },
  {
    id: 2,
    date: "2026-04-02",
    description: "Grocery Shopping",
    category: "Food & Groceries",
    amount: 3500,
    type: "expense",
    paymentMethod: "Phonepe"
  },
  {
    id: 3,
    date: "2026-04-02",
    description: "Netflix 1-Month Subscription",
    category: "Entertainment",
    amount: 149,
    type: "expense",
    paymentMethod: "Debit Card"
  },
  {
    id: 4,
    date: "2026-04-03",
    description: "Rapido Bike Ride",
    category: "Transport",
    amount: 150,
    type: "expense",
    paymentMethod: "Phonepe"
  },
  {
    id: 5,
    date: "2026-04-03",
    description: "Freelance project payment",
    category: "Income",
    amount: 20000,
    type: "income",
    paymentMethod: "Bank Transfer"
  },
  {
    id: 6,
    date: "2026-04-04",
    description: "Electricity Bill",
    category: "Utilities",
    amount: 2000,
    type: "expense",
    paymentMethod: "Amazon pay"
  },
  {
    id: 7,
    date: "2026-04-04",
    description: "Restaurant for Dinner",
    category: "Food & Groceries",
    amount: 400,
    type: "expense",
    paymentMethod: "Amazon pay"
  },
  {
    id: 8,
    date: "2026-04-05",
    description: "Running Shoes",
    category: "Health & Fitness",
    amount: 450,
    type: "expense",
    paymentMethod: "Phonepe"
  },
  {
    id: 9,
    date: "2026-04-05",
    description: "Offline Shopping",
    category: "Shopping",
    amount: 1050,
    type: "expense",
    paymentMethod: "Phonepe"
  },
  {
    id: 10,
    date: "2026-04-06",
    description: "Interest Income",
    category: "Income",
    amount: 27,
    type: "income",
    paymentMethod: "Bank Transfer"
  },
  {
    id: 11,
    date: "2026-04-06",
    description: "6-Movie Tickets",
    category: "Entertainment",
    amount: 600,
    type: "expense",
    paymentMethod: "Amazon pay"
  },
  {
    id: 12,
    date: "2026-04-07",
    description: "Mobile Recharge Payment",
    category: "Utilities",
    amount: 349,
    type: "expense",
    paymentMethod: "Phonepe"
  },
  {
    id: 13,
    date: "2026-04-08",
    description: "Online Course",
    category: "Education",
    amount: 2000,
    type: "expense",
    paymentMethod: "Debit Card"
  },
  {
    id: 14,
    date: "2026-04-09",
    description: "Freelance project payment",
    category: "Income",
    amount: 15000,
    type: "income",
    paymentMethod: "Bank Transfer"
  },
  {
    id: 15,
    date: "2026-04-10",
    description: "Bike Petrol",
    category: "Transport",
    amount: 100,
    type: "expense",
    paymentMethod: "Amazon pay"
  },
  {
    id: 16,
    date: "2026-04-10",
    description: "Train Ticket",
    category: "Transport",
    amount: 580,
    type: "expense",
    paymentMethod: "Amazon pay"
  },
  {
    id: 17,
    date: "2026-02-28",
    description: "Salary Deposited",
    category: "Income",
    amount: 95000,
    type: "income",
    paymentMethod: "Bank Transfer"
  },
  {
    id: 18,
    date: "2026-03-05",
    description: "Grocery Shopping March",
    category: "Food & Groceries",
    amount: 3200,
    type: "expense",
    paymentMethod: "Phonepe"
  },
  {
    id: 19,
    date: "2026-03-10",
    description: "Freelance project payment",
    category: "Income",
    amount: 18000,
    type: "income",
    paymentMethod: "Bank Transfer"
  },
  {
    id: 20,
    date: "2026-03-15",
    description: "March Utilities",
    category: "Utilities",
    amount: 2500,
    type: "expense",
    paymentMethod: "Amazon pay"
  },
  {
    id: 21,
    date: "2026-03-20",
    description: "Netflix 1-Month Subscription",
    category: "Entertainment",
    amount: 149,
    type: "expense",
    paymentMethod: "Debit Card"
  }
];


export const getMonthlyBalance = (transactions) => {
  const data = [];
  let balance = 0;
  
  // Transactions are grouped by date and calculate balance
  const grouped = {};
  
  transactions.forEach(tx => {
    const date = tx.date;
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(tx);
  });
  
  Object.keys(grouped).sort().forEach(date => {
    const dayTransactions = grouped[date];
    dayTransactions.forEach(tx => {
      balance += tx.type === 'income' ? tx.amount : -tx.amount;
    });
    data.push({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      balance: balance,
      fullDate: date
    });
  });
  
  return data;
};


export const getCategorySpending = (transactions) => {
  const categoryMap = {};
  
  transactions
    .filter(tx => tx.type === 'expense')
    .forEach(tx => {
      if (!categoryMap[tx.category]) {
        categoryMap[tx.category] = 0;
      }
      categoryMap[tx.category] += tx.amount;
    });
  
  return Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value,
    percentage: 0
  }));
};


export const calculateSummary = (transactions) => {
  let totalBalance = 0;
  let totalIncome = 0;
  let totalExpenses = 0;
  
  transactions.forEach(tx => {
    if (tx.type === 'income') {
      totalIncome += tx.amount;
      totalBalance += tx.amount;
    } else {
      totalExpenses += tx.amount;
      totalBalance -= tx.amount;
    }
  });
  
  return {
    totalBalance,
    totalIncome,
    totalExpenses
  };
};
