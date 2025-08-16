import React, { useState, useRef, useEffect } from 'react';
import { User, Crown, Moon, Star, Sparkles, Heart, Eye } from 'lucide-react';

interface User {
  username: string;
  profile_pic?: string;
  is_psychologist: boolean;
  description?: string;
}

interface WelcomeSectionProps {
  user: User;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ user }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [imageError, setImageError] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for entrance animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), 200);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Mouse tracking for dynamic effects
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    
    const rect = sectionRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMousePosition({ x, y });
  };

  // Helper function to get user initials
  const getUserInitials = (username: string): string => {
    return username.split(' ').map(name => name.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  // Helper function to get full profile image URL
  const getProfileImageUrl = (profilePic?: string): string | null => {
    if (!profilePic) return null;
    
    if (profilePic.startsWith('http://') || profilePic.startsWith('https://')) {
      return profilePic;
    }
    
    const cleanPath = profilePic.startsWith('/') ? profilePic : `/${profilePic}`;
    return `http://127.0.0.1:8000${cleanPath}`;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const profileImageUrl = getProfileImageUrl(user.profile_pic);

  return (
    <div 
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative text-center space-y-10 pt-0 pb-32 min-h-screen flex flex-col justify-start"
      style={{
        fontFamily: 'var(--font-inter, "Inter", sans-serif)',
        marginTop: '-90px', // Eliminar el espacio entre header y welcome section
        paddingTop: '110px' // Compensar con padding interno
      }}
    >
      {/* Extended sunlight rays from header - seamless connection y cobertura completa */}
      <div 
        className="absolute top-0 pointer-events-none overflow-hidden"
        style={{
          left: '-50vw',
          right: '-50vw',
          width: '200vw',
          height: '300px', // Reducido de altura
          marginLeft: '50vw',
          transform: 'translateX(-50%)'
        }}
      >
        {/* Main horizontal light beam from header - COBERTURA TOTAL */}
        <div 
          className="absolute top-0 inset-x-0 opacity-22"
          style={{
            height: '200px', // Reducido
            background: 'linear-gradient(to bottom, #ffe0db 0%, rgba(255, 224, 219, 0.8) 25%, rgba(241, 179, 190, 0.6) 50%, rgba(150, 117, 188, 0.4) 75%, transparent 100%)',
            animation: 'sunlight-glow 6s ease-in-out infinite alternate'
          }}
        />
        
        {/* Extended expanding sunlight rays - COBERTURA TOTAL */}
        <div 
          className="absolute top-0 inset-x-0 opacity-18"
          style={{
            height: '250px', // Reducido
            background: 'linear-gradient(to bottom, rgba(255, 224, 219, 0.9) 0%, rgba(241, 179, 190, 0.7) 30%, rgba(150, 117, 188, 0.5) 55%, rgba(150, 117, 188, 0.3) 75%, rgba(150, 117, 188, 0.15) 90%, transparent 100%)',
            filter: 'blur(20px)',
            animation: 'sunlight-expand 8s ease-in-out infinite alternate'
          }}
        />
        
        {/* Deep illumination layer - COBERTURA TOTAL */}
        <div 
          className="absolute top-0 inset-x-0 opacity-15"
          style={{
            height: '300px', // Reducido
            background: 'linear-gradient(to bottom, rgba(241, 179, 190, 0.6) 0%, rgba(150, 117, 188, 0.4) 35%, rgba(150, 117, 188, 0.25) 55%, rgba(150, 117, 188, 0.15) 75%, rgba(150, 117, 188, 0.08) 90%, transparent 100%)',
            filter: 'blur(30px)',
            animation: 'sunlight-expand 10s ease-in-out infinite alternate',
            animationDelay: '2s'
          }}
        />
        
        {/* Extended diagonal light rays */}
        <div 
          className="absolute top-0 left-1/4 opacity-12"
          style={{
            width: '3px',
            height: '250px', // Reducido
            background: 'linear-gradient(to bottom, #ffe0db 0%, rgba(255, 224, 219, 0.8) 35%, rgba(241, 179, 190, 0.5) 65%, rgba(150, 117, 188, 0.3) 90%, transparent 100%)',
            filter: 'blur(1.5px)',
            transform: 'rotate(6deg)',
            animation: 'ray-shimmer 7s ease-in-out infinite alternate'
          }}
        />
        <div 
          className="absolute top-0 right-1/4 opacity-12"
          style={{
            width: '3px',
            height: '250px', // Reducido
            background: 'linear-gradient(to bottom, #ffe0db 0%, rgba(255, 224, 219, 0.8) 35%, rgba(241, 179, 190, 0.5) 65%, rgba(150, 117, 188, 0.3) 90%, transparent 100%)',
            filter: 'blur(1.5px)',
            transform: 'rotate(-6deg)',
            animation: 'ray-shimmer 7s ease-in-out infinite alternate',
            animationDelay: '1s'
          }}
        />
        <div 
          className="absolute top-0 left-1/2 transform -translate-x-1/2 opacity-15"
          style={{
            width: '2px',
            height: '280px', // Reducido
            background: 'linear-gradient(to bottom, #ffffff 0%, #ffe0db 25%, rgba(241, 179, 190, 0.7) 55%, rgba(150, 117, 188, 0.4) 80%, transparent 100%)',
            filter: 'blur(1px)',
            animation: 'main-ray-glow 5s ease-in-out infinite alternate'
          }}
        />
        
        {/* Rayos laterales adicionales para mejor cobertura */}
        <div 
          className="absolute top-0 left-[10%] opacity-8"
          style={{
            width: '2px',
            height: '220px', // Reducido
            background: 'linear-gradient(to bottom, #ffe0db 0%, rgba(255, 224, 219, 0.6) 45%, rgba(241, 179, 190, 0.3) 75%, transparent 100%)',
            filter: 'blur(1px)',
            transform: 'rotate(3deg)',
            animation: 'ray-shimmer 8s ease-in-out infinite alternate',
            animationDelay: '1.5s'
          }}
        />
        <div 
          className="absolute top-0 right-[10%] opacity-8"
          style={{
            width: '2px',
            height: '220px', // Reducido
            background: 'linear-gradient(to bottom, #ffe0db 0%, rgba(255, 224, 219, 0.6) 45%, rgba(241, 179, 190, 0.3) 75%, transparent 100%)',
            filter: 'blur(1px)',
            transform: 'rotate(-3deg)',
            animation: 'ray-shimmer 8s ease-in-out infinite alternate',
            animationDelay: '0.5s'
          }}
        />
        
        {/* More floating light particles */}
        <div 
          className="absolute top-8 left-[15%] w-1 h-1 bg-[#ffe0db] rounded-full opacity-45 animate-dream-float"
          style={{ animationDelay: '0s', animationDuration: '8s' }}
        />
        <div 
          className="absolute top-12 left-[25%] w-0.5 h-0.5 bg-[#f1b3be] rounded-full opacity-55 animate-dream-float"
          style={{ animationDelay: '1s', animationDuration: '6s' }}
        />
        <div 
          className="absolute top-6 left-[40%] w-0.5 h-0.5 bg-[#ffe0db] rounded-full opacity-50 animate-dream-float"
          style={{ animationDelay: '3s', animationDuration: '7s' }}
        />
        <div 
          className="absolute top-10 right-[35%] w-1 h-1 bg-[#f1b3be] rounded-full opacity-40 animate-dream-float"
          style={{ animationDelay: '2s', animationDuration: '9s' }}
        />
        <div 
          className="absolute top-14 right-[25%] w-0.5 h-0.5 bg-[#ffe0db] rounded-full opacity-50 animate-dream-float"
          style={{ animationDelay: '4s', animationDuration: '7s' }}
        />
        <div 
          className="absolute top-7 right-[15%] w-1 h-1 bg-[#f1b3be] rounded-full opacity-35 animate-dream-float"
          style={{ animationDelay: '5s', animationDuration: '8s' }}
        />
      </div>

      {/* Dynamic background glow that follows mouse - optimized for #214d72 */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(150, 117, 188, 0.15), transparent 60%)`,
        }}
      />

      {/* Enhanced dream elements background - Fixed stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Main dream bubbles - adjusted for #214d72 background */}
        <div 
          className="absolute animate-dream-bubble opacity-12"
          style={{
            top: '15%',
            left: '10%',
            width: '120px',
            height: '120px',
            background: 'linear-gradient(135deg, #9675bc, #f1b3be)',
            borderRadius: '50%',
            filter: 'blur(3px)',
          }}
        />
        <div 
          className="absolute animate-dream-bubble opacity-15"
          style={{
            top: '70%',
            right: '15%',
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #f1b3be, #ffe0db)',
            borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
            filter: 'blur(2px)',
            animationDelay: '2s',
            animationDuration: '8s'
          }}
        />

        {/* Fixed background stars - Various colors and sizes */}
        {/* Pink stars */}
        <div className="absolute top-[12%] left-[20%] w-2 h-2 bg-[#f1b3be] rounded-full animate-twinkle opacity-60" style={{ animationDelay: '0s' }} />
        <div className="absolute top-[25%] left-[8%] w-1.5 h-1.5 bg-[#f1b3be] rounded-full animate-twinkle opacity-50" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[45%] left-[15%] w-2.5 h-2.5 bg-[#f1b3be] rounded-full animate-twinkle opacity-70" style={{ animationDelay: '2.5s' }} />
        <div className="absolute top-[65%] left-[5%] w-1 h-1 bg-[#f1b3be] rounded-full animate-twinkle opacity-40" style={{ animationDelay: '4s' }} />
        <div className="absolute top-[85%] left-[18%] w-2 h-2 bg-[#f1b3be] rounded-full animate-twinkle opacity-55" style={{ animationDelay: '0.8s' }} />

        {/* Purple stars */}
        <div className="absolute top-[18%] right-[25%] w-1.5 h-1.5 bg-[#9675bc] rounded-full animate-twinkle opacity-65" style={{ animationDelay: '1.2s' }} />
        <div className="absolute top-[32%] right-[8%] w-2 h-2 bg-[#9675bc] rounded-full animate-twinkle opacity-45" style={{ animationDelay: '3s' }} />
        <div className="absolute top-[52%] right-[20%] w-1 h-1 bg-[#9675bc] rounded-full animate-twinkle opacity-50" style={{ animationDelay: '1.8s' }} />
        <div className="absolute top-[75%] right-[12%] w-2.5 h-2.5 bg-[#9675bc] rounded-full animate-twinkle opacity-60" style={{ animationDelay: '2.2s' }} />
        <div className="absolute top-[88%] right-[30%] w-1.5 h-1.5 bg-[#9675bc] rounded-full animate-twinkle opacity-35" style={{ animationDelay: '0.5s' }} />

        {/* Peach/cream stars */}
        <div className="absolute top-[8%] left-[50%] w-2 h-2 bg-[#ffe0db] rounded-full animate-twinkle opacity-55" style={{ animationDelay: '2.8s' }} />
        <div className="absolute top-[28%] left-[75%] w-1 h-1 bg-[#ffe0db] rounded-full animate-twinkle opacity-40" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-[42%] right-[45%] w-2.5 h-2.5 bg-[#ffe0db] rounded-full animate-twinkle opacity-65" style={{ animationDelay: '0.3s' }} />
        <div className="absolute top-[58%] left-[60%] w-1.5 h-1.5 bg-[#ffe0db] rounded-full animate-twinkle opacity-50" style={{ animationDelay: '3.5s' }} />
        <div className="absolute top-[78%] left-[80%] w-2 h-2 bg-[#ffe0db] rounded-full animate-twinkle opacity-45" style={{ animationDelay: '2s' }} />

        {/* Center area stars */}
        <div className="absolute top-[35%] left-[42%] w-1 h-1 bg-[#f1b3be] rounded-full animate-twinkle opacity-30" style={{ animationDelay: '4.2s' }} />
        <div className="absolute top-[55%] right-[38%] w-1.5 h-1.5 bg-[#9675bc] rounded-full animate-twinkle opacity-35" style={{ animationDelay: '1.7s' }} />
        <div className="absolute top-[72%] left-[48%] w-1 h-1 bg-[#ffe0db] rounded-full animate-twinkle opacity-40" style={{ animationDelay: '3.2s' }} />

        {/* Additional scattered mini stars */}
        <div className="absolute top-[22%] left-[35%] w-0.5 h-0.5 bg-[#f1b3be] rounded-full animate-twinkle opacity-25" style={{ animationDelay: '5s' }} />
        <div className="absolute top-[48%] left-[28%] w-0.5 h-0.5 bg-[#9675bc] rounded-full animate-twinkle opacity-30" style={{ animationDelay: '4.5s' }} />
        <div className="absolute top-[62%] right-[55%] w-0.5 h-0.5 bg-[#ffe0db] rounded-full animate-twinkle opacity-20" style={{ animationDelay: '2.7s' }} />
        <div className="absolute top-[82%] left-[65%] w-0.5 h-0.5 bg-[#f1b3be] rounded-full animate-twinkle opacity-35" style={{ animationDelay: '1.3s' }} />

        {/* Additional bottom area elements */}
        <div className="absolute bottom-[15%] left-[25%] w-1.5 h-1.5 bg-[#9675bc] rounded-full animate-twinkle opacity-45" style={{ animationDelay: '3.8s' }} />
        <div className="absolute bottom-[8%] right-[20%] w-2 h-2 bg-[#f1b3be] rounded-full animate-twinkle opacity-55" style={{ animationDelay: '2.4s' }} />
        <div className="absolute bottom-[25%] left-[15%] w-1 h-1 bg-[#ffe0db] rounded-full animate-twinkle opacity-40" style={{ animationDelay: '4.7s' }} />
        <div className="absolute bottom-[12%] left-[70%] w-1.5 h-1.5 bg-[#9675bc] rounded-full animate-twinkle opacity-50" style={{ animationDelay: '1.9s' }} />
        <div className="absolute bottom-[20%] right-[35%] w-1 h-1 bg-[#f1b3be] rounded-full animate-twinkle opacity-35" style={{ animationDelay: '5.2s' }} />

        {/* Floating particles */}
        <div className="absolute bottom-[18%] left-[40%] w-0.5 h-0.5 bg-[#ffe0db] rounded-full animate-dream-float opacity-30" style={{ animationDelay: '6s' }} />
        <div className="absolute bottom-[22%] right-[45%] w-0.5 h-0.5 bg-[#9675bc] rounded-full animate-dream-float opacity-25" style={{ animationDelay: '3.5s' }} />
        <div className="absolute bottom-[14%] left-[55%] w-0.5 h-0.5 bg-[#f1b3be] rounded-full animate-dream-float opacity-40" style={{ animationDelay: '7s' }} />

        {/* Subtle orbs - enhanced visibility for #214d72 */}
        <div 
          className="absolute bottom-[10%] left-[35%] opacity-15 animate-dream-bubble"
          style={{
            width: '25px',
            height: '25px',
            background: 'linear-gradient(135deg, #ffe0db, #f1b3be)',
            borderRadius: '50%',
            filter: 'blur(1px)',
            animationDelay: '4s',
            animationDuration: '6s'
          }}
        />
        <div 
          className="absolute bottom-[16%] right-[25%] opacity-12 animate-dream-bubble"
          style={{
            width: '18px',
            height: '18px',
            background: 'linear-gradient(135deg, #9675bc, #f1b3be)',
            borderRadius: '50%',
            filter: 'blur(1.5px)',
            animationDelay: '6.5s',
            animationDuration: '7s'
          }}
        />
      </div>

      {/* Main content with stagger animation */}
      <div 
        className={`relative z-10 space-y-10 max-w-4xl mx-auto transform transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
        style={{ marginTop: '60px' }} // Separación moderada entre la luz y el contenido
      >
        
        {/* Enhanced Avatar Section */}
        <div 
          className="relative inline-flex items-center justify-center"
          style={{ marginTop: '20px' }} // Separación sutil para el avatar
        >
          
          {/* Multi-layer background glow - optimized for #214d72 background */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-gradient-to-r from-[#9675bc]/25 via-[#f1b3be]/30 to-[#ffe0db]/20 rounded-full blur-3xl opacity-80 animate-pulse w-52 h-52" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-gradient-to-r from-[#f1b3be]/20 to-[#9675bc]/25 rounded-full blur-2xl opacity-60 animate-pulse w-40 h-40" style={{ animationDelay: '1s' }} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-gradient-to-r from-[#ffe0db]/15 via-[#f1b3be]/18 to-[#9675bc]/15 rounded-full blur-xl opacity-70 animate-pulse w-32 h-32" style={{ animationDelay: '2s' }} />
          </div>
          
          {/* Main avatar container */}
          <div 
            ref={avatarRef}
            className="relative group transform transition-all duration-700 hover:scale-105 hover:rotate-2"
          >
            {/* Avatar glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#9675bc] to-[#f1b3be] rounded-full blur-lg opacity-0 group-hover:opacity-60 transition-all duration-500 scale-125" />
            
            {/* Avatar border ring */}
            <div className="absolute inset-0 rounded-full p-1 bg-gradient-to-br from-[#9675bc]/30 via-[#f1b3be]/40 to-[#ffe0db]/30 group-hover:from-[#9675bc]/50 group-hover:via-[#f1b3be]/60 group-hover:to-[#ffe0db]/50 transition-all duration-500">
              <div className="w-full h-full rounded-full bg-white/10 backdrop-blur-sm" />
            </div>
            
            {/* Avatar content */}
            <div className="relative w-40 h-40 rounded-full overflow-hidden shadow-2xl group-hover:shadow-3xl transition-shadow duration-500">
              {profileImageUrl && !imageError ? (
                <img
                  src={profileImageUrl}
                  alt={`Avatar de ${user.username}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={handleImageError}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#9675bc] via-[#f1b3be] to-[#ffe0db] flex items-center justify-center relative overflow-hidden">
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  
                  {/* User initials or icon */}
                  <div className="relative z-10">
                    {user.username ? (
                      <span className="text-white font-bold text-2xl drop-shadow-lg">
                        {getUserInitials(user.username)}
                      </span>
                    ) : (
                      <User className="w-14 h-14 text-white drop-shadow-lg" />
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Status indicator with reduced animation */}
            <div className="absolute -bottom-2 -right-2 group">
              <div className="relative">
                {/* Subtle pulsing ring */}
                <div className="absolute inset-0 w-10 h-10 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full animate-pulse opacity-15" />
                
                {/* Main status circle */}
                <div className="relative w-10 h-10 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white/50 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-4 h-4 bg-white rounded-full opacity-90" />
                </div>
                
                {/* Subtle sparkle effects on hover only */}
                <div className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-emerald-200 rounded-full opacity-0 group-hover:opacity-60 animate-ping transition-opacity duration-300" />
                <div className="absolute -bottom-1 -right-1 w-1 h-1 bg-emerald-300 rounded-full opacity-0 group-hover:opacity-50 animate-bounce transition-opacity duration-300" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Welcome Text */}
        <div 
          className={`space-y-8 transform transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`} 
          style={{ 
            transitionDelay: '0.3s',
            marginTop: '30px' // Separación moderada para el texto de bienvenida
          }}
        >
          
          {/* Main greeting with subtle hover effects */}
          <div className="relative group cursor-default">
            <h1 
              className="text-6xl font-bold bg-gradient-to-r from-[#ffe0db] via-[#f1b3be] to-[#9675bc] bg-clip-text text-transparent transition-all duration-500"
              style={{ fontFamily: 'var(--font-playfair, "Playfair Display", serif)' }}
            >
              ¡Bienvenido, {user.username}!
            </h1>
            
            {/* Subtle decorative line */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-[#f1b3be]/60 to-transparent group-hover:w-1/2 transition-all duration-700 origin-center" />
          </div>

          {/* Enhanced role display - Solo el badge */}
          <div className={`flex items-center justify-center text-[#ffe0db]/90 transform transition-all duration-700 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`} style={{ transitionDelay: '0.6s' }}>
            
            {user.is_psychologist ? (
              <div className="relative group">
                <Crown className="w-6 h-6 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300 animate-bounce" />
                <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-150" />
              </div>
            ) : (
              <div className="flex items-center space-x-2 bg-gradient-to-r from-[#f1b3be]/10 to-[#9675bc]/10 px-4 py-2 rounded-full border border-[#f1b3be]/20 backdrop-blur-sm hover:border-[#f1b3be]/40 transition-all duration-300 group">
                <Eye className="w-4 h-4 text-[#f1b3be]" />
                <span className="text-sm font-semibold group-hover:text-white transition-colors duration-300">
                  Explorador de Sueños
                </span>
              </div>
            )}
          </div>

          {/* Enhanced description - Sin iconos */}
          {user.description && (
            <div className={`transform transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`} style={{ transitionDelay: '0.9s' }}>
              <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#f1b3be]/30 transition-all duration-500 group max-w-2xl mx-auto">
                
                {/* Background effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#9675bc]/5 via-[#f1b3be]/5 to-[#ffe0db]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Quote decoration */}
                <div className="absolute top-2 left-4 text-4xl text-[#f1b3be]/20 font-serif">"</div>
                <div className="absolute bottom-2 right-4 text-4xl text-[#f1b3be]/20 font-serif rotate-180">"</div>
                
                {/* Description text */}
                <p className="relative text-[#ffe0db]/80 group-hover:text-[#ffe0db]/95 transition-colors duration-500 leading-relaxed text-lg italic">
                  {user.description}
                </p>
              </div>
            </div>
          )}

          {/* Iconos decorativos sin animación */}
          <div className={`flex justify-center space-x-6 transform transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`} style={{ transitionDelay: '1.2s' }}>
            <Sparkles className="w-5 h-5 text-[#f1b3be]/60" />
            <Star className="w-6 h-6 text-[#ffe0db]/60" />
            <Heart className="w-5 h-5 text-[#9675bc]/60" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes sunlight-glow {
          0%, 100% {
            opacity: 0.15;
          }
          50% {
            opacity: 0.25;
          }
        }
        
        @keyframes sunlight-expand {
          0% {
            transform: scaleY(0.8);
            opacity: 0.12;
          }
          100% {
            transform: scaleY(1.2);
            opacity: 0.18;
          }
        }
        
        @keyframes ray-shimmer {
          0%, 100% {
            opacity: 0.06;
            filter: blur(1px);
          }
          50% {
            opacity: 0.12;
            filter: blur(0.5px);
          }
        }
        
        @keyframes main-ray-glow {
          0%, 100% {
            opacity: 0.08;
            transform: translateX(-50%) scaleY(0.9);
          }
          50% {
            opacity: 0.15;
            transform: translateX(-50%) scaleY(1.1);
          }
        }
        
        @keyframes dream-float {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg) scale(1);
            opacity: 0.7;
          }
          25% {
            transform: translateY(-8px) translateX(4px) rotate(5deg) scale(1.1);
            opacity: 0.9;
          }
          50% {
            transform: translateY(-4px) translateX(-4px) rotate(-3deg) scale(0.9);
            opacity: 0.6;
          }
          75% {
            transform: translateY(-12px) translateX(2px) rotate(2deg) scale(1.05);
            opacity: 1;
          }
        }
        
        @keyframes dream-bubble {
          0%, 100% {
            transform: translateY(0px) translateX(0px) scale(1) rotate(0deg);
            opacity: 0.06;
          }
          33% {
            transform: translateY(-15px) translateX(8px) scale(1.1) rotate(120deg);
            opacity: 0.08;
          }
          66% {
            transform: translateY(-8px) translateX(-8px) scale(0.9) rotate(240deg);
            opacity: 0.04;
          }
        }
        
        @keyframes ethereal-sparkle {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.4) rotate(180deg);
          }
        }
        
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-dream-float {
          animation: dream-float 4s ease-in-out infinite;
        }
        
        .animate-dream-bubble {
          animation: dream-bubble 8s ease-in-out infinite;
        }
        
        .animate-ethereal-sparkle {
          animation: ethereal-sparkle 3s ease-in-out infinite;
        }
        
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        /* Enhanced focus states */
        .group:focus-within {
          outline: 2px solid #9675bc;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};

export default WelcomeSection;