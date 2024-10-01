import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faChartSimple, faChevronRight, faEllipsis, faHouseCircleCheck, faIndianRupee, faReceipt, faSuitcaseMedical, faVideo, faPizzaSlice, faCartShopping, faPlane } from '@fortawesome/free-solid-svg-icons';
import LottieAnimation from './LottieAnimation';
import { account, databases } from '../appwrite/appwriteConfig';
import { v4 as uuidv4 } from 'uuid'
import conf from '../conf/conf'
import { Query } from 'appwrite';
// library.add(faIndianRupee);

function Expense() {
    const divRef = useRef(null);

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
    const [selectedCategory, setSelectedCategory] = useState({ icon: faEllipsis, text: '' });
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

    // adding new expense in collection2
    const addNewExpense = async () => {
        if (!userId) return;
        console.log('User ID being queried:', userId);
        // checking collection4
        const res = await databases.listDocuments(
            conf.appwriteDatabaseId,
            conf.appwriteCollection4Id,
            [
                Query.equal('userid', userId)
            ]
        )

        if (res.total > 0) {
            console.log('Entry exists');
            // for collection 2
            const expense = {
                userid: String(userId),
                ExpenseAmount: Number(amount),
                Category: String(selectedCategory.text),
                Date: String(formattedDateTime),
            }
            const promise = databases.createDocument(conf.appwriteDatabaseId, conf.appwriteCollection2Id, uuidv4(), expense)
            promise.then(() => {
                const item = selectedCategory.text;
                const document = res.documents[0];
                const documentId = document.$id;
                if (selectedCategory.text === 'Food & Dining') {
                    const updatedData = {
                        FoodDining: Number(amount),
                    };
                    const promise4 = databases.updateDocument(conf.appwriteDatabaseId, conf.appwriteCollection4Id, documentId, updatedData);
                } else {
                    const updatedData = {
                        [selectedCategory.text]: Number(amount),
                    };
                    const promise4 = databases.updateDocument(conf.appwriteDatabaseId, conf.appwriteCollection4Id, documentId, updatedData);
                }
            })
        } else {
            console.log('Entry does not exist');
            // for collection 2
            const expense = {
                userid: String(userId),
                ExpenseAmount: Number(amount),
                Category: String(selectedCategory.text),
                Date: String(formattedDateTime),
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
        }
    }

    return (
        <div className="flex justify-center h-screen ml-[7rem]">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md flex flex-col">
                <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                        <div className="text-sm font-medium text-gray-600">{formattedDate}</div>
                        <div className="text-sm font-medium text-gray-600">{formattedTime}</div>
                    </div>
                </div>
                <div className="flex-grow overflow-y-auto p-4">
                    <div className="mb-4">
                        <div className="text-sm font-medium text-gray-700 mb-1">
                            <div className="flex text-[0.7rem]">Amount</div>
                            <div className="flex">
                                <div className='text-[1.5rem]'><FontAwesomeIcon icon={faIndianRupee} />
                                    <input type='number' onChange={handleInputChange} value={amount}></input></div>
                            </div>
                        </div>
                    </div>

                    {/* category */}
                    <div className="mb-4">
                        <div className="text-sm font-medium text-gray-700 mb-1">
                            <div className="flex text-[0.7rem]">Category</div>
                            <div className="flex justify-between">
                                <div className='text-[1.3rem]'>
                                    <FontAwesomeIcon icon={selectedCategory.icon} className="mr-2" />
                                    <span>{selectedCategory.text}</span>
                                </div>
                                <div className='cursor-pointer' onClick={handleIconClick}><FontAwesomeIcon icon={faChevronRight} /></div>
                            </div>
                            {/* Conditionally render the new div if isOpen is true */}
                            {isOpen && (
                                <div ref={divRef} className="grid grid-cols-3 gap-4 p-4 h-[13rem] bg-gray-200 rounded shadow-md mt-2">
                                    <div onClick={() => settingCategory(faEllipsis, 'others')} className="flex items-center justify-center cursor-pointer"><div className='cursor-pointer'><FontAwesomeIcon icon={faEllipsis} /> </div>Others</div>
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
                    </div>

                    <div className="mb-4">
                        <div className="text-sm font-medium text-gray-700 mb-1">
                            <div className="flex text-[0.7rem]">Payment mode</div>
                            <div className="flex justify-between">
                                <div className='text-[1.3rem]'>Cash</div>
                                <div className='cursor-pointer'><FontAwesomeIcon icon={faChevronRight} /></div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Other Details</label>
                        <textarea className="w-full px-3 py-2 border rounded-md" rows="3"></textarea>
                        {/* <LottieAnimation /> */}
                    </div>
                </div>

                <div className='m-t-[10rem]'>
                    <div className='m-t-[10rem] cursor-pointer' onClick={addNewExpense}>Submit</div>
                </div>
            </div>
        </div>
    );
}

export default Expense;
