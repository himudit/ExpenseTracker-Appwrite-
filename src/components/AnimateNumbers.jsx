import React from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const AnimatedIncome = ({ amount }) => {
    const { ref, inView } = useInView({ triggerOnce: true });

    const numericValue = parseFloat(amount.toString().replace(/[^\d.]/g, ''));

    return (
        <div
            ref={ref}
            className="w-full p-2 border bg-white text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
            ₹{" "}
            {inView ? (
                <CountUp end={numericValue} duration={2} separator="," />
            ) : (
                "0"
            )}
        </div>
    );
};

export default AnimatedIncome;
