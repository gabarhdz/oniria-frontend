import React, { useState, useEffect, useRef } from 'react';
import { IoIosSend } from "react-icons/io";

const OniriaChatbot = () => {
  const [messages, setMessages] = useState([
    { type: 'user', text: '¡Hola! ¿Qué sueño quieres analizar hoy?' },
    { type: 'bot', text: '¡Hola que tal! Me encantaría que me ayudes...' },
    { type: 'bot', text: 'En el sueño me encontraba perdido en un bosque y con mucho miedo...' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  // Scroll automático al enviar mensaje
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages(prev => [...prev, { type: 'bot', text: inputValue }]);
      setInputValue('');
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          type: 'user',
          text: 'Inicia sesion para probar el chatbot'
        }]);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Advanced floating particles with Oniria colors
  const FloatingParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(30)].map((_, i) => {
        const size = Math.random() * 4 + 1;
        const animationType = i % 3;
        return (
          <div
            key={i}
            className={`absolute rounded-full ${
              animationType === 0
                ? 'bg-[var(--color-oniria_pink)]/60'
                : animationType === 1
                ? 'bg-[var(--color-oniria_blue)]/40'
                : 'bg-[var(--color-oniria_purple)]/50'
            } animate-float-${animationType}`}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${6 + Math.random() * 8}s`
            }}
          />
        );
      })}
    </div>
  );

  // Sophisticated chatbot orb with Oniria colors
  const ChatbotOrb = () => (
    <div className="relative">
      <div className="w-8 h-8 bg-gradient-to-r from-[var(--color-oniria_pink)] via-[var(--color-oniria_purple)] to-[var(--color-oniria_blue)] rounded-full flex items-center justify-center relative overflow-visible shadow-lg">
        {/* Core orb */}
        <div className="w-6 h-6 bg-gradient-to-r from-white to-[var(--color-oniria_lightpink)] rounded-full animate-pulse shadow-inner"></div>
        {/* Multiple expanding wave layers */}
        <div className="absolute inset-0 rounded-full border-2 border-[var(--color-oniria_pink)]/60 animate-expand-wave-1"></div>
        <div className="absolute inset-0 rounded-full border-2 border-[var(--color-oniria_purple)]/50 animate-expand-wave-2"></div>
        <div className="absolute inset-0 rounded-full border-2 border-[var(--color-oniria_blue)]/40 animate-expand-wave-3"></div>
        <div className="absolute inset-0 rounded-full border border-[var(--color-oniria_pink)]/30 animate-expand-wave-4"></div>
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--color-oniria_pink)]/20 to-[var(--color-oniria_purple)]/20 animate-glow"></div>
      </div>
    </div>
  );

  // Advanced magical orbs with Oniria colors
  const MagicalOrbs = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(12)].map((_, i) => {
        const size = 40 + Math.random() * 120;
        const movePattern = i % 4;
        return (
          <div
            key={i}
            className={`absolute rounded-full blur-2xl animate-orb-${movePattern}`}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, ${
                i % 3 === 0
                  ? 'var(--color-oniria_pink)'
                  : i % 3 === 1
                  ? 'var(--color-oniria_purple)'
                  : 'var(--color-oniria_blue)'
              }30, transparent 70%)`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${12 + Math.random() * 8}s`
            }}
          />
        );
      })}
    </div>
  );

  // Dreamy constellation effect
  const DreamyConstellation = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-[var(--color-oniria_lightpink)] rounded-full animate-twinkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-[var(--color-oniria_darkblue)] via-[var(--color-oniria_blue)] to-[var(--color-oniria_darkblue)] min-h-screen py-16 px-4 relative overflow-hidden">
      <FloatingParticles />
      <MagicalOrbs />
      <DreamyConstellation />

      {/* Dynamic gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-oniria_pink)]/5 via-[var(--color-oniria_purple)]/10 to-[var(--color-oniria_blue)]/5 animate-gradient-shift"></div>

      <div className="max-w-6xl mx-auto relative z-10 transition-all duration-1500 ease-out transform">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-oniria_lightpink)] via-[var(--color-oniria_pink)] to-[var(--color-oniria_purple)] text-4xl md:text-5xl italic mb-4 transition-all duration-1000" 
              style={{fontFamily: 'var(--font-playfair)'}}>
            Tu asistente de sueños personal
          </h2>
          <p className="text-[var(--color-oniria_lightpink)]/90 text-lg max-w-2xl mx-auto transition-all duration-1000" 
             style={{ transitionDelay: '0.3s', fontFamily: 'var(--font-inter)' }}>
            Conversa con nuestro chatbot inteligente para recibir análisis personalizados 
            sobre tus sueños y descubrir su significado oculto
          </p>
        </div>

        {/* Enhanced Chatbot Interface */}
        <div className="max-w-md mx-auto transition-all duration-1000 ease-out">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-[var(--color-oniria_lightpink)]/20 hover:border-[var(--color-oniria_pink)]/50 transition-all duration-500 hover:shadow-[var(--color-oniria_pink)]/25">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-[var(--color-oniria_blue)]/90 via-[var(--color-oniria_purple)]/90 to-[var(--color-oniria_pink)]/90 backdrop-blur-sm text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center space-x-3">
                <ChatbotOrb />
                <div>
                  <span className="font-medium" style={{fontFamily: 'var(--font-inter)'}}>Chatbot Noctiria</span>
                  <div className="flex items-center mt-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                    <span className="text-xs text-[var(--color-oniria_lightpink)]/80" style={{fontFamily: 'var(--font-inter)'}}>En línea</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse hover:bg-green-300 transition-colors cursor-pointer"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse hover:bg-yellow-300 transition-colors cursor-pointer" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse hover:bg-red-300 transition-colors cursor-pointer" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>

            {/* Chat Messages */}
            <div ref={chatRef} className="p-6 space-y-4 h-80 overflow-y-auto bg-gradient-to-b from-white/5 to-[var(--color-oniria_purple)]/10 backdrop-blur-sm">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-message-appear`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className={`px-4 py-3 rounded-2xl max-w-xs shadow-lg transform hover:scale-105 transition-all duration-300 ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-[var(--color-oniria_pink)] to-[var(--color-oniria_purple)] text-white rounded-tr-md shadow-[var(--color-oniria_pink)]/50'
                      : 'bg-gradient-to-r from-white/95 to-[var(--color-oniria_lightpink)]/90 text-[var(--color-oniria_darkblue)] rounded-tl-md border border-[var(--color-oniria_purple)]/30 shadow-[var(--color-oniria_purple)]/20 backdrop-blur-sm'
                  }`}>
                    <p className="text-sm leading-relaxed" style={{fontFamily: 'var(--font-inter)'}}>{message.text}</p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-end animate-message-appear">
                  <div className="bg-gradient-to-r from-[var(--color-oniria_pink)] to-[var(--color-oniria_purple)] text-white px-4 py-3 rounded-2xl rounded-tr-md max-w-xs shadow-[var(--color-oniria_pink)]/50">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-white/10 bg-gradient-to-r from-[var(--color-oniria_purple)]/20 to-[var(--color-oniria_pink)]/20 backdrop-blur-sm p-4">
              <div className="flex items-center space-x-3">
                <div className="flex-1 bg-white/95 backdrop-blur-sm rounded-full border border-[var(--color-oniria_purple)]/30 px-4 py-3 shadow-inner hover:shadow-lg transition-all duration-300 hover:border-[var(--color-oniria_pink)]/50">
                  <input
                    type="text"
                    placeholder="Describe tu sueño..."
                    className="w-full outline-none text-sm text-[var(--color-oniria_darkblue)] bg-transparent placeholder-[var(--color-oniria_darkblue)]/60"
                    style={{fontFamily: 'var(--font-inter)'}}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  className="w-12 h-12 bg-gradient-to-r from-[var(--color-oniria_pink)] to-[var(--color-oniria_purple)] rounded-full flex items-center justify-center hover:from-[var(--color-oniria_pink)]/80 hover:to-[var(--color-oniria_purple)]/80 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 group"
                >
                  <IoIosSend className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-200" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes expand-wave-1 {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes expand-wave-2 {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(3); opacity: 0; }
        }
        @keyframes expand-wave-3 {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(3.5); opacity: 0; }
        }
        @keyframes expand-wave-4 {
          0% { transform: scale(1); opacity: 0.2; }
          100% { transform: scale(4); opacity: 0; }
        }
        @keyframes glow {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }
        @keyframes float-0 {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          33% { transform: translateY(-15px) translateX(10px) rotate(120deg); }
          66% { transform: translateY(5px) translateX(-5px) rotate(240deg); }
        }
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          50% { transform: translateY(-20px) translateX(-10px) rotate(180deg); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          25% { transform: translateY(-10px) translateX(15px) rotate(90deg); }
          75% { transform: translateY(10px) translateX(-15px) rotate(270deg); }
        }
        @keyframes orb-0 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
          25% { transform: translate(20px, -15px) scale(1.1); opacity: 0.6; }
          50% { transform: translate(-10px, -25px) scale(0.9); opacity: 0.8; }
          75% { transform: translate(-20px, 10px) scale(1.05); opacity: 0.5; }
        }
        @keyframes orb-1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          50% { transform: translate(30px, -20px) scale(1.2); opacity: 0.7; }
        }
        @keyframes orb-2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
          33% { transform: translate(-15px, 20px) scale(0.8); opacity: 0.3; }
          66% { transform: translate(25px, -10px) scale(1.1); opacity: 0.6; }
        }
        @keyframes orb-3 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
          25% { transform: translate(15px, 25px) scale(1.15); opacity: 0.7; }
          75% { transform: translate(-25px, -15px) scale(0.85); opacity: 0.2; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        @keyframes gradient-shift {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 0.4; }
        }
        @keyframes message-appear {
          0% { opacity: 0; transform: translateY(20px) scale(0.8); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-expand-wave-1 { animation: expand-wave-1 2s ease-out infinite; }
        .animate-expand-wave-2 { animation: expand-wave-2 2s ease-out infinite 0.3s; }
        .animate-expand-wave-3 { animation: expand-wave-3 2s ease-out infinite 0.6s; }
        .animate-expand-wave-4 { animation: expand-wave-4 2s ease-out infinite 0.9s; }
        .animate-glow { animation: glow 3s ease-in-out infinite; }
        .animate-float-0 { animation: float-0 linear infinite; }
        .animate-float-1 { animation: float-1 linear infinite; }
        .animate-float-2 { animation: float-2 linear infinite; }
        .animate-orb-0 { animation: orb-0 ease-in-out infinite; }
        .animate-orb-1 { animation: orb-1 ease-in-out infinite; }
        .animate-orb-2 { animation: orb-2 ease-in-out infinite; }
        .animate-orb-3 { animation: orb-3 ease-in-out infinite; }
        .animate-twinkle { animation: twinkle ease-in-out infinite; }
        .animate-gradient-shift { animation: gradient-shift 8s ease-in-out infinite; }
        .animate-message-appear { animation: message-appear 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
}
export default OniriaChatbot;