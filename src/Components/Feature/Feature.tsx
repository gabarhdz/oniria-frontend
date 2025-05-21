import React from "react";

interface FeatureProps {
  number: number;
  title: string;
  color: string;
  description: string;
  Icon: React.ElementType;
}

const Feature: React.FC<FeatureProps> = ({
  number,
  title,
  description,
  color,
  Icon,
}) => {
  return (
    <div className="bg-[#FEEFE8] p-4 min-h-[320px] w-full md:w-1/3 rounded-3xl shadow-md hover:shadow-lg transition text-center flex flex-col items-center justify-between">
      
      {/* Número en círculo */}
      <div 
        className="text-white font-bold w-16 h-16 rounded-full flex items-center justify-center text-lg mb-4"
        style={{ backgroundColor: color }}
      >
        {number.toString().padStart(2, '0')}
      </div>

      {/* Título */}
      <h3 className="text-2xl font-semibold italic text-oniria_darkblue mb-2">
        {title}
      </h3>

      {/* Descripción */}
      <div className="w-4/5 md:w-2/3">
        <p className="text-gray-700 text-base mb-6">
          {description}
        </p>
      </div>
      
      {/* Ícono en recuadro */}
      <div className="bg-oniria_lightpink bg-opacity-30 p-4 rounded-lg min-w-36 flex items-center justify-center">
        <Icon 
          className="w-10 h-10" 
          style={{ color: color }}
        />
      </div>
    </div>
  );
};

export default Feature;
