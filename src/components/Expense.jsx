import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartSimple, faChevronRight, faEllipsis, faHouseCircleCheck, faIndianRupee, faReceipt, faSuitcaseMedical, faVideo, faBurger, faCartShopping, faPlane, faCirclePlus, faCheck, faXmark, faWallet, faAngleDown } from '@fortawesome/free-solid-svg-icons';
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

    // submission lock (was used but never declared before — fixed)
    const [isSubmitting, setIsSubmitting] = useState(false);

    // for amount
    const [amount, setAmount] = useState('');

    const handleInputChange = (event) => {
        const value = event.target.value;
        // allow empty, or a non-negative number with at most one decimal point
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
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
        setIsOpen((prev) => (!prev));
    };

    // for Date (display only — actual save uses a fresh timestamp at submit time)
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const fD = new Date(formattedDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: '2-digit'
    });

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

    // for bucket2/bucket3 uploads
    const [fileName, setFileName] = useState(null);
    const fileInputRef = useRef(null);
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

    // Recurring Transaction
    const [isRecurring, setIsRecurring] = useState(false);
    const [interval, setInterval] = useState('');

    // adding New in collections
    const addNew = async () => {
        if (!userId) return;
        if (!amount || Number(amount) <= 0) {
            alert("Amount must be greater than zero!");
            return;
        }
        if (isRecurring && !interval) {
            alert("Please select a recurring interval!");
            return;
        }
        if (isSubmitting) return; // guard against double taps

        setIsSubmitting(true);
        setanimation1(true);

        try {
            const submitTime = new Date();
            const y = submitTime.getFullYear();
            const m = (submitTime.getMonth() + 1).toString().padStart(2, '0');
            const d = submitTime.getDate().toString().padStart(2, '0');
            const h = submitTime.getHours().toString().padStart(2, '0');
            const min = submitTime.getMinutes().toString().padStart(2, '0');
            const s = submitTime.getSeconds().toString().padStart(2, '0');
            const formattedDateTime = `${y}-${m}-${d} ${h}:${min}:${s}`;

            // fresh id per submission — avoids collisions with previously uploaded files
            const currentFileId = uuidv4();

            if (isRecurring) {
                const payload = {
                    userid: userId,
                    amount: parseInt(amount),
                    type: choice.toLowerCase(),
                    category: selectedCategory.text.toLowerCase(),
                    frequency: interval.toLowerCase(),
                    startDate: submitTime.toISOString(),
                    endDate: null,
                    isActive: true,
                };
                await databases.createDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollection7Id,
                    uuidv4(),
                    payload
                );
            }

            if (choice === 'Income') {
                const res = await databases.listDocuments(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollection6Id,
                    [Query.equal('userid', userId)]
                );

                if (selectedFile) {
                    const recieptResponse = await storage.createFile(conf.appwriteBucket3Id, currentFileId, selectedFile);
                    console.log(recieptResponse);
                }

                const income = {
                    userid: String(userId),
                    IncomeAmount: Number(amount),
                    Category: String(selectedCategory.text),
                    Date: String(formattedDateTime),
                };
                await databases.createDocument(conf.appwriteDatabaseId, conf.appwriteCollection5Id, uuidv4(), income);

                if (res.total > 0) {
                    const document = res.documents[0];
                    const documentId = document.$id;
                    const value = document[selectedCategory.text] ?? 0;
                    const updatedData = {
                        [selectedCategory.text]: value + Number(amount),
                    };
                    await databases.updateDocument(conf.appwriteDatabaseId, conf.appwriteCollection6Id, documentId, updatedData);
                } else {
                    const data = {
                        userid: String(userId),
                        others: Number(0),
                        Salary: Number(0),
                        Sold: Number(0),
                    };
                    if (income.Category in data) {
                        data[income.Category] = income.IncomeAmount;
                    }
                    await databases.createDocument(conf.appwriteDatabaseId, conf.appwriteCollection6Id, uuidv4(), data);
                }
            } else {
                const res = await databases.listDocuments(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollection4Id,
                    [Query.equal('userid', userId)]
                );

                if (selectedFile) {
                    const recieptResponse = await storage.createFile(conf.appwriteBucket2Id, currentFileId, selectedFile);
                    console.log(recieptResponse);
                }

                const expense = {
                    userid: String(userId),
                    ExpenseAmount: Number(amount),
                    Category: String(selectedCategory.text),
                    Date: String(formattedDateTime),
                };
                await databases.createDocument(conf.appwriteDatabaseId, conf.appwriteCollection2Id, uuidv4(), expense);

                if (res.total > 0) {
                    const document = res.documents[0];
                    const documentId = document.$id;
                    const value = document[selectedCategory.text] ?? 0;
                    const updatedData = {
                        [selectedCategory.text]: value + Number(amount),
                    };
                    await databases.updateDocument(conf.appwriteDatabaseId, conf.appwriteCollection4Id, documentId, updatedData);
                } else {
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
                    };
                    if (expense.Category in data) {
                        data[expense.Category] = expense.ExpenseAmount;
                    }
                    await databases.createDocument(conf.appwriteDatabaseId, conf.appwriteCollection4Id, uuidv4(), data);
                }
            }

            setanimation1(false);
            setanimation2(true);
            setTimeout(() => {
                setanimation2(false);
            }, 1000);
        } catch (error) {
            console.error("Error saving transaction:", error);
            alert("Something went wrong while saving. Please try again.");
            setanimation1(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    const cancelAll = () => {
        setAmount('');
        setSelectedCategory({ icon: faEllipsis, text: 'others', col: '#94969B' });
        setSelectedFile(null);
        setFileName(null);
        setIsRecurring(false);
        setInterval('');
    }

    return (
        <>
            <div
                className={`flex flex-wrap justify-center h-screen md:ml-[7rem] bg-gradient-to-r items-center`}
                style={{ filter: (animation1 || animation2) ? "blur(1px)" : "none" }}
            >
                {/* first div */}
                <div className="w-full h-[95%] max-w-md bg-white rounded-lg shadow-2xl flex flex-col mr-6  bg-white/30  border border-white/50  p-6">
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
                    <div className="flex-grow overflow-y-scroll p-4">
                        <div className="mb-4">
                            <div className="text-sm font-medium text-gray-700 mb-1">
                                <div className="flex text-[0.7rem]">Amount</div>
                                <div className="flex">
                                    <div className='text-[1.5rem]'><FontAwesomeIcon icon={faIndianRupee} />
                                        <input type='text' inputMode='decimal' className='bg-transparent border-none focus:outline-none' onChange={handleInputChange} value={amount} placeholder="0"></input></div>
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
                                        <span>  </span>
                                        <span>{selectedCategory.text}</span>
                                    </div>
                                    <button
                                        type="button"
                                        className="w-5 h-5  p-2 rounded inline-flex items-center justify-center"
                                        onClick={handleIconClick}
                                    >
                                        <FontAwesomeIcon icon={isOpen ? faAngleDown : faChevronRight} className="text-lg" />
                                    </button>

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
                                        <span>  </span>
                                        <span>{selectedCategory.text}</span>
                                    </div>
                                    <div className='cursor-pointer' onClick={handleIconClick}><FontAwesomeIcon icon={faChevronRight} /></div>
                                </div>
                                {isOpen && (
                                    <div ref={divRef} className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 h-[16rem] bg-gray-200 rounded shadow-md mt-2">
                                        <div onClick={() => settingCategory(faEllipsis, 'others', 'black')} className="flex items-center justify-center cursor-pointer"><div className='bg-gray-300 text-center text-black rounded-full w-8 h-8 flex items-center justify-center'><FontAwesomeIcon icon={faEllipsis} color='#94969B' /> </div>others</div>
                                        <div onClick={() => settingCategory(faWallet, 'Salary', 'lightgreen')} className="flex items-center justify-center cursor-pointer"><div className='bg-gray-300 text-center text-black rounded-full w-8 h-8 flex items-center justify-center'><FontAwesomeIcon icon={faWallet} color="lightgreen" /> </div>Salary</div>
                                        <div onClick={() => settingCategory(faCartShopping, 'Sold', 'brown')} className="flex items-center justify-center cursor-pointer"><div className='bg-gray-300 text-center text-black rounded-full w-8 h-8 flex items-center justify-center'><FontAwesomeIcon icon={faCartShopping} color="brown" /></div>Sold</div>
                                    </div>
                                )}
                            </div>
                        </div>)}
                        <div className="-mt-3 -ml-[1.8rem] max-w-lg p-6 border-none bg-white/30 border  space-y-6">
                            {/* Toggle */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Recurring Transaction</h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsRecurring(!isRecurring)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isRecurring ? 'bg-gray-700' : 'bg-gray-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isRecurring ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            {/* Recurring Interval Dropdown */}
                            {isRecurring && (
                                <div>
                                    <select
                                        id="interval"
                                        className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700 text-sm"
                                        value={interval}
                                        onChange={(e) => setInterval(e.target.value)}
                                    >
                                        <option value="" disabled hidden>
                                            Select interval
                                        </option>
                                        <option>Daily</option>
                                        <option>Weekly</option>
                                        <option>Monthly</option>
                                        <option>Yearly</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='flex justify-between m-2 w-full'>
                        <div className='p-2 cursor-pointer' onClick={cancelAll}>
                            <FontAwesomeIcon icon={faXmark} /> Cancel
                        </div>
                        <div
                            className={`ml-[-4rem] p-2 ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                            onClick={isSubmitting ? undefined : addNew}
                        >
                            <FontAwesomeIcon icon={faCheck} /> {isSubmitting ? 'Saving...' : 'Save'}
                        </div>
                    </div>

                </div>

                {/* second div */}
                <div className="w-full h-[95%] max-w-md bg-white rounded-lg shadow-2xl flex flex-col items-center justify-center p-4 bg-white/30 border-white/50">
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
            {
                (animation1 || animation2) && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        {animation1 ? <div> {animation1 && <LottieLoader />}</div> : <div className="w-[30rem] h-[30rem]">{animation2 && <LottieAnimation />}</div>}
                    </div>
                )
            }
        </>
    );
}

export default Expense;