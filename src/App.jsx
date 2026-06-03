import './App.css'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom'
import Layout from './Layout.jsx'
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home.jsx'
import Expense from './components/Expense.jsx'
import Recurring from './components/Recurring.jsx'
import Assistant from './components/Assistant/Assistant.jsx';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Layout />}>
        <Route path='/' element={<Home />} />
        <Route path='signup' element={<Signup />} />
        <Route path='login' element={<Login />} />
        <Route path='add' element={<Expense />} />
        <Route path='recurring' element={<Recurring />} />
        <Route path='/assistant' element={<Assistant />} />
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
