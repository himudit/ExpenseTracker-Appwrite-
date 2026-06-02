import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faHouse,
  faRightFromBracket,
  faBars,
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { account } from "../appwrite/appwriteConfig";
import { fetchUserProfile, removeUser } from "../utils/userSlice";
import Logo from "../assets/wallet.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [clicked, setClicked] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userContext = useSelector((store) => store.user.user);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      dispatch(removeUser());
      navigate("/login");
    } catch (error) {
      // console.log("Logout failed:", error);
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="relative z-50">
      {/* ---------------------------- DESKTOP SIDEBAR ---------------------------- */}
      <div className="hidden md:flex">
        <div className="fixed top-0 left-0 h-full w-24 bg-white border-r border-gray-100 flex flex-col items-center py-4">
          <div
            className="mb-8 flex flex-col items-center cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <img src={Logo} alt="Logo" className="w-9 object-contain group-hover:scale-110 transition-transform" />
            <div className="mt-2 text-[10px] font-bold text-gray-800">ExpenseMate</div>
          </div>

          <div className="flex flex-col items-center space-y-8">
            <NavLink
              aria-label="Navigate to Home"
              to="/"
              className={({ isActive }) =>
                isActive ? 'bg-blue-600 text-white rounded-2xl w-12 h-12 flex items-center justify-center shadow-lg shadow-blue-200 transition-all' : 'text-gray-400 hover:bg-blue-50 hover:text-blue-600 w-12 h-12 flex items-center justify-center rounded-2xl transition-all'
              }
            >
              <FontAwesomeIcon icon={faHouse} className="text-lg" />
            </NavLink>

            <NavLink
              aria-label="Add Transactions"
              to="/add"
              className={({ isActive }) =>
                isActive ? 'bg-blue-600 text-white rounded-2xl w-12 h-12 flex items-center justify-center shadow-lg shadow-blue-200 transition-all' : 'text-gray-400 hover:bg-blue-50 hover:text-blue-600 w-12 h-12 flex items-center justify-center rounded-2xl transition-all'
              }
            >
              <FontAwesomeIcon icon={faPlus} className="text-lg" />
            </NavLink>

            <NavLink
              aria-label="Recurring Transactions"
              to="/recurring"
              className={({ isActive }) =>
                isActive ? 'bg-blue-600 text-white rounded-2xl w-12 h-12 flex items-center justify-center shadow-lg shadow-blue-200 transition-all' : 'text-gray-400 hover:bg-blue-50 hover:text-blue-600 w-12 h-12 flex items-center justify-center rounded-2xl transition-all'
              }
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wallet"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" /><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" /></svg>
            </NavLink>

            <NavLink
              aria-label="AI"
              to="/assistant"
              className={({ isActive }) =>
                isActive ? 'bg-blue-600 text-white rounded-2xl w-12 h-12 flex items-center justify-center shadow-lg shadow-blue-200 transition-all' : 'text-gray-400 hover:bg-blue-50 hover:text-blue-600 w-12 h-12 flex items-center justify-center rounded-2xl transition-all'
              }
            >
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="70" height="70" viewBox="0 0 48 48">
                <path fill="#2196f3" d="M23.426,31.911l-1.719,3.936c-0.661,1.513-2.754,1.513-3.415,0l-1.719-3.936	c-1.529-3.503-4.282-6.291-7.716-7.815l-4.73-2.1c-1.504-0.668-1.504-2.855,0-3.523l4.583-2.034	c3.522-1.563,6.324-4.455,7.827-8.077l1.741-4.195c0.646-1.557,2.797-1.557,3.443,0l1.741,4.195	c1.503,3.622,4.305,6.514,7.827,8.077l4.583,2.034c1.504,0.668,1.504,2.855,0,3.523l-4.73,2.1	C27.708,25.62,24.955,28.409,23.426,31.911z"></path><path fill="#7e57c2" d="M38.423,43.248l-0.493,1.131c-0.361,0.828-1.507,0.828-1.868,0l-0.493-1.131	c-0.879-2.016-2.464-3.621-4.44-4.5l-1.52-0.675c-0.822-0.365-0.822-1.56,0-1.925l1.435-0.638c2.027-0.901,3.64-2.565,4.504-4.65	l0.507-1.222c0.353-0.852,1.531-0.852,1.884,0l0.507,1.222c0.864,2.085,2.477,3.749,4.504,4.65l1.435,0.638	c0.822,0.365,0.822,1.56,0,1.925l-1.52,0.675C40.887,39.627,39.303,41.232,38.423,43.248z"></path>
              </svg>
            </NavLink>

            {userContext ? (
              <button
                aria-label="Log out your account"
                className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center active:scale-95"
                onClick={() => {
                  setClicked(true);
                  handleLogout();
                }}
              >
                <FontAwesomeIcon icon={faRightFromBracket} className="text-lg" />
              </button>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <NavLink
                  aria-label="Navigate to Login"
                  to="/login"
                  className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-md hover:bg-blue-600 transition-all active:scale-95"
                >
                  <span className="text-[10px] font-bold">LOG</span>
                </NavLink>
                <NavLink
                  aria-label="Navigate to Signup"
                  to="/signup"
                  className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-md hover:bg-gray-800 transition-all active:scale-95"
                >
                  <span className="text-[10px] font-bold">SIGN</span>
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---------------------------- MOBILE NAVBAR ---------------------------- */}
      <div className="block md:hidden">
        <div className="flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0">
          <button
            onClick={toggleMenu}
            aria-label="Toggle navigation"
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
          >
            <FontAwesomeIcon icon={faBars} className="text-xl text-gray-700" />
          </button>
          <img
            src={Logo}
            alt="Logo"
            className="w-10 h-10 object-contain cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate("/")}
          />
          <div className="w-10"></div> {/* Spacer for symmetry */}
        </div>

        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full w-[280px] bg-white transform ${isOpen ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-2xl z-[60] flex flex-col`}
        >
          {/* Sidebar Header */}
          <div className="p-6 flex justify-between items-center border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-xl">
                <img src={Logo} alt="Logo" className="w-6 h-6 object-contain" />
              </div>
              <span className="font-bold text-lg tracking-tight text-gray-800">ExpenseMate</span>
            </div>
            <button
              onClick={toggleMenu}
              aria-label="Close menu"
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
            >
              <FontAwesomeIcon icon={faXmark} className="text-xl" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
            <NavLink
              to="/"
              onClick={toggleMenu}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                  ? "bg-blue-50 text-blue-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <FontAwesomeIcon icon={faHouse} className="text-lg opacity-80 group-hover:scale-110 transition-transform" />
              <span>Home</span>
            </NavLink>

            <NavLink
              to="/add"
              onClick={toggleMenu}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                  ? "bg-blue-50 text-blue-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <FontAwesomeIcon icon={faPlus} className="text-lg opacity-80 group-hover:scale-110 transition-transform" />
              <span>Add Expense</span>
            </NavLink>

            <NavLink
              to="/recurring"
              onClick={toggleMenu}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                  ? "bg-blue-50 text-blue-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <div className="w-[18px] flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wallet"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" /><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" /></svg>
              </div>
              <span>Recurring</span>
            </NavLink>
            {userContext && (
              <button
                onClick={() => {
                  toggleMenu();
                  handleLogout();
                }}
                className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group text-slate-600 hover:text-rose-600 hover:bg-rose-50/80 active:scale-95 mt-4 border-t border-gray-50 pt-6"
              >
                <div className="w-6 h-6 flex items-center justify-center rounded-lg bg-rose-50 text-rose-500 group-hover:bg-rose-100 transition-colors">
                  <FontAwesomeIcon icon={faRightFromBracket} className="text-sm" />
                </div>
                <span className="font-medium">Logout</span>
              </button>
            )}
          </div>
        </div>

        {/* Backdrop */}
        {isOpen && (
          <div
            onClick={toggleMenu}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 transition-opacity duration-500"
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
