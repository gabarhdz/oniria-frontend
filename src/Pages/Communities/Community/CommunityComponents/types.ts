// Types and interfaces for Community components
export interface User {
  id: string;
  username: string;
  email: string;
  profile_pic?: string;
  description?: string;
  is_psychologist?: boolean;
}

export interface Community {
  id: string;
  name: string;
  description?: string;
  profile_image?: string;
  created_at: string;
  users: User[];
  owner: User;
}

export interface Post {
  id: string;
  title: string;
  text: string;
  created_at: string;
  community: Community;
  parent_post?: Post;
  author: User;
  likes: User[];
  dislikes: User[];
}

export type FilterType = 'all' | 'member' | 'non-member';
export type SortType = 'created-asc' | 'created-desc' | 'members-asc' | 'members-desc';
export type ViewType = 'communities' | 'community-posts';
export type LoaderSize = 'small' | 'medium' | 'large';
export type AvatarSize = 'small' | 'medium' | 'large';