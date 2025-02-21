import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom';
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { faSearch, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import Logo from '../assets/wallet.png';
import { databases, account, storage } from '../appwrite/appwriteConfig';
import conf from '../conf/conf';
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../utils/userSlice'

function Navbar() {
  const [userId, setUserId] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [flag, setFlag] = useState(false);
  const navigate = useNavigate();
  const userContext = useSelector((store) => store.user.user)
  const dispatch = useDispatch();
  // fetching user data
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await account.get();
        dispatch(setUser(response));
        setUserDetails(response);
      } catch (error) {
        setUserDetails(null);
        console.log('No user logged in:', error);
      }
    };
    fetchUserDetails();
  }, []);

  // logout
  const handleLogout = async () => {
    try {
      await account.deleteSession("current")
      dispatch(setUser(null));
      setUserDetails((userDetails) => !userDetails);
      navigate("/login")
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="fixed top-0 left-0 h-full w-25 bg-dark-white flex flex-col items-center py-4 border-r-2 border-gray-300 bg-white">

        {/* logo */}
        <div className="mb-8 flex flex-col items-center">
          <img
            src={Logo}
            className="w-9 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl object-contain"
            alt="Logo"
          />
          {/* Responsive text below the logo */}
          <div className="mt-4 ml-1 font-bold" style={{ fontSize: '0.8rem' }}>
            ExpenseMate
          </div>
        </div>

        {/* navlinks */}
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

          {
            userContext ? <div>
              <button
                className="rounded-full  w-16 h-9  bg-blue-300 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-lime-green/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                onClick={handleLogout}
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
              </button>
            </div> : <NavLink
              to="/login"
              className="rounded-full bg-lime-green px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-lime-green/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              Login
            </NavLink>
          }

          {userContext ? <></> :
            <NavLink
              to="/signup"
              className="rounded-full bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              Sign Up
            </NavLink>}
        </div>
      </div >
    </>
  )
}

export default Navbar;
