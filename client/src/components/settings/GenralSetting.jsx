import React from 'react';
import Input from '../common/Input';

const GeneralSettings = ({ group, onUpdate, canModify, theme = 'blue' }) => {
  const themeClasses = {
    blue: 'focus:ring-blue-500 focus:border-blue-500',
    green: 'focus:ring-green-500 focus:border-green-500'
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">General Settings</h3>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <Input
            label="Group Name"
            value={group.name}
            onChange={(e) => onUpdate('name', e.target.value)}
            disabled={!canModify}
            className={themeClasses[theme]}
          />
          
          <Input
            label="Description"
            type="textarea"
            value={group.description}
            onChange={(e) => onUpdate('description', e.target.value)}
            disabled={!canModify}
            className={themeClasses[theme]}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{group.members}</div>
              <div className="text-sm text-gray-500">Total Members</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{group.createdAt}</div>
              <div className="text-sm text-gray-500">Created Date</div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-800">
                <strong>Created by:</strong> {group.createdBy}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;