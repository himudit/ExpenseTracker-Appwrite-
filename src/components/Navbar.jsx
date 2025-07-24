import React, { useEffect, useState, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
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
  const searchRef = useRef(null);

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
        <div className="fixed top-0 left-0 h-full w-24 bg-white border-r border-gray-300 flex flex-col items-center py-4">
          <div
            className="mb-8 flex flex-col items-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={Logo} alt="Logo" className="w-9 object-contain" />
            <div className="mt-2 text-xs font-bold">ExpenseMate</div>
          </div>

          <div className="flex flex-col items-center space-y-8">
            <NavLink
              aria-label="Navigate to Home"
              to="/"
              className={({ isActive }) =>
                isActive ? 'bg-gray-300 text-center text-black rounded-full w-16 h-9 flex items-center justify-center' : 'text-gray-300 hover:bg-lime-green w-11.4 h-11 hover:text-black px-4 py-2 rounded-full'
              }
            >
              <FontAwesomeIcon icon={faHouse} />
            </NavLink>

            <NavLink
              aria-label="Add Transactions"
              to="/add"
              className={({ isActive }) =>
                isActive ? 'bg-gray-300 text-center text-black rounded-full w-16 h-9 flex items-center justify-center' : 'text-gray-400 hover:bg-lime-green w-11.4 h-11 hover:text-black px-4 py-2 rounded-full'
              }
            >
              <FontAwesomeIcon icon={faPlus} />
            </NavLink>

            <NavLink
              aria-label="Recurring Transactions"
              to="/recurring"
              className={({ isActive }) =>
                isActive ? 'bg-gray-300 text-center text-black rounded-full w-16 h-9 flex items-center justify-center' : 'text-gray-400 hover:bg-lime-green w-11.4 h-11 hover:text-black px-4 py-2 rounded-full'
              }
            >
              {/* <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-repeat-icon lucide-repeat"><path d="m17 2 4 4-4 4" /><path d="M3 11v-1a4 4 0 0 1 4-4h14" /><path d="m7 22-4-4 4-4" /><path d="M21 13v1a4 4 0 0 1-4 4H3" /></svg> */}
              <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wallet-icon lucide-wallet"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" /><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" /></svg>
            </NavLink>

            {userContext ? (
              <button
                aria-label="Log out your account"
                className={`rounded-full w-16 h-9 px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black
                    ${clicked ? "bg-blue-300" : "bg-blue-300 hover:bg-blue-300"}`}
                onClick={() => {
                  setClicked(true);
                  handleLogout();
                }}
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
              </button>
            ) : (
              <>
                <NavLink
                  aria-label="Navigate to Login"
                  to="/login"
                  className="rounded-full bg-lime-green px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-lime-green/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                >
                  Login
                </NavLink>
                <NavLink
                  aria-label="Navigate to Signup"
                  to="/signup"
                  className="rounded-full bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ---------------------------- MOBILE NAVBAR ---------------------------- */}
      <div className="block md:hidden">
        <div className="flex justify-between items-center px-4 py-3">
          <button onClick={toggleMenu} aria-label="Toggle navigation">
            <FontAwesomeIcon icon={faBars} className="text-xl" />
          </button>
          <img
            src={Logo}
            alt="Logo"
            className="w-9 object-contain cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>

        <div
          className={`fixed top-0 left-0 h-full w-64 bg-white text-black transform ${isOpen ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-300 ease-in-out shadow-lg z-50`}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <img
              src={Logo}
              alt="Logo"
              className="w-9 object-contain cursor-pointer"
              onClick={() => {
                navigate("/");
                toggleMenu();
              }}
            />
            <button onClick={toggleMenu} aria-label="Go to home page">
              <FontAwesomeIcon icon={faXmark} className="text-xl" />
            </button>
          </div>

          <div className="p-6 flex flex-col gap-4">
            <NavLink
              aria-label="Navigate to Home"
              to="/"
              onClick={toggleMenu}
              className="text-black hover:text-lime-600 font-medium"
            >
              Home
            </NavLink>

            <NavLink
              aria-label="Add Transactions"
              to="/add"
              onClick={toggleMenu}
              className="text-black hover:text-lime-600 font-medium"
            >
              Add Expense
            </NavLink>

            <NavLink
              aria-label="Recurring Transactions"
              to="/recurring"
              className={({ isActive }) =>
                isActive ? 'bg-gray-300 text-center text-black rounded-full w-16 h-9 flex items-center justify-center' : 'text-gray-400 hover:bg-lime-green w-11.4 h-11 hover:text-black px-4 py-2 rounded-full'
              }
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wallet-icon lucide-wallet"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" /><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" /></svg>
            </NavLink>

            {userContext ? (
              <button
                aria-label="Login to your account"
                onClick={() => {
                  toggleMenu();
                  handleLogout();
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-full font-medium"
              >
                Logout
              </button>
            ) : (
              <>
                <NavLink
                  aria-label="Navigate to Login"
                  to="/login"
                  onClick={toggleMenu}
                  className="bg-lime-400 text-black px-4 py-2 rounded-full font-medium"
                >
                  Login
                </NavLink>
                <NavLink
                  aria-label="Navigate to Signup"
                  to="/signup"
                  onClick={toggleMenu}
                  className="bg-black text-white px-4 py-2 rounded-full font-medium"
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>

        {isOpen && (
          <div
            onClick={toggleMenu}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
