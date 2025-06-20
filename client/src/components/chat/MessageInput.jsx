import React from 'react';
import Button from '../common/Button';

const MessageInput = ({ 
  message, 
  onChange, 
  onSend, 
  onKeyPress, 
  placeholder = "Type your message...",
  theme = 'blue'
}) => {
  const themeClasses = {
    blue: 'focus-ring-blue',
    green: 'focus-ring-green'
  };

  const buttonThemes = {
    blue: 'btn-primary',
    green: 'btn-secondary'
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4 lg:p-6 shadow-soft">
      <div className="flex items-end space-x-3 lg:space-x-4">
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={onChange}
            onKeyPress={onKeyPress}
            placeholder={placeholder}
            className={`w-full resize-none border-2 border-gray-200 rounded-2xl px-4 lg:px-6 py-3 lg:py-4 ${themeClasses[theme]} transition-all duration-200 text-sm lg:text-base`}
            rows="2"
          />
          <div className="absolute bottom-3 right-3 flex items-center space-x-2">
            <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9-4V8a3 3 0 016 0v2M7 16v4a1 1 0 001 1h8a1 1 0 001-1v-4" />
              </svg>
            </button>
          </div>
        </div>
        <Button
          onClick={onSend}
          disabled={!message.trim()}
          className={`${buttonThemes[theme]} px-6 lg:px-8 py-3 lg:py-4 disabled:opacity-50 disabled:cursor-not-allowed hover-lift text-sm lg:text-base font-semibold`}
        >
          <svg className="w-5 h-5 lg:w-6 lg:h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          <span className="hidden sm:inline">Send</span>
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;