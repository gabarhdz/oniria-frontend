import React, { useState, useEffect, useMemo } from 'react';

interface TwinklingStarsProps {
  count?: number;
  density?: 'low' | 'medium' | 'high';
  speed?: 'slow' | 'normal' | 'fast';
  showShootingStars?: boolean;
  showConstellations?: boolean;
  className?: string;
}

// Star configuration interface
interface StarConfig {
  id: string;
  size: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  opacity: number;
  type: 'twinkle' | 'pulse' | 'sparkle' | 'glow';
  color: string;
}

// Shooting star interface
interface ShootingStarConfig {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  delay: number;
  duration: number;
  trail: number;
}

// Constellation interface
interface ConstellationConfig {
  id: string;
  points: Array<{ x: number; y: number }>;
  opacity: number;
}

export const TwinklingStars: React.FC<TwinklingStarsProps> = ({ 
  count = 30,
  density = 'medium',
  speed = 'normal',
  showShootingStars = true,
  showConstellations = true,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Color palette based on Noctiria theme
  const starColors = [
    '#ffe0db', // oniria_lightpink
    '#f1b3be', // oniria_pink
    '#9675bc', // oniria_purple
    '#ffffff', // pure white for variety
    '#e0c9ff'  // light purple variant
  ];

  // Adjust count based on density
  const adjustedCount = useMemo(() => {
    const densityMultipliers = { low: 0.7, medium: 1, high: 1.5 };
    return Math.floor(count * densityMultipliers[density]);
  }, [count, density]);

  // Speed multipliers
  const speedMultipliers = { slow: 1.5, normal: 1, fast: 0.7 };
  const speedMultiplier = speedMultipliers[speed];

  // Generate stars configuration
  const stars: StarConfig[] = useMemo(() => {
    return Array.from({ length: adjustedCount }, (_, i) => {
      const starTypes: StarConfig['type'][] = ['twinkle', 'pulse', 'sparkle', 'glow'];
      const randomType = starTypes[Math.floor(Math.random() * starTypes.length)];
      
      return {
        id: `star-${i}`,
        size: Math.random() * 3 + 0.8,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5,
        duration: (Math.random() * 3 + 2) * speedMultiplier,
        opacity: Math.random() * 0.6 + 0.4,
        type: randomType,
        color: starColors[Math.floor(Math.random() * starColors.length)]
      };
    });
  }, [adjustedCount, speedMultiplier]);

  // Generate shooting stars
  const shootingStars: ShootingStarConfig[] = useMemo(() => {
    if (!showShootingStars) return [];
    
    return Array.from({ length: 3 }, (_, i) => ({
      id: `shooting-${i}`,
      startX: -10,
      startY: Math.random() * 60,
      endX: 110,
      endY: Math.random() * 80 + 10,
      delay: i * 12 + Math.random() * 8,
      duration: 2.5 + Math.random() * 1.5,
      trail: 40 + Math.random() * 30
    }));
  }, [showShootingStars]);

  // Generate constellation patterns
  const constellations: ConstellationConfig[] = useMemo(() => {
    if (!showConstellations) return [];
    
    return [
      {
        id: 'constellation-1',
        points: [
          { x: 20, y: 25 },
          { x: 25, y: 20 },
          { x: 30, y: 22 },
          { x: 35, y: 18 },
          { x: 28, y: 30 }
        ],
        opacity: 0.3
      },
      {
        id: 'constellation-2',
        points: [
          { x: 70, y: 60 },
          { x: 75, y: 65 },
          { x: 80, y: 62 },
          { x: 78, y: 70 }
        ],
        opacity: 0.25
      }
    ];
  }, [showConstellations]);

  // Individual star component
  const Star: React.FC<{ config: StarConfig }> = ({ config }) => {
    const getStarElement = () => {
      switch (config.type) {
        case 'sparkle':
          return (
            <div
              className="absolute"
              style={{
                width: `${config.size}px`,
                height: `${config.size}px`,
                left: `${config.x}%`,
                top: `${config.y}%`,
                animationDelay: `${config.delay}s`,
                animationDuration: `${config.duration}s`,
                opacity: config.opacity,
              }}
            >
              <div 
                className="relative w-full h-full animate-sparkle-star"
                style={{
                  background: `radial-gradient(circle, ${config.color} 0%, transparent 70%)`,
                }}
              >
                {/* Four-pointed star shape */}
                <div 
                  className="absolute inset-0 transform rotate-45"
                  style={{
                    background: config.color,
                    clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                  }}
                />
              </div>
            </div>
          );

        case 'glow':
          return (
            <div
              className="absolute animate-glow-star"
              style={{
                width: `${config.size * 1.5}px`,
                height: `${config.size * 1.5}px`,
                left: `${config.x}%`,
                top: `${config.y}%`,
                animationDelay: `${config.delay}s`,
                animationDuration: `${config.duration}s`,
                opacity: config.opacity,
                background: `radial-gradient(circle, ${config.color} 0%, ${config.color}40 30%, transparent 70%)`,
                borderRadius: '50%',
              }}
            >
              <div 
                className="absolute inset-1 rounded-full animate-pulse"
                style={{
                  background: `radial-gradient(circle, ${config.color} 0%, transparent 60%)`,
                }}
              />
            </div>
          );

        case 'pulse':
          return (
            <div
              className="absolute animate-pulse-star"
              style={{
                width: `${config.size}px`,
                height: `${config.size}px`,
                left: `${config.x}%`,
                top: `${config.y}%`,
                animationDelay: `${config.delay}s`,
                animationDuration: `${config.duration}s`,
                opacity: config.opacity,
                background: `radial-gradient(circle, ${config.color} 0%, transparent 70%)`,
                borderRadius: '50%',
              }}
            />
          );

        default: // twinkle
          return (
            <div
              className="absolute animate-twinkle-star"
              style={{
                width: `${config.size}px`,
                height: `${config.size}px`,
                left: `${config.x}%`,
                top: `${config.y}%`,
                animationDelay: `${config.delay}s`,
                animationDuration: `${config.duration}s`,
                opacity: config.opacity,
                background: config.color,
                borderRadius: '50%',
                boxShadow: `0 0 ${config.size * 2}px ${config.color}40`,
              }}
            />
          );
      }
    };

    return getStarElement();
  };

  // Shooting star component
  const ShootingStar: React.FC<{ config: ShootingStarConfig }> = ({ config }) => (
    <div
      className="absolute animate-shooting-star pointer-events-none"
      style={{
        left: `${config.startX}%`,
        top: `${config.startY}%`,
        animationDelay: `${config.delay}s`,
        animationDuration: `${config.duration}s`,
        '--end-x': `${config.endX - config.startX}vw`,
        '--end-y': `${config.endY - config.startY}vh`,
      } as React.CSSProperties}
    >
      {/* Main shooting star body */}
      <div 
        className="w-2 h-2 bg-gradient-to-r from-[#ffe0db] via-[#f1b3be] to-transparent rounded-full shadow-lg"
        style={{
          boxShadow: '0 0 10px #f1b3be, 0 0 20px #ffe0db40'
        }}
      />
      
      {/* Trail effect */}
      <div 
        className="absolute top-0 left-0 h-1 bg-gradient-to-r from-[#f1b3be] to-transparent opacity-60 blur-sm"
        style={{
          width: `${config.trail}px`,
          transform: 'translateX(-100%)'
        }}
      />
    </div>
  );

  // Constellation component
  const Constellation: React.FC<{ config: ConstellationConfig }> = ({ config }) => (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none animate-constellation-drift"
      style={{ opacity: config.opacity }}
    >
      {/* Draw lines between constellation points */}
      {config.points.map((point, index) => {
        const nextPoint = config.points[(index + 1) % config.points.length];
        return (
          <line
            key={`line-${index}`}
            x1={`${point.x}%`}
            y1={`${point.y}%`}
            x2={`${nextPoint.x}%`}
            y2={`${nextPoint.y}%`}
            stroke="#9675bc"
            strokeWidth="0.5"
            strokeOpacity="0.4"
            className="animate-pulse"
          />
        );
      })}
      
      {/* Draw constellation points */}
      {config.points.map((point, index) => (
        <circle
          key={`point-${index}`}
          cx={`${point.x}%`}
          cy={`${point.y}%`}
          r="1.5"
          fill="#f1b3be"
          className="animate-twinkle"
          style={{ animationDelay: `${index * 0.5}s` }}
        />
      ))}
    </svg>
  );

  return (
    <div 
      className={`absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
    >
      {/* Regular stars */}
      {stars.map((star) => (
        <Star key={star.id} config={star} />
      ))}
      
      {/* Shooting stars */}
      {shootingStars.map((shootingStar) => (
        <ShootingStar key={shootingStar.id} config={shootingStar} />
      ))}
      
      {/* Constellations */}
      {constellations.map((constellation) => (
        <Constellation key={constellation.id} config={constellation} />
      ))}
      
      {/* Ambient glow effects */}
      <div className="absolute inset-0 bg-gradient-radial from-[#9675bc]/2 via-transparent to-transparent animate-pulse" />
      <div className="absolute inset-0 bg-gradient-radial from-[#f1b3be]/1 via-transparent to-transparent animate-pulse" style={{ animationDelay: '2s' }} />
      
      <style>{`
        @keyframes twinkle-star {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        
        @keyframes sparkle-star {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.4) rotate(180deg);
          }
        }
        
        @keyframes glow-star {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
            filter: blur(0px);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.5);
            filter: blur(2px);
          }
        }
        @keyframes pulse-star {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }
        @keyframes shooting-star {
          from {
            transform: translateX(var(--start-x)) translateY(var(--start-y));
          }
          to {
            transform: translateX(var(--end-x)) translateY(var(--end-y));
          }
        }
        @keyframes constellation-drift {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2%);
          }
          100% {
            transform: translateY(0);
          }
        }
        @keyframes sparkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }
        @keyframes glow {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
            filter: blur(0px);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.5);
            filter: blur(2px);
          }
        }
        @keyframes shooting {
          from {
            transform: translateX(var(--start-x)) translateY(var(--start-y));
          }
          to {
            transform: translateX(var(--end-x)) translateY(var(--end-y));
          }
        }
        @keyframes constellation-drift {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2%);
          }
          100% {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
export default TwinklingStars;