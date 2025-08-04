import React from 'react';
import { Link } from 'react-router-dom';
import { RiTwitterXFill } from "react-icons/ri";
import { FaInstagram } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";

 export const DashboardFooter: React.FC = () => {
  return (
    <footer className="relative bg-oniria_darkblue/95 backdrop-blur-xl text-white overflow-hidden border-t border-oniria_lightpink/10">
      {/* Efectos de fondo animados */}
      <div className="absolute inset-0 bg-gradient-to-t from-oniria_darkblue via-oniria_darkblue/90 to-oniria_darkblue/80"></div>
      
      {/* Partículas flotantes de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-2 h-2 bg-oniria_lightpink/30 rounded-full animate-pulse"></div>
        <div className="absolute top-16 right-1/3 w-1 h-1 bg-oniria_purple/40 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-1.5 h-1.5 bg-oniria_lightpink/20 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-10 right-1/4 w-1 h-1 bg-white/20 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute top-1/2 left-1/6 w-0.5 h-0.5 bg-oniria_purple/30 rounded-full animate-bounce" style={{animationDelay: '1.5s'}}></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Contenido principal */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Logo y Copyright */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-oniria_lightpink/10 to-oniria_purple/10 rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-500 origin-center"></div>
            <div className="relative p-4 rounded-2xl">
              <h2 className="text-2xl font-bold italic font-playfair mb-2 relative overflow-hidden">
                <Link to={'/'} className="group/logo relative inline-block">
                  <span className="bg-gradient-to-r from-oniria_lightpink via-white to-oniria_lightpink bg-clip-text text-transparent group-hover/logo:bg-gradient-to-l transition-all duration-700 group-hover/logo:tracking-wider">
                    NOCTIRIA
                  </span>
                  {/* Efecto de brillo que pasa por el texto */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/logo:translate-x-full transition-transform duration-1000 delay-200"></div>
                </Link>
              </h2>
              <p className="text-sm mt-2 font-inter text-oniria_lightpink/70 group-hover:text-oniria_lightpink transition-colors duration-300">
                © 2025 Noctiria. Todos los derechos reservados.
              </p>
              
              {/* Partículas alrededor del logo */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute top-2 right-4 w-1 h-1 bg-oniria_lightpink rounded-full animate-pulse"></div>
                <div className="absolute bottom-3 left-2 w-1.5 h-1.5 bg-oniria_purple/60 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
                <div className="absolute top-1/2 right-2 w-0.5 h-0.5 bg-white rounded-full animate-ping" style={{animationDelay: '0.6s'}}></div>
              </div>
            </div>
          </div>
          
          {/* Enlaces de navegación */}
          <div className="flex flex-wrap justify-center gap-6">
            {['Contactos', 'Emociones', 'Sugerencias', 'Timeline'].map((item, index) => (
              <a 
                key={item}
                href="#" 
                className="group relative text-sm font-inter text-oniria_lightpink hover:text-white transition-all duration-500 py-2 px-4 rounded-full overflow-hidden"
              >
                {/* Efecto de burbuja expansiva */}
                <div className="absolute inset-0 bg-gradient-to-br from-oniria_lightpink/20 to-oniria_purple/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></div>
                
                {/* Partículas flotantes en hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-1 left-2 w-0.5 h-0.5 bg-oniria_lightpink rounded-full animate-pulse"></div>
                  <div className="absolute bottom-1 right-2 w-1 h-1 bg-oniria_purple/60 rounded-full animate-bounce" style={{animationDelay: `${index * 0.1}s`}}></div>
                </div>
                
                {/* Texto con efecto de brillo */}
                <span className="relative z-10 group-hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.6)] transition-all duration-300">
                  {item}
                </span>
                
                {/* Línea animada */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-oniria_lightpink to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"></div>
                
                {/* Efecto de destello lateral */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </a>
            ))}
          </div>
          
          {/* Redes sociales */}
          <div className="flex space-x-6">
            {[
              { icon: RiTwitterXFill, href: "https://x.com/", label: "Síguenos en X" },
              { icon: FaInstagram, href: "https://instagram.com/", label: "Síguenos en Instagram" },
              { icon: FaTiktok, href: "https://tiktok.com/", label: "Síguenos en TikTok" }
            ].map(({ icon: Icon, href, label }, index) => (
              <a 
                key={href}
                href={href}
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label={label}
                className="group relative p-3 rounded-full bg-oniria_lightpink/10 backdrop-blur-sm border border-oniria_lightpink/20 hover:border-oniria_lightpink/60 text-oniria_lightpink hover:text-white transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-oniria_lightpink/40 overflow-hidden"
              >
                {/* Efecto de ondas expansivas */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-oniria_lightpink/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {/* Partículas orbitantes */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-1 left-1 w-1 h-1 bg-oniria_purple rounded-full animate-spin" style={{animationDuration: '3s', animationDelay: `${index * 0.2}s`}}></div>
                  <div className="absolute bottom-1 right-1 w-0.5 h-0.5 bg-white rounded-full animate-ping" style={{animationDelay: `${index * 0.3}s`}}></div>
                </div>
                
                <Icon className="w-5 h-5 relative z-10 transform transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
                
                {/* Anillo pulsante */}
                <div className="absolute inset-0 rounded-full border border-oniria_lightpink/30 scale-100 group-hover:scale-125 opacity-100 group-hover:opacity-0 transition-all duration-500"></div>
              </a>
            ))}
          </div>
        </div>
        
        {/* Separador animado */}
        <div className="relative my-8">
          <div className="h-px bg-gradient-to-r from-transparent via-oniria_lightpink/30 to-transparent"></div>
          <div className="absolute inset-0 h-px bg-gradient-to-r from-oniria_lightpink/0 via-oniria_lightpink/60 to-oniria_lightpink/0 animate-pulse"></div>
        </div>
        
        {/* Enlaces legales */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <div className="text-oniria_lightpink/60">
            Conectando mentes, sanando corazones
          </div>
          
          <div className="flex space-x-6">
            {['Términos', 'Privacidad', 'Contacto'].map((item, index) => (
              <a 
                key={item}
                href="#" 
                className="group relative font-inter text-oniria_lightpink/60 hover:text-oniria_lightpink transition-all duration-300 py-1 px-2 rounded overflow-hidden"
              >
                {/* Mini efecto de burbuja */}
                <div className="absolute inset-0 bg-oniria_lightpink/5 rounded scale-0 group-hover:scale-100 transition-transform duration-200 origin-center"></div>
                
                <span className="relative z-10 group-hover:drop-shadow-[0_0_4px_rgba(255,192,203,0.5)] transition-all duration-300">
                  {item}
                </span>
                
                {/* Línea sutil */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-oniria_lightpink/40 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></div>
              </a>
            ))}
          </div>
        </div>
      </div>
      
      {/* Efecto de brillo en el borde superior */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-oniria_lightpink/50 to-transparent animate-pulse"></div>
    </footer>
  );
};

export default DashboardFooter;