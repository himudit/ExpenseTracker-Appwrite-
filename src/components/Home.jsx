import React, { useEffect, useState } from 'react'
import { databases, account, storage } from '../appwrite/appwriteConfig';

function Home() {
  const [userDetails, setUserDetails] = useState({});
  const [budget, setBudget] = useState("Enter Budget First");
  const [expenses, setExpenses] = useState(0);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);

  useEffect(() => {
    const getData = account.get();
    getData.then(
      function (res) {
        setUserDetails(res);
      }
    )
  }, userDetails);

  useEffect(() => {
    const fetchProfilePictureUrl = async () => {
      try {
        if (!userDetails || !userDetails.$id) return;
        // if (userDetails) {
        const res = await databases.listDocuments(conf.appwriteDatabaseId, conf.appwriteCollection3Id, [Query.equal('user_id', userDetails.$id)]);
        setProfilePictureUrl(`${conf.appwriteUrl}/storage/buckets/${conf.appwriteBucketId}/files/${res.documents[0].image_id}/view?project=${conf.appwriteProjectId}&mode=admin`);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfilePictureUrl();
  }, [userDetails]);

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-black-100 ml-[7rem]">
      {/* expenses */}
      <div className='flex w-full h-[3rem] space-x-4 p-4 border-b-2 border-black-500'>
        {/* <div className='caret-black font-bold'>Dashboard</div> */}
        {/* Profile Picture */}
        <div className="absolute top-1 right-[4rem] md:top-3 md:right-6 lg:top-[0.2rem] lg:right-20">
          <img
            src={profilePictureUrl}
            alt="Profile"
            className="h-14 w-14 md:h-12 md:w-12 lg:h-14 lg:w-14 rounded-full cursor-pointer"
          />
        </div>
      </div>
      {/* logic for profile and good morining */}
      <div className='caret-black'>Good Morning {userDetails ? userDetails.name : "Nothing"}</div>
      <div className="flex w-full space-x-4 p-4">
        <div className="bg-blue-200 p-6 rounded-lg shadow-md flex-1">
          Total Income
          <span className="mr-2"></span>
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
          Total Expense
          <span className="mr-2"></span>
          <input
            type="text"
            value={expenses}
            placeholder=""
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="bg-green-200 p-6 rounded-lg shadow-md flex-1">
          Remaining Balance
          <span className="mr-2"></span>
          <input
            type="text"
            // value={}
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