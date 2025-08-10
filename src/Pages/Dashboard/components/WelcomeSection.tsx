import React, { useState, useEffect, useRef } from 'react';
import { User, Crown, Moon, Star, Heart, Shield, Sparkles } from 'lucide-react';

interface User {
  username: string;
  profile_pic?: string;
  is_psychologist: boolean;
  description?: string;
}

interface WelcomeSectionProps {
  user: User;
}

// ReactBits-inspired Animation Components
const FadeInUp: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ 
  children, 
  delay = 0, 
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 1000);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transform transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      } ${className}`}
    >
      {children}
    </div>
  );
};

const ScaleIn: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ 
  children, 
  delay = 0, 
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 1000);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transform transition-all duration-500 ease-out ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      } ${className}`}
    >
      {children}
    </div>
  );
};

const TypewriterText: React.FC<{ text: string; speed?: number; className?: string }> = ({ 
  text, 
  speed = 80, 
  className = '' 
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span className={className}>
      {displayText}
      {!isComplete && (
        <span 
          className="inline-block w-0.5 h-8 ml-1 animate-pulse"
          style={{ backgroundColor: '#f1b3be' }}
        />
      )}
    </span>
  );
};

const FloatingElements: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Geometric floating shapes */}
      <div 
        className="absolute animate-float-gentle opacity-10"
        style={{
          top: '15%',
          left: '10%',
          width: '60px',
          height: '60px',
          background: 'linear-gradient(135deg, #9675bc, #f1b3be)',
          borderRadius: '50%',
          filter: 'blur(1px)',
          animationDelay: '0s'
        }}
      />
      <div 
        className="absolute animate-float-gentle opacity-15"
        style={{
          top: '70%',
          right: '15%',
          width: '40px',
          height: '40px',
          background: 'linear-gradient(135deg, #f1b3be, #ffe0db)',
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          filter: 'blur(1px)',
          animationDelay: '2s'
        }}
      />
      <div 
        className="absolute animate-float-gentle opacity-20"
        style={{
          bottom: '20%',
          left: '20%',
          width: '30px',
          height: '30px',
          background: '#ffe0db',
          clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
          filter: 'blur(0.5px)',
          animationDelay: '4s'
        }}
      />
      
      {/* Subtle sparkles */}
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          className="absolute animate-twinkle"
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${10 + Math.random() * 80}%`,
            width: '2px',
            height: '2px',
            background: '#ffe0db',
            borderRadius: '50%',
            animationDelay: `${Math.random() * 3}s`,
            opacity: 0.6
          }}
        />
      ))}
    </div>
  );
};

const GlowingBorder: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`relative group ${className}`}>
      {/* Animated border glow */}
      <div 
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-30 transition-all duration-700 blur-sm"
        style={{
          background: 'linear-gradient(45deg, #9675bc, #f1b3be, #ffe0db, #9675bc)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 3s ease infinite'
        }}
      />
      {children}
    </div>
  );
};

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ user }) => {
  const [avatarError, setAvatarError] = useState(false);

  // Función para obtener las iniciales del usuario
  const getUserInitials = (username: string): string => {
    return username.split(' ').map(name => name.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  return (
    <GlowingBorder className="relative min-h-[400px] rounded-3xl overflow-hidden">
      <FloatingElements />
      
      {/* Main background with theme colors */}
      <div 
        className="absolute inset-0 backdrop-blur-sm"
        style={{
          background: 'linear-gradient(135deg, #252c3e 0%, #214d72 50%, #9675bc 100%)'
        }}
      />
      
      {/* Subtle overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: 'linear-gradient(to top, #9675bc, transparent)'
        }}
      />
      
      {/* Main content */}
      <div className="relative z-10 p-8 text-center space-y-6">
        
        {/* Avatar Section */}
        <ScaleIn delay={0.2}>
          <div className="relative inline-flex items-center justify-center">
            <div className="relative group">
              {/* Subtle glow effect around avatar */}
              <div 
                className="absolute inset-0 rounded-full opacity-50 group-hover:opacity-70 transition-all duration-500 blur-lg"
                style={{
                  background: 'radial-gradient(circle, #f1b3be 0%, transparent 70%)',
                  transform: 'scale(1.2)'
                }}
              />
              
              <div 
                className="relative w-28 h-28 rounded-full overflow-hidden shadow-xl transform transition-all duration-500 hover:shadow-2xl hover:scale-105 border-4 group"
                style={{ 
                  borderColor: '#f1b3be',
                  boxShadow: '0 20px 40px rgba(150, 117, 188, 0.3)'
                }}
              >
                {/* Avatar Image or Initials */}
                {user.profile_pic && !avatarError ? (
                  <img
                    src={user.profile_pic}
                    alt={user.username}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center text-white font-bold text-2xl relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #9675bc 0%, #f1b3be 100%)'
                    }}
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <span className="relative z-10">{getUserInitials(user.username)}</span>
                  </div>
                )}
              </div>
              
              {/* Online indicator */}
              <div className="absolute -bottom-1 -right-1">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-4 border-white relative"
                  style={{ backgroundColor: '#4ade80' }}
                >
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                  {/* Pulse ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping opacity-75" />
                </div>
              </div>
            </div>
          </div>
        </ScaleIn>
        
        {/* Welcome Text with typewriter effect */}
        <FadeInUp delay={0.4}>
          <div className="space-y-4">
            <h1 
              className="text-4xl lg:text-5xl font-bold leading-tight"
              style={{ 
                background: 'linear-gradient(135deg, #ffe0db 0%, #f1b3be 50%, #9675bc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontFamily: 'var(--font-playfair, "Playfair Display", serif)'
              }}
            >
              ¡Bienvenido, <TypewriterText text={user.username} />!
            </h1>
            
            {/* Role badge with enhanced styling */}
            <ScaleIn delay={0.6}>
              {user.is_psychologist ? (
                <div 
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-full border backdrop-blur-sm group hover:scale-105 transition-all duration-300 cursor-default relative overflow-hidden"
                  style={{
                    backgroundColor: 'rgba(255, 224, 219, 0.15)',
                    borderColor: 'rgba(255, 224, 219, 0.3)'
                  }}
                >
                  {/* Subtle shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <Crown className="w-5 h-5 animate-pulse" style={{ color: '#ffe0db' }} />
                  <span 
                    className="font-semibold text-lg relative z-10"
                    style={{ 
                      color: '#ffe0db',
                      fontFamily: 'var(--font-inter, "Inter", sans-serif)'
                    }}
                  >
                    Psicólogo Certificado
                  </span>
                  <Shield className="w-4 h-4" style={{ color: '#f1b3be' }} />
                </div>
              ) : (
                <div 
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-full border backdrop-blur-sm group hover:scale-105 transition-all duration-300 cursor-default relative overflow-hidden"
                  style={{
                    backgroundColor: 'rgba(241, 179, 190, 0.15)',
                    borderColor: 'rgba(241, 179, 190, 0.3)'
                  }}
                >
                  {/* Subtle shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <Moon className="w-5 h-5 animate-pulse" style={{ color: '#f1b3be' }} />
                  <span 
                    className="font-medium relative z-10"
                    style={{ 
                      color: '#ffe0db',
                      fontFamily: 'var(--font-inter, "Inter", sans-serif)'
                    }}
                  >
                    Explorador de Sueños
                  </span>
                  <Star className="w-5 h-5 animate-twinkle" style={{ color: '#ffe0db' }} />
                  <Sparkles className="w-4 h-4 animate-pulse" style={{ color: '#ffe0db' }} />
                </div>
              )}
            </ScaleIn>
          </div>
        </FadeInUp>
        
        {/* User description */}
        {user.description && (
          <FadeInUp delay={0.8}>
            <div className="max-w-2xl mx-auto">
              <div 
                className="backdrop-blur-sm border rounded-2xl px-6 py-4 relative group hover:scale-105 transition-all duration-300 overflow-hidden"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(255, 255, 255, 0.2)'
                }}
              >
                {/* Subtle background animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500" />
                
                <p 
                  className="leading-relaxed text-lg relative z-10"
                  style={{ 
                    color: 'rgba(255, 224, 219, 0.9)',
                    fontFamily: 'var(--font-inter, "Inter", sans-serif)'
                  }}
                >
                  {user.description}
                </p>
                
                {/* Decorative icon */}
                <Heart 
                  className="absolute top-3 right-3 w-4 h-4 opacity-50 animate-pulse" 
                  style={{ color: '#f1b3be' }}
                />
              </div>
            </div>
          </FadeInUp>
        )}
        
        {/* Time-based greeting */}
        <FadeInUp delay={1.0}>
          <div className="flex items-center justify-center space-x-2 group">
            <Moon className="w-4 h-4 animate-pulse" style={{ color: '#f1b3be' }} />
            <span 
              className="text-sm font-medium opacity-80 group-hover:opacity-100 transition-opacity duration-300"
              style={{ 
                color: '#ffe0db',
                fontFamily: 'var(--font-inter, "Inter", sans-serif)'
              }}
            >
              {new Date().getHours() < 12 
                ? 'Buenos días, que tengas dulces sueños esta noche' 
                : new Date().getHours() < 18 
                ? 'Buenas tardes, prepárate para explorar tus sueños'
                : 'Buenas noches, es hora de sumergirte en el mundo onírico'
              }
            </span>
            <Star className="w-4 h-4 animate-twinkle" style={{ color: '#ffe0db' }} />
          </div>
        </FadeInUp>
      </div>
      
      {/* Subtle border */}
      <div 
        className="absolute inset-0 rounded-3xl border pointer-events-none"
        style={{
          borderColor: 'rgba(150, 117, 188, 0.3)'
        }}
      />

      {/* CSS Animations */}
      <style>{`
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          25% { transform: translateY(-10px) translateX(5px) rotate(1deg); }
          50% { transform: translateY(-5px) translateX(-5px) rotate(-1deg); }
          75% { transform: translateY(-15px) translateX(2px) rotate(0.5deg); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-float-gentle {
          animation: float-gentle 6s ease-in-out infinite;
        }
        
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
      `}</style>
    </GlowingBorder>
  );
};

export default WelcomeSection;