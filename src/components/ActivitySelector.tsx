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
  onActivitySelect?: (activityIndex: number) => void;
  selectedActivity?: number | null;
  targetStatus?: {[key: number]: { remaining: number; overtime: number; isComplete: boolean }};
}

export default function ActivitySelector({ isVisible, onActivitySelect, selectedActivity, targetStatus = {} }: ActivitySelectorProps) {
  // Format time display with + for overtime
  const formatTime = (hours: number, isOvertime: boolean = false) => {
    if (hours === 0) return '';
    const timeStr = hours === Math.floor(hours) ? `${hours}h` : `${hours}h`;
    return isOvertime ? `+${timeStr}` : timeStr;
  };

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
      className="fixed bottom-28 lg:bottom-16 left-1/2 transform -translate-x-1/2 z-20 px-4"
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
            onClick={() => onActivitySelect?.(index)}
          >
            <div className="relative">
              <div
                className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full mb-1 lg:mb-2 transition-all duration-200 group-hover:scale-110 flex items-center justify-center ${
                  selectedActivity === index ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800' : ''
                }`}
                style={{ backgroundColor: activity.color }}
              >
{(() => {
                  const status = targetStatus[index];
                  if (!status) return null;
                  
                  if (status.overtime > 0) {
                    // Over target - show +overtime in red/orange
                    return (
                      <span className={`text-[8px] lg:text-xs font-medium ${
                        activity.color === '#FFFFFF' ? 'text-red-600' : 'text-red-300'
                      }`}>
                        {formatTime(status.overtime, true)}
                      </span>
                    );
                  } else if (status.isComplete) {
                    // Target reached exactly - show checkmark
                    return (
                      <span className={`text-[8px] lg:text-xs font-bold ${
                        activity.color === '#FFFFFF' ? 'text-green-800' : 'text-green-300'
                      }`}>
                        ✓
                      </span>
                    );
                  } else if (status.remaining > 0) {
                    // Still has remaining target time
                    return (
                      <span className={`text-[8px] lg:text-xs font-medium ${
                        activity.color === '#FFFFFF' ? 'text-black' : 'text-white'
                      }`}>
                        {formatTime(status.remaining)}
                      </span>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>
            <span className={`text-xs lg:text-sm font-light transition-colors ${
              selectedActivity === index ? 'text-white' : 'text-white group-hover:text-gray-300'
            }`}>
              {activity.name}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}