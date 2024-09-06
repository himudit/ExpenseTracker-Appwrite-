import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
// import Search from './components/Search'
// import RecipeApp from './components/RecipeApp'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom'
// import Favourite from './components/Favourite'
import Layout from './Layout.jsx'
import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile.jsx'
// import RecipeAi from './components/RecipeAi.jsx'
import Home from './components/Home.jsx'
// import CookingAnimation from "./components/Preloader/Preloader.jsx"

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Layout />}>
        <Route path='/' element={<Login />} />
        <Route path='signup' element={<Signup />} />
        <Route path='home' element={<Home />} />
        <Route path='profile' element={<Profile />} />
        {/* <Route path='search' element={<Search />} /> */}
        {/* <Route path='favourite' element={<Favourite />} /> */}
        {/* <Route path='recipeAI' element={<RecipeAi />} /> */}
        {/* <Route path='preloader' element={<CookingAnimation />} /> */}
      </Route>
    )
  );
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App