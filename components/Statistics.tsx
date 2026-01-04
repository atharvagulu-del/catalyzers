"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
    { label: "Happy Students", target: 5000000, suffix: "+" },
    { label: "Mock Tests", target: 10000, suffix: "+" },
    { label: "YouTube Subscribers", target: 8500000, suffix: "+" },
    { label: "Expert Faculty", target: 500, suffix: "+" },
];

function useCountUp(target: number, duration: number = 2000) {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.3 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        let startTime: number;
        let animationFrame: number;

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);

            setCount(Math.floor(progress * target));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [isVisible, target, duration]);

    return { count, ref };
}

function formatNumber(num: number): string {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
}

// Separate component for each stat to properly use hooks
function StatItem({ stat, index }: { stat: typeof stats[0]; index: number }) {
    const { count, ref } = useCountUp(stat.target);

    return (
        <div
            ref={ref}
            className="text-center space-y-2 animate-fade-in"
            style={{ animationDelay: `${index * 150}ms` }}
        >
            <div className="text-4xl md:text-5xl lg:text-6xl font-bold">
                {formatNumber(count)}
                {count === stat.target && stat.suffix}
            </div>
            <div className="text-sm md:text-base text-purple-200">
                {stat.label}
            </div>
        </div>
    );
}

export default function Statistics() {
    return (
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-primary-dark text-white">
            <div className="container px-4 md:px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                    {stats.map((stat, index) => (
                        <StatItem key={stat.label} stat={stat} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
