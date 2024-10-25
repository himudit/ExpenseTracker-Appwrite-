import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faChartSimple, faChevronRight, faEllipsis, faHouseCircleCheck, faIndianRupee, faReceipt, faSuitcaseMedical, faVideo, faPizzaSlice, faCartShopping, faPlane, faCircle, faCirclePlus, faCheck, faXmark, faRupee, faWallet } from '@fortawesome/free-solid-svg-icons';
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
    const [amount, setAmount] = useState(0);
    const handleInputChange = (event) => {
        const value = event.target.value;
        if (amount === 0) {
            setAmount('');
        } else {
            setAmount(value);
        }
    };

    // for category selection
    const [selectedCategory, setSelectedCategory] = useState({ icon: faEllipsis, text: 'others' });
    const settingCategory = (icon, text) => {
        setSelectedCategory({ icon, text });
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
                        }, 2000);

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
                    if (selectedCategory.text === 'Food & Dining') {
                        const value = document.FoodDining;
                        const updatedData = {
                            FoodDining: value + Number(amount),
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
                    FoodDining: Number(0),
                    Shopping: Number(0),
                    Travelling: Number(0),
                    Entertainment: Number(0),
                    Medical: Number(0),
                    Bills: Number(0),
                    Rent: Number(0),
                    Taxes: Number(0),
                    Investments: Number(0),
                }
                if (selectedCategory.text === 'Food & Dining') {
                    data['FoodDining'] = expense.ExpenseAmount;
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
        <div className="flex flex-wrap justify-center h-screen ml-[7rem] bg-gradient-to-r from-gray-100  to-blue-900 items-center">
            {/* // <div className="flex flex-wrap justify-center h-screen ml-[7rem] "> */}

            {/* first div */}
            <div className="w-full h-[90%] max-w-md bg-white rounded-lg shadow-md flex flex-col mr-6  bg-white/30 backdrop-blur-md border border-white/50  p-6">
                <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                        <div className="text-sm font-medium text-gray-600">{formattedDate}</div>
                        <div className="text-sm font-medium text-gray-600">{formattedTime}</div>
                    </div>
                </div>
                <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                        <div className="text-sm font-medium text-gray-600 cursor-pointer" onClick={chooseIncome}>Income</div>
                        <div className="text-sm font-medium text-gray-600 cursor-pointer" onClick={chooseExpense}>Expense</div>
                    </div>
                </div>
                <div className="flex-grow overflow-y-auto p-4">
                    <div className="mb-4">
                        <div className="text-sm font-medium text-gray-700 mb-1">
                            <div className="flex text-[0.7rem]">Amount</div>
                            <div className="flex">
                                <div className='text-[1.5rem]'><FontAwesomeIcon icon={faIndianRupee} />
                                    <input type='text' className='bg-transparent border-none focus:outline-none' onChange={handleInputChange} value={amount}></input></div>
                            </div>
                        </div>
                    </div>

                    {/* category */}
                    {choice === 'Expense' ? (<div className="mb-4">
                        <div className="text-sm font-medium text-gray-700 mb-1">
                            <div className="flex text-[0.7rem]">Category</div>
                            <div className="flex justify-between">
                                <div className='text-[1.3rem]'>
                                    <FontAwesomeIcon icon={selectedCategory.icon} className="mr-2" />
                                    <span>{selectedCategory.text}</span>
                                </div>
                                <div className='cursor-pointer' onClick={handleIconClick}><FontAwesomeIcon icon={faChevronRight} /></div>
                            </div>
                            {isOpen && (
                                <div ref={divRef} className="grid grid-cols-3 gap-4 p-4 h-[13rem] bg-gray-200 rounded shadow-md mt-2">
                                    <div onClick={() => settingCategory(faEllipsis, 'others')} className="flex items-center justify-center cursor-pointer"><div className='cursor-pointer'><FontAwesomeIcon icon={faEllipsis} /> </div>others</div>
                                    <div onClick={() => settingCategory(faPizzaSlice, 'Food & Dining')} className="flex items-center justify-center cursor-pointer"><div className='cursor-pointer'><FontAwesomeIcon icon={faPizzaSlice} /> </div>Food & Dining</div>
                                    <div onClick={() => settingCategory(faCartShopping, 'Shopping')} className="flex items-center justify-center cursor-pointer"><div className='cursor-pointer'><FontAwesomeIcon icon={faCartShopping} /></div>Shopping</div>
                                    <div onClick={() => settingCategory(faPlane, 'Travelling')} className="flex items-center justify-center cursor-pointer"><div className='cursor-pointer'><FontAwesomeIcon icon={faPlane} /></div>Travelling</div>
                                    <div onClick={() => settingCategory(faVideo, 'Entertainment')} className="flex items-center justify-center cursor-pointer"><div className='cursor-pointer'><FontAwesomeIcon icon={faVideo} /></div>Entertainment</div>
                                    <div onClick={() => settingCategory(faSuitcaseMedical, 'Medical')} className="flex items-center justify-center cursor-pointer"><div className='cursor-pointer'><FontAwesomeIcon icon={faSuitcaseMedical} /></div>Medical</div>
                                    <div onClick={() => settingCategory(faReceipt, 'Bills')} className="flex items-center justify-center cursor-pointer"><div className='cursor-pointer'><FontAwesomeIcon icon={faReceipt} /></div>Bills</div>
                                    <div onClick={() => settingCategory(faHouseCircleCheck, 'Rent')} className="flex items-center justify-center cursor-pointer"><div className='cursor-pointer'><FontAwesomeIcon icon={faHouseCircleCheck} /></div>Rent</div>
                                    <div onClick={() => settingCategory(faIndianRupee, 'Taxes')} className="flex items-center justify-center cursor-pointer"><div className='cursor-pointer'><FontAwesomeIcon icon={faIndianRupee} /></div>Taxes</div>
                                    <div onClick={() => settingCategory(faChartSimple, 'Investments')} className="flex items-center justify-center cursor-pointer"><div className='cursor-pointer'><FontAwesomeIcon icon={faChartSimple} /></div>Investments</div>
                                </div>

                            )}

                        </div>
                    </div>) : (<div className="mb-4">
                        <div className="text-sm font-medium text-gray-700 mb-1">
                            <div className="flex text-[0.7rem]">Category</div>
                            <div className="flex justify-between">
                                <div className='text-[1.3rem]'>
                                    <FontAwesomeIcon icon={selectedCategory.icon} className="mr-2" />
                                    <span>{selectedCategory.text}</span>
                                </div>
                                <div className='cursor-pointer' onClick={handleIconClick}><FontAwesomeIcon icon={faChevronRight} /></div>
                            </div>
                            {isOpen && (
                                <div ref={divRef} className="grid grid-cols-3 gap-4 p-4 h-[13rem] bg-gray-200 rounded shadow-md mt-2">
                                    <div onClick={() => settingCategory(faEllipsis, 'others')} className="flex items-center justify-center cursor-pointer"><div className='cursor-pointer'><FontAwesomeIcon icon={faEllipsis} /> </div>others</div>
                                    <div onClick={() => settingCategory(faWallet, 'Salary')} className="flex items-center justify-center cursor-pointer"><div className='cursor-pointer'><FontAwesomeIcon icon={faWallet} /> </div>Salary</div>
                                    <div onClick={() => settingCategory(faCartShopping, 'Sold')} className="flex items-center justify-center cursor-pointer"><div className='cursor-pointer'><FontAwesomeIcon icon={faCartShopping} /></div>Sold-items</div>
                                </div>
                            )}
                        </div>
                    </div>)}
                    {animation1 && <LottieLoader />}
                    {animation2 && <LottieAnimation />}
                </div>
                <div className='flex flex-end m-2 w-full'>
                    <div className='p-3 cursor-pointer' onClick={addNew}>
                        <FontAwesomeIcon icon={faXmark} /> Cancel
                    </div>
                    <div className='p-3 cursor-pointer' onClick={addNew}>
                        <FontAwesomeIcon icon={faCheck} /> Save
                    </div>
                </div>

            </div>

            {/* second div */}
            <div className="w-full h-[90%] max-w-md bg-white rounded-lg shadow-md flex flex-col items-center justify-center p-4 bg-white/30 backdrop-blur-md border-white/50">
                <div className="w-[95%] h-[90%] bg-white rounded-lg flex flex-col justify-center items-center border-2 border-dotted border-gray-500 p-4 bg-white/30 backdrop-blur-md border-white/50 hover:border-blue-800 hover:shadow-[0_0_20px_5px_rgba(0, 68, 255, 0.8)] transition-all duration-300 ease-in-out">
                    Add Receipt
                    <FontAwesomeIcon className='w-[10%] h-[10%] cursor-pointer' icon={faCirclePlus} onClick={handleIconClickFile} />
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