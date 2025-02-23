import React, { useState } from 'react'
import { account } from '../appwrite/appwriteConfig'
import { NavLink, useNavigate } from 'react-router-dom'
import LottieDot from './LottieDot'
import { height } from '@fortawesome/free-solid-svg-icons/fa0'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../utils/userSlice'

function Login() {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    email: "",
    password: ""
  })
  const [loading, setLoading] = useState(false);
  const userContext = useSelector((store) => store.user.user)
  const dispatch = useDispatch();

  const [dotAnimation, setDotAnimation] = useState(false);
  const loginUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await account.createEmailPasswordSession(user.email, user.password);
      // dispatch(setUser("NotNull"));
      dispatch({ type: 'user/setUser', payload: 'NotNull' });
      setDotAnimation(false);
      navigate("/");
    } catch (error) {
      setDotAnimation(false);
      console.log(error);
      alert(error);
    } finally {
      setLoading(false);
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

                <div>

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

                  <button
                    type="submit"
                    disabled={loading}
                    onClick={loginUser}
                    className={`w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-3 transition-colors ${loading ? 'bg-indigo-400 cursor-not-allowed' : ''
                      }`}
                  >
                    {loading && (
                      <span className="w-5 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    )}
                    {loading ? 'Logging in...' : 'Login'}
                  </button>

                </div>
              </form>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default Login