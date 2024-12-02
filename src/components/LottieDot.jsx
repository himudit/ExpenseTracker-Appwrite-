import React from 'react';
import Lottie from 'lottie-react';
import animationData from './DottedEdit.json'
const LottieDot = () => {
    return (
        <div>
            <Lottie animationData={animationData} loop={true} />
        </div>
    );
};

export default LottieDot;
