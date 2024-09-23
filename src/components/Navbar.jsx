import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Logo from '../assets/Logo.jpg';

function Navbar() {
  return (
    <>
      <div className="fixed top-0 left-0 h-full w-25 bg-dark-white flex flex-col items-center py-4 border-r-2 border-black-500">
        {/* logo */}
        <div className="mb-8 flex flex-col items-center">
          <img
            src={Logo}
            className="w-7 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl object-contain"
            alt="Logo"
          />
          {/* Responsive text below the logo */}
          <div className="mt-4 ml-4 text-base sm:text-s md:text-s lg:text-s xl:text-s font-bold">
            ExpenseMate
          </div>
        </div>


        {/* navlinks */}
        <div className="flex flex-col items-center space-y-8">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              isActive ? 'bg-lime-green w-11.4 h-11 text-black px-4 py-2 rounded-full' : 'text-gray-300 hover:bg-lime-green w-11.4 h-11 hover:text-black px-4 py-2 rounded-full'
            }
          >
            <FontAwesomeIcon icon={faHouse} />
          </NavLink>

          {/* <NavLink
                        to="/search"
                        className={({ isActive }) =>
                            isActive ? 'bg-lime-green w-11.4 h-11 text-black px-4 py-2 rounded-full' : 'text-gray-300 hover:bg-lime-green w-11.4 h-11 hover:text-black px-4 py-2 rounded-full'
                        }
                    >
                        <FontAwesomeIcon icon={faSearch} />
                    </NavLink> */}


          <NavLink
            to="/expense"
            className={({ isActive }) =>
              isActive ? 'bg-lime-green w-11.4 h-11 text-black px-4 py-2 rounded-full' : 'text-black-300 hover:bg-lime-green w-11.4 h-11 hover:text-black px-4 py-2 rounded-full'
            }
          >
            <FontAwesomeIcon icon={faPlus} />
          </NavLink>

          <NavLink
            to="/"
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
        </div>
      </div>
    </>
  )
}

export default Navbar;
