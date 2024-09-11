import React, { useEffect, useState } from 'react'
import { databases, account, storage } from '../appwrite/appwriteConfig';

function Home() {
  const [userDetails, setUserDetails] = useState({});
  const [budget, setBudget] = useState("Enter Budget First");
  const [expenses, setExpenses] = useState(0);

  useEffect(() => {
    const getData = account.get();
    getData.then(
      function (res) {
        setUserDetails(res);
      }
    )
  }, userDetails);

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-black-100 ml-12">
      {/* expenses */}
      <div className='caret-black'>Dashboard</div>
      {/* logic for profile and good morining */}
      <div className='caret-black'>Good Morning {userDetails ? userDetails.name : "Nothing"}</div>
      <div className="flex w-full space-x-4 p-4">
        <div className="bg-blue-200 p-6 rounded-lg shadow-md flex-1">
          Total revenue
          <span className="mr-2">$</span>
          <input
            type="text"
            value={budget}
            // onChange={enterBudget}
            // onFocus={handleFocus}
            placeholder="Enter Budget"
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          {/* <button type='submit' onClick={handleCreateSubcollection}>Click Me</button> */}
        </div>
        <div className="bg-purple-200 p-6 rounded-lg shadow-md flex-1">
          Total expense
          <span className="mr-2">$</span>
          <input
            type="text"
            value={expenses}
            placeholder=""
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>
      <div className="bg-black p-10 rounded-lg shadow-md flex-grow w-full m-4">
       Graphs
      </div>
      <div className="bg-black p-10 rounded-lg shadow-md flex-grow w-full m-4">
        Category
      </div>
    </div>
  );
}

export default Home