"use client";

import React from "react";
import Lottie from "lottie-react";

interface LottieAnimationProps {
    animationData: any;
    width?: number | string;
    height?: number | string;
    className?: string;
    loop?: boolean;
}

export const LottieAnimation: React.FC<LottieAnimationProps> = ({
    animationData,
    width = "100%",
    height = "100%",
    className = "",
    loop = true,
}) => {
    return (
        <div className={className} style={{ width, height }}>
            <Lottie animationData={animationData} loop={loop} />
        </div>
    );
};
