
import { useState, useEffect } from 'react';

export const useUsageTracking = () => {
  const [usageCount, setUsageCount] = useState(0);
  
  useEffect(() => {
    // Track usage count
    const count = parseInt(localStorage.getItem('usageCount') || '0');
    const newCount = count + 1;
    setUsageCount(newCount);
    localStorage.setItem('usageCount', newCount.toString());
  }, []);

  return { usageCount };
};
