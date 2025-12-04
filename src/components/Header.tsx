'use client';

import { motion } from 'framer-motion';

export default function Header() {
  return (
    <div className="flex items-start pt-6 pb-0 px-8">
      {/* Left text */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex justify-start flex-1 "
      >
        <h3 className="
          text-[12px] md:text-lg font-light text-white text-left 
          p-2 w-full
        ">
          Track your day, understand your rhythm.
        </h3>
      </motion.div>

      {/* Center text */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex items-center justify-center flex-1 pt-3 "
      >
        <div className="flex items-center">
          <div className="h-px bg-[#333333] lg:w-40 md:w-20 sm:w-5"></div>
          <p className="
            text-[8px] sm:text-xxs md:text-xs lg:text-xs text-white 
            tracking-widest text-center uppercase mx-4
            
          ">
            LOG YOUR ACTIVITIES
          </p>
          <div className="h-px bg-[#333333] lg:w-40 md:w-20 sm:w-5"></div>
        </div>
      </motion.div>

      {/* Right text */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="flex justify-end flex-1 "
      >
        <h3 className="
          text-[12px] md:text-lg font-light text-white text-right
          p-2 w-full
        ">
          Cadence helps you see where your time goes.
        </h3>
      </motion.div>
    </div>
  );
}