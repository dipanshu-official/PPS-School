import { useState } from 'react';
import  {useSelector} from "react-redux"
import { allteacherDataSelector } from '../../store/globalSelctor';

const ChatManagement = () => {
 
  const allTeacher = useSelector(allteacherDataSelector)

  const [chatGroups, setChatGroups] = useState([
    {
      id: 1,
      name: 'Mathematics Department',
      description: 'Discussion group for math teachers',
      members: [
        { id: 1, name: 'Emily Johnson', subject: 'Mathematics', avatar: 'EJ' },
        { id: 4, name: 'David Wilson', subject: 'Advanced Mathematics', avatar: 'DW' }
      ],
      lastMessage: {
        sender: 'Emily Johnson',
        message: 'The new curriculum guidelines look great!',
        time: '2 hours ago'
      },
      unreadCount: 3,
      createdAt: '2024-12-01'
    },
    {
      id: 2,
      name: 'Science Faculty',
      description: 'Science department coordination',
      members: [
        { id: 3, name: 'Sarah Smith', subject: 'Science', avatar: 'SS' },
        { id: 7, name: 'Dr. Michael Chen', subject: 'Physics', avatar: 'MC' }
      ],
      lastMessage: {
        sender: 'Sarah Smith',
        message: 'Lab equipment order has been approved',
        time: '5 hours ago'
      },
      unreadCount: 1,
      createdAt: '2024-11-28'
    },
    {
      id: 3,
      name: 'Grade 5 Team',
      description: 'Grade 5 teachers collaboration',
      members: [
        { id: 1, name: 'Emily Johnson', subject: 'Mathematics', avatar: 'EJ' },
        { id: 2, name: 'Michael Davis', subject: 'English Literature', avatar: 'MD' },
        { id: 5, name: 'Lisa Garcia', subject: 'Art', avatar: 'LG' }
      ],
      lastMessage: {
        sender: 'Michael Davis',
        message: 'Parent-teacher meeting schedule is ready',
        time: '1 day ago'
      },
      unreadCount: 0,
      createdAt: '2024-11-25'
    }
  ]);

  const [teachers] = useState([
    { id: 1, name: 'Emily Johnson', subject: 'Mathematics', avatar: 'EJ' },
    { id: 2, name: 'Michael Davis', subject: 'English Literature', avatar: 'MD' },
    { id: 3, name: 'Sarah Smith', subject: 'Science', avatar: 'SS' },
    { id: 4, name: 'David Wilson', subject: 'History', avatar: 'DW' },
    { id: 5, name: 'Lisa Garcia', subject: 'Art', avatar: 'LG' },
    { id: 6, name: 'Robert Brown', subject: 'Physical Education', avatar: 'RB' },
    { id: 7, name: 'Dr. Michael Chen', subject: 'Physics', avatar: 'MC' },
    { id: 8, name: 'Jennifer Lee', subject: 'Chemistry', avatar: 'JL' }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newGroupData, setNewGroupData] = useState({
    name: '',
    description: '',
    selectedMembers: []
  });

  const handleCreateGroup = () => {
    if (newGroupData.name && newGroupData.selectedMembers.length > 0) {
      const newGroup = {
        id: Math.max(...chatGroups.map(g => g.id)) + 1,
        name: newGroupData.name,
        description: newGroupData.description,
        members: teachers.filter(t => newGroupData.selectedMembers.includes(t.id)),
        lastMessage: {
          sender: 'Dr. Sarah Wilson',
          message: 'Welcome to the group!',
          time: 'Just now'
        },
        unreadCount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setChatGroups([newGroup, ...chatGroups]);
      setShowCreateModal(false);
      setNewGroupData({ name: '', description: '', selectedMembers: [] });
    }
  };

  const handleDeleteGroup = (groupId) => {
    if (window.confirm('Are you sure you want to delete this chat group?')) {
      setChatGroups(chatGroups.filter(group => group.id !== groupId));
    }
  };

  const toggleMemberSelection = (teacherId) => {
    setNewGroupData(prev => ({
      ...prev,
      selectedMembers: prev.selectedMembers.includes(teacherId)
        ? prev.selectedMembers.filter(id => id !== teacherId)
        : [...prev.selectedMembers, teacherId]
    }));
  };

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Chat Management</h2>
          <p className="text-gray-600">Create and manage chat groups with teachers</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 font-semibold flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Create Chat Group</span>
        </button>
      </div>

      {/* Chat Groups Grid */}
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {chatGroups.map((group) => (
          <div key={group.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            {/* Group Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                  {group.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {group.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{group.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedChat(group)}
                  className="text-purple-600 hover:text-purple-700 p-2 rounded-lg hover:bg-purple-50 transition-colors duration-200"
                  title="Open Chat"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteGroup(group.id)}
                  className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                  title="Delete Group"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Members */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Members ({group.members.length})</p>
              <div className="flex -space-x-2">
                {group.members.slice(0, 4).map((member) => (
                  <div
                    key={member.id}
                    className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center border-2 border-white"
                    title={member.name}
                  >
                    <span className="text-white font-bold text-xs">{member.avatar}</span>
                  </div>
                ))}
                {group.members.length > 4 && (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center border-2 border-white">
                    <span className="text-gray-600 font-bold text-xs">+{group.members.length - 4}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Last Message */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">
                    {group.lastMessage.sender.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{group.lastMessage.sender}</p>
                  <p className="text-sm text-gray-600 truncate">{group.lastMessage.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{group.lastMessage.time}</p>
                </div>
              </div>
            </div>

            {/* Group Actions */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => setSelectedChat(group)}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium text-sm"
              >
                Open Chat
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Create New Chat Group</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Group Name */}
                <div>
                  <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-2">
                    Group Name
                  </label>
                  <input
                    type="text"
                    id="groupName"
                    value={newGroupData.name}
                    onChange={(e) => setNewGroupData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter group name"
                    required
                  />
                </div>

                {/* Group Description */}
                <div>
                  <label htmlFor="groupDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    id="groupDescription"
                    value={newGroupData.description}
                    onChange={(e) => setNewGroupData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter group description"
                    rows={3}
                  />
                </div>

                {/* Select Teachers */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Teachers ({newGroupData.selectedMembers.length} selected)
                  </label>
                  <div className="border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto">
                    <div className="space-y-2">
                      {allTeacher.map((teacher) => (
                        <label
                          key={teacher._id}
                          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={newGroupData.selectedMembers.includes(teacher._id)}
                            onChange={() => toggleMemberSelection(teacher._id)}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xs">{teacher.avatar}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{teacher.firstName}</p>
                            {/* <p className="text-xs text-gray-600">{teacher.subject}</p> */}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateGroup}
                    disabled={!newGroupData.name || newGroupData.selectedMembers.length === 0}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Group
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Window Modal */}
      {selectedChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 h-[80vh] flex flex-col">
            {/* Chat Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedChat.name}</h3>
                  <p className="text-sm text-gray-600">{selectedChat.members.length} members</p>
                </div>
                <button
                  onClick={() => setSelectedChat(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
              <div className="text-center text-gray-500 py-8">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p>Chat functionality will be implemented here</p>
                <p className="text-sm">Real-time messaging with {selectedChat.name}</p>
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatManagement;