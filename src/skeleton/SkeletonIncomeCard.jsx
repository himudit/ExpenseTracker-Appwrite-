import React from 'react';

const SkeletonIncomeCard = ({ color }) => {
  return (
    <div className={`flex-1 h-[8rem] min-w-[250px] sm:min-w-[300px] p-4 bg-${color}-200 rounded-lg shadow-md animate-pulse space-y-4 `} >
      <div className="h-5 w-1/2 bg-gray-300 rounded-md"></div> {/* heading skeleton */}
      <div className="h-7 w-full bg-gray-100 rounded-md"></div> {/* amount box skeleton */}
    </div >
  );
};

export default SkeletonIncomeCard;
