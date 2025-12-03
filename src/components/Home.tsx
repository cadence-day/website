'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import ActivitySelector from './ActivitySelector';

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Calculate angles for clock hands
  const hours = currentTime.getHours() % 12;
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();
  
  const hourAngle = (hours * 30) + (minutes * 0.5); // 30 degrees per hour + minute offset
  const minuteAngle = minutes * 6; // 6 degrees per minute
  const secondAngle = seconds * 6; // 6 degrees per second

  // Generate hour markers
  const hourMarkers = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30) - 90; // -90 to start from top
    const isQuarterHour = i % 3 === 0;
    const number = (i + 3) % 12;
    return {
      angle,
      isQuarter: isQuarterHour,
      number: number === 0 ? 12 : number,
    };
  });

  // Generate minute markers (segments around the outer ring)
  const minuteSegments = Array.from({ length: 60 }, (_, i) => ({
    angle: (i * 6) - 90,
    isActive: i < minutes,
  }));

  const formatDate = (date: Date) => {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    
    const day = days[date.getDay()];
    const month = months[date.getMonth()];
    const dayNum = date.getDate();
    
    const suffix = dayNum === 1 || dayNum === 21 || dayNum === 31 ? 'st' :
                   dayNum === 2 || dayNum === 22 ? 'nd' :
                   dayNum === 3 || dayNum === 23 ? 'rd' : 'th';
    
    return `${day}, ${month} ${dayNum}${suffix}`;
  };

  return (
    <div className="h-screen overflow-hidden bg-[#191919] flex flex-col">
      {/* Top text section */}
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

      {/* Center Column - Clock */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Gradient glow background */}
        <div className="absolute w-100 h-100 md:w-80 md:h-80 lg:w-[540px] lg:h-[540px] rounded-full" 
             style={{
               background: 'radial-gradient(circle, rgba(96, 64, 195, 1) 0%, transparent 70%)'
             }}>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative w-96 h-96 z-10"
        >

          {/* Outer ring with minute segments */}
          <div className="absolute inset-0">
            {minuteSegments.map((segment, i) => (
              <div
                key={i}
                className="absolute w-1 h-8 origin-bottom"
                style={{
                  left: '50%',
                  bottom: '50%',
                  transform: `translateX(-50%) rotate(${segment.angle}deg)`,
                }}
              >
                <div 
                  className={`w-full h-full rounded-full ${
                    segment.isActive ? 'bg-purple-400' : 'bg-gray-600'
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Main clock circle */}
          <div className="absolute inset-8 rounded-full bg-[#282828] border border-gray-600">
            {/* Half-hour rectangular segments around the dial */}
            {Array.from({ length: 24 }, (_, i) => {
              const angle = i * 15 - 90; // 24 segments of 15 degrees each
              const radius = 172; // Distance from center
              const segmentWidth = isMobile ? 20 : 25;
              const segmentHeight = isMobile ? 43 : 40;
              
              return (
                <div
                  key={`segment-${i}`}
                  className="absolute border border-gray-600 bg-[#1a1a1a]"
                  style={{
                    width: `${segmentWidth}px`,
                    height: `${segmentHeight}px`,
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) translate(${Math.cos((angle + 90) * Math.PI / 180) * radius}px, ${Math.sin((angle + 90) * Math.PI / 180) * radius}px) rotate(${angle + 90}deg)`,
                    transformOrigin: 'center',
                  }}
                />
              );
            })}

            {/* Hour numbers only */}
            {hourMarkers.map((marker, i) => (
              <div key={i}>
                {/* Hour number */}
                <div
                  className="absolute text-gray-300 text-sm font-light"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) translate(${Math.cos((marker.angle + 90) * Math.PI / 180) * 130}px, ${Math.sin((marker.angle + 90) * Math.PI / 180) * 130}px)`,
                  }}
                >
                  {marker.number.toString().padStart(2, '0')}
                </div>
              </div>
            ))}

            {/* Half-hour dots */}
            {Array.from({ length: 12 }, (_, i) => {
              const angle = (i * 30) - 75; // -75 to place between hour markers
              return (
                <div
                  key={`dot-${i}`}
                  className="absolute w-0.5 h-0.5 bg-gray-400 rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) translate(${Math.cos((angle + 90) * Math.PI / 180) * 130}px, ${Math.sin((angle + 90) * Math.PI / 180) * 130}px)`,
                  }}
                />
              );
            })}

            {/* Clock hands */}
            {/* Hour hand */}
            <motion.div
              className="absolute w-1 h-16 bg-white rounded-full origin-bottom"
              style={{
                left: '50%',
                bottom: '50%',
              }}
              animate={{
                rotate: hourAngle
              }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 10
              }}
            />
            
            {/* Minute hand */}
            <motion.div
              className="absolute w-0.5 h-24 bg-white rounded-full origin-bottom"
              style={{
                left: '50%',
                bottom: '50%',
              }}
              animate={{
                rotate: minuteAngle
              }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 10
              }}
            />

            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2" />

            {/* Date display */}
            <div className="absolute top-1/2 left-1/2 pt-6 transform -translate-x-1/2 translate-y-8">
              <p className="text-white text-sm font-light">
                {formatDate(currentTime)}
              </p>
            </div>
          </div>
        </motion.div>
      </div>


      {/* Activity Selector */}
      <ActivitySelector />

      {/* Bottom right CADENCE logo */}
      <div className="absolute bottom-8 right-8">
        <motion.h6
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-4xl font-light text-white"
        >
          CADENCE
        </motion.h6>
      </div>
    </div>
  );
}