import React, { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';


// FadeIn
interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}
const FadeIn: React.FC<FadeInProps> = ({ children, delay = 0, direction = 'up', className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0) translateX(0)';
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const getInitialTransform = () => {
    switch (direction) {
      case 'up': return 'translateY(20px)';
      case 'down': return 'translateY(-20px)';
      case 'left': return 'translateX(-20px)';
      case 'right': return 'translateX(20px)';
      default: return 'translateY(20px)';
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        transform: getInitialTransform(),
        transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};


interface AnimatedGradientTextProps {
  text: string;
  className?: string;
  isDarkMode?: boolean;
}
const AnimatedGradientText: React.FC<AnimatedGradientTextProps> = ({ text, className = '', isDarkMode = false }) => (
  <span className={`relative inline-block ${className}`}>
    <span className={`${isDarkMode 
      ? 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400' 
      : 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600'
    } bg-clip-text text-transparent bg-[length:200%_100%] animate-gradient`}>
      {text}
    </span>
  </span>
);


interface BlurInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}
const BlurIn: React.FC<BlurInProps> = ({ children, delay = 0, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.style.opacity = '1';
          element.style.filter = 'blur(0px)';
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        filter: 'blur(5px)',
        transition: `opacity 0.6s ease-out ${delay}s, filter 0.6s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

// ShimmerButton
interface ShimmerButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  isDarkMode?: boolean;
}
const ShimmerButton: React.FC<ShimmerButtonProps> = ({ children, className = '', onClick, isDarkMode = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden group cursor-pointer ${className}`}
      type="button"
    >
      {/* Partículas de fondo */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random()}s`,
            }}
          />
        ))}
      </div>
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
    </button>
  );
};

// Pulsing Orb - Componente de orbe pulsante
interface PulsingOrbProps {
  className?: string;
  size?: string;
  color?: string;
  delay?: number;
}
const PulsingOrb: React.FC<PulsingOrbProps> = ({ 
  className = '', 
  size = 'w-4 h-4', 
  color = 'bg-purple-400',
  delay = 0 
}) => {
  return (
    <div className={`absolute ${size} ${className}`}>
      <div className={`${size} ${color} rounded-full animate-pulse`} 
           style={{ animationDelay: `${delay}s` }}>
        <div className={`absolute inset-0 ${color} rounded-full animate-ping opacity-75`}
             style={{ animationDelay: `${delay + 0.5}s` }}></div>
      </div>
    </div>
  );
};

// Floating Ring - Anillo flotante
interface FloatingRingProps {
  className?: string;
  size?: string;
  color?: string;
  duration?: number;
}
const FloatingRing: React.FC<FloatingRingProps> = ({ 
  className = '', 
  size = 'w-12 h-12', 
  color = 'border-purple-300',
  duration = 3
}) => {
  return (
    <div className={`absolute ${size} ${className}`}
         style={{ animation: `float ${duration}s ease-in-out infinite` }}>
      <div className={`w-full h-full border-2 ${color} rounded-full opacity-60`}>
        <div className={`w-full h-full border ${color.replace('border-', 'border-pink-')} rounded-full animate-spin`}
             style={{ animationDuration: `${duration * 2}s` }}></div>
      </div>
    </div>
  );
};

// Glow Effect - Efecto de brillo
interface GlowEffectProps {
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  color?: string;
}
const GlowEffect: React.FC<GlowEffectProps> = ({ 
  className = '', 
  intensity = 'medium',
  color = 'from-purple-400 to-pink-400' 
}) => {
  const getIntensity = () => {
    switch (intensity) {
      case 'low': return 'opacity-10 blur-sm';
      case 'medium': return 'opacity-20 blur-md';
      case 'high': return 'opacity-30 blur-lg';
      default: return 'opacity-20 blur-md';
    }
  };

  return (
    <div className={`absolute inset-0 bg-gradient-to-r ${color} ${getIntensity()} animate-pulse ${className}`}></div>
  );
};

// Morphing Shape - Forma que cambia
interface MorphingShapeProps {
  className?: string;
  color?: string;
}
const MorphingShape: React.FC<MorphingShapeProps> = ({ 
  className = '', 
  color = 'bg-gradient-to-r from-purple-300 to-pink-300' 
}) => {
  return (
    <div className={`absolute ${color} opacity-30 animate-morph ${className}`}
         style={{ 
           borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
           animation: 'morph 8s ease-in-out infinite'
         }}>
    </div>
  );
};

// Twinkling Stars - Estrellas parpadeantes
interface TwinklingStarsProps {
  count?: number;
  className?: string;
  isDarkMode?: boolean;
}
const TwinklingStars: React.FC<TwinklingStarsProps> = ({ count = 15, className = '', isDarkMode = false }) => {
  const stars = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3,
    duration: Math.random() * 2 + 1,
  }));

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {stars.map((star) => (
        <div
          key={star.id}
          className={`absolute rounded-full ${isDarkMode ? 'bg-yellow-200' : 'bg-white'} opacity-60 animate-twinkle`}
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.x}%`,
            top: `${star.y}%`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

// Breath Effect - Efecto de respiración
interface BreathEffectProps {
  children: ReactNode;
  className?: string;
  duration?: number;
}
const BreathEffect: React.FC<BreathEffectProps> = ({ 
  children, 
  className = '', 
  duration = 4 
}) => {
  return (
    <div className={`animate-breath ${className}`}
         style={{ animationDuration: `${duration}s` }}>
      {children}
    </div>
  );
};

// Enhanced Magnetic Effect - Efecto magnético mejorado
interface MagneticEffectProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  isHovered?: boolean;
}
const MagneticEffect: React.FC<MagneticEffectProps> = ({ 
  children, 
  className = '', 
  strength = 20,
  isHovered = false
}) => {
  const [transform, setTransform] = useState('translate(0px, 0px) scale(1)');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const distance = Math.sqrt(x * x + y * y);
      
      if (distance < 150) {
        const factor = (150 - distance) / 150;
        const moveX = (x / distance) * strength * factor;
        const moveY = (y / distance) * strength * factor;
        const scale = 1 + (factor * 0.05);
        setTransform(`translate(${moveX}px, ${moveY}px) scale(${scale})`);
      } else {
        setTransform('translate(0px, 0px) scale(1)');
      }
    };

    const handleMouseLeave = () => {
      setTransform('translate(0px, 0px) scale(1)');
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return (
    <div
      ref={ref}
      className={`transition-transform duration-200 ease-out cursor-pointer ${className}`}
      style={{ transform }}
    >
      {children}
    </div>
  );
};

const HeroSection: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const getThemeColors = () => {
    if (isDarkMode) {
      return {
        background: 'bg-gradient-to-br from-slate-900 via-gray-900 to-indigo-900',
        textPrimary: 'text-gray-100',
        textSecondary: 'text-gray-300',
        buttonBg: 'bg-indigo-600 hover:bg-indigo-700',
        morphingShape: 'bg-gradient-to-r from-indigo-600 to-purple-600',
        glowEffect: 'from-indigo-400 via-purple-400 to-blue-400',
        imageContainer: 'from-indigo-800 to-purple-800',
        imageCircle: 'from-gray-800 to-slate-800',
        backgroundImage: 'from-indigo-900 to-purple-900',
        orbColors: {
          primary: 'bg-indigo-400',
          secondary: 'bg-purple-400',
          tertiary: 'bg-blue-400',
          quaternary: 'bg-violet-400'
        },
        ringColors: {
          primary: 'border-indigo-400',
          secondary: 'border-purple-400',
          tertiary: 'border-blue-400'
        },
        floatingElements: {
          primary: 'bg-yellow-400',
          secondary: 'bg-cyan-400'
        }
      };
    } else {
      return {
        background: 'bg-gradient-to-br from-pink-100 via-rose-100 to-purple-200',
        textPrimary: 'text-slate-800',
        textSecondary: 'text-slate-600',
        buttonBg: 'bg-purple-600 hover:bg-purple-700',
        morphingShape: 'bg-gradient-to-r from-purple-200 to-pink-200',
        glowEffect: 'from-purple-400 via-pink-400 to-blue-400',
        imageContainer: 'from-purple-100 to-pink-100',
        imageCircle: 'from-blue-100 to-purple-100',
        backgroundImage: 'from-purple-100 to-pink-100',
        orbColors: {
          primary: 'bg-purple-400',
          secondary: 'bg-pink-400',
          tertiary: 'bg-blue-400',
          quaternary: 'bg-indigo-400'
        },
        ringColors: {
          primary: 'border-purple-300',
          secondary: 'border-pink-300',
          tertiary: 'border-blue-300'
        },
        floatingElements: {
          primary: 'bg-yellow-300',
          secondary: 'bg-cyan-300'
        }
      };
    }
  };

  const theme = getThemeColors();

  return (
    <section className={`${theme.background} min-h-screen flex items-center overflow-hidden relative transition-all duration-1000`}>
      {/* Fondo con estrellas parpadeantes */}
      <TwinklingStars count={20} isDarkMode={isDarkMode} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-2 items-center">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-8 ml-4 sm:ml-8 lg:ml-12 text-center lg:text-left">
            {/* Título con texto animado */}
            <FadeIn delay={0.1} direction="up">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className={theme.textPrimary}>Descubre el </span>
                <AnimatedGradientText
                  text="significado"
                  className="italic"
                  isDarkMode={isDarkMode}
                />
                <span className={theme.textPrimary}> de </span>
                <AnimatedGradientText
                  text="tus sueños"
                  className="italic"
                  isDarkMode={isDarkMode}
                />
              </h1>
            </FadeIn>

            {/* Párrafo con efecto blur */}
            <BlurIn delay={0.3}>
              <p className={`text-lg sm:text-xl lg:text-2xl ${theme.textSecondary} max-w-lg mx-auto lg:mx-0`}>
                <span className="block">Explora tu subconsciente con análisis avanzado</span>
                <span className="block">y descubre las emociones ocultas en tus sueños.</span>
              </p>
            </BlurIn>

            {/* Botón con efecto shimmer */}
            <FadeIn delay={0.5} direction="up">
            <Link to="/signup">
              <ShimmerButton  className={`${theme.buttonBg} text-white font-semibold px-8 sm:px-10 py-4 sm:py-5 rounded-lg text-lg sm:text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
                isDarkMode={isDarkMode}
              >
              Comenzar ahora
             </ShimmerButton>
          </Link>
          </FadeIn>

          </div>

          {/* Right Content */}
          <div className="flex justify-center lg:justify-end mr-4 sm:mr-12 lg:mr-20">
            <FadeIn delay={0.2} direction="right">
              <div className="relative">
                {/* Contenedor principal */}
                <MagneticEffect strength={25}>
                  <div className="relative group cursor-pointer" onClick={toggleDarkMode}>
                    {/* Forma de fondo */}
                    <MorphingShape 
                      className="w-80 h-80 sm:w-96 sm:h-96 lg:w-[400px] lg:h-[400px] -top-8 -left-8 transition-all duration-1000"
                      color={theme.morphingShape}
                    />
                    
                    {/* Efecto de brillo principal */}
                    <GlowEffect 
                      className="w-72 h-72 sm:w-88 sm:h-88 lg:w-96 lg:h-96 rounded-full transition-all duration-1000"
                      intensity="medium"
                      color={theme.glowEffect}
                    />
                    
                    {/* Contenedor de imagen */}
                    <BreathEffect duration={6}>
                      <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 relative z-10">
                        {/* Imagen principal */}
                        <BlurIn delay={0.4}>
                          <div className="relative w-full h-full">
                            <div className={`w-full h-full bg-gradient-to-br ${theme.imageContainer} rounded-full flex items-center justify-center transition-all duration-1000`}>
                              <div className={`w-5/6 h-5/6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-full shadow-2xl flex items-center justify-center transition-all duration-1000`}>
                                <div className={`text-6xl transition-all duration-1000 ${isDarkMode ? 'animate-pulse' : ''}`}>
                                  {isDarkMode ? '☀️' : '🌙'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </BlurIn>
                        
                        {/* Imagen de fondo */}
                        <BlurIn delay={0.6}>
                          <div className="absolute inset-0 w-full h-full">
                            <div className={`w-full h-full bg-gradient-to-br ${theme.backgroundImage} rounded-full opacity-70 transition-all duration-1000 group-hover:opacity-50 flex items-center justify-center`}>
                              <div className={`text-4xl opacity-60 transition-all duration-1000 ${isDarkMode ? 'animate-pulse' : ''}`}>
                                {isDarkMode ? '🌟' : '✨'}
                              </div>
                            </div>
                          </div>
                        </BlurIn>
                      </div>
                    </BreathEffect>

                    {/* Anillos flotantes */}
                    <FloatingRing 
                      className="top-8 right-8 sm:top-12 sm:right-12 transition-all duration-1000"
                      size="w-16 h-16 sm:w-20 sm:h-20"
                      color={theme.ringColors.primary}
                      duration={4}
                    />
                    <FloatingRing 
                      className="bottom-12 left-4 sm:bottom-16 sm:left-8 transition-all duration-1000"
                      size="w-12 h-12 sm:w-16 sm:h-16"
                      color={theme.ringColors.secondary}
                      duration={5}
                    />
                    <FloatingRing 
                      className="top-1/2 -right-8 sm:-right-12 transition-all duration-1000"
                      size="w-8 h-8 sm:w-12 sm:h-12"
                      color={theme.ringColors.tertiary}
                      duration={3}
                    />

                    {/* Orbes pulsantes */}
                    <PulsingOrb 
                      className="-top-4 -right-4 sm:-top-6 sm:-right-6 transition-all duration-1000"
                      size="w-6 h-6 sm:w-8 sm:h-8"
                      color={theme.orbColors.primary}
                      delay={0}
                    />
                    <PulsingOrb 
                      className="-bottom-6 -left-6 sm:-bottom-8 sm:-left-8 transition-all duration-1000"
                      size="w-4 h-4 sm:w-6 sm:h-6"
                      color={theme.orbColors.secondary}
                      delay={1}
                    />
                    <PulsingOrb 
                      className="top-1/3 -left-8 sm:-left-12 transition-all duration-1000"
                      size="w-3 h-3 sm:w-4 sm:h-4"
                      color={theme.orbColors.tertiary}
                      delay={2}
                    />
                    <PulsingOrb 
                      className="bottom-1/3 -right-6 sm:-right-8 transition-all duration-1000"
                      size="w-5 h-5 sm:w-6 sm:h-6"
                      color={theme.orbColors.quaternary}
                      delay={1.5}
                    />

                    {/* Elementos flotantes adicionales */}
                    <FadeIn delay={0.8}>
                      <div className={`absolute top-4 left-4 sm:top-8 sm:left-8 w-2 h-2 sm:w-3 sm:h-3 rounded-full ${theme.floatingElements.primary} opacity-80 animate-bounce transition-all duration-1000`}>
                        <div className={`absolute inset-0 rounded-full ${theme.floatingElements.primary} animate-ping`}></div>
                      </div>
                    </FadeIn>
                    <FadeIn delay={1.2}>
                      <div className={`absolute bottom-8 right-4 sm:bottom-12 sm:right-8 w-2 h-2 sm:w-3 sm:h-3 rounded-full ${theme.floatingElements.secondary} opacity-80 animate-pulse transition-all duration-1000`}>
                        <div className={`absolute inset-0 rounded-full ${theme.floatingElements.secondary} animate-ping`}></div>
                      </div>
                    </FadeIn>

                    {/* Efecto de glow */}
                    <div className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-30 transition-all duration-700 bg-gradient-to-r ${theme.glowEffect} blur-xl transform scale-125 animate-pulse`}></div>
                  </div>
                </MagneticEffect>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      

      {/* Animación CSS personalizada */}
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes morph {
          0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        @keyframes breath {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        .animate-morph {
          animation: morph 8s ease-in-out infinite;
        }
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        .animate-breath {
          animation: breath 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;