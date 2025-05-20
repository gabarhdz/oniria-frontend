import React from 'react'
import {Link} from 'react-router-dom'

const Header = () => {
  return (
    <>
    <nav className='bg-oniria_blue text-oniria_lightpink sm:hidden md:flex md:justify-between md:items-center md:p-4'>
        <div>
            <ul className='flex gap-4'>
                <li><Link to={'/'}>Logo</Link></li>
                <li className='font-black italic text-3xl'><Link to={'/'}>ONIRIA</Link></li>
            </ul>     
        </div>
        <div className='flex items-center '>
            <ul className='flex gap-20 '>
                <li><Link  to={'/'}>Chatbot</Link></li>
                <li><Link to={'/'}>Análisis</Link></li>
                <li><Link to={'/'}>Psicólogos</Link></li>
                <li><Link to={'/'}>Comunidad</Link></li>
            </ul>
        </div>

        <div>
            <ul className='flex gap-4'>
                <li className='bg-oniria_lightpink text-oniria_blue '><Link className='w-7 h-2 px-4 py-1 rounded border-2 hover:bg-oniria_darkblue duration-300 ease-in-out border-oniria_darkblue bg-oniria_lightpink text-oniria_purple' to={'/signup'}>Sign Up</Link></li>
                <li className='bg-oniria_blue '><Link className='w-7 h-2 px-4 py-1 rounded border-2 hover:bg-oniria_lightpink hover:text-oniria_darkblue duration-300 ease-in-out border-oniria_lightpink'  to={'/login'}>Log In</Link></li>
            </ul>
        </div>
    </nav>
    <nav>

    </nav>
    </>
  )
}

export default Header