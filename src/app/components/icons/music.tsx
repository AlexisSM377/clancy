'use client';

import type { Variants } from 'motion/react';
import { motion, useAnimation } from 'motion/react';

const variants: Variants = {
    normal: {
        rotate: 0,
    },
    animate: (custom: number) => ({
        rotate: custom === 1 ? [-10, 10, 0] : [10, -10, 0],
        transition: {
            delay: 0.1 * custom,
            repeat: Infinity,
            repeatType: 'reverse',
            duration: 0.5,
        },
    }),
};

const DrumIcon = () => {
    const controls = useAnimation();

    return (
        <div
            className="cursor-pointer select-none p-2 hover:bg-accent rounded-md transition-colors duration-200 flex items-center justify-center"
            onMouseEnter={() => controls.start('animate')}
            onMouseLeave={() => controls.start('normal')}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <motion.path
                    d="m2 2 8 8"
                    variants={variants}
                    animate={controls}
                    custom={1}
                />
                <motion.path
                    d="m22 2-8 8"
                    variants={variants}
                    animate={controls}
                    custom={2}
                />
                <ellipse cx="12" cy="9" rx="10" ry="5" />
                <path d="M7 13.4v7.9" />
                <path d="M12 14v8" />
                <path d="M17 13.4v7.9" />
                <path d="M2 9v8a10 5 0 0 0 20 0V9" />
            </svg>
        </div>
    );
};

export { DrumIcon };
