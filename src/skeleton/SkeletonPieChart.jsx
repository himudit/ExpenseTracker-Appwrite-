import React from 'react';

const SkeletonPieChartCard = () => {
  return (
    <div className="w-full md:w-3/6 h-auto md:h-[20rem] bg-white p-4 md:p-10 rounded-lg shadow-md m-2 md:m-4 border border-gray-200 animate-pulse">
      {/* Title */}
      <div className="text-lg font-bold flex ml-[-0.8rem] mt-[-1.2rem] bg-gray-200 w-32 h-5 rounded-md mb-6"></div>

      {/* Chart + Legend layout */}
      <div className="flex flex-wrap justify-center items-center gap-10">
        {/* Pie Chart Skeleton */}
        <div className="w-[160px] h-[160px] bg-gray-300 rounded-full"></div>

        {/* Legend Skeleton */}
        <div className="w-[160px] h-[160px] flex flex-col ml-4 space-y-2">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-gray-300"></div>
              <div className="w-20 h-4 bg-gray-200 rounded-md"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows Skeleton */}
      <div className="flex justify-between m-2 mt-[4rem] w-full">
        <div className="bg-gray-200 w-7 h-7 flex items-center justify-center rounded-md border border-gray-300"></div>
        <div className="bg-gray-200 w-7 h-7 flex items-center justify-center rounded-md border border-gray-300"></div>
      </div>
    </div>
  );
};

export default SkeletonPieChartCard;
