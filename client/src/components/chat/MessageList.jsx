import React, { useEffect } from 'react';
import Avatar from '../common/Avatar';
import { principalGroups, groupMembers, sampleMessages, allStaffMembers } from '../../data/MocData';
import { useSelector , useDispatch } from 'react-redux';
import { userProfileDataSelector } from '../../store/globalSelctor';
import { getUserProfile } from '../../store/globalAction';
const MessageList = ({ messages, theme = 'blue' }) => {
  const dispatch = useDispatch()
  const user = useSelector(userProfileDataSelector)
  console.log("user => ",user)


  useEffect(() => {
    getUserProfile()
  },[])

  const themeClasses = {
    blue: 'bg-gradient-to-r from-principal-500 to-principal-600',
    green: 'bg-gradient-to-r from-teacher-500 to-teacher-600'
  };

  const currentMessages = sampleMessages['all-teachers'] || [];


  return (
    <div className=" overflow-y-auto p-4 space-y-6 bg-gradient-to-b from-gray-25 to-gray-50">
      {currentMessages.map((message, index) => (
        <div
          key={message.id}
          className={`flex message-enter ${message.isOwn ? 'justify-end' : 'justify-start'}`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className={`flex items-start space-x-3 max-w-2xl lg:max-w-3xl ${message.isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <div className="flex-shrink-0">
              <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-sm lg:text-base font-bold shadow-medium ${
                message.isOwn ? `${themeClasses[theme]} text-white` : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600'
              }`}>
                R
              </div>
            </div>
            <div className={`${message.isOwn ? 'text-right' : 'text-left'} flex-1`}>
              <div className={`flex items-center space-x-2 mb-2 ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
                <span className="text-sm lg:text-base font-semibold text-gray-900">Sender</span>
                <span className="text-xs lg:text-sm text-gray-500 font-medium">role</span>
                <span className="text-xs lg:text-sm text-gray-400">{message.timestamp}</span>
              </div>
              <div className={`relative p-4 lg:p-5 rounded-2xl shadow-soft transition-all duration-200 hover:shadow-medium ${
                message.isOwn 
                  ? `${themeClasses[theme]} text-white` 
                  : 'bg-white border border-gray-100'
              }`}>
                <p className="text-sm lg:text-base leading-relaxed text-black">{message.message}</p>
                
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;