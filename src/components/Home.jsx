import React, { useEffect, useState } from 'react'
import { databases, account, storage } from '../appwrite/appwriteConfig';
import { v4 as uuidv4 } from 'uuid';
import { Query } from 'appwrite';
import conf from '../conf/conf';
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faChartSimple, faChevronRight, faEllipsis, faHouseCircleCheck, faIndianRupee, faReceipt, faSuitcaseMedical, faVideo, faPizzaSlice, faCartShopping, faPlane, faCircle, faCirclePlus, faCheck, faXmark, faRupee, faWallet } from '@fortawesome/free-solid-svg-icons';

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
      // console.log('TotalExpense for user:', totalExpense);

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
      // console.log('TotalIncome for user:', totalIncome);
    }

    fetchProfilePictureUrl();
    fetchTotalFromCategory();
  }, [userDetails]);

  // for Transaction
  // for category selection
  const [expenseEntries, setExpenseEntries] = useState([]);
  const [incomeEntries, setIncomeEntries] = useState([]);
  const [combinedEntries, setCombinedEntries] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState();
  const settingCategory = (icon, text) => {
    setSelectedCategory({ icon, text });
  };
  // for data from collection 2 & collection 5
  useEffect(() => {
    // for collection 2 (Expense)
    const fetchfromNewExpense = async () => {
      const userDataExpense = await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollection2Id,
        [
          Query.equal('userid', userDetails.$id)
        ]
      );
      setExpenseEntries(userDataExpense.documents); // Update state with fetched expense entries
    };

    // for collection 5 (Income)
    const fetchfromNewIncome = async () => {
      const userDataIncome = await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollection5Id,
        [
          Query.equal('userid', userDetails.$id)
        ]
      );
      setIncomeEntries(userDataIncome.documents); // Update state with fetched income entries
    };

    fetchfromNewExpense();
    fetchfromNewIncome();
  }, [userDetails]);

  useEffect(() => {
    if (expenseEntries.length > 0 || incomeEntries.length > 0) {
      const combined = [...expenseEntries, ...incomeEntries];
      const sortedEntries = combined.sort((a, b) => new Date(b.Date) - new Date(a.Date));

      setCombinedEntries(sortedEntries);
    }
  }, [expenseEntries, incomeEntries]);

  // swicth for 
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'others':
        return faEllipsis;
      case 'Salary':
        return faWallet;
      case 'Sold':
        return faCartShopping;
      case 'Food & Dining':
        return faPizzaSlice;
      case 'Shopping':
        return faCartShopping;
      case 'Travelling':
        return faPlane;
      case 'Entertainment':
        return faVideo;
      case 'Medical':
        return faSuitcaseMedical;
      case 'Bills':
        return faReceipt;
      case 'Rent':
        return faHouseCircleCheck;
      case 'Taxes':
        return faIndianRupee;
      case 'Investmnts':
        return faChartSimple;
      default:
        return faEllipsis;
    }
  };

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
      <div className="relative w-full flex flex-col md:flex-row justify-between top-[-0.6rem]">

        {/* <!-- Recent Transactions Section --> */}
        <div className="w-full md:w-3/5 h-auto md:h-[20rem] bg-white rounded-lg shadow-md m-2 md:m-4 border border-gray-200 p-4">
          <div className="text-lg md:text-[1.18rem] font-bold mt-2 md:mt-4">Recent Transactions</div>
          {combinedEntries.map((entry, index) => (
            <div
              key={index}
              className="flex justify-between bg-white p-2 border-b border-gray-300"
            >
              {/* <div className="flex justify-between"> */}
              <div className="flex space-x-2">
                <div className="box1">  {/* first box */}
                  <div className="flex-1 text-center">
                    <div className="bg-gray-300 text-center text-black rounded-full w-12 h-12 flex items-center justify-center">
                      <FontAwesomeIcon icon={getCategoryIcon(entry.Category)} style={{ color: "green" }} />
                    </div>
                  </div></div>

                <div className="box2"> {/* second box */}
                  <div className="flex-1 text-center">
                    <div className="flex-1 font-bold">{entry.Category}</div>
                    <div className='text-gray-500 text-sm'>
                      {new Date(entry.Date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: '2-digit'
                      })}
                    </div>
                    {/* <div className="text-sm text-gray-500">
                  {new Date(entry.Date).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                  })}
                </div> */}
                  </div></div>
              </div>

              <div className="box3">{/* third Box */}
                <div className="flex-1 text-center">
                  {entry.ExpenseAmount ? <div className="text-red-600 font-bold-400 flex-1">{entry.ExpenseAmount}</div> : <div className="text-green-500 font-bold-400 flex-1">{entry.IncomeAmount}</div>}
                </div></div>
              {/* </div> */}

            </div>
          ))}
        </div>

        {/* <!-- Categories Section --> */}
        <div className="w-full md:w-2/5 h-auto md:h-[20rem] bg-white p-4 md:p-10 rounded-lg shadow-md m-2 md:m-4 border border-gray-200">
          <div className="text-lg font-bold">Categories</div>
        </div>

      </div>

    </div>
  );
}

export default Home