import React from 'react';
import { IoIosSend } from "react-icons/io";

const OniriaChatbot = () => {
  return (
    <div className="bg-oniria_darkblue min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-oniria_lightpink text-4xl md:text-5xl font-serif italic mb-4">
            Tu asistente de sueños personal
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Conversa con nuestro chatbot inteligente para recibir análisis personalizados 
            sobre tus sueños y descubrir su significado oculto
          </p>
        </div>

        {/* Chatbot Interface */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Chat Header */}
            <div className="bg-oniria_blue text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-oniria_pink rounded-full flex items-center justify-center">
                  {/* Space for chatbot icon/image */}
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
                <span className="font-medium">Chatbot Oniria</span>
              </div>
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="p-6 space-y-4 h-80 overflow-y-auto">
              {/* User Message */}
              <div className="flex justify-end">
                <div className="bg-oniria_pink text-oniria_darkblue px-4 py-3 rounded-2xl rounded-tr-md max-w-xs">
                  <p className="text-sm">¡Hola! ¿Qué sueño quieres analizar hoy?</p>
                </div>
              </div>

              {/* Bot Message */}
              <div className="flex justify-start">
                <div className="bg-oniria_lightpink text-oniria_darkblue px-4 py-3 rounded-2xl rounded-tl-md max-w-xs">
                  <p className="text-sm">¡Hola que tal! Me encantaría que me ayudes...</p>
                </div>
              </div>

              {/* Bot Message Continued */}
              <div className="flex justify-start">
                <div className="bg-oniria_lightpink text-oniria_darkblue px-4 py-3 rounded-2xl rounded-tl-md max-w-xs">
                  <p className="text-sm">
                    En el sueño me encontraba perdido 
                    en un bosque y con mucho
                    miedo...
                  </p>
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="border-t bg-oniria_lightpink p-4">
              <div className="flex items-center space-x-3">
                <div className="flex-1 bg-white rounded-full border border-gray-200 px-4 py-2">
                  <input 
                    type="text" 
                    placeholder="Escribe tu mensaje..."
                    className="w-full outline-none text-sm text-gray-700"
                  />
                </div>
                <button className="w-14 h-14 bg-pink-400 rounded-full flex items-center justify-center hover:bg-pink-500 transition-colors">
                  <IoIosSend className="w-10 h-10" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OniriaChatbot;