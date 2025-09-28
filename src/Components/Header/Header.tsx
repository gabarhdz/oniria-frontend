import { useState } from 'react'
import { IoClose } from "react-icons/io5";
import { MdOutlineMenu } from "react-icons/md";
import { AlertTriangle } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const [menu, setMenu] = useState(false);
    const [showLoginAlert, setShowLoginAlert] = useState(false);
    const navigate = useNavigate();

    // Simula si el usuario está logueado (ajusta según tu lógica real)
    const isLoggedIn = false;

    // Navegación protegida para todas las secciones
    const handleProtectedNav = (e: React.MouseEvent, route: string) => {
        if (!isLoggedIn) {
            e.preventDefault();
            setShowLoginAlert(true);
        }
    };

    const handleConfirmLogin = () => {
        setShowLoginAlert(false);
        navigate('/login');
    };

    const handleCancelLogin = () => {
        setShowLoginAlert(false);
    };

    const navItems = [
        { name: 'Chatbot', route: '/chatbot' },
        { name: 'Análisis', route: '/análisis' },
        { name: 'Psicólogos', route: '/psicólogos' },
        { name: 'Comunidad', route: '/comunidad' }
    ];

    return (
        <>
            <nav className='fixed top-0 left-0 right-0 z-50 bg-oniria_darkblue/80 backdrop-blur-xl text-oniria_lightpink h-[90px] font-playfair border-b border-oniria_lightpink/10 shadow-2xl'>
                {/* Mobile Layout */}
                <div className='flex md:hidden justify-between items-center p-4 h-full relative'>
                    {/* Logo simplificado */}
                    <div className="relative">
                        <ul className='flex gap-4 items-center'>
                            <li className="relative">
                                <Link to={'/'} className="flex items-center group">
                                    <img 
                                        src="/img/Oniria.svg" 
                                        alt="ONIRIA Logo" 
                                        className="w-16 h-16 filter drop-shadow-md transition-all duration-500 group-hover:scale-110 group-hover:rotate-3" 
                                    />
                                    <span className="font-playfair font-black italic text-2xl ml-4 bg-gradient-to-r from-oniria_lightpink via-white to-oniria_lightpink bg-clip-text text-transparent hover:bg-gradient-to-l transition-all duration-700 hover:tracking-wider">
                                        NOCTIRIA
                                    </span>
                                </Link>
                            </li>
                        </ul>     
                    </div>
                    
                    {/* Botón Menu con animación */}
                    <div className="relative">
                        <button 
                            onClick={() => setMenu(!menu)}
                            className='relative group p-3 rounded-full bg-oniria_lightpink/10 backdrop-blur-sm border border-oniria_lightpink/30 hover:border-oniria_lightpink/60 text-oniria_lightpink hover:text-white transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-oniria_lightpink/40 overflow-hidden'
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-oniria_lightpink/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            {menu ? (
                                <IoClose className='text-3xl relative z-10 transform transition-all duration-300 group-hover:rotate-90 group-hover:scale-110'/>
                            ) : (
                                <MdOutlineMenu className='text-3xl relative z-10 transform transition-all duration-300 group-hover:rotate-12 group-hover:scale-110' />
                            )}
                        </button>
                    </div>

                    {/* Menú móvil con glassmorphism */}
                    <div className={`absolute top-full left-0 w-full transition-all duration-500 ease-out transform ${menu ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'}`}>
                        <div className='bg-oniria_darkblue/90 backdrop-blur-2xl border-t border-oniria_lightpink/20 shadow-2xl'>
                            <div className='p-6 bg-oniria_lightpink/5'>
                                <ul className='space-y-4'>
                                    {navItems.map((item, index) => (
                                        <li key={item.name} className={`transform transition-all duration-500 ${menu ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`} style={{transitionDelay: `${index * 100}ms`}}>
                                            <Link 
                                                to={item.route}
                                                className='group relative flex items-center text-xl text-oniria_lightpink hover:text-white transition-all duration-500 py-3 px-6 rounded-2xl block overflow-hidden'
                                                onClick={(e) => handleProtectedNav(e, item.route)}
                                            >
                                                {/* Efectos visuales */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-oniria_lightpink/20 to-oniria_lightpink/5 rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></div>
                                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                                    <div className="absolute top-2 left-3 w-1 h-1 bg-oniria_lightpink rounded-full animate-pulse"></div>
                                                    <div className="absolute bottom-3 right-4 w-1.5 h-1.5 bg-oniria_lightpink/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                                    <div className="absolute top-1/2 left-1/2 w-0.5 h-0.5 bg-white rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
                                                </div>
                                                <span className="relative z-10 font-medium group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-300">
                                                    {item.name}
                                                </span>
                                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-oniria_lightpink to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-oniria_lightpink to-white animate-pulse"></div>
                                                </div>
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 delay-100"></div>
                                            </Link>
                                        </li>
                                    ))}
                                    <li className={`pt-6 border-t border-oniria_lightpink/20 mt-6 transform transition-all duration-500 ${menu ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{transitionDelay: '400ms'}}>
                                        <div className='flex justify-center gap-4'>
                                            <Link
                                                to={'/signup'}
                                                className='group relative px-6 py-3 rounded-full bg-oniria_lightpink text-oniria_darkblue font-semibold hover:bg-oniria_lightpink/90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-oniria_lightpink/50 overflow-hidden border border-oniria_lightpink/20'
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                                <span className="relative z-10">Sign Up</span>
                                            </Link>
                                            <Link
                                                to={'/login'}
                                                className='group relative px-6 py-3 rounded-full border-2 border-oniria_lightpink bg-oniria_lightpink/10 backdrop-blur-sm text-oniria_lightpink hover:bg-oniria_lightpink hover:text-oniria_darkblue transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-oniria_lightpink/50 overflow-hidden'
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-oniria_lightpink/0 via-oniria_lightpink/30 to-oniria_lightpink/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                                <span className="relative z-10">Log In</span>
                                            </Link>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop Layout */}
                <div className='hidden md:flex md:justify-between md:items-center md:p-4 h-full'> 
                    {/* Logo Desktop simplificado */}
                    <div className="ml-6 relative">
                        <ul className='flex gap-4 items-center'>
                            <li className="relative">
                                <Link to={'/'} className="flex items-center group">
                                    <img 
                                        src="../../public/img/Oniria.svg" 
                                        className="w-20 h-20 object-contain filter drop-shadow-md transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                                        alt="ONIRIA Logo"
                                    />
                                    <span className="font-playfair font-black italic text-2xl ml-4 bg-gradient-to-r from-oniria_lightpink via-white to-oniria_lightpink bg-clip-text text-transparent hover:bg-gradient-to-l transition-all duration-700 hover:tracking-wider">
                                       NOCTIRIA
                                    </span>
                                </Link>
                            </li>
                        </ul>     
                    </div>

                    {/* Navegación Desktop */}
                    <div className='flex items-center'>
                        <ul className='flex gap-8 text-[16px] font-inter'>
                            {navItems.map((item, index) => (
                                <li key={item.name} className='group relative'>
                                    <Link 
                                        to={item.route}
                                        className='relative text-oniria_lightpink hover:text-white transition-all duration-500 py-3 px-6 rounded-2xl block overflow-hidden'
                                        onClick={(e) => handleProtectedNav(e, item.route)}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-oniria_lightpink/20 to-oniria_lightpink/5 rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></div>
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            <div className="absolute top-2 left-3 w-1 h-1 bg-oniria_lightpink rounded-full animate-pulse"></div>
                                            <div className="absolute bottom-3 right-4 w-1.5 h-1.5 bg-oniria_lightpink/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                            <div className="absolute top-1/2 left-1/2 w-0.5 h-0.5 bg-white rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
                                        </div>
                                        <span className="relative z-10 font-medium group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-300">
                                            {item.name}
                                        </span>
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-oniria_lightpink to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center">
                                            <div className="absolute inset-0 bg-gradient-to-r from-oniria_lightpink to-white animate-pulse"></div>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 delay-100"></div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Botones Desktop */}
                    <div className='flex items-center mr-12'>
                        <ul className='flex gap-4'>
                            <li>
                                <Link 
                                    className='group relative inline-block px-6 py-3 rounded-full bg-oniria_lightpink text-oniria_darkblue font-semibold hover:bg-oniria_lightpink/90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-oniria_lightpink/50 overflow-hidden border border-oniria_lightpink/20' 
                                    to={'/signup'}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                    <span className="relative z-10">Sign Up</span>
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    className='group relative inline-block px-6 py-3 rounded-full border-2 border-oniria_lightpink bg-oniria_lightpink/10 backdrop-blur-sm text-oniria_lightpink hover:bg-oniria_lightpink hover:text-oniria_darkblue transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-oniria_lightpink/50 overflow-hidden' 
                                    to={'/login'}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-oniria_lightpink/0 via-oniria_lightpink/30 to-oniria_lightpink/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                    <span className="relative z-10">Log In</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Espaciador para el header fijo */}
            <div className="h-[90px]"></div>

            {/* Modal de alerta login bonito */}
            <div className={`fixed inset-0 z-[9999] transition-all duration-300 ${showLoginAlert ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                {/* Backdrop */}
                <div 
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={handleCancelLogin}
                />
                {/* Modal */}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                    <div className={`relative bg-gradient-to-br from-oniria_darkblue/95 via-oniria_darkblue/90 to-oniria_blue/95 backdrop-blur-2xl border border-oniria_purple/30 rounded-2xl shadow-2xl shadow-oniria_purple/20 p-6 sm:p-8 max-w-md w-full mx-4 transform transition-all duration-500 ${showLoginAlert ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
                        {/* Efectos decorativos */}
                        <div className="absolute inset-0 rounded-2xl overflow-hidden">
                            <div className="absolute top-4 left-4 w-2 h-2 bg-oniria_purple/30 rounded-full animate-pulse"></div>
                            <div className="absolute top-8 right-6 w-1 h-1 bg-oniria_pink/40 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-oniria_lightpink/30 rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
                            <div className="absolute bottom-4 right-4 w-1 h-1 bg-oniria_purple/20 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
                        </div>
                        {/* Contenido */}
                        <div className="relative z-10 text-center space-y-6">
                            <div className="relative inline-flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-r from-oniria_pink/20 via-oniria_purple/20 to-oniria_lightpink/20 rounded-full blur-xl animate-pulse w-20 h-20"></div>
                                <div className="relative w-16 h-16 bg-gradient-to-br from-oniria_pink/30 to-oniria_purple/30 rounded-full flex items-center justify-center">
                                    <AlertTriangle className="w-8 h-8 text-oniria_lightpink animate-pulse" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-oniria_lightpink via-oniria_pink to-oniria_purple bg-clip-text text-transparent">
                                    Inicia sesión para continuar
                                </h3>
                                <p className="text-sm sm:text-base text-oniria_lightpink/80">
                                    Debes iniciar sesión para acceder a esta sección.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                                <button
                                    onClick={handleCancelLogin}
                                    className="group relative flex-1 px-6 py-3 rounded-xl bg-oniria_blue/20 backdrop-blur-sm border border-oniria_blue/50 hover:border-oniria_purple/60 text-oniria_lightpink hover:text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-oniria_blue/40 overflow-hidden cursor-pointer"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-oniria_blue/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                    <span className="relative z-10 font-medium">Cancelar</span>
                                </button>
                                <button
                                    onClick={handleConfirmLogin}
                                    className="group relative flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-oniria_pink/30 to-oniria_purple/25 backdrop-blur-sm border border-oniria_pink/50 hover:border-oniria_purple/70 text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-oniria_pink/50 overflow-hidden cursor-pointer"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-oniria_pink/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                    <span className="relative z-10 font-medium flex items-center justify-center gap-2">
                                        Ir a Login
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header;