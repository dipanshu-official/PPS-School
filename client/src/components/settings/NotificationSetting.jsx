import React from 'react';
import Toggle from '../common/Toggle';

const NotificationSettings = ({ group, onUpdate, theme = 'blue' }) => {
  const notificationOptions = [
    { id: 'all-messages', label: 'All Messages', description: 'Get notified for every message' },
    { id: 'mentions', label: 'Mentions Only', description: 'Only when you are mentioned' },
    { id: 'important', label: 'Important Messages', description: 'Only important announcements' }
  ];

  const themeClasses = {
    blue: 'text-blue-600 border-gray-300 focus:ring-blue-500',
    green: 'text-green-600 border-gray-300 focus:ring-green-500'
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Notification Settings</h3>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        <Toggle
          label="Group Notifications"
          description="Receive notifications for this group"
          checked={group.notifications}
          onChange={(e) => onUpdate('notifications', e.target.checked)}
          color={theme}
        />

        <div className="space-y-4">
          <div className="font-medium text-gray-900">Notification Types</div>
          
          {notificationOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-3">
              <input
                type="radio"
                id={option.id}
                name="notification-type"
                className={`w-4 h-4 ${themeClasses[theme]}`}
                defaultChecked={option.id === 'all-messages'}
              />
              <div>
                <label htmlFor={option.id} className="font-medium text-gray-900 cursor-pointer">
                  {option.label}
                </label>
                <div className="text-sm text-gray-500">{option.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;