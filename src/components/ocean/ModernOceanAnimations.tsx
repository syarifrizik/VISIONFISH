
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import OceanBackground from './OceanBackground';
import SwimmingFish from './SwimmingFish';
import FishSchool from './FishSchool';
import BubbleSystem from './BubbleSystem';
import UnderwaterEffects from './UnderwaterEffects';

interface ModernOceanAnimationsProps {
  intensity?: 'minimal' | 'normal' | 'full';
  showEffects?: boolean;
}

const ModernOceanAnimations: React.FC<ModernOceanAnimationsProps> = ({
  intensity = 'normal',
  showEffects = true
}) => {
  const isMobile = useIsMobile();

  // Reduce animations on mobile for performance
  const effectiveIntensity = isMobile && intensity === 'full' ? 'normal' : intensity;

  const getAnimationConfig = () => {
    switch (effectiveIntensity) {
      case 'minimal':
        return {
          individualFish: 3,
          schools: 1,
          showBubbles: true,
          showEffects: false
        };
      case 'normal':
        return {
          individualFish: 6,
          schools: 2,
          showBubbles: true,
          showEffects: showEffects && !isMobile
        };
      case 'full':
        return {
          individualFish: 10,
          schools: 3,
          showBubbles: true,
          showEffects: showEffects
        };
      default:
        return {
          individualFish: 6,
          schools: 2,
          showBubbles: true,
          showEffects: showEffects && !isMobile
        };
    }
  };

  const config = getAnimationConfig();

  return (
    <>
      {/* Ocean Background Environment */}
      <OceanBackground />
      
      {/* Individual Swimming Fish */}
      {Array.from({ length: config.individualFish }).map((_, i) => (
        <SwimmingFish
          key={`fish-${i}`}
          size={20 + Math.random() * 16}
          depth={1 + Math.random() * 3}
          speed={25 + Math.random() * 15}
          delay={i * 3 + Math.random() * 5}
          direction={Math.random() > 0.5 ? 'right' : 'left'}
          path={Math.random() > 0.6 ? 'wave' : Math.random() > 0.3 ? 'curve' : 'straight'}
        />
      ))}
      
      {/* Fish Schools */}
      {Array.from({ length: config.schools }).map((_, i) => (
        <FishSchool
          key={`school-${i}`}
          fishCount={4 + Math.floor(Math.random() * 4)}
          schoolDirection={Math.random() > 0.5 ? 'right' : 'left'}
          depth={2 + i}
          speed={20 + Math.random() * 10}
          formation={i === 0 ? 'tight' : 'loose'}
        />
      ))}
      
      {/* Bubble System */}
      {config.showBubbles && <BubbleSystem />}
      
      {/* Underwater Effects */}
      {config.showEffects && <UnderwaterEffects />}
    </>
  );
};

export default ModernOceanAnimations;
