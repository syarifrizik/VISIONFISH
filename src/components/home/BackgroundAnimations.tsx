
import React from 'react';
import ModernOceanAnimations from '@/components/ocean/ModernOceanAnimations';

// Legacy component - now uses the new modern system
const BackgroundAnimations = () => {
  return <ModernOceanAnimations intensity="normal" showEffects={true} />;
};

export default BackgroundAnimations;
export { ModernOceanAnimations };
