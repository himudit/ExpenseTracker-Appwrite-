// SkeletonRecurring.jsx
import React from 'react';

const SkeletonRecurring = () => {
    return (
        <div className="animate-pulse p-6 md:ml-[7rem]">
            <div className="flex flex-wrap gap-4 items-center mb-4">
                <div className="h-10 w-full md:w-1/3 bg-gray-200 rounded" />
                <div className="h-10 w-36 bg-gray-200 rounded" />
            </div>

            <div className="overflow-x-auto rounded border border-gray-200">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700 font-semibold">
                        <tr>
                            <th className="p-3">Date</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Amount</th>
                            <th className="p-3">Recurring</th>
                            <th className="p-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {[1, 2, 3, 4].map((_, i) => (
                            <tr key={i} className="border-t">
                                <td className="p-3"><div className="h-4 w-20 bg-gray-200 rounded" /></td>
                                <td className="p-3"><div className="h-6 w-24 bg-gray-300 rounded-full" /></td>
                                <td className="p-3"><div className="h-4 w-16 bg-gray-200 rounded" /></td>
                                <td className="p-3"><div className="h-6 w-24 bg-purple-200 rounded-full" /></td>
                                <td className="p-3"><div className="h-4 w-6 bg-gray-300 rounded" /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SkeletonRecurring;
