import React from 'react'
import {Link} from 'react-router-dom'

const Header = () => {
  return (
    <>
    <nav className='bg-oniria_blue'>
    <div>
        <ul>
            <Link to={'/'}>Chatbot</Link>
            <Link to={'/'}>Análisis</Link>
            <Link to={'/'}>Psicólogos</Link>
            <Link to={'/'}>Comunidad</Link>
        </ul>
    </div>
    <div>
        <ul>
            <li><Link to={'/signup'}>Sign Up</Link></li>
            <li><Link to={'/login'}>Log In</Link></li>
        </ul>
    </div>
    </nav>
    </>
  )
}

export default Header