import React, { useState } from 'react'

function Expense() {
    const [amount, setAmount] = useState(0);
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // getMonth() returns 0-11
    const day = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const formattedDateTime = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const formatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
    });

    const formattedDate = formatter.format(now);
    console.log(formattedDate);
    // Output example: "September 23, 2024 at 2:30:45 PM"

    return (
        <div className="flex items-center justify-center h-screen p-4 overflow-hidden  ml-[7rem]">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md flex flex-col h-[calc(100vh-2rem)]">
                <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                        <div className="text-sm font-medium text-gray-600">Date</div>
                        <div className="text-sm font-medium text-gray-600">Time</div>
                    </div>
                </div>
                <div className="flex-grow overflow-y-auto p-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select className="w-full px-3 py-2 border rounded-md">
                            <option>Select category</option>
                            {/* Add more options here */}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
                        <select className="w-full px-3 py-2 border rounded-md">
                            <option>Select payment mode</option>
                            {/* Add more options here */}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Other Details</label>
                        <textarea className="w-full px-3 py-2 border rounded-md" rows="3"></textarea>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Expense