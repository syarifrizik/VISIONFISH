
import React from 'react';
import CommunityErrorBoundary from '@/components/community/CommunityErrorBoundary';
import ModernCommunityTab2025 from './ModernCommunityTab2025';

const EnhancedCommunityTab = () => {
  console.log('EnhancedCommunityTab rendering...');
  
  return (
    <CommunityErrorBoundary>
      <ModernCommunityTab2025 />
    </CommunityErrorBoundary>
  );
};

export default EnhancedCommunityTab;
