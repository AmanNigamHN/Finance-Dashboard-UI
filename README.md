# Finance Dashboard

A simple finance dashboard I made using React. This project shows how to build a basic dashboard with charts, transaction lists, and role-based features.

## What This Project Does

### Main Features
- **Dashboard View**: Shows total money, income, and expenses in cards
- **Charts**: Line chart for balance over time and pie chart for spending by category
- **Transaction List**: Shows all money in/out with details
- **Search & Filter**: Find transactions by name, category, or type
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
- **Context API**: For managing app state

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
- Export data to JSON
- Add more chart types
- Real database integration

