import React, { useState, useEffect, useRef } from 'react';
import { Heart, Zap, CloudRain, Sun, Moon, Sparkles, Wind, Star } from 'lucide-react';

const emotionConfig = {
  diversion: { color: 'var(--color-oniria_lightpink)', icon: Sun, textColor: 'var(--color-oniria_darkblue)' },
  tristeza: { color: 'var(--color-oniria_blue)', icon: CloudRain, textColor: 'white' },
  ira: { color: '#e74c3c', icon: Zap, textColor: 'white' },
  miedo: { color: 'var(--color-oniria_darkblue)', icon: Moon, textColor: 'white' },
  amor: { color: 'var(--color-oniria_pink)', icon: Heart, textColor: 'var(--color-oniria_darkblue)' },
  emocion: { color: '#ff6b6b', icon: Sparkles, textColor: 'white' },
  calma: { color: 'var(--color-oniria_purple)', icon: Wind, textColor: 'white' },
  ansiedad: { color: '#6c5ce7', icon: Star, textColor: 'white' }
} as const;

type EmotionKey = keyof typeof emotionConfig;

const Emotions = () => {
  const [emotions, setEmotions] = useState({
    diversion: 50,
    tristeza: 30,
    ira: 20,
    miedo: 10,
    amor: 60,
    emocion: 40,
    calma: 70,
    ansiedad: 25
  });

  const [isAnimating, setIsAnimating] = useState(false);
  const [screenSize, setScreenSize] = useState('desktop');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // Screen size detection
  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    type Particle = {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      alpha: number;
    };
    const particles: Particle[] = [];
    const particleCount = screenSize === 'mobile' ? 20 : screenSize === 'tablet' ? 35 : 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(150, 117, 188, ${particle.alpha})`;
        ctx.fill();
      });
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [screenSize]);

  const updateEmotion = (emotion: string, value: number) => {
    setEmotions(prev => ({ ...prev, [emotion]: value }));
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const getEmotionSize = (value: number) => {
    const baseSize = screenSize === 'mobile' ? 40 : screenSize === 'tablet' ? 50 : 60;
    const maxSize = screenSize === 'mobile' ? 80 : screenSize === 'tablet' ? 100 : 150;
    return Math.max(baseSize, Math.min(maxSize, (value / 100) * maxSize));
  };

  const getEmotionPosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI;
    let radius, centerX, centerY;
    
    if (screenSize === 'mobile') {
      radius = 80;
      centerX = 140;
      centerY = 140;
    } else if (screenSize === 'tablet') {
      radius = 120;
      centerX = 180;
      centerY = 180;
    } else {
      radius = 180;
      centerX = 250;
      centerY = 250;
    }
    
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius
    };
  };

  const getVisualizationDimensions = () => {
    if (screenSize === 'mobile') {
      return { width: 280, height: 280 };
    } else if (screenSize === 'tablet') {
      return { width: 360, height: 360 };
    } else {
      return { width: 500, height: 500 };
    }
  };

  const getCentralCoreSize = () => {
    if (screenSize === 'mobile') {
      return 'w-12 h-12';
    } else if (screenSize === 'tablet') {
      return 'w-16 h-16';
    } else {
      return 'w-20 h-20 sm:w-24 sm:h-24';
    }
  };

  const dimensions = getVisualizationDimensions();

  return (
    <div 
      className="min-h-screen overflow-hidden relative"
      style={{ 
        background: 'linear-gradient(135deg, var(--color-oniria_darkblue) 0%, var(--color-oniria_blue) 25%, var(--color-oniria_purple) 75%, var(--color-oniria_pink) 100%)',
        fontFamily: 'var(--font-inter)'
      }}
    >
      {/* Animated background canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-30"
      />
      
      {/* Aurora effect */}
      <div className="absolute inset-0 opacity-15">
        <div 
          className={`absolute top-0 left-1/4 ${screenSize === 'mobile' ? 'w-48 h-48' : 'w-96 h-96'} rounded-full blur-3xl animate-pulse`}
          style={{ 
            background: 'radial-gradient(circle, var(--color-oniria_purple)40 0%, var(--color-oniria_pink)40 100%)' 
          }}
        ></div>
        <div 
          className={`absolute bottom-0 right-1/4 ${screenSize === 'mobile' ? 'w-48 h-48' : 'w-96 h-96'} rounded-full blur-3xl animate-pulse`}
          style={{ 
            background: 'radial-gradient(circle, var(--color-oniria_blue)40 0%, var(--color-oniria_purple)40 100%)',
            animationDelay: '1s'
          }}
        ></div>
      </div>

      <div className="relative z-10 p-3 sm:p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h1 
            className={`${
              screenSize === 'mobile' 
                ? 'text-2xl' 
                : screenSize === 'tablet' 
                ? 'text-3xl' 
                : 'text-3xl sm:text-4xl lg:text-6xl'
            } font-bold mb-2 sm:mb-4 animate-pulse`}
            style={{ 
              fontFamily: 'var(--font-playfair)',
              background: 'linear-gradient(45deg, var(--color-oniria_lightpink), var(--color-oniria_pink), var(--color-oniria_purple))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Mapea tus emociones
          </h1>
          <p 
            className={`${
              screenSize === 'mobile' 
                ? 'text-sm px-2' 
                : 'text-base sm:text-lg lg:text-xl px-4'
            } opacity-90`}
            style={{ 
              color: 'var(--color-oniria_lightpink)',
              fontFamily: 'var(--font-inter)'
            }}
          >
            Visualiza y controla el estado emocional de tus mente
          </p>
        </div>

        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 lg:space-y-12">
          {/* Emotion Visualization Area - TOP SECTION */}
          <div 
            className="backdrop-blur-xl rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-6 lg:p-8 border shadow-2xl"
            style={{ 
              backgroundColor: 'rgba(37,44,62,0.25)',
              borderColor: 'var(--color-oniria_purple)'
            }}
          >
            <h2 
              className={`${
                screenSize === 'mobile' 
                  ? 'text-xl mb-4' 
                  : 'text-2xl sm:text-3xl mb-6 sm:mb-8'
              } font-semibold text-center`}
              style={{ 
                color: 'var(--color-oniria_lightpink)',
                fontFamily: 'var(--font-playfair)'
              }}
            >
              Mapa Emocional Onírico
            </h2>
            
            <div className="flex justify-center overflow-hidden">
              <div 
                className="relative mx-auto"
                style={{
                  width: dimensions.width,
                  height: dimensions.height
                }}
              >
                {/* Central dream core */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div 
                    className={`${getCentralCoreSize()} rounded-full animate-spin shadow-lg`}
                    style={{ 
                      background: 'linear-gradient(45deg, var(--color-oniria_purple), var(--color-oniria_pink))',
                      boxShadow: '0 0 30px var(--color-oniria_purple)'
                    }}
                  ></div>
                  <div 
                    className={`absolute inset-0 ${getCentralCoreSize()} rounded-full animate-ping opacity-20`}
                    style={{ 
                      background: 'linear-gradient(45deg, var(--color-oniria_purple), var(--color-oniria_pink))'
                    }}
                  ></div>
                </div>

                {/* Emotion circles */}
                {Object.entries(emotions).map(([emotion, value], index) => {
                  const position = getEmotionPosition(index, Object.keys(emotions).length);
                  const size = getEmotionSize(value);
                  const config = emotionConfig[emotion as EmotionKey];
                  const IconComponent = config.icon;
                  const iconSize = screenSize === 'mobile' ? 14 : Math.max(16, size * 0.35);

                  return (
                    <div
                      key={emotion}
                      className={`absolute transition-all duration-700 ease-out ${
                        isAnimating ? 'scale-125' : 'scale-100'
                      }`}
                      style={{
                        left: position.x - size / 2,
                        top: position.y - size / 2,
                        width: size,
                        height: size
                      }}
                    >
                      <div
                        className="w-full h-full rounded-full shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer animate-pulse
                          flex items-center justify-center group relative overflow-hidden"
                        style={{
                          backgroundColor: config.color,
                          boxShadow: `0 15px 40px ${config.color}40`,
                          animationDelay: `${index * 200}ms`
                        }}
                      >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 -top-10 bg-gradient-to-r from-transparent via-white/30 to-transparent rotate-45 transform translate-x-full group-hover:translate-x-[-150%] transition-transform duration-700"></div>
                        
                        <IconComponent 
                          className="z-10" 
                          size={iconSize}
                          style={{ color: config.textColor }}
                        />
                        
                        {/* Ripple effect */}
                        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div 
                            className="absolute inset-0 rounded-full animate-ping"
                            style={{ backgroundColor: `${config.color}40` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Floating label */}
                      <div className={`absolute ${screenSize === 'mobile' ? '-bottom-8' : '-bottom-10'} left-1/2 transform -translate-x-1/2`}>
                        <span 
                          className={`${
                            screenSize === 'mobile' 
                              ? 'text-xs px-2 py-0.5' 
                              : 'text-sm sm:text-base px-3 py-1'
                          } font-medium capitalize rounded-full backdrop-blur-sm whitespace-nowrap`}
                          style={{ 
                            color: 'var(--color-oniria_lightpink)',
                            backgroundColor: 'var(--color-oniria_darkblue)',
                            fontFamily: 'var(--font-inter)'
                          }}
                        >
                          {emotion}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Connecting lines - hidden on mobile for clarity */}
                {screenSize !== 'mobile' && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                    {Object.keys(emotions).map((_, index) => {
                      const pos1 = getEmotionPosition(index, Object.keys(emotions).length);
                      const pos2 = getEmotionPosition((index + 1) % Object.keys(emotions).length, Object.keys(emotions).length);
                      return (
                        <line
                          key={index}
                          x1={pos1.x}
                          y1={pos1.y}
                          x2={pos2.x}
                          y2={pos2.y}
                          stroke="url(#gradient)"
                          strokeWidth={screenSize === 'tablet' ? "2" : "3"}
                          className="animate-pulse"
                        />
                      );
                    })}
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--color-oniria_purple)" />
                        <stop offset="100%" stopColor="var(--color-oniria_pink)" />
                      </linearGradient>
                    </defs>
                  </svg>
                )}
              </div>
            </div>
          </div>

          {/* Controls Panel - BOTTOM SECTION */}
          <div 
            className="backdrop-blur-xl rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-6 lg:p-8 border shadow-2xl"
            style={{ 
              backgroundColor: 'rgba(37,44,62,0.25)',
              borderColor: 'var(--color-oniria_purple)'
            }}
          >
            <h2 
              className={`${
                screenSize === 'mobile' 
                  ? 'text-xl mb-4' 
                  : 'text-2xl sm:text-3xl mb-6 sm:mb-8'
              } font-semibold text-center`}
              style={{ 
                color: 'var(--color-oniria_lightpink)',
                fontFamily: 'var(--font-playfair)'
              }}
            >
              Panel de Control Emocional
            </h2>
            
            <div className={`grid gap-4 sm:gap-6 ${
              screenSize === 'mobile' 
                ? 'grid-cols-1' 
                : screenSize === 'tablet'
                ? 'grid-cols-1'
                : 'grid-cols-1 lg:grid-cols-2'
            }`}>
              {Object.entries(emotions).map(([emotion, value]) => {
                const config = emotionConfig[emotion as EmotionKey];
                const IconComponent = config.icon;
                return (
                  <div key={emotion} className="group">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className={`${
                          screenSize === 'mobile' ? 'p-2' : 'p-3'
                        } rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}
                          style={{ backgroundColor: config.color }}>
                          <IconComponent 
                            className="text-white" 
                            size={screenSize === 'mobile' ? 18 : 24} 
                          />
                        </div>
                        <span 
                          className={`font-medium capitalize ${
                            screenSize === 'mobile' ? 'text-base' : 'text-lg sm:text-xl'
                          }`} 
                          style={{ color: 'var(--color-oniria_purple)' }}
                        >
                          {emotion}
                        </span>
                      </div>
                      <span 
                        className={`font-bold ${
                          screenSize === 'mobile' ? 'text-base' : 'text-lg sm:text-xl'
                        }`} 
                        style={{ color: 'var(--color-oniria_pink)' }}
                      >
                        {value}%
                      </span>
                    </div>
                    
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={value}
                        onChange={(e) => updateEmotion(emotion, parseInt(e.target.value))}
                        className={`w-full ${
                          screenSize === 'mobile' ? 'h-3' : 'h-4'
                        } rounded-lg appearance-none cursor-pointer slider`}
                        style={{
                          background: `linear-gradient(to right, ${config.color} 0%, ${config.color} ${value}%, #4B5563 ${value}%, #4B5563 100%)`
                        }}
                      />
                      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300 blur-sm pointer-events-none"></div>
                    </div>
                    
                    <div 
                      className={`flex justify-between mt-1 sm:mt-2 ${
                        screenSize === 'mobile' ? 'text-xs' : 'text-xs sm:text-sm'
                      }`} 
                      style={{ color: 'var(--color-oniria_purple)' }}
                    >
                      <span>Bajo</span>
                      <span>Moderado</span>
                      <span>Alto</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dream analysis */}
            <div 
              className={`mt-6 sm:mt-8 p-3 sm:p-4 md:p-6 rounded-xl border`}
              style={{ 
                background: 'linear-gradient(135deg, var(--color-oniria_purple)30, var(--color-oniria_pink)30)',
                borderColor: 'var(--color-oniria_pink)'
              }}
            >
              <h3 
                className={`${
                  screenSize === 'mobile' ? 'text-base' : 'text-lg sm:text-xl'
                } font-semibold mb-3 sm:mb-4 flex items-center`}
                style={{ 
                  color: 'var(--color-oniria_lightpink)',
                  fontFamily: 'var(--font-playfair)'
                }}
              >
                <Sparkles className="mr-2" size={screenSize === 'mobile' ? 16 : 20} />
                Análisis del Estado Cognitivo
              </h3>
              <p 
                className={`leading-relaxed ${
                  screenSize === 'mobile' ? 'text-sm' : 'text-sm sm:text-base'
                }`}
                style={{ 
                  color: 'var(--color-oniria_lightpink)',
                  fontFamily: 'var(--font-inter)'
                }}
              >
                {emotions.diversion > 70 && emotions.calma > 60 
                  ? "Tu estado refleja armonía y serenidad. Los sueños pueden ser particularmente vividos y positivos."
                  : emotions.tristeza > 50 || emotions.ansiedad > 60
                  ? "Detectamos cierta turbulencia emocional. Considera técnicas de relajación."
                  : "Tu equilibrio emocional es estable. Estado ideal para llevar al maximo tu vida cotidiana."
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: ${screenSize === 'mobile' ? '18px' : '24px'};
          width: ${screenSize === 'mobile' ? '18px' : '24px'};
          border-radius: 50%;
          background: linear-gradient(45deg, var(--color-oniria_purple), var(--color-oniria_pink));
          cursor: pointer;
          box-shadow: 0 0 25px var(--color-oniria_purple);
          border: 2px solid var(--color-oniria_lightpink);
        }
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 35px var(--color-oniria_purple);
        }
        .slider::-moz-range-thumb {
          height: ${screenSize === 'mobile' ? '18px' : '24px'};
          width: ${screenSize === 'mobile' ? '18px' : '24px'};
          border-radius: 50%;
          background: linear-gradient(45deg, var(--color-oniria_purple), var(--color-oniria_pink));
          cursor: pointer;
          box-shadow: 0 0 25px var(--color-oniria_purple);
          border: 2px solid var(--color-oniria_lightpink);
        }
        
        /* Touch-friendly interactions on mobile */
        @media (max-width: 640px) {
          .slider {
            touch-action: pan-x;
          }
          
          /* Larger touch targets */
          .slider::-webkit-slider-thumb {
            height: 20px;
            width: 20px;
          }
          .slider::-moz-range-thumb {
            height: 20px;
            width: 20px;
          }
          
          /* Improved hover states for touch devices */
          .group:active .group-hover\\:scale-110 {
            transform: scale(1.1);
          }
          
          .group:active .group-hover\\:opacity-100 {
            opacity: 1;
          }
        }
        
        /* Tablet optimizations */
        @media (min-width: 641px) and (max-width: 1023px) {
          .slider::-webkit-slider-thumb {
            height: 22px;
            width: 22px;
          }
          .slider::-moz-range-thumb {
            height: 22px;
            width: 22px;
          }
        }
      `}</style>
    </div>
  );
}

export default Emotions;