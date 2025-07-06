import React, { useState } from 'react'
import { account } from '../appwrite/appwriteConfig'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

function Login() {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    email: "",
    password: ""
  })
  const [loading, setLoading] = useState(false);
  const userContext = useSelector((store) => store.user.user)
  const dispatch = useDispatch();

  const loginUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await account.createEmailPasswordSession(user.email, user.password);
      // dispatch(setUser("NotNull"));
      dispatch({ type: 'user/setUser', payload: 'NotNull' });
      navigate("/");
    } catch (error) {
      console.log(error);
      alert(error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <div className={`flex justify-center items-center`}>
        <div className="h-full w-[70%] flex flex-col justify-center  mt-[4rem] md:ml-[7rem]">
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
                    className={`mt-4 w-full px-6 py-2 flex items-center justify-center gap-2 rounded-md text-white font-medium 
    transition-colors duration-300
    ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}
  `}
                  >
                    {loading && (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
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