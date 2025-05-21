import React from 'react';
import {Link} from 'react-router-dom'
import { RiTwitterXFill } from "react-icons/ri";
import { FaInstagram } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-oniria_darkblue text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold italic font-playfair"><Link to={'/'}>ONIRIA</Link></h2>
            <p className="text-xs mt-2 font-inter">© 2025 Oniria. Todos los derechos reservados.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 mb-4 md:mb-0">
            <a href="#" className="text-sm hover:text-oniria_purple font-inter">Contactos</a>
            <a href="#" className="text-sm hover:text-oniria_purple font-inter">Emociones</a>
            <a href="#" className="text-sm hover:text-oniria_purple font-inter">Sugerencias</a>
            <a href="#" className="text-sm hover:text-oniria_purple font-inter">Emociones</a>
          </div>
          
          <div className="flex space-x-4">
            <a href="https://x.com/"  target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Síguenos en X">
              <div className="w-5 h-5">
                 <RiTwitterXFill className="w-full h-full" />
              </div>
            </a>

            <a 
              href="https://instagram.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Síguenos en Instagram">
              <div className="w-5 h-5">
                 <FaInstagram className="w-full h-full" />
              </div>
            </a>

            <a 
              href="https://tiktok.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Síguenos en TikTok"
            >
              <FaTiktok className="w-5 h-5" />
            </a>

          </div>
        </div>
        
        <div className="flex justify-end mt-4 text-xs">
          <div className="flex space-x-4">
            <a href="#" className="hover:text-oniria_purple font-inter">Términos</a>
            <a href="#" className="hover:text-oniria_purple font-inter">Privacidad</a>
            <a href="#" className="hover:text-oniria_purple font-inter">Contacto</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;