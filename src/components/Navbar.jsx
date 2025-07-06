// import React, { useEffect, useState } from 'react'
// import { Link, NavLink } from 'react-router-dom'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { useNavigate } from 'react-router-dom';
// import { faPlus } from '@fortawesome/free-solid-svg-icons'
// import { faHouse } from '@fortawesome/free-solid-svg-icons';
// import { faSearch, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
// import Logo from '../assets/wallet.png';
// import { databases, account, storage } from '../appwrite/appwriteConfig';
// import conf from '../conf/conf';
// import { useDispatch, useSelector } from 'react-redux'
// import { setUser, removeUser } from '../utils/userSlice'
// import { fetchUserProfile } from "../utils/userSlice";

// function Navbar() {
//   const navigate = useNavigate();
//   const userContext = useSelector((store) => store.user.user)
//   const dispatch = useDispatch();
//   const [clicked, setClicked] = useState(false);

//   useEffect(() => {
//     dispatch(fetchUserProfile());
//   }, [dispatch]);

//   const handleLogout = async () => {
//     try {
//       await account.deleteSession("current"); // Ends user session
//       dispatch(removeUser()); // Remove user from Redux
//       // setUserDetails(null); // Clear local state
//       navigate("/login"); // Redirect to login
//     } catch (error) {
//       console.log("Logout failed:", error);
//     }
//   };


//   return (
//     <>
//       {/* <div className="fixed top-0 left-0 h-full w-25 bg-dark-white flex flex-col items-center py-4 border-r-2 border-gray-300 bg-white">

//         <div className="mb-8 flex flex-col items-center cursor-pointer" onClick={() => {
//           navigate('/');
//         }}>
//           <img
//             src={Logo}
//             className="w-9 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl object-contain"
//             alt="Logo"
//           />
//           <div className="mt-4 ml-1 font-bold" style={{ fontSize: '0.8rem' }}>
//             ExpenseMate
//           </div>
//         </div>

//         <div className="flex flex-col items-center space-y-8">
//           <NavLink
//             to="/"
//             className={({ isActive }) =>
//               isActive ? 'bg-gray-300 text-center text-black rounded-full w-16 h-9 flex items-center justify-center' : 'text-gray-300 hover:bg-lime-green w-11.4 h-11 hover:text-black px-4 py-2 rounded-full'
//             }
//           >
//             <FontAwesomeIcon icon={faHouse} />
//           </NavLink>

//           <NavLink
//             to="/expense"
//             className={({ isActive }) =>
//               isActive ? 'bg-gray-300 text-center text-black rounded-full w-16 h-9 flex items-center justify-center' : 'text-gray-400 hover:bg-lime-green w-11.4 h-11 hover:text-black px-4 py-2 rounded-full'
//             }
//           >
//             <FontAwesomeIcon icon={faPlus} />
//           </NavLink>

//           {
//             userContext ?
//               <div>
//                 <button
//                   className={`rounded-full w-16 h-9 px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black
//         ${clicked ? "bg-blue-300" : "bg-blue-300 hover:bg-blue-300"}`}
//                   onClick={() => {
//                     setClicked(true);
//                     handleLogout();
//                   }}
//                 >
//                   <FontAwesomeIcon icon={faRightFromBracket} />
//                 </button>
//               </div>
//               : <NavLink
//                 to="/login"
//                 className="rounded-full bg-lime-green px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-lime-green/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
//               >
//                 Login
//               </NavLink>
//           }

//           {userContext ? <></> :
//             <NavLink
//               to="/signup"
//               className="rounded-full bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
//             >
//               Sign Up
//             </NavLink>}
//         </div>
//       </div > */}


//       <nav className="relative z-50">
//         {/* ---------------------------- DESKTOP SIDEBAR (shown on md and above) ---------------------------- */}
//         <div className="hidden md:flex">
//           <div className="fixed top-0 left-0 h-full w-24 bg-white border-r border-gray-300 flex flex-col items-center py-4">

//             {/* Logo */}
//             <div className="mb-8 cursor-pointer flex flex-col items-center" onClick={() => navigate('/')}>
//               <img src={Logo} alt="Logo" className="w-9 object-contain" />
//               <div className="mt-2 text-xs font-bold">ExpenseMate</div>
//             </div>

//             {/* Sidebar Nav Icons */}
//             <div className="flex flex-col items-center space-y-8">
//               <NavLink to="/" className={({ isActive }) =>
//                 isActive
//                   ? 'bg-gray-300 text-black rounded-full w-10 h-10 flex items-center justify-center'
//                   : 'text-gray-400 hover:bg-lime-400 w-10 h-10 hover:text-black flex items-center justify-center rounded-full'}>
//                 <FontAwesomeIcon icon={faHouse} />
//               </NavLink>

//               <NavLink to="/expense" className={({ isActive }) =>
//                 isActive
//                   ? 'bg-gray-300 text-black rounded-full w-10 h-10 flex items-center justify-center'
//                   : 'text-gray-400 hover:bg-lime-400 w-10 h-10 hover:text-black flex items-center justify-center rounded-full'}>
//                 <FontAwesomeIcon icon={faPlus} />
//               </NavLink>

//               {userContext ? (
//                 <button
//                   className="bg-blue-300 hover:bg-blue-400 text-white rounded-full w-10 h-10 flex items-center justify-center"
//                   onClick={() => {
//                     setClicked(true);
//                     handleLogout();
//                   }}>
//                   <FontAwesomeIcon icon={faRightFromBracket} />
//                 </button>
//               ) : (
//                 <>
//                   <NavLink to="/login" className="bg-lime-400 text-black rounded-full px-3 py-2 text-sm font-semibold">Login</NavLink>
//                   <NavLink to="/signup" className="bg-black text-white rounded-full px-3 py-2 text-sm font-semibold">Sign Up</NavLink>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* ---------------------------- MOBILE NAVBAR (hamburger-based, keep as-is) ---------------------------- */}
//         <div className="block md:hidden">
//           {/* Use your original mobile Navbar code (with hamburger + overlay + drawer) here */}
//           {/* You already have this fully built in your Edusphere version */}
//         </div>
//       </nav>


//     </>
//   )
// }

// export default Navbar;


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
      console.log("Logout failed:", error);
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
              to="/"
              className={({ isActive }) =>
                isActive ? 'bg-gray-300 text-center text-black rounded-full w-16 h-9 flex items-center justify-center' : 'text-gray-300 hover:bg-lime-green w-11.4 h-11 hover:text-black px-4 py-2 rounded-full'
              }
            >
              <FontAwesomeIcon icon={faHouse} />
            </NavLink>

            <NavLink
              to="/expense"
              className={({ isActive }) =>
                isActive ? 'bg-gray-300 text-center text-black rounded-full w-16 h-9 flex items-center justify-center' : 'text-gray-400 hover:bg-lime-green w-11.4 h-11 hover:text-black px-4 py-2 rounded-full'
              }
            >
              <FontAwesomeIcon icon={faPlus} />
            </NavLink>

            {userContext ? (
              <button
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
                  to="/login"
                  className="rounded-full bg-lime-green px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-lime-green/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                >
                  Login
                </NavLink>
                <NavLink
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
          <button onClick={toggleMenu}>
            <FontAwesomeIcon icon={faBars} className="text-xl" />
          </button>
          <img
            src={Logo}
            alt="Logo"
            className="w-9 object-contain cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>

        {/* Sidebar Menu */}
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
            <button onClick={toggleMenu}>
              <FontAwesomeIcon icon={faXmark} className="text-xl" />
            </button>
          </div>

          <div className="p-6 flex flex-col gap-4">
            <NavLink
              to="/"
              onClick={toggleMenu}
              className="text-black hover:text-lime-600 font-medium"
            >
              Home
            </NavLink>

            <NavLink
              to="/expense"
              onClick={toggleMenu}
              className="text-black hover:text-lime-600 font-medium"
            >
              Add Expense
            </NavLink>

            {userContext ? (
              <button
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
                  to="/login"
                  onClick={toggleMenu}
                  className="bg-lime-400 text-black px-4 py-2 rounded-full font-medium"
                >
                  Login
                </NavLink>
                <NavLink
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

        {/* Overlay */}
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
