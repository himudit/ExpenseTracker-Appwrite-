import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom'
import Layout from './Layout.jsx'
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home.jsx'
import Expense from './components/Expense.jsx'

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Layout />}>
        <Route path='/' element={<Home />} />
        <Route path='signup' element={<Signup />} />
        <Route path='login' element={<Login />} />
        <Route path='expense' element={<Expense />} />
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
