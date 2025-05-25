import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-oniria_lightpink to-oniria_pink min-h-screen flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-2 items-center">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-8 ml-4 sm:ml-8 lg:ml-12 text-center lg:text-left group cursor-pointer">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-oniria_darkblue leading-tight transition-all duration-300 group-hover:scale-103 group-hover:text-oniria_blue">
              Descubre el{' '}
              <span className="italic text-oniria_blue group-hover:text-oniria_darkblue">significado</span> de{' '}
              <span className="italic text-oniria_blue group-hover:text-oniria_darkblue">tus sueños</span>
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 max-w-lg mx-auto lg:mx-0 transition-all duration-300">
              Explora tu subconsciente con análisis avanzado 
              y descubre las emociones ocultas en tus sueños.
            </p>
            
            <button className="bg-oniria_purple hover:bg-purple-600 text-white font-semibold px-8 sm:px-10 py-4 sm:py-5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-lg sm:text-xl group-hover:scale-110 group-hover:shadow-2xl">
              Comenzar ahora
            </button>
          </div>
          
          {/* Right Content */}
          <div className="flex justify-center lg:justify-end mr-4 sm:mr-12 lg:mr-20">
            <div className="relative group cursor-pointer">
              <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110">
                <img 
                  src="../../public/img/oniria_landingpage.svg" 
                  alt="Dream illustration" 
                  className="w-full h-full object-contain z-10 transition-all duration-300 group-hover:brightness-110"
                />
                <img 
                  src="../../public/img/dream.svg" 
                  alt="Background illustration" 
                  className="absolute inset-0 w-full h-full object-contain z-0 transition-all duration-300 group-hover:opacity-80"
                />
              </div>
              
              {/* floating elements */}
              <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-purple-300 opacity-60 transition-all duration-300 group-hover:opacity-100 group-hover:scale-110 group-hover:animate-pulse"></div>
              <div className="absolute -bottom-3 sm:-bottom-6 -left-3 sm:-left-6 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-pink-300 opacity-60 transition-all duration-300 group-hover:opacity-100 group-hover:scale-110 group-hover:animate-pulse"></div>
              <div className="absolute top-1/2 -left-4 sm:-left-8 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-purple-200 opacity-80 transition-all duration-300 group-hover:opacity-100 group-hover:scale-110 group-hover:animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;