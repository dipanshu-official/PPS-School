import React from 'react';

const Avatar = ({ name, size = 'md', status, className = '' }) => {
  const initials = name
    
    
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  const statusColors = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    offline: 'bg-gray-400'
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`${sizes[size]} bg-gray-200 rounded-full flex items-center justify-center`}>
        <span className="font-semibold text-gray-600">{initials}</span>
      </div>
      {status && (
        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${statusColors[status]}`}></div>
      )}
    </div>
  );
};

export default Avatar;