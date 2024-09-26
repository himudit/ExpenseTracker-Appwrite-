// LottieAnimation.jsx
import React from 'react';
import Lottie from 'lottie-react';
import animationData from './Animation - 1727368020440.json'
const LottieAnimation = () => {
    return (
        <div>
            <Lottie animationData={animationData} loop={true} />
        </div>
    );
};

export default LottieAnimation;
