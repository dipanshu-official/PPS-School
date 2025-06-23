import React from 'react';
import Button from '../common/Button';

const ChatHeader = ({ group,  showSearch = false, theme = 'blue' }) => {
  const themeClasses = {
    blue: 'btn-primary',
    green: 'btn-secondary'
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4 lg:p-6 shadow-soft">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900">{group?.name}</h3>
            {group?.isPrivate && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Private
              </span>
            )}
          </div>
          <p className="text-sm lg:text-base text-gray-600 mb-2">{group?.description}</p>
          <div className="flex flex-wrap items-center gap-2 text-xs lg:text-sm text-gray-500">
            <span className="inline-flex items-center">
              <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {group?.members} members
            </span>
            {group?.createdBy && (
              <>
                <span className="text-gray-300">•</span>
                <span>Created by {group.createdBy}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {showSearch && (
            <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;