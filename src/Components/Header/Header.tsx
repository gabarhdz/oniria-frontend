import {useState} from 'react'
import {Link} from 'react-router-dom'
import { IoClose } from "react-icons/io5";
import { MdOutlineMenu } from "react-icons/md";

const Header = () => {
    const [menu, setMenu] = useState(false);
  return (
    <>
    <nav className='bg-oniria_darkblue text-oniria_lightpink h-[90px] font-playfair'>
        <div className='flex md:hidden justify-between items-center p-4 h-full relative'>
    {/* Logo y botón del menú */}
    <div>
        <ul className='flex gap-4 items-center'>
            <li>
                <Link to={'/'}>
                    <img src="/img/Logo.svg" alt="ONIRIA Logo" className="w-full h-full object-contain" />
                </Link>
            </li>
            <li className='font-playfair font-black italic text-3xl'><Link to={'/'}>ONIRIA</Link></li>
        </ul>     
    </div>
    
    <div>
        <button 
            onClick={() => setMenu(!menu)}
            className='text-oniria_lightpink hover:text-oniria_darkblue transition-colors duration-300'
        >
            {menu ? (
                <IoClose className='text-4xl'/>
            ) : (
                <MdOutlineMenu className='text-4xl' />
            )}
        </button>
    </div>

    {/* Menú desplegable */}
    {menu && (
        <div className='absolute top-16 left-0 w-full bg-oniria_blue z-50 shadow-lg'>
            <div className='p-6 border-t border-oniria_lightpink/20'>
                <ul className='space-y-6 text-center'>
                    <li>
                        <Link 
                            to={'/'}
                            className='text-2xl text-oniria_lightpink hover:text-oniria_darkblue transition-colors duration-300 block py-2'
                        >
                            Chatbot
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to={'/'}
                            className='text-2xl text-oniria_lightpink hover:text-oniria_darkblue transition-colors duration-300 block py-2'
                        >
                            Análisis
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to={'/'}
                            className='text-2xl text-oniria_lightpink hover:text-oniria_darkblue transition-colors duration-300 block py-2'
                        >
                            Psicólogos
                        </Link>
                    </li>
                    <li>
                        <Link 
                            to={'/'}
                            className='text-2xl text-oniria_lightpink hover:text-oniria_darkblue transition-colors duration-300 block py-2'
                        >
                            Comunidad
                        </Link>
                    </li>
                    <li className='pt-6 border-t border-oniria_lightpink/20'>
                        <div className='flex justify-center gap-4 mt-4'>
                            <Link
                                to={'/signup'}
                                className='px-6 py-2 rounded-full border-2 border-oniria_darkblue bg-oniria_lightpink text-oniria_blue hover:bg-oniria_darkblue hover:text-oniria_lightpink transition-colors duration-300'
                            >
                                Sign Up
                            </Link>
                            <Link
                                to={'/login'}
                                className='px-6 py-2 rounded-full border-2 border-oniria_lightpink text-oniria_lightpink hover:bg-oniria_lightpink hover:text-oniria_blue transition-colors duration-300'
                            >
                                Log In
                            </Link>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    )}
</div>
    <div className='hidden md:flex md:justify-between md:items-center md:p-4 h-full'> 
        <div>
            <ul className='flex gap-4 items-center'>
                <li>
                    <Link to={'/'}>
                       <img 
                  src="../../public/img/LogoA.svg" 
                  className="w-90 h-90 z-10 transition-all duration-300 group-hover:brightness-110 ml-6 -mr-15 mt-2"
                />
                    </Link>
                </li>
              
            </ul>     
        </div>
        <div className='flex items-center'>
            <ul className='flex gap-20 text-[16px] font-inter'>
                <li><Link to={'/'}>Chatbot</Link></li>
                <li><Link to={'/'}>Análisis</Link></li>
                <li><Link to={'/'}>Psicólogos</Link></li>
                <li><Link to={'/'}>Comunidad</Link></li>
            </ul>
        </div>
        <div className='flex items-center mr-12'>
            <ul className='flex gap-4'>
                <li className='bg-oniria_lightpink text-oniria_blue'>
                    <Link className='w-7 h-2 px-4 py-1 rounded border-2 hover:bg-oniria_darkblue duration-300 ease-in-out border-oniria_darkblue bg-oniria_lightpink text-oniria_purple' to={'/signup'}>Sign Up</Link>
                </li>
                <li className='bg-oniria_blue'>
                    <Link className='w-7 h-2 px-4 py-1 rounded border-2 hover:bg-oniria_lightpink hover:text-oniria_darkblue duration-300 ease-in-out border-oniria_lightpink' to={'/login'}>Log In</Link>
                </li>
            </ul>
            </div>
        </div>
    </nav>
    </>
  )
}

export default Header