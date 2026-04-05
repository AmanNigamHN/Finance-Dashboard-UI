# Finance Dashboard

A simple finance dashboard I made using React & JavaScript. This project shows how to build a basic dashboard with charts, transaction lists, advance filtering and role-based features.

## What This Project Does

### Main Features
- **Dashboard View**: Shows total money, income, and expenses in cards
- **Charts**: Line chart for balance over time and pie chart for spending by category
- **Chart Trend Filter**: View your balance trends for the recent 7 days or pick any specific month to see how your money changed over that days / month
- **Transaction List**: Shows all money in/out with details
- **Search & Filter**: Find transactions by name, category, or type with easy-to-use filters
- **Advanced Filtering**: Fine-tune your transaction view with multiple filter options including date ranges, amount ranges, and custom search criteria
- **Sort**: Order transactions by date or amount
- **Role System**: Two modes - Viewer (can only see) and Admin (can add/edit/delete)

### Extra Features
- **Insights**: Shows spending patterns and statistics
- **Responsive**: Works on phone and computer
- **Dark Mode**: Toggle between light and dark themes

## How to Run This Project

### What You Need
- Node.js installed on your computer
- npm (comes with Node.js)

### Steps to Run

1. **Open the project folder**
   ```bash
   cd Finance-Dashboard-UI
   ```

2. **Install packages**
   ```bash
   npm install
   ```

3. **Start the app**
   ```bash
   npm run dev
   ```

   The app will open at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

## Project Structure

```
src/
├── components/          # All the UI parts
│   ├── Dashboard.jsx    # Main page
│   ├── Charts.jsx       # Charts for data
│   ├── TransactionList.jsx  # List of transactions
│   └── ...
├── context/             # State management
├── data/               # Sample data
├── styles/             # CSS files
└── App.jsx            # Main app file
```

## Technologies Used

- **React**: For building the UI
- **Vite**: For fast development
- **Recharts**: For making charts
- **CSS**: For styling
- **Context Management**: For managing app state

## How I Built This

### Approach
1. **Planning**: Drew simple wireframes on paper
2. **Components**: Broke down UI into small reusable parts
3. **State**: Used React Context to share data between components
4. **Styling**: Made it look nice with CSS and responsive design
5. **Features**: Added filtering, sorting, and role-based access

### Challenges I Faced
- Making the charts work properly
- Implementing the role system
- Making it responsive for mobile
- Managing state across components

## How to Use

### Basic Usage
1. App opens directly to dashboard (no login needed)
2. Switch between Viewer and Admin roles
3. View charts and transaction data
4. Search and filter transactions

### Admin Features
- Click "Add Transaction" to add new entries
- Click edit icon to change transactions
- Click delete icon to remove transactions
- Export your transaction data to CSV for record keeping
- Reset to default data if you want to start fresh

## Detailed Feature Guide

### Advanced Filtering
You'll see an "Advanced filters" button below the basic filters. This powerful feature lets you:

- **Filter by Amount Range**: Set minimum and maximum amounts to see only transactions within that range
- **Filter by Multiple Dates**: Pick specific date ranges to analyze spending patterns in particular month
- **Combine Multiple Filters**: Use several filters together to pinpoint exactly what you're looking for
- **Clear All Filters**: One-click reset to remove all active filters and start fresh

Simply click the "Advanced filters" button to expand the options, set your criteria, and the transaction list updates instantly.

### Chart Trend Filter by Month
The Balance Trend chart has a smart days / month selector that makes it easy to analyze your financial journey:

- **Recent View**: By default, it shows your last 7 days of activity so you can see your recent spending and earning patterns
- **Monthly View**: Click the "Days / Month" dropdown to select any month from your transaction history
- **See the Full Picture**: Each view shows running balance changes day by day within that month, so you can spot trends and understand when your money goes up or down

For example, you could check last month to see if you spent more in the beginning or end of the month, or compare this month to previous months to track your savings progress.

## Sample Data

The app comes with sample transactions including:
- Salary income
- Food expenses
- Transport costs
- Entertainment spending
- And more...

## What I Learned

This project helped me learn:
- React components and hooks
- State management with Context
- CSS Grid and Flexbox
- Chart libraries
- Responsive design
- Basic role-based UI

## Future Ideas

- Add budget planning
- Mock API Integration to Send Alert to Users
- Add more chart types
- Real database integration

