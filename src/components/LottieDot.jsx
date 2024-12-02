import React from 'react';
import Lottie from 'lottie-react';
import animationData from './Animation - 1733114374359.json'
const LottieDot = () => {
    return (
        <div>
            <Lottie animationData={animationData} loop={true} />
        </div>
    );
};

export default LottieDot;
