import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faChartSimple, faChevronRight, faEllipsis, faHouseCircleCheck, faIndianRupee, faReceipt, faSuitcaseMedical, faVideo, faPizzaSlice, faBurger, faCartShopping, faPlane, faCircle, faCirclePlus, faCheck, faXmark, faRupee, faWallet, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import LottieAnimation from './LottieAnimation';
import { account, databases, storage } from '../appwrite/appwriteConfig';
import { v4 as uuidv4 } from 'uuid'
import conf from '../conf/conf'
import { Query } from 'appwrite';
import LottieLoader from './LottieLoader';

function Expense() {
    const divRef = useRef(null);

    // for animation
    const [animation1, setanimation1] = useState(false);
    const [animation2, setanimation2] = useState(false);

    // for amount
    const [amount, setAmount] = useState('');

    const handleInputChange = (event) => {
        const value = event.target.value;
        if (!isNaN(value)) {
            setAmount(value);
        }
    };

    // for category selection
    const [selectedCategory, setSelectedCategory] = useState({ icon: faEllipsis, text: 'others', col: '#94969B' });
    const settingCategory = (icon, text, col) => {
        setSelectedCategory({ icon, text, col });
    };

    // for arrow icon
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (divRef.current && !divRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    const handleIconClick = () => {
        setIsOpen(!isOpen);
    };

    // for Date
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const fD = new Date(formattedDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: '2-digit'
    });
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const formattedDateTime = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}
    ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // for getting Account
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await account.get();
                setUserId(response.$id);
            } catch (error) {
                console.error('Failed to get user:', error);
            }
        };
        getUser();
    }, []);

    // for bucket2
    const [fileName, setFileName] = useState(null);
    const fileInputRef = useRef(null);
    const fileId = uuidv4();
    const [recieptUrl, setRecieptUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file)
            setFileName(file.name);
        }
    };
    const handleIconClickFile = () => {
        fileInputRef.current.click();
    };

    // for selecting whether Income or Expense
    const [choice, setChoice] = useState('Expense');
    const chooseIncome = () => {
        setChoice('Income');
    };
    const chooseExpense = () => {
        setChoice('Expense');
    };

    // adding New in collections
    const addNew = async () => {
        if (!userId) return;
        console.log('User ID being queried:', userId);
        setanimation1(true);

        if (choice == 'Income') {
            // checking collection6(categoryIncome)
            const res = await databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollection6Id,
                [
                    Query.equal('userid', userId)
                ]
            )
            if (res.total > 0) {
                console.log('Entry exists');

                // for bucket 3
                if (selectedFile) {
                    await storage.createFile(conf.appwriteBucket3Id, fileId, selectedFile);
                }

                // for collection 5
                const income = {
                    userid: String(userId),
                    IncomeAmount: Number(amount),
                    Category: String(selectedCategory.text),
                    Date: String(formattedDateTime),
                    if(selectedFile) {
                        ReceiptId: fileId
                    }

                }
                const promise = databases.createDocument(conf.appwriteDatabaseId, conf.appwriteCollection5Id, uuidv4(), income)
                promise.then(() => {
                    const item = selectedCategory.text;
                    const document = res.documents[0];
                    const documentId = document.$id;
                    const value = document[selectedCategory.text];
                    const updatedData = {
                        [selectedCategory.text]: value + Number(amount),
                    };
                    const promise4 = databases.updateDocument(conf.appwriteDatabaseId, conf.appwriteCollection6Id, documentId, updatedData);

                    promise4.then(() => {
                        console.log("Done");
                        setanimation1(false);
                        setanimation2(true);
                        setTimeout(() => {
                            setanimation2(false);
                        }, 1000);

                    })

                })
            } else {
                console.log('Entry does not exist');

                // for bucket 3
                if (selectedFile) {
                    await storage.createFile(conf.appwriteBucket3Id, fileId, selectedFile);
                }
                // for collection 5
                const income = {
                    userid: String(userId),
                    IncomeAmount: Number(amount),
                    Category: String(selectedCategory.text),
                    Date: String(formattedDateTime),
                    if(selectedFile) {
                        ReceiptId: fileId
                    }
                }
                const promise = databases.createDocument(conf.appwriteDatabaseId, conf.appwriteCollection5Id, uuidv4(), income)

                // for collection6
                const data = {
                    userid: String(userId),
                    others: Number(0),
                    Salary: Number(0),
                    Sold: Number(0),
                }
                if (income.Category in data) {
                    data[income.Category] = income.IncomeAmount;
                }

                const promise4 = databases.createDocument(conf.appwriteDatabaseId, conf.appwriteCollection6Id, uuidv4(), data);
                promise4.then(() => {
                    console.log("Done");
                    setanimation1(false);
                    setanimation2(true);
                    setTimeout(() => {
                        setanimation2(false);
                    }, 2000);
                })
            }
        }
        else {
            // checking collection4(categoryExpense)
            const res = await databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollection4Id,
                [
                    Query.equal('userid', userId)
                ]
            )
            if (res.total > 0) {
                console.log('Entry exists');

                // for bucket 2
                if (selectedFile) {
                    await storage.createFile(conf.appwriteBucket2Id, fileId, selectedFile);
                }

                // for collection 2
                const expense = {
                    userid: String(userId),
                    ExpenseAmount: Number(amount),
                    Category: String(selectedCategory.text),
                    Date: String(formattedDateTime),
                    if(selectedFile) {
                        ReceiptId: fileId
                    }

                }
                const promise = databases.createDocument(conf.appwriteDatabaseId, conf.appwriteCollection2Id, uuidv4(), expense)
                promise.then(() => {
                    const item = selectedCategory.text;
                    const document = res.documents[0];
                    const documentId = document.$id;
                    if (selectedCategory.text === 'Food') {
                        const value = document.Food;
                        const updatedData = {
                            Food: value + Number(amount),
                        };
                        const promise4 = databases.updateDocument(conf.appwriteDatabaseId, conf.appwriteCollection4Id, documentId, updatedData);
                        promise.then(() => {
                            console.log("Done");
                            setanimation1(false);
                            setanimation2(true);
                            setTimeout(() => {
                                setanimation2(false);
                            }, 2000);

                        })

                    } else {
                        const value = document[selectedCategory.text];
                        const updatedData = {
                            [selectedCategory.text]: value + Number(amount),
                        };
                        const promise4 = databases.updateDocument(conf.appwriteDatabaseId, conf.appwriteCollection4Id, documentId, updatedData);

                        promise4.then(() => {
                            console.log("Done");
                            setanimation1(false);
                            setanimation2(true);
                            setTimeout(() => {
                                setanimation2(false);
                            }, 2000);

                        })
                    }
                })
            } else {
                console.log('Entry does not exist');

                // for bucket 2
                if (selectedFile) {
                    await storage.createFile(conf.appwriteBucket2Id, fileId, selectedFile);
                }
                // for collection 2
                const expense = {
                    userid: String(userId),
                    ExpenseAmount: Number(amount),
                    Category: String(selectedCategory.text),
                    Date: String(formattedDateTime),
                    if(selectedFile) {
                        ReceiptId: fileId
                    }
                }
                const promise = databases.createDocument(conf.appwriteDatabaseId, conf.appwriteCollection2Id, uuidv4(), expense)

                // for collection4
                const data = {
                    userid: String(userId),
                    others: Number(0),
                    Food: Number(0),
                    Shopping: Number(0),
                    Travelling: Number(0),
                    Entertainment: Number(0),
                    Medical: Number(0),
                    Bills: Number(0),
                    Rent: Number(0),
                    Taxes: Number(0),
                    Investments: Number(0),
                }
                if (selectedCategory.text === 'Food') {
                    data['Food'] = expense.ExpenseAmount;
                } else {
                    if (expense.Category in data) {
                        data[expense.Category] = expense.ExpenseAmount;
                    }
                }
                const promise4 = databases.createDocument(conf.appwriteDatabaseId, conf.appwriteCollection4Id, uuidv4(), data);
                promise4.then(() => {
                    console.log("Done");
                    setanimation1(false);
                    setanimation2(true);
                    setTimeout(() => {
                        setanimation2(false);
                    }, 2000);
                })
            }
        }
    }

    return (
        <div className="flex flex-wrap justify-center h-screen ml-[7rem] bg-gradient-to-r items-center">
            {/* first div */}
            <div className="w-full h-[90%] max-w-md bg-white rounded-lg shadow-md flex flex-col mr-6  bg-white/30  border border-white/50  p-6">
                <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-[20px]  text-black">{fD}</div>
                        {choice === "Expense" ? <>  <div
                            className="text-sm text-[17px] text-white cursor-pointer bg-gray-300 w-[7rem] h-[2.7rem] border rounded-md flex items-center justify-center"
                            onClick={chooseIncome}
                        >
                            Income
                        </div>
                            <div
                                className="text-sm text-[17px] text-white cursor-pointer bg-gray-600 w-[7rem] h-[2.7rem] border rounded-md flex items-center justify-center"
                                onClick={chooseExpense}
                            >
                                Expense
                            </div></> : <>  <div
                                className="text-sm text-[17px] text-white cursor-pointer bg-gray-600 w-[7rem] h-[2.7rem] border rounded-md flex items-center justify-center"
                                onClick={chooseIncome}
                            >
                                Income
                            </div>
                            <div
                                className="text-sm text-[17px] text-white cursor-pointer bg-gray-300 w-[7rem] h-[2.7rem] border rounded-md flex items-center justify-center"
                                onClick={chooseExpense}
                            >
                                Expense
                            </div></>}
                    </div>
                </div>
                <div className="flex-grow overflow-y-auto p-4">
                    <div className="mb-4">
                        <div className="text-sm font-medium text-gray-700 mb-1">
                            <div className="flex text-[0.7rem]">Amount</div>
                            <div className="flex">
                                <div className='text-[1.5rem]'><FontAwesomeIcon icon={faIndianRupee} />
                                    <input type='text' className='bg-transparent border-none focus:outline-none' onChange={handleInputChange} value={amount} placeholder="0"></input></div>
                            </div>
                        </div>
                    </div>

                    {/* category */}
                    {choice === 'Expense' ? (<div className="mb-4">
                        <div className="text-sm font-medium text-gray-700 mb-1">
                            <div className="flex text-[0.7rem]">Category</div>
                            <div className="flex justify-between">
                                <div className='text-[1.3rem]'>
                                <FontAwesomeIcon
                                        icon={selectedCategory.icon}
                                        style={{ color: selectedCategory.col }}
                                    />
                                    <span>{selectedCategory.text}</span>
                                </div>
                                <div className='cursor-pointer' onClick={handleIconClick}>{isOpen ? <FontAwesomeIcon icon={faAngleDown} /> : <FontAwesomeIcon icon={faChevronRight} />}</div>
                            </div>
                            {isOpen && (
                                <div
                                    ref={divRef}
                                    className="grid grid-cols-2 md:grid-cols-3 gap-4 p-3 h-[16rem] bg-gray-200 rounded shadow-md mt-2"
                                >
                                    <div onClick={() => settingCategory(faEllipsis, 'others', '#94969B')} className="flex items-center justify-center cursor-pointer">
                                        <div className="cursor-pointer bg-gray-300 text-center text-black rounded-full w-8 h-8 flex items-center justify-center">
                                            <FontAwesomeIcon icon={faEllipsis} color='#94969B' /> </div>others</div>

                                    <div
                                        onClick={() => settingCategory(faBurger, 'Food', '#FFBF00')}
                                        className="flex items-center space-x-2 cursor-pointer"
                                    >
                                        <div className="bg-gray-300 text-center text-black rounded-full w-8 h-8 flex items-center justify-center">
                                            <FontAwesomeIcon icon={faBurger} color="#FFBF00" />
                                        </div>
                                        <span>Food</span>
                                    </div>

                                    <div onClick={() => settingCategory(faCartShopping, 'Shopping', '#4D4DFF')} className="flex items-center justify-center cursor-pointer"> <div className="bg-gray-300 text-center text-black rounded-full w-8 h-8 flex items-center justify-center"><FontAwesomeIcon icon={faCartShopping} color="#4D4DFF" /></div>Shopping</div>

                                    <div onClick={() => settingCategory(faPlane, 'Travelling', 'purple')} className="flex items-center justify-center cursor-pointer"> <div className="bg-gray-300 text-center text-black rounded-full w-8 h-8 flex items-center justify-center"><FontAwesomeIcon icon={faPlane} color="purple" /></div>Travelling</div>

                                    <div onClick={() => settingCategory(faHouseCircleCheck, 'Rent', '#005F6A')} className="flex items-center justify-center cursor-pointer"> <div className="bg-gray-300 text-center text-black rounded-full w-8 h-8 flex items-center justify-center"><FontAwesomeIcon icon={faHouseCircleCheck} color="#005F6A" /></div>Rent</div>

                                    <div onClick={() => settingCategory(faVideo, 'Entertainment', '#FF6F61')} className="flex items-center justify-center cursor-pointer"> <div className="bg-gray-300 text-center text-black rounded-full w-8 h-8 flex items-center justify-center"><FontAwesomeIcon icon={faVideo} color="#FF6F61" /></div>Entertainment</div>

                                    <div onClick={() => settingCategory(faSuitcaseMedical, 'Medical', 'red')} className="flex items-center justify-center cursor-pointer"> <div className="bg-gray-300 text-center text-black rounded-full w-8 h-8 flex items-center justify-center"><FontAwesomeIcon icon={faSuitcaseMedical} color="red" /></div>Medical</div>

                                    <div onClick={() => settingCategory(faReceipt, 'Bills', '#797982')} className="flex items-center justify-center cursor-pointer"> <div className="bg-gray-300 text-center text-black rounded-full w-8 h-8 flex items-center justify-center"><FontAwesomeIcon icon={faReceipt} color="#797982" /></div>Bills</div>

                                    <div onClick={() => settingCategory(faIndianRupee, 'Taxes', '#721322')} className="flex items-center justify-center cursor-pointer"> <div className="bg-gray-300 text-center text-black rounded-full w-8 h-8 flex items-center justify-center"><FontAwesomeIcon icon={faIndianRupee} color="#721322" /></div>Taxes</div>

                                    <div onClick={() => settingCategory(faChartSimple, 'Investments', '#32CD32')} className="flex items-center justify-center cursor-pointer"> <div className="bg-gray-300 text-center text-black rounded-full w-8 h-8 flex items-center justify-center"><FontAwesomeIcon icon={faChartSimple} color="#32CD32" /></div>Investments</div>
                                </div>
                            )}

                        </div>
                    </div>) : (<div className="mb-4">
                        <div className="text-sm font-medium text-gray-700 mb-1">
                            <div className="flex text-[0.7rem]">Category</div>
                            <div className="flex justify-between">
                                <div className='text-[1.3rem]'>
                                    <FontAwesomeIcon
                                        icon={selectedCategory.icon}
                                        style={{ color: selectedCategory.col }}
                                    />
                                    <span>{selectedCategory.text}</span>
                                </div>
                                <div className='cursor-pointer' onClick={handleIconClick}><FontAwesomeIcon icon={faChevronRight} /></div>
                            </div>
                            {/* here */}
                            {isOpen && (
                                <div ref={divRef} className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 h-[16rem] bg-gray-200 rounded shadow-md mt-2">
                                    <div onClick={() => settingCategory(faEllipsis, 'others', 'black')} className="flex items-center justify-center cursor-pointer"><div className='bg-gray-300 text-center text-black rounded-full w-8 h-8 flex items-center justify-center'><FontAwesomeIcon icon={faEllipsis} color='#94969B' /> </div>others</div>
                                    <div onClick={() => settingCategory(faWallet, 'Salary', 'lightgreen')} className="flex items-center justify-center cursor-pointer"><div className='bg-gray-300 text-center text-black rounded-full w-8 h-8 flex items-center justify-center'><FontAwesomeIcon icon={faWallet} color="lightgreen" /> </div>Salary</div>
                                    <div onClick={() => settingCategory(faCartShopping, 'Sold', 'brown')} className="flex items-center justify-center cursor-pointer"><div className='bg-gray-300 text-center text-black rounded-full w-8 h-8 flex items-center justify-center'><FontAwesomeIcon icon={faCartShopping} color="brown" /></div>Sold</div>
                                </div>
                            )}
                        </div>
                    </div>)}
                    {animation1 && <LottieLoader />}
                    {animation2 && <LottieAnimation />}
                </div>
                <div className='flex justify-between m-2 w-full'>
                    <div className='p-2 cursor-pointer' onClick={addNew}>
                        <FontAwesomeIcon icon={faXmark} /> Cancel
                    </div>
                    <div className='ml-[-4rem] p-2 cursor-pointer' onClick={addNew}>
                        <FontAwesomeIcon icon={faCheck} /> Save
                    </div>
                </div>

            </div>

            {/* second div */}
            <div className="w-full h-[90%] max-w-md bg-white rounded-lg shadow-md flex flex-col items-center justify-center p-4 bg-white/30 border-white/50">
                <div className="w-[95%] h-[90%] bg-white rounded-lg flex flex-col justify-center items-center border-2 border-dotted border-gray-500 p-4 bg-white/30 backdrop-blur-md border-white/50 hover:border-gray-600 hover:shadow-[0_0_20px_5px_rgba(0, 68, 255, 0.8)] transition-all duration-300 ease-in-out">
                    <div className='text-[2rem]'> Add Receipt</div>
                    <div>Upload your receipt for better tracking</div>
                    <FontAwesomeIcon className='w-[11%] h-[11%] cursor-pointer text-gray-600' icon={faCirclePlus} onClick={handleIconClickFile} />
                    <input
                        type="file" ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    {fileName && (
                        <div className="mt-2 text-sm text-gray-600">
                            Selected file: {fileName}
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}

export default Expense;