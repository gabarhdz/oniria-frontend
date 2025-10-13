// Tipos para TypeScript
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  description?: string;
  profile_pic?: string;
  is_psychologist: boolean;
  date_joined?: string;
}

export interface ProfileProps {
  viewOnly?: boolean;
}

export interface PrivacySettings {
  profile_visibility: 'public' | 'friends' | 'private';
  email_visibility: boolean;
  dream_sharing: boolean;
  community_notifications: boolean;
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
  isActive?: boolean;
}

export interface ProfileBreadcrumbsProps {
  activeSection: 'profile' | 'privacy' | 'security';
  viewOnly?: boolean;
  username?: string;
}

export interface NotificationState {
  type: 'success' | 'error';
  message: string;
}

export interface ProfileHeaderProps {
  activeTab: string;
  viewOnly?: boolean;
  username?: string;
}

export interface ProfileAvatarProps {
  size: 'small' | 'medium' | 'large';
  editable: boolean;
  user: UserProfile;
  previewUrl: string | null;
  isEditing: boolean;
  viewOnly: boolean;
  getUserInitials: (username: string) => string;
  fileInputRef?: React.RefObject<HTMLInputElement>;
}

export interface TwinklingStarsProps {
  count?: number;
  className?: string;
}