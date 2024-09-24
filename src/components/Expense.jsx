import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

function Expense() {
    const [amount, setAmount] = useState(0);
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
                                <div className='text-[1.5rem]'>0</div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="text-sm font-medium text-gray-700 mb-1">
                            <div className="flex text-[0.7rem]">Category</div>
                            <div className="flex justify-between">
                                <div className='text-[1.3rem]'>Others</div>
                                <div className='cursor-pointer'><FontAwesomeIcon icon={faChevronRight} /></div>
                            </div>
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
