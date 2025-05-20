import React from "react";
import {Link} from 'react-router-dom'
import { LuBrain } from "react-icons/lu";
import { FiInfo } from "react-icons/fi";
import { RiUserCommunityLine } from "react-icons/ri";
import { MdEmojiEmotions } from "react-icons/md";

const features = [
  {
    Icon: LuBrain,
    title: "Análisis de sueños",
    description:
      "Descubre patrones ocultos en tus sueños con nuestro análisis avanzado en IA.",
    Icon2: FiInfo
  },
  {
    Icon: RiUserCommunityLine,
    title: "Comunidad",
    description:
      "Comparte tus experiencias y conecta con personas que tienen sueños similiares",
    Icon2: FiInfo
  },
  {
    Icon: MdEmojiEmotions,
    title: "Emociones",
    description:
      "Mapea las emociones presentes en tus sueños y comprende su impacto en vida.",
    Icon2: FiInfo
  },
];

const Feature: React.FC = () => {
  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-12">Descubre nuestras funciones</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {features.map(({ Icon, title, description, Icon2 }, idx) => (
            <div
              key={idx}
              className="bg-oniria_lightpink p-8 min-h-[320px] rounded-lg shadow-md hover:shadow-lg transition" >
              <div className="flex justify-center mb-4">
                <Icon className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-oniria_darkblue mb-2">{title}</h3>
              <p className="text-gray-600 text-base">{description}</p>
             <div className="flex justify-center mb-4 mt-15 bg-oniria_pink rounded-lg opacity-50">
                <ul>
                 <li><Link to={'/signup'}><Icon2 className="h-12 w-10 text-blue-600" /></Link></li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feature;
