import React, { useState, useEffect } from 'react';
import { faSync, faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Query } from 'appwrite';
import { account, databases, storage } from '../appwrite/appwriteConfig';
import conf from '../conf/conf';
import SkeletonRecurring from '../skeleton/SkeletonRecurring';

const categoryColors = {
    food: '#FFBF00',
    shopping: '#4D4DFF',
    travelling: 'purple',
    rent: '#005F6A',
    entertainment: '#FF6F61',
    medical: 'red',
    bills: '#797982',
    taxes: '#721322',
    investments: '#32CD32',
    others: '#94969B',
};


const Recurring = () => {
    const [transactions, setTransactions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [loading, setLoading] = useState(true); // <-- New
    const [interval, setInterval] = useState(''); // <-- New

    const filteredTransactions = transactions.filter((tx) => {
        const matchesSearch = tx.category.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesInterval = interval === '' || tx.recurring.toLowerCase() === interval.toLowerCase();
        return matchesSearch && matchesInterval;
    });


    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await databases.listDocuments(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollection7Id
                );

                const formatted = res.documents
                    .filter((doc) => doc.isActive && doc.frequency) // ensure it's recurring
                    .map((doc) => ({
                        date: new Date(doc.startDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: '2-digit',
                            year: 'numeric',
                        }),
                        category: {
                            name: doc.category,
                            color: categoryColors[doc.category.toLowerCase()] || '#94969B',
                        },
                        amount: Math.abs(doc.amount), // ensure negative for expense
                        recurring: doc.frequency.charAt(0).toUpperCase() + doc.frequency.slice(1), // e.g. 'weekly' → 'Weekly'
                    }));

                setTransactions(formatted);
            } catch (err) {
                // console.error('Error fetching recurring transactions:', err);
            } finally {
                setLoading(false); // <-- Done loading
            }
        };

        fetchTransactions();
    }, []);

    if (loading) return <SkeletonRecurring />;

    return (
        <div className="p-6 md:ml-[7rem] ">
            <div className="flex flex-wrap gap-4 items-center mb-4">
                <input
                    type="text"
                    placeholder="Search transactions..."
                    className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/3"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select className="border border-gray-300 rounded px-4 py-2" value={interval}
                    onChange={(e) => setInterval(e.target.value)}>
                    {/* <option value="" disabled hidden>
                        Select interval
                    </option> */}
                    <option value="">All Intervals</option>
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                    <option>Yearly</option>
                </select>
                {/* <select className="border border-gray-300 rounded px-4 py-2">
                    <option>All Transactions</option>
                </select> */}
            </div>

            <div className="overflow-x-auto rounded border">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700 font-semibold">
                        <tr>
                            {/* <th className="p-3"><input type="checkbox" /></th> */}
                            <th className="p-3">Date</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Amount</th>
                            <th className="p-3">Recurring</th>
                            <th className="p-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map((tx, idx) => (
                            <tr key={idx} className="border-t hover:bg-gray-50">
                                {/* <td className="p-3"><input type="checkbox" /></td> */}
                                <td className="p-3 whitespace-nowrap">{tx.date}</td>
                                <td className="p-3">
                                    <span
                                        className="text-white text-xs font-medium px-2 py-1 rounded-full"
                                        style={{ backgroundColor: tx.category.color }}
                                    >
                                        {tx.category.name}
                                    </span>
                                </td>
                                <td className="p-3 text-red-500 font-medium">
                                    -Rs. {tx.amount.toFixed(2)}
                                </td>
                                <td className="p-3">
                                    <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700 inline-flex items-center gap-1">
                                        <FontAwesomeIcon icon={tx.recurring === 'One-time' ? faClock : faSync} />
                                        {tx.recurring}
                                    </span>
                                </td>
                                <td className="p-3 text-gray-500 text-lg">...</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Recurring;