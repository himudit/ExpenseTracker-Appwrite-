import React, { useState, useEffect } from 'react';
import { account } from '../appwrite/appwriteConfig';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Logo from '../assets/Logo.jpg';
import isEmail from 'validator/lib/isEmail';
import LottieDot from './LottieDot'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../utils/userSlice'

function Signup() {
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState('');
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const [dotAnimation, setDotAnimation] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await account.get();
        navigate('/');
      } catch (error) {
        console.log('No logged-in user:', error);
      }
    };
    checkUser();
  }, [navigate]);

  const signupUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setDotAnimation(true);

    // Password validation
    if (user.password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    } else {
      setPasswordError('');
    }

    try {
      // Create user account
      if (!user.name || user.name.length > 15) {
        throw new Error('Name must be more than 15 characters long.');
      }
      if (!user.email || !isEmail(user.email)) {
        throw new Error("Invalid email address");
      }
      await account.create(uuidv4(), user.email, user.password, user.name);

      // Log in the user
      await account.createEmailPasswordSession(user.email, user.password);
      setDotAnimation(false);
      // Redirect to the home page
      navigate('/');
    } catch (err) {
      // console.error('Error during signup or login:', err);
      setDotAnimation(false);
      alert(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-center items-center'>
      <div className="h-full w-[70%] flex flex-col justify-center mt-[3rem] ml-[6rem]">
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
              <button
                type="submit"
                disabled={loading}
                onClick={signupUser}
                className={`w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-3 transition-colors ${loading ? 'bg-purple-500 cursor-not-allowed' : ''
                  }`}
              >
                {loading && (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
