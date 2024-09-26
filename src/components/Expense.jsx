import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faChartSimple, faChevronRight, faEllipsis, faHouseCircleCheck, faIndianRupee, faReceipt, faSuitcaseMedical, faVideo, faPizzaSlice, faCartShopping, faPlane } from '@fortawesome/free-solid-svg-icons';

function Expense() {
    const [category, setCategory] = useState(null);
    const [isOpen, setIsOpen] = useState(false);  // State to track whether the div is open
    const divRef = useRef(null);  // Create a reference for the new div

    const [amount, setAmount] = useState(0);

    // Function to handle icon click and toggle the div
    const handleIconClick = () => {
        setIsOpen(!isOpen);  // Toggle the div state
    };

    const [selectedCategory, setSelectedCategory] = useState({ icon: null, text: '' });

    // Function to handle category click
    const settingCategory = (icon, text) => {
        setSelectedCategory({ icon, text });
    };

    // useEffect to handle outside click and close the div
    useEffect(() => {
        const handleClickOutside = (event) => {
            // If the div is open and the click is outside the div, close it
            if (divRef.current && !divRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        // Add event listener to detect outside clicks
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            // Cleanup the event listener when the component unmounts
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

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
                                <div className='text-[1.5rem]'><FontAwesomeIcon icon={faIndianRupee} /><input type='text' value={amount}></input></div>
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
                                    <div onClick={() => settingCategory(faEllipsis, 'Others')} className="flex items-center justify-center cursor-pointer"><div className='cursor-pointer'><FontAwesomeIcon icon={faEllipsis} /> </div>Others</div>
                                    <div onClick={() => settingCategory(faPizzaSlice, 'Food & Dining')} className="flex items-center justify-center cursor-pointer"><div className='cursor-pointer'><FontAwesomeIcon icon={faPizzaSlice} /> </div>Food &Dining</div>
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
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Expense;
