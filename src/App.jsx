import { useContext } from "react";
import { FinanceProvider } from "./context/FinanceContext";
import Dashboard from "./components/Dashboard";
import "./App.css";


function App() {
  return (
    <FinanceProvider>
      <Dashboard />
    </FinanceProvider>
  );
}

export default App;
