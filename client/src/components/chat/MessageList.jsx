import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Avatar from '../common/Avatar';
import { userProfileDataSelector } from '../../store/globalSelctor';
import { getUserProfile } from '../../store/globalAction';

const MessageList = ({ messages = [], theme = 'blue' }) => {
  const dispatch = useDispatch();
  const user = useSelector(userProfileDataSelector);

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  const themeClasses = {
    blue: 'bg-gradient-to-r from-principal-500 to-principal-600',
    green: 'bg-gradient-to-r from-teacher-500 to-teacher-600',
  };

  const getInitial = (name = '') => name.charAt(0).toUpperCase();

  return (
    <div className="overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg shadow-inner h-[80vh]">
      {messages.map((message, index) => (
        <div
          key={message.id}
          className={`flex transition-opacity duration-300 ease-out ${message.isOwn ? 'justify-end' : 'justify-start'} animate-fade-in`}
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className={`flex items-start gap-4 max-w-2xl lg:max-w-3xl ${message.isOwn ? 'flex-row-reverse' : ''}`}>
            
            {/* Avatar */}
            <div className="flex-shrink-0">
              <Avatar
                size="md"
                name={message.sender || 'User'}
                className={`${message.isOwn ? themeClasses[theme] + ' text-white' : 'bg-gray-200 text-gray-700'} font-bold shadow`}
              >
                {getInitial(message.sender)}
              </Avatar>
            </div>

            {/* Message Content */}
            <div className={`${message.isOwn ? 'text-right' : 'text-left'} flex-1`}>
              <div className={`flex items-center gap-2 mb-1 ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
                <span className="text-sm font-semibold text-gray-900">{message.sender}</span>
                <span className="text-xs text-gray-500 font-medium">{message.role}</span>
                <span className="text-xs text-gray-400">{message.timestamp}</span>
              </div>

              <div
                className={`relative p-4 rounded-2xl shadow transition duration-200 ${
                  message.isOwn
                    ? `${themeClasses[theme]} text-white`
                    : 'bg-white border border-gray-200 text-gray-800'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.message}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
