import React from 'react';
import Button from '../common/Button';

const ChatSidebar = ({ 
  title, 
  subtitle, 
  avatar, 
  groups, 
  selectedGroup, 
  onGroupSelect, 
  onCreateGroup, 
  onEditGroup, 
  onDeleteGroup,
  canModifyGroup,
  theme = 'blue'
}) => {
  const themeClasses = {
    blue: {
      avatar: 'bg-gradient-to-br from-principal-500 to-principal-600',
      button: 'btn-primary',
      selected: 'bg-gradient-to-r from-principal-50 to-principal-100 border-principal-200 shadow-soft',
      badge: 'bg-gradient-to-r from-principal-500 to-principal-600',
      hover: 'hover:text-principal-600'
    },
    green: {
      avatar: 'bg-gradient-to-br from-teacher-500 to-teacher-600',
      button: 'btn-secondary',
      selected: 'bg-gradient-to-r from-teacher-50 to-teacher-100 border-teacher-200 shadow-soft',
      badge: 'bg-gradient-to-r from-teacher-500 to-teacher-600',
      hover: 'hover:text-teacher-600'
    }
  };

  const colors = themeClasses[theme];

  return (
    <div className="w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col shadow-medium">
      <div className="p-4  border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 lg:w-14 lg:h-14 ${colors.avatar} rounded-2xl flex items-center justify-center shadow-medium`}>
              <span className="text-white font-bold text-lg lg:text-xl">{avatar}</span>
            </div>
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">{title}</h2>
              <p className="text-sm lg:text-base text-gray-500">{subtitle}</p>
            </div>
          </div>
        </div>
        
        <Button
          onClick={onCreateGroup}
          className={`w-full ${colors.button} space-x-3 py-3 lg:py-4 text-base lg:text-lg font-semibold hover-lift`}
        >
          <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Create Group</span>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 lg:mb-6">
            Chat Groups ({groups.length})
          </h3>
          <div className="space-y-1">
            {groups.map((group) => (
              <div
                key={group.id}
                className={`group relative p-2 lg:p-2 rounded-xl transition-all duration-200 hover-lift ${
                  selectedGroup === group.id
                    ? `${colors.selected} border-2`
                    : 'hover:bg-gray-50 border-2 border-transparent'
                }`}
              >
                <button
                  onClick={() => onGroupSelect(group.id)}
                  className="w-full text-left"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900 text-base lg:text-lg">{group.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs lg:text-sm text-gray-500 font-medium">{group.members} members</span>
                      {group.unread > 0 && (
                        <span className={`${colors.badge} text-white text-xs lg:text-sm rounded-full px-2 py-1 font-bold shadow-soft animate-bounce-subtle`}>
                          {group.unread}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm lg:text-base text-gray-600 truncate mb-2">{group.lastMessage}</p>
                  <p className="text-xs lg:text-sm text-gray-400 font-medium">{group.timestamp}</p>
                </button>
                
                {canModifyGroup(group) && (
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex items-center space-x-1 bg-white rounded-lg shadow-medium p-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditGroup(group);
                        }}
                        className={`p-2 text-gray-400 ${colors.hover} transition-colors duration-200 rounded-md hover:bg-gray-50`}
                        title="Edit Group"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteGroup(group);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200 rounded-md hover:bg-red-50"
                        title="Delete Group"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;