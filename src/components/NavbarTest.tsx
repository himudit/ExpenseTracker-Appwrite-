// import React, { useEffect, useState } from 'react'
// import { Link, NavLink } from 'react-router-dom'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { useNavigate } from 'react-router-dom';
// import { faPlus } from '@fortawesome/free-solid-svg-icons'
// import { faHouse } from '@fortawesome/free-solid-svg-icons';
// import { faSearch, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
// import Logo from '../assets/wallet.png';
// import { databases, account, storage } from '../appwrite/appwriteConfig';
// import { useDispatch, useSelector } from 'react-redux'
// import { setUser, removeUser } from '../utils/userSlice'
// import { fetchUserProfile } from "../utils/userSlice";

// function Navbar() {
//     const navigate = useNavigate();
//     const userContext = useSelector((store) => store.user.user)
//     const dispatch = useDispatch();
//     const [clicked, setClicked] = useState(false);

//     useEffect(() => {
//         dispatch(fetchUserProfile());
//     }, [dispatch]);

//     const handleLogout = async () => {
//         try {
//             await account.deleteSession("current"); // Ends user session
//             dispatch(removeUser()); // Remove user from Redux
//             // setUserDetails(null); // Clear local state
//             navigate("/login"); // Redirect to login
//         } catch (error) {
//             console.log("Logout failed:", error);
//         }
//     };


//     return (
//         <>
//             <div className="fixed top-0 left-0 h-full w-25 bg-dark-white flex flex-col items-center py-4 border-r-2 border-gray-300 bg-white">

//                 <div className="mb-8 flex flex-col items-center cursor-pointer" onClick={() => {
//                     navigate('/');
//                 }}>
//                     <img
//                         src={Logo}
//                         className="w-9 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl object-contain"
//                         alt="Logo"
//                     />
//                     <div className="mt-4 ml-1 font-bold" style={{ fontSize: '0.8rem' }}>
//                         ExpenseMate
//                     </div>
//                 </div>

//                 <div className="flex flex-col items-center space-y-8">
//                     <NavLink
//                         to="/"
//                         className={({ isActive }) =>
//                             isActive ? 'bg-gray-300 text-center text-black rounded-full w-16 h-9 flex items-center justify-center' : 'text-gray-300 hover:bg-lime-green w-11.4 h-11 hover:text-black px-4 py-2 rounded-full'
//                         }
//                     >
//                         <FontAwesomeIcon icon={faHouse} />
//                     </NavLink>

//                     <NavLink
//                         to="/expense"
//                         className={({ isActive }) =>
//                             isActive ? 'bg-gray-300 text-center text-black rounded-full w-16 h-9 flex items-center justify-center' : 'text-gray-400 hover:bg-lime-green w-11.4 h-11 hover:text-black px-4 py-2 rounded-full'
//                         }
//                     >
//                         <FontAwesomeIcon icon={faPlus} />
//                     </NavLink>

//                     {
//                         userContext ?
//                             <div>
//                                 <button
//                                     className={`rounded-full w-16 h-9 px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black
//         ${clicked ? "bg-blue-300" : "bg-blue-300 hover:bg-blue-300"}`}
//                                     onClick={() => {
//                                         setClicked(true);
//                                         handleLogout();
//                                     }}
//                                 >
//                                     <FontAwesomeIcon icon={faRightFromBracket} />
//                                 </button>
//                             </div>
//                             : <NavLink
//                                 to="/login"
//                                 className="rounded-full bg-lime-green px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-lime-green/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
//                             >
//                                 Login
//                             </NavLink>
//                     }

//                     {userContext ? <></> :
//                         <NavLink
//                             to="/signup"
//                             className="rounded-full bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
//                         >
//                             Sign Up
//                         </NavLink>}
//                 </div>
//             </div >
//         </>
//     )
// }

// export default Navbar;

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from '../assets/logo1.webp'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { fetchUserProfile } from "../features/userSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";

const Navbar: React.FC = () => {

  const [isOpen, setIsOpen] = useState(false);
  const suggestions: string[] = [
    "Python",
    "Programming",
    "Data Science",
    "Cloud Computing",
    "DevOps",
    "Deployment",
    "Backend",
    "AI",
    "scikit-learn",
    "Machine Learning",
    "JavaScript",
    "Java",
    "Web Development",
    "Spring Boot",
    "Frontend",
    "React.js",
    "Programming",
    "System Design",
    "Scalable Systems"
  ];


  const toggleMenu = () => setIsOpen(!isOpen);

  const { user, loading } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const navigate = useNavigate();

  const [query, setQuery] = useState<string>("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    setActiveIndex(-1);
    if (value.trim() === "") {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    } else {
      setFilteredSuggestions(
        suggestions.filter((item) =>
          item.toLowerCase().includes(value.toLowerCase())
        )
      );
      setShowSuggestions(true);
    }
  };

  const handleSelect = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    setActiveIndex(-1);

    const encodedQuery = encodeURIComponent(suggestion.trim());
    navigate(`/search?q=${encodedQuery}`);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (filteredSuggestions.length > 0) {
        setActiveIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (filteredSuggestions.length > 0) {
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && filteredSuggestions[activeIndex]) {
        handleSelect(filteredSuggestions[activeIndex]);
      } else if (query.trim() !== "") {
        const encodedQuery = encodeURIComponent(query.trim());
        navigate(`/search?q=${encodedQuery}`);
      }
    }
  };


  return (
    <nav className="relative bg-black text-white ">
      {
        user?.teacher_profile_picture ?
          <>
            {/* Main Navbar Container */}
            <div className="max-w-7xl mx-auto">
              {/* Top Navbar */}
              <div className="flex items-center justify-between px-4 py-4 relative">
                {/* Mobile Left - Hamburger */}
                <div className="md:hidden">
                  {!isOpen && (
                    <button onClick={toggleMenu} className="text-2xl">
                      &#9776;
                    </button>
                  )}
                </div>

                {/* Desktop Left Section */}
                <div className="hidden md:flex items-center">
                  {/* Logo for Desktop */}
                  <Link to="/" className="text-2xl font-bold mr-8">
                    <img src={logo} alt="logo" className="w-[3rem] h-[3rem]" />
                  </Link>

                  {/* Desktop Navigation */}
                  <ul className="flex items-center gap-8">
                    <li>
                      <Link to="/teacher/courseupload" className="text-sm font-medium hover:text-purple-400 transition-colors">
                        Upload Course
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Center Logo for Mobile */}
                <div className="absolute left-1/2 transform -translate-x-1/2 md:hidden">
                  <Link to="/" className="text-2xl font-bold">
                    <img src={logo} alt="logo" className="w-[3rem] h-[3rem]" />
                  </Link>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">

                  {/* Profile Section */}
                  <div className="flex items-center gap-3">
                    {/* Notifications */}

                    {/* Profile Picture */}
                    <div className="relative group">
                      {loading ? (
                        <></>
                      ) : user?.teacher_profile_picture ? (
                        <img
                          src={user?.teacher_profile_picture}
                          alt="Profile"
                          className="w-12 h-12 rounded-full border-2 border-purple-500 cursor-pointer"
                          onClick={() => {
                            navigate('/profile');
                          }} />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Link
                            to="/login"
                            className="text-white hover:text-white transition duration-300"
                          >
                            Login
                          </Link>
                          <span className="text-white">or</span>
                          <Link
                            to="/signup"
                            className="text-white hover:text-white transition duration-300"
                          >
                            Signup
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div
              className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-gray-900 to-black text-white z-50 transform ${isOpen ? "translate-x-0" : "-translate-x-full"
                } transition-transform duration-300 ease-in-out shadow-2xl`}
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <Link to="/" className="text-2xl font-bold text-purple-400"> <img src={logo} alt="logo" className="w-[3rem] h-[3rem]" /></Link>
                <button
                  onClick={toggleMenu}
                  aria-label="Close menu"
                  className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="py-6">
                {/* Profile Section in Sidebar */}
                <div className="px-6 mb-6 flex items-center gap-3">
                  {
                    user ?
                      <>
                        <img
                          src={user?.teacher_profile_picture}
                          alt="Profile"
                          className="w-[4rem] h-[4rem] rounded-full border-2 border-purple-500"
                        />
                        <div>
                          <h3 className="font-medium">{user?.first_name} {user?.last_name}</h3>
                          <p className="text-sm text-gray-400">{user?.email}</p>
                        </div>
                      </> : <></>
                  }
                </div>

                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/teacher/courseupload"
                      onClick={toggleMenu}
                      className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                    >
                      <FontAwesomeIcon icon={faCloudArrowUp} className="text-gray-300 mr-3" />
                      Upload Course
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/mylearning"
                      onClick={toggleMenu}
                      className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                    >
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      My Courses
                    </Link>
                  </li>
                  <li>
                    {user ?
                      <> <Link
                        to="/profile"
                        onClick={toggleMenu}
                        className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                      >
                        <svg
                          className="w-5 h-5 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Profile
                      </Link></> : <></>}

                  </li>
                </ul>
              </div>
            </div>

            {/* Overlay */}
            {isOpen && (
              <div
                onClick={toggleMenu}
                className="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm transition-opacity"
              ></div>
            )}
          </> :
          <>
            {/* Main Navbar Container */}
            <div className="max-w-7xl mx-auto">
              {/* Top Navbar */}
              <div className="flex items-center justify-between px-4 py-4 relative">
                {/* Mobile Left - Hamburger */}
                <div className="md:hidden">
                  {!isOpen && (
                    <button onClick={toggleMenu} className="text-2xl">
                      &#9776;
                    </button>
                  )}
                </div>

                {/* Desktop Left Section */}
                <div className="hidden md:flex items-center">
                  {/* Logo for Desktop */}
                  <Link to="/" className="text-2xl font-bold mr-8">
                    <img src={logo} alt="logo" className="w-[3rem] h-[3rem]" />
                  </Link>

                  {/* Desktop Navigation */}
                  <ul className="flex items-center gap-8">
                    <li>
                      <Link to="/search" className="text-sm font-medium hover:text-purple-400 transition-colors">
                        Explore Courses
                      </Link>
                    </li>
                    {
                      user ?
                        <li>
                          <Link to="/mylearning" className="text-sm font-medium hover:text-purple-400 transition-colors">
                            My Learning
                          </Link>
                        </li> :
                        <></>
                    }

                  </ul>
                </div>

                {/* Center Section - Search (Desktop Only) */}
                <div className="hidden md:block flex-1 max-w-xl mx-auto px-4" ref={searchRef}>
                  <div className="relative">
                    <input
                      type="text"
                      value={query}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      placeholder="Search courses..."
                      className="w-full px-4 py-2 rounded-[3rem] text-sm bg-gray-900 border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all outline-none placeholder-gray-400"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-4.35-4.35M16.5 10a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
                      />
                    </svg>
                  </div>

                  {/* Suggestions Dropdown */}
                  {showSuggestions && filteredSuggestions.length > 0 && (
                    <div className="absolute w-[45%] left-[38%] right-0 mt-2 bg-gray-800 text-white shadow-lg rounded-lg overflow-hidden z-10">
                      <div className="p-2 font-semibold border-b border-gray-700">
                        Popular on Edusphere
                      </div>
                      {filteredSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className={`p-2 flex items-center gap-2 cursor-pointer ${index === activeIndex ? "bg-gray-700" : "hover:bg-gray-600"
                            }`}
                          onClick={() => handleSelect(suggestion)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-gray-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M21 21l-4.35-4.35M16.5 10a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
                            />
                          </svg>
                          <span>{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>


                {/* Center Logo for Mobile */}
                <div className="absolute left-1/2 transform -translate-x-1/2 md:hidden">
                  <Link to="/" className="text-2xl font-bold">
                    <img src={logo} alt="logo" className="w-[3rem] h-[3rem]" />
                  </Link>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                  {/* Profile Section */}
                  <div className="flex items-center gap-3">
                    {/* Notifications */}

                    {/* Profile Picture */}
                    <div className="relative group">
                      {loading ? (
                        <></>
                      ) : user?.student_profile_picture ? (
                        <img
                          src={user?.student_profile_picture}
                          alt="Profile"
                          className="w-12 h-12 rounded-full border-2 border-purple-500 cursor-pointer"
                          onClick={() => {
                            navigate('/profile');
                          }} />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Link
                            to="/login"
                            className="text-white hover:text-white transition duration-300"
                          >
                            Login
                          </Link>
                          <span className="text-white">or</span>
                          <Link
                            to="/signup"
                            className="text-white hover:text-white transition duration-300"
                          >
                            Signup
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-gray-900 to-black text-white z-50 transform ${isOpen ? "translate-x-0" : "-translate-x-full"
                } transition-transform duration-300 ease-in-out shadow-2xl`}
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <Link to="/" className="text-2xl font-bold text-purple-400"> <img src={logo} alt="logo" className="w-[3rem] h-[3rem]" /></Link>
                <button
                  onClick={toggleMenu}
                  className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                  aria-label="Close menu"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="py-6">
                {/* Profile Section in Sidebar */}
                <div className="px-6 mb-6 flex items-center gap-3">
                  {
                    user ?
                      <>
                        <img
                          src={user?.student_profile_picture}
                          alt="Profile"
                          className="w-[4rem] h-[4rem] rounded-full border-2 border-purple-500"
                        />
                        <div>
                          <h3 className="font-medium">{user?.first_name} {user?.last_name}</h3>
                          <p className="text-sm text-gray-400">{user?.email}</p>
                        </div>
                      </> : <></>
                  }
                </div>

                <ul className="space-y-2">
                  <li>
                    <Link
                      to="/search"
                      onClick={toggleMenu}
                      className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                    >
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      Explore Courses
                    </Link>
                  </li>
                  <li>
                    {
                      user ?
                        <Link
                          to="/mylearning"
                          onClick={toggleMenu}
                          className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                        >
                          < svg
                            className="w-5 h-5 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                          My Learning
                        </Link> :
                        <></>
                    }
                  </li>
                  <li>
                    {user ?
                      <>
                        <Link
                          onClick={toggleMenu}
                          to="/profile"
                          className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                        >
                          <svg
                            className="w-5 h-5 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          Profile
                        </Link>
                      </>
                      :
                      <></>
                    }

                  </li>
                </ul>
              </div>
            </div>

            {/* Overlay */}
            {
              isOpen && (
                <div
                  onClick={toggleMenu}
                  className="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm transition-opacity"
                ></div>
              )
            }
          </>
      }

      <div className="block md:hidden">
        <div className="flex-1 max-w-xl mx-auto px-4" ref={searchRef}>
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Search courses..."
              className="w-full h-[3rem] px-4 py-2 rounded-[3rem] text-lg bg-gray-900 border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all outline-none placeholder-gray-400"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35M16.5 10a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
              />
            </svg>
          </div>

          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-black shadow-lg rounded-lg overflow-hidden z-50">
              <div className="p-2 font-semibold text-gray-400 border-b border-gray-700">
                Popular on Edusphere
              </div>
              {filteredSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`p-2 flex items-center gap-2 cursor-pointer ${index === activeIndex ? "bg-gray-700" : "hover:bg-gray-600"
                    }`}
                  onClick={() => handleSelect(suggestion)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-4.35-4.35M16.5 10a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z"
                    />
                  </svg>
                  <span className="text-white">{suggestion}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </nav >
  );
};

export default Navbar;