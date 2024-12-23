import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Provider } from 'react-redux'
import appStore from './utils/appStore.js'

const Layout = () => {
  const location = useLocation();

  // Check if the current route is the Expense page
  const isExpensePage = location.pathname === "/expense";

  return (
    <div className="h-full w-full">
      <Provider store={appStore}>
        <Navbar />
      </Provider>
      <div className={`h-full ${isExpensePage ? "bg-gray-100" : ""}`}>
        <Provider store={appStore}>
          <Outlet />
        </Provider>
      </div>
    </div >
  );
};

export default Layout;
