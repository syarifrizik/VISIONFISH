
import { useState, useEffect } from 'react';

const FREE_CHAT_LIMIT = 8;
const RESET_INTERVAL_HOURS = 2;
const STORAGE_KEY = 'visionfish_chat_usage';

interface ChatUsage {
  count: number;
  lastResetTime: number; // Changed from lastResetDate to timestamp
}

export const useChatUsage = () => {
  const [usageCount, setUsageCount] = useState(0);
  const [isLimitReached, setIsLimitReached] = useState(false);

  useEffect(() => {
    loadUsageFromStorage();
  }, []);

  const shouldReset = (lastResetTime: number): boolean => {
    const now = Date.now();
    const timeDiff = now - lastResetTime;
    const hoursElapsed = timeDiff / (1000 * 60 * 60); // Convert milliseconds to hours
    return hoursElapsed >= RESET_INTERVAL_HOURS;
  };

  const loadUsageFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const usage: ChatUsage = JSON.parse(stored);
        
        // Check if we need to reset (after 2 hours)
        if (shouldReset(usage.lastResetTime)) {
          resetUsage();
        } else {
          setUsageCount(usage.count);
          setIsLimitReached(usage.count >= FREE_CHAT_LIMIT);
        }
      }
    } catch (error) {
      console.error('Error loading chat usage:', error);
      resetUsage();
    }
  };

  const incrementUsage = () => {
    const newCount = usageCount + 1;
    const now = Date.now();
    
    const usage: ChatUsage = {
      count: newCount,
      lastResetTime: now
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
      setUsageCount(newCount);
      setIsLimitReached(newCount >= FREE_CHAT_LIMIT);
    } catch (error) {
      console.error('Error saving chat usage:', error);
    }

    return newCount;
  };

  const resetUsage = () => {
    const now = Date.now();
    const usage: ChatUsage = {
      count: 0,
      lastResetTime: now
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
      setUsageCount(0);
      setIsLimitReached(false);
    } catch (error) {
      console.error('Error resetting chat usage:', error);
    }
  };

  const getRemainingChats = () => {
    return Math.max(0, FREE_CHAT_LIMIT - usageCount);
  };

  const shouldShowWarning = () => {
    return usageCount >= 6 && usageCount < FREE_CHAT_LIMIT;
  };

  const getTimeUntilReset = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const usage: ChatUsage = JSON.parse(stored);
        const now = Date.now();
        const timeDiff = now - usage.lastResetTime;
        const hoursElapsed = timeDiff / (1000 * 60 * 60);
        const hoursRemaining = Math.max(0, RESET_INTERVAL_HOURS - hoursElapsed);
        return Math.ceil(hoursRemaining * 60); // Return minutes remaining
      }
    } catch (error) {
      console.error('Error calculating time until reset:', error);
    }
    return 0;
  };

  return {
    usageCount,
    remainingChats: getRemainingChats(),
    isLimitReached,
    shouldShowWarning: shouldShowWarning(),
    incrementUsage,
    resetUsage,
    getTimeUntilReset,
    FREE_CHAT_LIMIT,
    RESET_INTERVAL_HOURS
  };
};
