import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home,
  BookOpen,
  Brain,
  Heart,
  Settings,
  Star,
  Plus
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
      {/* Active background glow */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-br from-oniria_lightpink/20 to-oniria_purple/20 rounded-2xl backdrop-blur-xl border border-oniria_lightpink/30">
          <div className="absolute inset-0 bg-gradient-to-br from-oniria_lightpink/10 to-oniria_purple/10 rounded-2xl animate-pulse" />
        </div>
      )}
      
      {/* Hover effect */}
      <div className={`absolute inset-0 bg-gradient-to-br from-oniria_lightpink/5 to-oniria_purple/5 rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-200 ${isActive ? 'opacity-0' : ''}`} />
      
      {/* Icon container */}
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
        
        {/* Notification dot */}
        {notification && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-br from-red-400 to-red-600 rounded-full animate-pulse border border-white/20">
            <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-75" />
          </div>
        )}
      </div>
      
      {/* Label */}
      <span className={`text-xs font-medium transition-all duration-300 relative z-10 truncate max-w-full ${
        isActive 
          ? 'text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.8)] font-semibold' 
          : 'group-hover:text-oniria_lightpink'
      }`}>
        {label}
      </span>
      
      {/* Active indicator line */}
      {isActive && (
        <div className="absolute bottom-0 left-1/2 w-8 h-0.5 bg-gradient-to-r from-oniria_lightpink to-oniria_purple rounded-full transform -translate-x-1/2 translate-y-1">
          <div className="absolute inset-0 bg-white/40 rounded-full animate-pulse" />
        </div>
      )}
      
      {/* Floating particles on active */}
      {isActive && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1 left-2 w-0.5 h-0.5 bg-oniria_lightpink rounded-full animate-float opacity-60" />
          <div className="absolute top-2 right-3 w-1 h-1 bg-oniria_purple/40 rounded-full animate-float opacity-40" style={{animationDelay: '0.5s'}} />
          <div className="absolute bottom-3 left-1/2 w-0.5 h-0.5 bg-white/60 rounded-full animate-float opacity-80" style={{animationDelay: '1s'}} />
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

  const navItems = [
    {
      id: 'home',
      icon: <Home className="w-5 h-5" />,
      label: 'Inicio',
      notification: false,
      to: '/dashboard'
    },
    {
      id: 'dreams',
      icon: <BookOpen className="w-5 h-5" />,
      label: 'Sueños',
      notification: true
    },
    {
      id: 'add',
      icon: <Plus className="w-6 h-6" />,
      label: 'Agregar',
      notification: false
    },
    {
      id: 'analysis',
      icon: <Brain className="w-5 h-5" />,
      label: 'Análisis',
      notification: false
    },
    {
      id: 'profile',
      icon: <Heart className="w-5 h-5" />,
      label: 'Perfil',
      notification: false
    }
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50">
      {/* Main footer container */}
      <div className="relative bg-oniria_darkblue/95 backdrop-blur-2xl border-t border-oniria_lightpink/20 shadow-2xl">
        
        {/* Animated top border */}
        <div className="absolute top-0 left-0 right-0 h-px">
          <div className="h-full bg-gradient-to-r from-transparent via-oniria_lightpink/60 to-transparent animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-r from-oniria_lightpink/0 via-oniria_lightpink/40 to-oniria_lightpink/0 animate-shimmer" />
        </div>
        
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-t from-oniria_darkblue via-oniria_darkblue/95 to-oniria_darkblue/90" />
        
        {/* Floating background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-2 left-1/4 w-1 h-1 bg-oniria_lightpink/20 rounded-full animate-float" />
          <div className="absolute top-3 right-1/3 w-0.5 h-0.5 bg-oniria_purple/30 rounded-full animate-float" style={{animationDelay: '1s'}} />
          <div className="absolute top-1 right-1/4 w-1.5 h-1.5 bg-white/10 rounded-full animate-float" style={{animationDelay: '2s'}} />
        </div>
        
        {/* Navigation container */}
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
        
        {/* iPhone safe area */}
        <div className="h-safe-area-inset-bottom bg-oniria_darkblue/90" />
      </div>
      
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-4px) rotate(180deg);
            opacity: 1;
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
        
        .h-safe-area-inset-bottom {
          height: env(safe-area-inset-bottom, 0px);
        }
        
        /* Custom Tailwind classes */
        .text-oniria_lightpink {
          color: #f1b3be;
        }
        
        .text-oniria_purple {
          color: #9675bc;
        }
        
        .bg-oniria_darkblue {
          background-color: #252c3e;
        }
        
        .bg-oniria_lightpink {
          background-color: #f1b3be;
        }
        
        .bg-oniria_purple {
          background-color: #9675bc;
        }
        
        .border-oniria_lightpink {
          border-color: #f1b3be;
        }
        
        .from-oniria_lightpink {
          --tw-gradient-from: #f1b3be;
        }
        
        .to-oniria_purple {
          --tw-gradient-to: #9675bc;
        }
        
        .from-oniria_darkblue {
          --tw-gradient-from: #252c3e;
        }
        
        .to-oniria_darkblue {
          --tw-gradient-to: #252c3e;
        }
      `}</style>
    </footer>
  );
};


export default DashboardFooter;