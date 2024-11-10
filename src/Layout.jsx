import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";

const Layout = () => {
  const location = useLocation();

  // Check if the current route is the Expense page
  const isExpensePage = location.pathname === "/expense";

  return (
    <div className="h-full w-full">
      <Navbar />
      <div className={`h-full ${isExpensePage ? "bg-gray-300" : ""}`}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
