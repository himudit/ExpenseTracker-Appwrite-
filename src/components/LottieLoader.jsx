// LottieAnimation.jsx
import React from 'react';
import Lottie from 'lottie-react';
import animationData from './Animation - 1728269313950.json'
const LottieLoader = () => {
    return (
        <div>
            <Lottie animationData={animationData} loop={true} />
        </div>
    );
};

export default LottieLoader;
