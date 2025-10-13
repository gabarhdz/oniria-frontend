import { Plus, ArrowLeft, Trash2 } from 'lucide-react';
import React from 'react';
import type { SidebarProps } from './types';

const Sidebar: React.FC<SidebarProps> = ({
  showSidebar,
  conversations,
  currentConversationId,
  onToggleSidebar,
  onCreateNew,
  onSelectConversation,
  onDeleteConversation
}) => {
  return (
    <div className={`fixed inset-y-0 left-0 z-40 w-64 sm:w-72 bg-white/10 backdrop-blur-xl border-r border-white/20 transform transition-transform duration-300 ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="h-full flex flex-col p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-oniria_lightpink">Conversaciones</h2>
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-white/10 rounded-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-oniria_lightpink" />
          </button>
        </div>

        <button
          onClick={onCreateNew}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-oniria_purple to-oniria_pink hover:from-oniria_pink hover:to-oniria_lightpink text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg mb-4"
        >
          <Plus className="w-5 h-5" />
          <span>Nueva Conversación</span>
        </button>

        <div className="flex-1 overflow-y-auto space-y-2">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`group relative p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                currentConversationId === conv.id
                  ? 'bg-white/20 border border-white/30'
                  : 'bg-white/5 hover:bg-white/10 border border-transparent'
              }`}
              onClick={() => onSelectConversation(conv.id)}
            >
              <p className="text-sm font-medium text-oniria_lightpink truncate mb-1">
                {conv.title}
              </p>
              <p className="text-xs text-oniria_lightpink/60">
                {conv.updatedAt.toLocaleDateString()}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteConversation(conv.id);
                }}
                className="absolute top-2 right-2 p-1.5 bg-red-500/20 hover:bg-red-500/40 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="w-3 h-3 text-red-300" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Sidebar;