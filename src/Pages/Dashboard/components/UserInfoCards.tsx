import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Shield, 
  Heart,
  Zap,
  Star,
  Eye,
  Crown,
  Sparkles
} from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string;
  is_psychologist?: boolean;
  profile_pic?: string;
}

interface UserInfoCardsProps {
  user: User;
}

// Enhanced Info Card Component
interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  gradient: string;
  delay: number;
  isSpecial?: boolean;
}

const InfoCard: React.FC<InfoCardProps> = ({ 
  icon, 
  title, 
  value, 
  gradient, 
  delay,
  isSpecial = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 100);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [delay]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMousePosition({ x, y });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative overflow-hidden transform transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{
        fontFamily: 'var(--font-inter, "Inter", sans-serif)',
      }}
    >
      {/* Dynamic mouse glow */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
        style={{
          background: `radial-gradient(300px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(150, 117, 188, 0.15), transparent 40%)`,
        }}
      />
      
      {/* Ambient background glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-2xl blur-xl opacity-10 group-hover:opacity-25 transition-all duration-700 scale-110`} />
      
      {/* Enhanced glass border */}
      <div className={`absolute inset-0 rounded-2xl p-[1px] transition-all duration-500 ${
        isSpecial 
          ? 'bg-gradient-to-br from-[#9675bc]/40 via-[#f1b3be]/50 to-[#ffe0db]/40 group-hover:from-[#9675bc]/60 group-hover:via-[#f1b3be]/70 group-hover:to-[#ffe0db]/60'
          : 'bg-gradient-to-br from-[#9675bc]/25 via-[#f1b3be]/30 to-[#ffe0db]/25 group-hover:from-[#9675bc]/40 group-hover:via-[#f1b3be]/50 group-hover:to-[#ffe0db]/40'
      }`}>
        <div className="h-full w-full rounded-2xl bg-gradient-to-br from-white/95 via-white/88 to-[#ffe0db]/25 backdrop-blur-xl" />
      </div>
      
      {/* Floating dream particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        {isHovered && (
          <>
            {/* Main particles */}
            <div className="absolute top-4 right-6 w-1.5 h-1.5 bg-[#f1b3be] rounded-full animate-dream-sparkle opacity-70" />
            <div 
              className="absolute bottom-5 left-7 w-2 h-2 bg-[#9675bc] rounded-full animate-dream-float opacity-60"
              style={{ animationDelay: '0.4s' }}
            />
            <div 
              className="absolute top-1/2 right-1/4 w-1 h-1 bg-[#ffe0db] rounded-full animate-dream-pulse opacity-90"
              style={{ animationDelay: '0.8s' }}
            />
            
            {/* Sparkle trail for special cards */}
            {isSpecial && (
              <>
                <div className="absolute top-6 left-1/3 w-0.5 h-0.5 bg-[#f1b3be] rounded-full animate-sparkle-trail opacity-80" />
                <div 
                  className="absolute top-8 left-1/2 w-0.5 h-0.5 bg-[#9675bc] rounded-full animate-sparkle-trail opacity-60"
                  style={{ animationDelay: '0.2s' }}
                />
                <div 
                  className="absolute top-10 left-2/3 w-0.5 h-0.5 bg-[#ffe0db] rounded-full animate-sparkle-trail opacity-90"
                  style={{ animationDelay: '0.4s' }}
                />
              </>
            )}
          </>
        )}
      </div>
      
      {/* Main content */}
      <div className="relative z-10 p-8 transform transition-all duration-500 group-hover:scale-[1.01] group-hover:-translate-y-1">
        
        {/* Header section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-[#252c3e] group-hover:text-[#214d72] transition-colors duration-300 mb-1">
              {title}
            </h3>
            {isSpecial && (
              <div className="flex items-center space-x-1 mb-2">
                <Crown className="w-3 h-3 text-[#f1b3be]" />
                <span className="text-xs font-medium text-[#9675bc]">Usuario Especial</span>
                <Sparkles className="w-3 h-3 text-[#ffe0db] animate-pulse" />
              </div>
            )}
          </div>
          
          {/* Status indicator */}
          <div className="relative">
            <div className="w-3 h-3 bg-gradient-to-r from-[#f1b3be] to-[#9675bc] rounded-full animate-pulse opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 w-3 h-3 bg-gradient-to-r from-[#f1b3be] to-[#9675bc] rounded-full animate-ping opacity-20" />
          </div>
        </div>
        
        {/* Content section */}
        <div className="flex items-center space-x-6">
          
          {/* Enhanced icon */}
          <div className="relative flex-shrink-0">
            {/* Icon glow effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-all duration-500 scale-125`} />
            
            {/* Icon container */}
            <div className={`relative p-4 rounded-xl bg-gradient-to-br ${gradient} shadow-xl group-hover:shadow-2xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 overflow-hidden`}>
              
              {/* Inner shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              {/* Icon with enhanced effect */}
              <div className="relative z-10">
                {icon}
              </div>
              
              {/* Animated border */}
              <div className="absolute inset-0 rounded-xl border-2 border-white/30 animate-pulse" />
              
              {/* Corner highlight */}
              <div className="absolute top-1 right-1 w-2 h-2 bg-white/60 rounded-full animate-ping opacity-70" />
            </div>
          </div>
          
          {/* Value section */}
          <div className="flex-1 space-y-2">
            <p className="text-[#252c3e]/70 font-medium leading-relaxed break-all group-hover:text-[#252c3e]/90 transition-colors duration-300">
              {value}
            </p>
            
            {/* Additional info for special users */}
            {isSpecial && (
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-[#f1b3be]" />
                  <span className="text-xs text-[#252c3e]/60 font-medium">Verificado</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="w-3 h-3 text-[#9675bc]" />
                  <span className="text-xs text-[#252c3e]/60 font-medium">Seguro</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#252c3e]/50 font-medium">Completitud del perfil</span>
            <span className="text-[#252c3e]/70 font-bold">
              {isSpecial ? '100%' : '85%'}
            </span>
          </div>
          <div className="w-full bg-[#252c3e]/8 rounded-full h-1.5 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#9675bc] via-[#f1b3be] to-[#ffe0db] rounded-full transition-all duration-1000 ease-out"
              style={{ 
                width: isSpecial ? '100%' : '85%',
                transitionDelay: isVisible ? '0.8s' : '0s'
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center opacity-60`} />
    </div>
  );
};

// Main UserInfoCards Component
export const UserInfoCards: React.FC<UserInfoCardsProps> = ({ user }) => {
  const [sectionVisible, setSectionVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const cards = [
    {
      icon: <User className="w-6 h-6 text-white" />,
      title: "Nombre de Soñador",
      value: user.username,
      gradient: "from-[#9675bc]/40 to-[#7c3aed]/40",
      isSpecial: user.is_psychologist
    },
    {
      icon: <Mail className="w-6 h-6 text-white" />,
      title: "Correo Onírico",
      value: user.email,
      gradient: "from-[#f1b3be]/40 to-[#ec4899]/40"
    },
    {
      icon: <Shield className="w-6 h-6 text-white" />,
      title: "ID de Usuario",
      value: `#${user.id.slice(0, 8)}`,
      gradient: "from-[#ffe0db]/40 to-[#f97316]/40"
    }
  ];

  return (
    <div 
      ref={sectionRef}
      className="relative"
      style={{
        fontFamily: 'var(--font-inter, "Inter", sans-serif)',
      }}
    >
      {/* Background dream elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Constellation pattern */}
        <div 
          className="absolute animate-constellation-drift opacity-8"
          style={{
            top: '12%',
            left: '8%',
            width: '120px',
            height: '80px',
            background: 'radial-gradient(circle, #9675bc 1.5px, transparent 1.5px), radial-gradient(circle, #f1b3be 1px, transparent 1px)',
            backgroundSize: '25px 25px, 15px 15px',
            backgroundPosition: '0 0, 12px 12px',
            filter: 'blur(1px)'
          }}
        />
        
        {/* Floating profile essence */}
        <div 
          className="absolute animate-profile-essence opacity-10"
          style={{
            top: '65%',
            right: '10%',
            width: '90px',
            height: '90px',
            background: 'conic-gradient(from 0deg, #9675bc, #f1b3be, #ffe0db, #9675bc)',
            borderRadius: '50%',
            filter: 'blur(3px)'
          }}
        />
        
        {/* Identity sparkles */}
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="absolute animate-identity-sparkle"
            style={{
              top: `${10 + Math.random() * 80}%`,
              left: `${5 + Math.random() * 90}%`,
              width: `${1.5 + Math.random() * 2.5}px`,
              height: `${1.5 + Math.random() * 2.5}px`,
              background: ['#ffe0db', '#f1b3be', '#9675bc'][Math.floor(Math.random() * 3)],
              borderRadius: Math.random() > 0.5 ? '50%' : '20%',
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.3 + Math.random() * 0.4
            }}
          />
        ))}
      </div>
      
      {/* Main content */}
      <div className="relative z-10 space-y-8">
        
        {/* Section header */}
        <div className={`text-center space-y-4 transform transition-all duration-700 ${
          sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="relative inline-flex flex-col items-center">
            
            {/* Title with decorative elements */}
            <div className="flex items-center space-x-3 mb-3">
              <Heart className="w-5 h-5 text-[#f1b3be] animate-pulse" />
              <h2 
                className="text-3xl font-bold bg-gradient-to-r from-[#ffe0db] via-[#f1b3be] to-[#9675bc] bg-clip-text text-transparent"
                style={{ fontFamily: 'var(--font-playfair, "Playfair Display", serif)' }}
              >
                Perfil del Soñador
              </h2>
              <Zap className="w-5 h-5 text-[#9675bc] animate-bounce" />
            </div>
            
            {/* Subtitle */}
            <p className="text-lg text-[#ffe0db]/80 max-w-xl leading-relaxed">
              Tu identidad única en el mundo de los sueños y emociones
            </p>
            
            {/* Special user indicator */}
            {user.is_psychologist && (
              <div className="mt-3 inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#9675bc]/20 to-[#f1b3be]/20 rounded-full border border-[#9675bc]/30">
                <Crown className="w-4 h-4 text-[#f1b3be]" />
                <span className="text-sm font-semibold text-[#ffe0db]">Psicólogo Certificado</span>
                <Star className="w-4 h-4 text-[#ffe0db] animate-pulse" />
              </div>
            )}
            
            {/* Decorative elements */}
            <div className="mt-4 flex items-center space-x-2">
              <Eye className="w-4 h-4 text-[#9675bc]/60 animate-pulse" />
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#f1b3be]/40 to-transparent" />
              <Sparkles className="w-4 h-4 text-[#f1b3be]/60 animate-pulse" style={{ animationDelay: '0.5s' }} />
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#9675bc]/40 to-transparent" />
              <Heart className="w-4 h-4 text-[#ffe0db]/60 animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </div>
        
        {/* Info cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <InfoCard
              key={index}
              icon={card.icon}
              title={card.title}
              value={card.value}
              gradient={card.gradient}
              delay={index + 1}
              isSpecial={card.isSpecial}
            />
          ))}
        </div>
        
        {/* Additional profile insights */}
        {user.is_psychologist && (
          <div className={`transform transition-all duration-700 delay-500 ${
            sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="relative bg-gradient-to-br from-[#9675bc]/10 via-[#f1b3be]/15 to-[#ffe0db]/10 backdrop-blur-xl border border-[#9675bc]/20 rounded-2xl p-6 overflow-hidden">
              
              {/* Background effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#f1b3be]/5 to-transparent animate-shimmer" />
              
              {/* Content */}
              <div className="relative z-10 text-center space-y-3">
                <div className="flex items-center justify-center space-x-2">
                  <Shield className="w-5 h-5 text-[#9675bc]" />
                  <h3 className="text-lg font-bold text-[#252c3e]">Perfil Profesional Verificado</h3>
                  <Crown className="w-5 h-5 text-[#f1b3be]" />
                </div>
                <p className="text-sm text-[#252c3e]/70 max-w-md mx-auto leading-relaxed">
                  Este usuario ha sido verificado como profesional de la salud mental especializado en análisis de sueños.
                </p>
                <div className="flex justify-center space-x-6 pt-2">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-[#f1b3be]" />
                    <span className="text-xs text-[#252c3e]/60 font-medium">Certificado</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4 text-[#9675bc]" />
                    <span className="text-xs text-[#252c3e]/60 font-medium">Especialista</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4 text-[#ffe0db]" />
                    <span className="text-xs text-[#252c3e]/60 font-medium">Confiable</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes dream-sparkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.4) rotate(180deg);
          }
        }
        
        @keyframes dream-float {
          0%, 100% {
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-6px) translateX(3px) scale(1.1);
            opacity: 1;
          }
        }
        
        @keyframes dream-pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.3);
          }
        }
        
        @keyframes sparkle-trail {
          0% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.5) rotate(180deg);
          }
          100% {
            opacity: 0;
            transform: scale(0) rotate(360deg);
          }
        }
        
        @keyframes constellation-drift {
          0%, 100% {
            transform: translateX(0px) translateY(0px) rotate(0deg);
            opacity: 0.08;
          }
          50% {
            transform: translateX(15px) translateY(-8px) rotate(180deg);
            opacity: 0.15;
          }
        }
        
        @keyframes profile-essence {
          0%, 100% {
            transform: rotate(0deg) scale(1);
            opacity: 0.10;
          }
          50% {
            transform: rotate(180deg) scale(1.1);
            opacity: 0.18;
          }
        }
        
        @keyframes identity-sparkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1) rotate(0deg);
          }
          33% {
            opacity: 1;
            transform: scale(1.4) rotate(120deg);
          }
          66% {
            opacity: 0.6;
            transform: scale(0.8) rotate(240deg);
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-dream-sparkle {
          animation: dream-sparkle 2.5s ease-in-out infinite;
        }
        
        .animate-dream-float {
          animation: dream-float 3s ease-in-out infinite;
        }
        
        .animate-dream-pulse {
          animation: dream-pulse 2s ease-in-out infinite;
        }
        
        .animate-sparkle-trail {
          animation: sparkle-trail 2s ease-in-out infinite;
        }
        
        .animate-constellation-drift {
          animation: constellation-drift 10s ease-in-out infinite;
        }
        
        .animate-profile-essence {
          animation: profile-essence 8s ease-in-out infinite;
        }
        
        .animate-identity-sparkle {
          animation: identity-sparkle 3s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};



export default UserInfoCards;