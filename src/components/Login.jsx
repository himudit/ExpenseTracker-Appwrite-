import React, { useState } from 'react'
import { account } from '../appwrite/appwriteConfig'
import { NavLink, useNavigate } from 'react-router-dom'
import LottieDot from './LottieDot'
import { height } from '@fortawesome/free-solid-svg-icons/fa0'

function Login() {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    email: "",
    password: ""
  })

  const [dotAnimation, setDotAnimation] = useState(false);
  const loginUser = async (e) => {
    e.preventDefault();
    setDotAnimation(true);

    try {
      await account.createEmailPasswordSession(user.email, user.password);
      setDotAnimation(false);
      navigate("/");
    } catch (error) {
      setDotAnimation(false);
      alert("Login failed. Please check your email and password and try again.");
    }
  };


  return (
    <>
      <div className={`flex justify-center items-center`}>
        <div className="h-full w-[70%] flex flex-col justify-center  mt-[4rem] ml-[6rem]">
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <form className="space-y-6" action="#" method="POST">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      onChange={(e) => {
                        setUser({
                          ...user,
                          email: e.target.value
                        })
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      onChange={(e) => {
                        setUser({
                          ...user,
                          password: e.target.value
                        })
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <NavLink
                      to="/signup"
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Don't have Account, Sign Up
                    </NavLink>
                  </div>
                </div>

                <div>
                  {dotAnimation ?
                    <>
                      <div className='flex justify-center ml-[9rem] mt-[-0.8rem] w-[8rem] h-[1.7rem] text-white bg-white'><LottieDot /></div>
                    </> : <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={loginUser}
                    >
                      Log in
                    </button>}

                </div>
              </form>
            </div>
          </div>
        </div>
        {/* {
          (dotAnimation) && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <LottieDot />
            </div>
          )
        } */}
      </div>
    </>
  )
}

export default Login