// components/dashboard/ActionsSection.tsx
import React from 'react';
import { BookOpen, Palette, Award, Settings } from 'lucide-react';
import { ActionButton } from './ActionButton';

export const ActionsSection: React.FC = () => {
  const actions = [
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "Diario de Sueños",
      description: "Registra y explora tus experiencias oníricas",
      gradient: "from-[#9675bc] to-[#7c3aed]",
      onClick: () => {
        window.location.href = '/dreams';
      }
    },
    {
      icon: <Palette className="w-5 h-5" />,
      title: "Análisis de Patrones",
      description: "Descubre los patrones ocultos en tus sueños",
      gradient: "from-[#f1b3be] to-[#ec4899]",
      onClick: () => {
        window.location.href = '/analysis';
      }
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: "Logros Oníricos",
      description: "Ve tus logros como explorador de sueños",
      gradient: "from-[#ffe0db] to-[#f97316]",
      onClick: () => {
        window.location.href = '/achievements';
      }
    },
    {
      icon: <Settings className="w-5 h-5" />,
      title: "Configuración",
      description: "Personaliza tu experiencia en Noctiria",
      gradient: "from-[#214d72] to-[#0f172a]",
      onClick: () => {
        window.location.href = '/settings';
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#ffe0db] via-[#f1b3be] to-[#9675bc] bg-clip-text text-transparent mb-2">
          Explorar Noctiria
        </h2>
        <p className="text-[#ffe0db]/70">Descubre todas las herramientas disponibles</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {actions.map((action, index) => (
          <ActionButton
            key={index}
            icon={action.icon}
            title={action.title}
            description={action.description}
            onClick={action.onClick}
            gradient={action.gradient}
          />
        ))}
      </div>
    </div>
  );
};