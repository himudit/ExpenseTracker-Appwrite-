
const SkeletonRecentCard = () => {
  return (
    <div className="w-full md:w-3/6 h-auto md:h-[20rem] bg-white rounded-lg shadow-md m-2 md:m-4 border border-gray-200 p-4 relative animate-pulse">
      <div className="text-lg md:text-[1.18rem] font-bold mt-2 md:mt-4 bg-gray-200 w-40 h-5 rounded-md"></div>

      {/* Skeleton Entries */}
      <div className="overflow-y-auto mt-4 space-y-4">
        {[1, 2, 3].map((_, index) => (
          <div
            key={index}
            className="flex justify-between bg-white py-2 border-b border-gray-300"
          >
            <div className="flex space-x-2">
              {/* Icon Skeleton */}
              <div className="w-9 h-9 bg-gray-300 rounded-full"></div>

              {/* Category and Date Skeleton */}
              <div className="flex flex-col justify-center space-y-1">
                <div className="w-24 h-4 bg-gray-300 rounded-md"></div>
                <div className="w-16 h-3 bg-gray-200 rounded-md"></div>
              </div>
            </div>

            {/* Amount Skeleton */}
            <div className="flex items-center">
              <div className="w-16 h-4 bg-gray-300 rounded-md"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows Skeleton */}
      <div className="flex justify-between mt-4">
        <div className="bg-gray-200 w-7 h-7 flex items-center justify-center rounded-md border border-gray-300"></div>
        <div className="bg-gray-200 w-7 h-7 flex items-center justify-center rounded-md border border-gray-300"></div>
      </div>
    </div>
  );
};

export default SkeletonRecentCard;
