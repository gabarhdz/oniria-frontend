import React from 'react'
import Header from '../../Components/Header/Header'
import Feature from '../../Components/Feature/Feature'
import Footer from '../../Components/Footer/Footer';
import { getfeatureData } from '../../data/featureData';
import HeroSection from '../../Components/Hero/Hero';

const featureData = getfeatureData();

const Home = () => {
  return (
    <>
      <Header /> 
      <HeroSection />
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
        <div className="flex flex-col items-center justify-center  text-center">
          <h2 className="font-playfair text-oniria_darkblue text-5xl font-bold italic">
            Mapea tus emociones
          </h2>
          <div>
            <img src="../../../public/img/emotions.svg" alt="Emociones" className="w-[650px]" />
          </div>
        </div>

        <Footer />
    </>
  )
}

export default Home
