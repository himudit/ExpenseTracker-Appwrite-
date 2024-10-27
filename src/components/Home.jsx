import React, { useEffect, useState } from 'react'
import { databases, account, storage } from '../appwrite/appwriteConfig';
import { v4 as uuidv4 } from 'uuid';
import { Query } from 'appwrite';
import conf from '../conf/conf';
import { useNavigate, Link, Navigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);
  const [userDetails, setUserDetails] = useState()
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [budget, setBudget] = useState(0);
  const [profilePictureUrl, setProfilePictureUrl] = useState('/image.png');

  useEffect(() => {
    const getData = account.get()
    getData.then(
      function (response) {
        setUserDetails(response)
      },
      function (error) {
        console.log(error);
      }
    )
  }, [])

  useEffect(() => {
    const fetchProfilePictureUrl = async () => {
      if (!userDetails || !userDetails.$id) return;
      try {
        const res = await databases.listDocuments(conf.appwriteDatabaseId, conf.appwriteCollection3Id, [Query.equal('user_id', userDetails.$id)]);
        setProfilePictureUrl(`${conf.appwriteUrl}/storage/buckets/${conf.appwriteBucketId}/files/${res.documents[0].image_id}/view?project=${conf.appwriteProjectId}&mode=admin`);
      } catch (error) {
        console.log(error);
      }
    };

    // for collection4(Category)
    const fetchTotalFromCategory = async () => {
      const userData = await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollection4Id,
        [
          Query.equal('userid', userDetails.$id)
        ]
      )
      const userDocument = userData.documents[0];
      const others = userDocument.others || 0;
      const foodDining = userDocument.FoodDining || 0;
      const shopping = userDocument.Shopping || 0;
      const travelling = userDocument.Travelling || 0;
      const entertainment = userDocument.Entertainment || 0;
      const medicalBills = userDocument.Medical || 0;
      const bills = userDocument.Bills || 0;
      const rent = userDocument.Rent || 0;
      const taxes = userDocument.Taxes || 0;
      const investments = userDocument.Investments || 0;
      const totalExpense = others + foodDining + shopping + travelling + entertainment + medicalBills + bills + rent + taxes + investments;
      setExpenses(totalExpense);
      console.log('TotalExpense for user:', totalExpense);

      const userDataInc = await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollection6Id,
        [
          Query.equal('userid', userDetails.$id)
        ]
      )
      const userDocumentInc = userDataInc.documents[0];
      const othersInc = userDocumentInc.others || 0;
      const Salary = userDocumentInc.Salary || 0;
      const Sold = userDocumentInc.Sold || 0;

      const totalIncome = othersInc + Salary + Sold;
      setIncome(totalIncome);
      console.log('TotalIncome for user:', totalIncome);
    }

    // for collection1(Main)
    // const fetchDataFromMain = async () => {
    //   try {
    //     const res1 = await databases.listDocuments(conf.appwriteDatabaseId, conf.appwriteCollection1Id, [Query.equal('userid', userDetails.$id)]);
    //     if (res1.total > 0) {
    //       // exist & update
    //       console.log(res1.documents);
    //       setIncome(res1.documents.IncomeAmount);
    //     }
    //   } catch (err) {
    //     console.log(err);
    //   }
    // };

    fetchProfilePictureUrl();
    fetchTotalFromCategory();
    // fetchDataFromMain();
  }, [userDetails]);

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-black-100 ml-[7rem]">

      <div className='flex w-full h-[3rem] space-x-4 p-4 border-b-2 border-black-500'>
        <div className='caret-black font-bold'>Dashboard</div>
        {/* Profile Picture */}
        <div className="absolute top-1 right-[4rem] md:top-3 md:right-6 lg:top-[0.2rem] lg:right-20" onClick={() => navigate('/profile')}>
          <img
            src={profilePictureUrl}
            alt="Profile"
            className="h-14 w-14 md:h-12 md:w-12 lg:h-14 lg:w-14 rounded-full cursor-pointer"
          />
        </div>
      </div>
      {/* logic for profile and good morning */}
      <div className='caret-black'>Good Morning {userDetails ? userDetails.name : "Nothing"}</div>
      <div className="flex w-full space-x-4 p-4">
        <div className="bg-blue-200 text-white p-6 rounded-lg shadow-md flex-1">
          Total Income
          <span className="mr-2"></span>
          <input
            type="text"
            value={income}
            className="w-full p-2 border text-black border-gray-300 rounded-lg"
          />
        </div>
        <div className="bg-purple-200 p-6  text-white rounded-lg shadow-md flex-1">
          Total Expense
          <span className="mr-2"></span>
          <input
            type="text"
            value={expenses}
            placeholder=""
            className="w-full p-2 border text-black border-gray-300 rounded-lg"
          />
        </div>
        <div className="bg-green-200  text-white p-6 rounded-lg shadow-md flex-1">
          Remaining Balance
          <span className="mr-2"></span>
          <input
            type="text"
            value={budget}
            placeholder=""
            className="w-full p-2 border  text-black border-gray-300 rounded-lg"
          />
        </div>
      </div>
      {/* Middle Box */}
      <div className="bg-black p-10 rounded-lg shadow-md flex-grow w-full m-4">
        Graphs
      </div>
      {/* Lowest Box */}
      <div className="bg-white p-10 rounded-lg shadow-md flex-grow w-full m-4 border border-gray-200">
        <div className="relative flex justify-between top-[-2.4rem]">
          <div className="w-3/5 h-[20rem] bg-white rounded-lg shadow-md flex-grow m-4 border border-gray-200">
            <div>Recent Transactions</div>
          </div>

          <div className="w-2/5 h-[20rem] bg-white p-10 rounded-lg shadow-md flex-grow  m-4 border border-gray-200">
            <div>Categories</div>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Home