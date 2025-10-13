export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserData {
  id: string;
  username: string;
  email: string;
  profile_pic?: string;
}

export interface OrbProps {
  isActive: boolean;
  size?: 'small' | 'medium' | 'large';
}

export interface MessageBubbleProps {
  message: Message;
  index: number;
  isLoading: boolean;
  messagesLength: number;
  user: UserData | null;
  copiedId: string | null;
  onCopy: (id: string, content: string) => void;
}

export interface ChatInputProps {
  input: string;
  isLoading: boolean;
  currentConversationId: string | null;
  onInputChange: (value: string) => void;
  onSend: () => void;
}

export interface SidebarProps {
  showSidebar: boolean;
  conversations: Conversation[];
  currentConversationId: string | null;
  onToggleSidebar: () => void;
  onCreateNew: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
}

export interface HeaderProps {
  showSidebar: boolean;
  currentConversation: Conversation | undefined;
  onToggleSidebar: () => void;
  onRefresh: () => void;
  onExport: () => void;
}
