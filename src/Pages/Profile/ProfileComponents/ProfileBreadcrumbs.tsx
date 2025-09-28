import React from 'react';
import { Link } from 'react-router-dom';
import { Home, User, ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
  isActive?: boolean;
}

interface ProfileBreadcrumbsProps {
  activeSection: 'profile' | 'privacy' | 'security';
  viewOnly?: boolean;
  username?: string;
}

export const ProfileBreadcrumbs: React.FC<ProfileBreadcrumbsProps> = ({ 
  activeSection, 
  viewOnly = false, 
  username 
}) => {
  const getSectionLabel = (section: string) => {
    switch (section) {
      case 'profile': return viewOnly ? 'Perfil de Usuario' : 'Mi Perfil';
      case 'privacy': return 'Privacidad';
      case 'security': return 'Seguridad';
      default: return viewOnly ? 'Perfil de Usuario' : 'Mi Perfil';
    }
  };
  
  const breadcrumbItems: BreadcrumbItem[] = viewOnly ? [
    { label: 'Comunidades', path: '/communities' },
    { label: `Perfil de ${username || 'Usuario'}`, isActive: true }
  ] : [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Mi Perfil', path: '/dashboard/profile/profile' },
    { label: getSectionLabel(activeSection), isActive: true }
  ];
  
  return (
    <nav className="flex items-center space-x-2 text-sm mb-6">
      <div className="flex items-center space-x-2 bg-[#ffe0db]/10 backdrop-blur-sm rounded-full px-4 py-2 border border-[#ffe0db]/20">
        <Home className="w-4 h-4 text-[#f1b3be]" />
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-[#ffe0db]/40" />
            )}
            {item.isActive ? (
              <span className="text-[#ffe0db] font-semibold flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{item.label}</span>
              </span>
            ) : (
              <Link
                to={item.path!}
                className="text-[#ffe0db]/70 hover:text-[#ffe0db] transition-colors duration-200 hover:underline"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};