import React, { useEffect, useState } from 'react'
import { databases, account, storage } from '../appwrite/appwriteConfig';
import { v4 as uuidv4 } from 'uuid';
import { Query } from 'appwrite';
import conf from '../conf/conf';
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faChartSimple, faChevronRight, faEllipsis, faHouseCircleCheck, faIndianRupee, faReceipt, faSuitcaseMedical, faVideo, faPizzaSlice, faCartShopping, faPlane, faCircle, faCirclePlus, faCheck, faXmark, faRupee, faWallet, faChevronLeft, faBurger, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { PieChart, Pie } from 'recharts';
import PieChartComponent from './PieChartComponent';
import CustomAreaChart from './CustomAreaChart';

function Home() {
  const navigate = useNavigate();
  const [leftC, setLeftC] = useState(false);
  const [rightC, setRightC] = useState(false);
  const [indexC, setindexC] = useState(0);

  const [userId, setUserId] = useState(null);
  const [userDetails, setUserDetails] = useState()
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [budget, setBudget] = useState(0);
  const [profilePictureUrl, setProfilePictureUrl] = useState('/image.png');
  const [middleData, setMiddleData] = useState([]);
  const [middleFlag, setMiddleFlag] = useState(false);
  const [descombinedEntries, setDesCombinedEntries] = useState([]);

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
      const userDataInc = await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollection6Id,
        [
          Query.equal('userid', userDetails.$id)
        ]
      )
      const userDocumentInc = userDataInc.documents[0];
      const othersInc = userDocumentInc?.others || 0;
      const salary = userDocumentInc?.Salary || 0;
      const sold = userDocumentInc?.Sold || 0;
      const totalIncome = othersInc + salary + sold;
      setIncome(totalIncome);

      const userData = await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollection4Id,
        [
          Query.equal('userid', userDetails.$id)
        ]
      )
      const userDocument = userData.documents[0];
      const others = userDocument?.others || 0;
      const food = userDocument?.Food || 0;
      const shopping = userDocument?.Shopping || 0;
      const travelling = userDocument?.Travelling || 0;
      const entertainment = userDocument?.Entertainment || 0;
      const medicalBills = userDocument?.Medical || 0;
      const bills = userDocument?.Bills || 0;
      const rent = userDocument?.Rent || 0;
      const taxes = userDocument?.Taxes || 0;
      const investments = userDocument?.Investments || 0;
      const totalExpense = others + food + shopping + travelling + entertainment + medicalBills + bills + rent + taxes + investments;
      setExpenses(totalExpense);
    }
    fetchProfilePictureUrl();
    fetchTotalFromCategory();
  }, [userDetails]);

  // for Transaction
  const [expenseEntries, setExpenseEntries] = useState([]);
  const [incomeEntries, setIncomeEntries] = useState([]);
  const [combinedEntries, setCombinedEntries] = useState([]);
  const [startingIndex, setStartingIndex] = useState(0);
  const [endingIndex, setEndingIndex] = useState(0);
  const [leftT, setLeftT] = useState(false);
  const [rightT, setRightT] = useState(false);
  const [indexT, setindexT] = useState(0);

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
      setExpenseEntries(userDataExpense.documents);
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
      setRightC(true);
      setIncomeEntries(userDataIncome.documents);
    };

    fetchfromNewExpense();
    fetchfromNewIncome();
  }, [userDetails]);

  useEffect(() => {
    if (expenseEntries.length > 0 || incomeEntries.length > 0) {
      const combined = [...expenseEntries, ...incomeEntries];
      const sortedEntries = combined.sort((a, b) => new Date(b.Date) - new Date(a.Date));
      setCombinedEntries(sortedEntries);
      // console.log(combinedEntries.length);
      setEndingIndex(sortedEntries.length);
      if (sortedEntries.length > 3) {
        setRightT(true);
      }
    }
  }, [expenseEntries, incomeEntries]);

  useEffect(() => {
    // console.log(combinedEntries);
    const combined = [...expenseEntries, ...incomeEntries];
    const dessortedEntries = combined.sort((a, b) => new Date(a.Date) - new Date(b.Date));
    setDesCombinedEntries(dessortedEntries);
    // console.log(descombinedEntries);
    if (dessortedEntries.length > 0) {
      const newMiddleData = [];
      let i = 0;
      while (i < dessortedEntries.length) {
        let sumE = 0;
        let sumI = 0;
        let catE = '';
        let catI = '';
        if (dessortedEntries[i]?.hasOwnProperty('ExpenseAmount')) {
          sumE += dessortedEntries[i].ExpenseAmount || 0;
          catE += (catE ? ',' : '') + (dessortedEntries[i].Category || '');
        } else {
          sumI += dessortedEntries[i].IncomeAmount || 0;
          catI += (catI ? ',' : '') + (dessortedEntries[i].Category || '');
        }
        // const day = new Date(dessortedEntries[i]?.Date).getDate();
        const day = dessortedEntries[i]?.Date.split("T")[0].split("-")[2];
        // console.log(day);

        let j = i + 1;
        while (j < dessortedEntries.length) {
          // if (new Date(dessortedEntries[j]?.Date).getDate() === day) {
          if (dessortedEntries[j]?.Date.split("T")[0].split("-")[2] === day) {
            if (dessortedEntries[j]?.hasOwnProperty('ExpenseAmount')) {
              sumE += dessortedEntries[j].ExpenseAmount || 0;
              catE += (catE ? ',' : '') + (dessortedEntries[j].Category || '');
            } else {
              sumI += dessortedEntries[j].IncomeAmount || 0;
              catI += (catI ? ',' : '') + (dessortedEntries[j].Category || '');
            }
          } else {
            break;
          }
          j++;
        }
        newMiddleData.push({
          date: day,
          spend: sumE,
          spendCategory: catE,
          cashback: sumI,
          cashbackCategory: catI,
        });
        i = j;
      }
      setMiddleData(newMiddleData);
      // console.log(newMiddleData);
    }
  }, [combinedEntries]);


  // switch for 
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'others':
        return faEllipsis;
      case 'Salary':
        return faWallet;
      case 'Sold':
        return faCartShopping;
      case 'Food':
        return faBurger;
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
      case 'Investments':
        return faChartSimple;
      default:
        return faEllipsis;
    }
  };

  const categoryColors = {
    Shopping: '#4D4DFF',
    "Food": '#FFBF00',
    Travelling: 'purple',
    Entertainment: '#FF6F61',
    Medical: 'red',
    Bills: '#797982',
    Rent: '#005F6A',
    Taxes: '#721322',
    Investments: '#32CD32',
    others: '#A9A9A9',
    Salary: 'lightgreen',
    Sold: 'brown',
  };
  const LeftArrowT = () => {
    setRightT(true);
    if (indexT - 3 == 0 || indexT == 0) {
      setindexT(indexT - 3);
      setLeftT(false);
    } else {
      setindexT(indexT - 3);
    }
  }

  const RightArrowT = () => {
    setLeftT(true);
    if (indexT + 6 >= endingIndex) {
      setindexT(indexT + 3);
      setRightT(false);
    } else {
      setindexT(indexT + 3);
    }
  }

  // for categories
  // const [dataCatExp, setDataCatExp] = useState([]);
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);

  const LeftArrowC = () => {
    setRightC(true);
    setLeftC(false);
  }
  const RightArrowC = () => {
    setLeftC(true);
    setRightC(false);
  }

  useEffect(() => {
    const fetchFromExpenseCategory = async () => {
      // Expense
      const result = await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollection4Id,
        [
          Query.equal('userid', userDetails.$id)
        ]
      );
      if (result.documents && result.documents.length > 0) {
        setData1([
          { name: "others", value: result.documents[0].others, color: "#A9A9A9" },
          { name: "Food", value: result.documents[0].Food, color: "#FFBF00" },
          { name: "Shopping", value: result.documents[0].Shopping, color: "#0000ff" },
          { name: "Travelling", value: result.documents[0].Travelling, color: "purple" },
          { name: "Entertainment", value: result.documents[0].Entertainment, color: "#FF6F61" },
          { name: "Medical", value: result.documents[0].Medical, color: "red" },
          { name: "Bills", value: result.documents[0].Bills, color: "#797982" },
          { name: "Rent", value: result.documents[0].Rent, color: "#005F6A" },
          { name: "Taxes", value: result.documents[0].Taxes, color: "#721322" },
          { name: "Investments", value: result.documents[0].Investments, color: "#32CD32" },
        ]);
      }

      // Income
      const result1 = await databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollection6Id,
        [
          Query.equal('userid', userDetails.$id)
        ]
      );
      if (result1.documents && result1.documents.length > 0) {
        setData2([
          { name: "others", value: result1.documents[0].others, color: "#A9A9A9" },
          { name: "Salary", value: result1.documents[0].Salary, color: "lightgreen" },
          { name: "Sold", value: result1.documents[0].Sold, color: "brown" },
        ]);
      }
    };
    fetchFromExpenseCategory();
  }, [userDetails]);

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-black-100 ml-[7rem] ">

      <div className='flex w-full h-[4rem] space-x-4 p-4 border-b-2 border-black-500'>
        <div className='caret-black font-bold'>Dashboard</div>
        {/* Profile Picture */}
        <div className="absolute top-1 right-[4rem] md:top-3 md:right-6 lg:top-[0.2rem] lg:right-20" onClick={() => navigate('/profile')}>
          <img
            src={profilePictureUrl}
            alt="Profile"
            className="h-10 w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 rounded-full cursor-pointer"
          />
        </div>
      </div>
      {/* logic for profile and good morning */}
      <div className="caret-black">
        {(() => {
          const currentHour = new Date().getHours();
          if (currentHour >= 5 && currentHour < 12) {
            return "Good Morning";
          } else if (currentHour >= 12 && currentHour < 17) {
            return "Good Afternoon";
          } else if (currentHour >= 17 && currentHour < 21) {
            return "Good Evening";
          } else {
            return "Good Night";
          }
        })()}{" "}
        {userDetails ? userDetails.name : ""}
      </div>

      <div className="flex flex-wrap w-full gap-4 p-4">
        <div className="bg-blue-200 text-white p-6 rounded-lg shadow-md flex-1 min-w-[250px] sm:min-w-[300px]">
          <div className="mb-2 text-lg font-semibold">Total Income</div>
          <input
            type="text"
            value={+ income}
            className="w-full p-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-purple-200 p-6 text-white rounded-lg shadow-md flex-1 min-w-[250px] sm:min-w-[300px]">
          <div className="mb-2 text-lg font-semibold">Total Expense</div>
          <input
            type="text"
            value={"₹" + expenses}
            placeholder=""
            className="w-full p-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="bg-green-200 text-white p-6 rounded-lg shadow-md flex-1 min-w-[250px] sm:min-w-[300px]">
          <div className="mb-2 text-lg font-semibold">Remaining Balance</div>
          <input
            type="text"
            value={"₹" + (income - expenses)}
            placeholder=""
            className="w-full p-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>


      {/* Middle Box */}
      <div className="bg-black p-10  rounded-lg shadow-md flex-grow w-[95%] m-4">
        <CustomAreaChart
          data={middleData}
        />

      </div>

      {/* Lowest Box */}
      <div className="relative w-full flex flex-col md:flex-row justify-between top-[-0.6rem]">

        {/* <!-- Recent Transactions Section --> */}
        <div className="w-full md:w-3/6 h-auto md:h-[20rem] bg-white rounded-lg shadow-md m-2 md:m-4 border border-gray-200 p-4 relative">
          <div className="text-lg md:text-[1.18rem] font-bold mt-2 md:mt-4">Recent Transactions</div>

          {/* Transaction Entries */}
          <div className="overflow-y-auto  min-h-[13rem] max-h-[13rem]">
            {combinedEntries.slice(indexT, indexT + 3).map((entry, index) => (
              <div
                key={index}
                className="flex justify-between bg-white p-2 border-b border-gray-300"
              >
                <div className="flex space-x-2">
                  <div className="box1">
                    <div className="flex-1 text-center">
                      <div className="text-center text-black rounded-full w-12 h-12 flex items-center justify-center">
                        <FontAwesomeIcon icon={getCategoryIcon(entry.Category)} style={{ color: categoryColors[entry.Category], fontSize: "1.4rem" }} />
                      </div>
                    </div>
                  </div>
                  <div className="box2">
                    <div className="flex-1 text-center">
                      <div className="font-bold">{entry.Category}</div>
                      <div className='text-gray-500 text-sm'>
                        {/* {entry?.Date.split("T")[0].split("-")[2]} */}
                        {new Date(entry.Date).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: '2-digit',
                          timeZone: 'UTC',
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="box3">
                  <div className="flex-1 text-center">
                    {entry.ExpenseAmount ? (
                      <div className="text-red-600 font-bold-400"><FontAwesomeIcon icon={faMinus} /><span>  </span><FontAwesomeIcon icon={faIndianRupee} />{entry.ExpenseAmount}</div>
                    ) : (
                      <div className="text-green-500 font-bold-400"><FontAwesomeIcon icon={faPlus} /><span>  </span><FontAwesomeIcon icon={faIndianRupee} />{entry.IncomeAmount}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className='flex justify-between w-full'>
            {leftT ? (
              <div className='bg-gray-400 w-7 h-7 flex items-center justify-center rounded-md border border-gray-500 cursor-pointer' onClick={LeftArrowT}>
                <FontAwesomeIcon icon={faChevronLeft} style={{ color: "black" }} />
              </div>
            ) : (
              <div className='bg-gray-200 w-7 h-7 flex items-center justify-center rounded-md border border-gray-500 cursor-pointer'>
                <FontAwesomeIcon icon={faChevronLeft} style={{ color: "black" }} />
              </div>
            )}

            {rightT && endingIndex >= 0 ? (
              <div className='bg-gray-400 w-7 h-7 flex items-center justify-center rounded-md border border-gray-500 cursor-pointer' onClick={RightArrowT}>
                <FontAwesomeIcon icon={faChevronRight} style={{ color: "black" }} />
              </div>
            ) : (
              <div className='bg-gray-200 w-7 h-7 flex items-center justify-center rounded-md border border-gray-500 cursor-pointer'>
                <FontAwesomeIcon icon={faChevronRight} style={{ color: "black" }} />
              </div>
            )}
          </div>
        </div>

        {/* <!-- Categories Section --> */}
        <div className="w-full md:w-3/6 h-auto md:h-[20rem] bg-white p-4 md:p-10 rounded-lg shadow-md m-2 md:m-4 border border-gray-200">
          <div>
            <div className="text-lg font-bold flex ml-[-0.8rem] mt-[-1.2rem]">Category</div>
            {
              leftC ? <PieChartComponent data1={data1} /> : <PieChartComponent data1={data2} />
            }

            <div className='flex justify-between m-2 w-full'>
              {leftC ? (
                <div className='bg-gray-400 w-7 h-7 flex items-center justify-center rounded-md border border-gray-500 cursor-pointer' onClick={LeftArrowC}>
                  <FontAwesomeIcon icon={faChevronLeft} style={{ color: "black" }} />
                </div>
              ) : (
                <div className='bg-gray-200 w-7 h-7 flex items-center justify-center rounded-md border border-gray-500 cursor-pointer'>
                  <FontAwesomeIcon icon={faChevronLeft} style={{ color: "black" }} />
                </div>
              )}

              {rightC ? (
                <div className='bg-gray-400 w-7 h-7 flex items-center justify-center rounded-md border border-gray-500 cursor-pointer' onClick={RightArrowC}>
                  <FontAwesomeIcon icon={faChevronRight} style={{ color: "black" }} />
                </div>
              ) : (
                <div className='bg-gray-200 w-7 h-7 flex items-center justify-center rounded-md border border-gray-500 cursor-pointer'>
                  <FontAwesomeIcon icon={faChevronRight} style={{ color: "black" }} />
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

    </div >
  );
}

export default Home