import React, { useState, useEffect } from 'react';
import { account } from '../appwrite/appwriteConfig';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

function Signup() {
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState('');
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await account.get();
        // Redirect if user is already logged in
        navigate('/home');
      } catch (error) {
        console.log('No logged-in user:', error);
      }
    };
    checkUser();
  }, [navigate]);

  const signupUser = async (e) => {
    e.preventDefault();

    // Password validation
    if (user.password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    } else {
      setPasswordError('');
    }

    try {
      // Create user account
      await account.create(uuidv4(), user.email, user.password, user.name);

      // Log in the user
      await account.createEmailPasswordSession(user.email, user.password);

      // Redirect to the home page
      navigate('/home');
    } catch (err) {
      console.error('Error during signup or login:', err);
      alert(err.message || 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="flex">
      <div className="h-full w-[70%] flex flex-col justify-center mt-[-2rem] ml-[7rem]">
        <div className="text-center text-2xl font-bold text-white">Sign up</div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={signupUser}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    onChange={(e) => {
                      setUser({
                        ...user,
                        name: e.target.value
                      });
                    }}
                  />
                </div>
              </div>
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
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    onChange={(e) => {
                      setUser({
                        ...user,
                        email: e.target.value
                      });
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
                      });
                    }}
                  />
                  {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
