import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

const NoTransactions = () => {
    return (
        <div className="w-full md:w-3/6 h-auto md:h-[20rem] bg-white p-4 md:p-10 rounded-lg shadow-md m-2 md:m-4 border border-gray-200 flex flex-col items-center justify-center">
            {/* <div className="w-full md:w-[47%] h-auto md:h-[20rem] flex flex-col items-center justify-center bg-white rounded-lg shadow-md border  border-gray-200 p-4"> */}
            {/* Icon Placeholder */}
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                {/* Insert your icon here */}
                <FontAwesomeIcon icon={faCircleExclamation} className='w-10 h-10'/>
            </div>

            {/* Heading */}
            <h2 className="text-lg font-semibold text-gray-700 mb-1">
                No transactions yet
            </h2>

            {/* Subtext */}
            <p className="text-sm text-gray-500 text-center max-w-xs">
                After your first transaction, you will be able to view it here.
            </p>
        </div>
    );
};

export default NoTransactions;
