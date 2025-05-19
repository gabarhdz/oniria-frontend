import React from 'react'
import {Link} from 'react-router-dom'

const Header = () => {
  return (
    <>
    <nav className='bg-oniria_blue'>
        <div>
            <ul>
                <li><Link to={'/'}>Chatbot</Link></li>
                <li><Link to={'/'}>Análisis</Link></li>
                <li><Link to={'/'}>Psicólogos</Link></li>
                <li><Link to={'/'}>Comunidad</Link></li>
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