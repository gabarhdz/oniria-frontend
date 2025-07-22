import React from 'react'
import Header from '../../Components/Header/Header'
import Feature from '../../Components/Feature/Feature'
import Footer from '../../Components/Footer/Footer';
import { getfeatureData } from '../../data/featureData';
import HeroSection from '../../Components/Hero/Hero';
import OniriaChatbot from '../../Components/Chatbot/Chatbot';
import Timeline from '../../Components/TimeLine/TimeLine';
import Emotions from '../../Components/Emotions/Emotions';

const featureData = getfeatureData();

const Home = () => {
  return (
    <>
      <Header /> 
      <HeroSection />
       <h2 className="italic text-3xl md:text-5xl font-playfair text-center text-oniria_darkblue mt-10 md:mt-30 pb-8 md:pb-45 mb-25 md:-mb-60">
        Descubre nuestras funciones
       </h2>
      <div className="flex flex-col md:flex-row gap-4 items-center justify-center min-h-screen p-4 md:p-16 -mt-22 -mb-10">
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

        <OniriaChatbot />
        
        <Timeline />

       <Emotions />
        <Footer />
    </>
  )
}

export default Home
