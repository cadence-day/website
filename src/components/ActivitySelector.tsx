'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const activities = [
  { name: 'Work', color: '#4F46E5' },     // Blue-purple
  { name: 'Friends', color: '#10B981' },   // Green
  { name: 'Cooking', color: '#F59E0B' },   // Yellow
  { name: 'Rest', color: '#FFFFFF' },      // White
  { name: 'Sport', color: '#8B5CF6' },     // Purple
  { name: 'Reading', color: '#3B82F6' },   // Blue
];

interface ActivitySelectorProps {
  isVisible: boolean;
  onScrollEvent?: (direction: 'up' | 'down', isVisible: boolean) => void;
}

export default function ActivitySelector({ isVisible, onScrollEvent }: ActivitySelectorProps) {

  useEffect(() => {
    let touchStartY = 0;
    
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      
      if (event.deltaY > 0) {
        // Scrolling down
        onScrollEvent?.('down', isVisible);
      } else {
        // Scrolling up
        onScrollEvent?.('up', isVisible);
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0].clientY;
    };

    const handleTouchMove = (event: TouchEvent) => {
      event.preventDefault();
      
      const touchCurrentY = event.touches[0].clientY;
      const touchDiff = touchStartY - touchCurrentY;
      
      // Threshold to prevent accidental triggers
      if (Math.abs(touchDiff) > 50) {
        if (touchDiff > 0) {
          // Swiping up (scrolling down effect)
          onScrollEvent?.('down', isVisible);
        } else {
          // Swiping down (scrolling up effect)
          onScrollEvent?.('up', isVisible);
        }
        touchStartY = touchCurrentY; // Reset for continuous scrolling
      }
    };

    // Desktop events
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    // Mobile events
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isVisible, onScrollEvent]);
  return (
    <motion.div
      initial={{ y: 200, opacity: 0 }}
      animate={{ 
        y: isVisible ? 0 : 200, 
        opacity: isVisible ? 1 : 0 
      }}
      transition={{ 
        duration: 0.4,
        type: "spring",
        stiffness: 200,
        damping: 30
      }}
      className="fixed bottom-16 left-1/2 transform -translate-x-1/2 z-20 px-4"
    >
      <div className="flex items-center space-x-2 lg:space-x-8">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.name}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              delay: 1.7 + (index * 0.1),
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
            className="flex flex-col items-center cursor-pointer group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div
              className="w-6 h-6 lg:w-8 lg:h-8 rounded-full mb-1 lg:mb-2 transition-transform group-hover:scale-110"
              style={{ backgroundColor: activity.color }}
            />
            <span className="text-xs lg:text-sm text-white font-light group-hover:text-gray-300 transition-colors">
              {activity.name}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}