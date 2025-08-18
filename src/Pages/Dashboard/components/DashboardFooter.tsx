import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home,
  BookOpen,
  Brain,
  Heart,
  Plus,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  to?: string;
  notification?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive = false, onClick, to, notification = false }) => {
  const baseClasses = `group relative flex flex-col items-center justify-center px-3 py-2 rounded-2xl transition-all duration-300 min-w-0 flex-1 ${
    isActive 
      ? 'text-white' 
      : 'text-oniria_lightpink/60 hover:text-oniria_lightpink active:scale-95'
  }`;

  const content = (
    <>
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-br from-oniria_lightpink/20 to-oniria_purple/20 rounded-2xl backdrop-blur-xl border border-oniria_lightpink/30">
          <div className="absolute inset-0 bg-gradient-to-br from-oniria_lightpink/10 to-oniria_purple/10 rounded-2xl animate-pulse" />
        </div>
      )}
      <div className={`absolute inset-0 bg-gradient-to-br from-oniria_lightpink/5 to-oniria_purple/5 rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-200 ${isActive ? 'opacity-0' : ''}`} />
      <div className="relative z-10 mb-1">
        <div className={`p-1 rounded-xl transition-all duration-300 ${
          isActive 
            ? 'bg-gradient-to-br from-oniria_lightpink/20 to-oniria_purple/20 transform scale-110' 
            : 'group-hover:bg-oniria_lightpink/10'
        }`}>
          <div className={`transition-all duration-300 ${isActive ? 'drop-shadow-[0_0_8px_rgba(241,179,190,0.6)]' : ''}`}>
            {icon}
          </div>
        </div>
        {notification && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-br from-red-400 to-red-600 rounded-full animate-pulse border border-white/20">
            <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-75" />
          </div>
        )}
      </div>
      <span className={`text-xs font-medium transition-all duration-300 relative z-10 truncate max-w-full ${
        isActive 
          ? 'text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.8)] font-semibold' 
          : 'group-hover:text-oniria_lightpink'
      }`}>
        {label}
      </span>
      {isActive && (
        <div className="absolute bottom-0 left-1/2 w-8 h-0.5 bg-gradient-to-r from-oniria_lightpink to-oniria_purple rounded-full transform -translate-x-1/2 translate-y-1">
          <div className="absolute inset-0 bg-white/40 rounded-full animate-pulse" />
        </div>
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={baseClasses}>
      {content}
    </button>
  );
};

export const DashboardFooter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', icon: <Home className="w-5 h-5" />, label: 'Inicio', to: '/dashboard' },
    { id: 'dreams', icon: <BookOpen className="w-5 h-5" />, label: 'Sueños', notification: true },
    { id: 'add', icon: <Plus className="w-6 h-6" />, label: 'Agregar' },
    { id: 'analysis', icon: <Brain className="w-5 h-5" />, label: 'Análisis' },
    { id: 'profile', icon: <Heart className="w-5 h-5" />, label: 'Perfil' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center">
      {/* Footer deslizante */}
      <div
        className={`w-full transform transition-transform duration-500 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Botón flecha pegado arriba del footer */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -top-6 left-1/2 -translate-x-1/2 p-2 rounded-full bg-oniria_darkblue/90 border border-oniria_lightpink/30 text-oniria_lightpink hover:bg-oniria_darkblue/95 transition-all shadow-lg"
        >
          {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
        </button>

        <div className="relative bg-oniria_darkblue/95 backdrop-blur-2xl border-t border-oniria_lightpink/20 shadow-2xl rounded-t-2xl">
          <div className="relative z-10 px-4 py-2">
            <div className="flex items-center justify-around max-w-md mx-auto">
              {navItems.map((item) => (
                <NavItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  isActive={activeTab === item.id}
                  onClick={item.to ? undefined : () => setActiveTab(item.id)}
                  to={item.to}
                  notification={item.notification}
                />
              ))}
            </div>
          </div>
          <div className="h-safe-area-inset-bottom bg-oniria_darkblue/90" />
        </div>
      </div>
    </div>
  );
};

export default DashboardFooter;
