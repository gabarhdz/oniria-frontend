import React from 'react'
import {Link} from 'react-router-dom'
import Header from '../../Components/Header/Header'
import Feature from '../../Components/Feature/Feature'
import Footer from '../../Components/Footer/Footer';

import { getfeatureData } from '../../data/featureData';

const featureData = getfeatureData();

const Home = () => {
  return (
    <>
      <Header />
      <div className='bg-oniria_pink flex justify-between items-center'>
        <div>
          <div className='flex flex-col items-center justify-center m-2 p-4'>
            <h2 className='font-playfair font-bold italic text-5xl text-oniria_blue pb-4 '>Descubre el <br /> significado  <br /> de tus sueños</h2>
            <p className='mb-4 mr-2'>Explora tu subconsciente con análisis avanzado <br /> y descubre las emociones ocultas en tus sueños</p>
          </div>
          <Link to={'/signup'} className='bg-oniria_purple py-3 px-6 rounded-xl m-5'>
          Comenzar ahora
          </Link>
        </div>
        <div>
          <div className='rounded-full w-lg h-[32rem] bg-oniria_lightpink items-center justify-center flex mr-32 my-8'>
            Oniria
          </div>
        </div>
      </div> 

      <div className="flex flex-col md:flex-row gap-4 items-center justify-center min-h-screen p-4 md:p-16">
        {featureData.map((feature) => (
          <Feature
            key={feature.number}
            number={feature.number}
            title={feature.title}
            description={feature.description}
            color={feature.color}
            Icon={feature.Icon}
          />
        ))} 
      </div>

        <Footer />
    </>
  )
}

export default Home
