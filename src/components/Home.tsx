'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import ActivitySelector from './ActivitySelector';
import Header from './Header';
import ClockDisplay from './ClockDisplay';

export default function Home() {
  const [showActivityLegend, setShowActivityLegend] = useState(true);
  const [showTimeBlocks, setShowTimeBlocks] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<number | null>(3); // Rest activity selected by default
  const [segmentActivities, setSegmentActivities] = useState<{[key: number]: number}>({});
  
  // Target hours for each activity
  const [activityTargets] = useState<{[key: number]: number}>({
    0: 5,    // Work: 5h target
    1: 0,    // Friends: 0h target  
    2: 0,    // Cooking: 0h target
    3: 8,    // Rest: 8h target
    4: 1,    // Sport: 1h target
    5: 0.5   // Reading: 0.5h target
  });
  
  // Activity colors for time blocks
  const activityColors = [
    '#4F46E5', // Work - Blue-purple
    '#10B981', // Friends - Green  
    '#F59E0B', // Cooking - Yellow
    '#FFFFFF', // Rest - White
    '#8B5CF6', // Sport - Purple
    '#3B82F6', // Reading - Blue
  ];
  
  // Sample time block data (you can replace with real data)
  const timeBlocks = [
    { activity: 0, segments: [0, 1, 2] }, // Work from 00:00-01:30
    { activity: 3, segments: [3, 4, 5, 6, 7] }, // Rest from 01:30-04:00  
    { activity: 1, segments: [8, 9] }, // Friends from 04:00-05:00
    { activity: 2, segments: [10, 11, 12, 13] }, // Cooking from 05:00-07:00
    { activity: 4, segments: [14, 15] }, // Sport from 07:00-08:00
    { activity: 5, segments: [16, 17, 18] }, // Reading from 08:00-09:30
  ];


  // Calculate target vs assigned time for each activity
  const calculateTargetStatus = () => {
    const assignedTimes: {[key: number]: number} = {};
    const targetStatus: {[key: number]: { remaining: number; overtime: number; isComplete: boolean }} = {};
    
    // Initialize assigned times with 0
    for (let i = 0; i < activityColors.length; i++) {
      assignedTimes[i] = 0;
    }
    
    // Count segments for each activity (each segment = 0.5 hours)
    Object.values(segmentActivities).forEach(activityIndex => {
      assignedTimes[activityIndex] = (assignedTimes[activityIndex] || 0) + 0.5;
    });
    
    // Calculate target status for each activity
    for (let i = 0; i < activityColors.length; i++) {
      const target = activityTargets[i] || 0;
      const assigned = assignedTimes[i] || 0;
      
      if (assigned <= target) {
        // Still within or at target
        targetStatus[i] = {
          remaining: target - assigned,
          overtime: 0,
          isComplete: assigned === target
        };
      } else {
        // Over target
        targetStatus[i] = {
          remaining: 0,
          overtime: assigned - target,
          isComplete: false
        };
      }
    }
    
    return targetStatus;
  };

  // Handle activity selection from ActivitySelector
  const handleActivitySelection = (activityIndex: number) => {
    setSelectedActivity(activityIndex);
  };

  // Handle segment click to assign activity
  const handleSegmentClick = (segmentIndex: number) => {
    if (selectedActivity !== null) {
      setSegmentActivities(prev => ({
        ...prev,
        [segmentIndex]: selectedActivity
      }));
    }
  };



  return (
    <div className="h-screen overflow-hidden bg-[#191919] flex flex-col fixed inset-0">
      <Header />
      
      <ClockDisplay 
        showTimeBlocks={showTimeBlocks}
        activityColors={activityColors}
        timeBlocks={timeBlocks}
        segmentActivities={segmentActivities}
        onSegmentClick={handleSegmentClick}
        selectedActivity={selectedActivity}
      />


      {/* Activity Selector */}
      <ActivitySelector 
        isVisible={showActivityLegend}
        onActivitySelect={handleActivitySelection}
        selectedActivity={selectedActivity}
        targetStatus={calculateTargetStatus()}
      />

      {/* Bottom left social links */}
      <div className="absolute bottom-16 left-4 lg:bottom-8 lg:left-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="flex items-center space-x-4"
        >
          {/* Instagram */}
          <a 
            href="https://www.instagram.com/cadencedotday" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-white transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>

          {/* Twitter */}
          <a 
            href="https://x.com/cadencedotday" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-white transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </a>

          {/* Blog */}
          <a 
            href="https://blog.cadence.day/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-white transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
          </a>

          {/* App Store */}
          <a 
            href="https://apps.apple.com/us/app/cadence-day/id6745115112" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-white transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
          </a>
        </motion.div>
      </div>

      {/* Bottom right CADENCE logo */}
      <div className="absolute bottom-30 right-4 lg:bottom-8 lg:right-8">
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