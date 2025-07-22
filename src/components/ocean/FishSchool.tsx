
import React from 'react';
import SwimmingFish from './SwimmingFish';

interface FishSchoolProps {
  fishCount?: number;
  schoolDirection?: 'left' | 'right';
  depth?: number;
  speed?: number;
  formation?: 'tight' | 'loose' | 'line';
}

const FishSchool: React.FC<FishSchoolProps> = ({
  fishCount = 5,
  schoolDirection = 'right',
  depth = 1,
  speed = 25,
  formation = 'loose'
}) => {
  const getFormationOffset = (index: number) => {
    switch (formation) {
      case 'tight':
        return {
          x: (index % 3) * 30,
          y: Math.floor(index / 3) * 20,
          delay: index * 0.2
        };
      case 'line':
        return {
          x: index * 40,
          y: 0,
          delay: index * 0.3
        };
      default: // loose
        return {
          x: (index % 4) * 50,
          y: Math.floor(index / 4) * 30 + Math.random() * 20,
          delay: index * 0.5
        };
    }
  };

  return (
    <>
      {Array.from({ length: fishCount }).map((_, index) => {
        const offset = getFormationOffset(index);
        
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: schoolDirection === 'right' ? `-${offset.x}px` : `${offset.x}px`,
              top: `${offset.y}px`
            }}
          >
            <SwimmingFish
              size={16 + Math.random() * 8}
              depth={depth}
              speed={speed + Math.random() * 5}
              delay={offset.delay}
              direction={schoolDirection}
              path={Math.random() > 0.7 ? 'wave' : 'straight'}
            />
          </div>
        );
      })}
    </>
  );
};

export default FishSchool;
