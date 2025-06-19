import { useState } from 'react';
import {useSelector} from "react-redux"
import { allstudentDataSelector } from '../../store/globalSelctor';

const ChatManagement = () => {
  const allStudent = useSelector(allstudentDataSelector)
  const [chatGroups, setChatGroups] = useState([
    {
      id: 1,
      name: 'Grade 5A Mathematics',
      description: 'Math class discussion and homework help',
      members: [
        { id: 1, name: 'Alex Thompson', grade: 'Grade 5A', avatar: 'AT' },
        { id: 2, name: 'Emma Johnson', grade: 'Grade 5A', avatar: 'EJ' },
        { id: 3, name: 'Michael Davis', grade: 'Grade 5A', avatar: 'MD' }
      ],
      lastMessage: {
        sender: 'Alex Thompson',
        message: 'Can you help me with problem 15?',
        time: '1 hour ago'
      },
      unreadCount: 2,
      createdAt: '2024-12-01'
    },
    {
      id: 2,
      name: 'Grade 6B Science Lab',
      description: 'Science experiments and lab discussions',
      members: [
        { id: 4, name: 'Sarah Wilson', grade: 'Grade 6B', avatar: 'SW' },
        { id: 5, name: 'James Brown', grade: 'Grade 6B', avatar: 'JB' },
        { id: 6, name: 'Olivia Garcia', grade: 'Grade 6B', avatar: 'OG' },
        { id: 7, name: 'William Martinez', grade: 'Grade 6B', avatar: 'WM' }
      ],
      lastMessage: {
        sender: 'Sarah Wilson',
        message: 'The volcano experiment was amazing!',
        time: '3 hours ago'
      },
      unreadCount: 0,
      createdAt: '2024-11-28'
    },
    {
      id: 3,
      name: 'Math Study Group',
      description: 'Extra help for struggling students',
      members: [
        { id: 8, name: 'Sophia Anderson', grade: 'Grade 5B', avatar: 'SA' },
        { id: 1, name: 'Alex Thompson', grade: 'Grade 5A', avatar: 'AT' }
      ],
      lastMessage: {
        sender: 'Ms. Emily Johnson',
        message: 'Great progress on your assignments!',
        time: '1 day ago'
      },
      unreadCount: 1,
      createdAt: '2024-11-25'
    }
  ]);

  const [students] = useState([
    { id: 1, name: 'Alex Thompson', grade: 'Grade 5A', avatar: 'AT' },
    { id: 2, name: 'Emma Johnson', grade: 'Grade 5A', avatar: 'EJ' },
    { id: 3, name: 'Michael Davis', grade: 'Grade 5A', avatar: 'MD' },
    { id: 4, name: 'Sarah Wilson', grade: 'Grade 6B', avatar: 'SW' },
    { id: 5, name: 'James Brown', grade: 'Grade 6B', avatar: 'JB' },
    { id: 6, name: 'Olivia Garcia', grade: 'Grade 6B', avatar: 'OG' },
    { id: 7, name: 'William Martinez', grade: 'Grade 6B', avatar: 'WM' },
    { id: 8, name: 'Sophia Anderson', grade: 'Grade 5B', avatar: 'SA' },
    { id: 9, name: 'Ethan Wilson', grade: 'Grade 5A', avatar: 'EW' },
    { id: 10, name: 'Isabella Davis', grade: 'Grade 6B', avatar: 'ID' }
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
        members: students.filter(s => newGroupData.selectedMembers.includes(s.id)),
        lastMessage: {
          sender: 'Ms. Emily Johnson',
          message: 'Welcome to the group! Feel free to ask questions.',
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

  const toggleMemberSelection = (studentId) => {
    setNewGroupData(prev => ({
      ...prev,
      selectedMembers: prev.selectedMembers.includes(studentId)
        ? prev.selectedMembers.filter(id => id !== studentId)
        : [...prev.selectedMembers, studentId]
    }));
  };

  const groupedStudents = students.reduce((acc, student) => {
    if (!acc[student.grade]) {
      acc[student.grade] = [];
    }
    acc[student.grade].push(student);
    return acc;
  }, {});

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Chat Groups</h2>
          <p className="text-gray-600">Create and manage chat groups with your students</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold flex items-center space-x-2"
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
                  className="text-green-600 hover:text-green-700 p-2 rounded-lg hover:bg-green-50 transition-colors duration-200"
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
              <p className="text-sm font-medium text-gray-700 mb-2">Students ({group.members.length})</p>
              <div className="flex -space-x-2">
                {group.members.slice(0, 4).map((member) => (
                  <div
                    key={member.id}
                    className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center border-2 border-white"
                    title={`${member.name} - ${member.grade}`}
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
                <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center">
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
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium text-sm"
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
                <h3 className="text-lg font-semibold text-gray-900">Create New Student Chat Group</h3>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter group name (e.g., Grade 5A Math Help)"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter group description"
                    rows={3}
                  />
                </div>

                {/* Select Students */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Students ({newGroupData.selectedMembers.length} selected)
                  </label>
                  <div className="border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto">
                    {Object.entries(groupedStudents).map(([grade, gradeStudents]) => (
                      <div key={grade} className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2 text-sm bg-gray-50 px-2 py-1 rounded">
                          {grade}
                        </h4>
                        <div className="space-y-2 ml-2">
                          {allStudent.map((student) => (
                            <label
                              key={student._id}
                              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={newGroupData.selectedMembers.includes(student._id)}
                                onChange={() => toggleMemberSelection(student.id)}
                                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                              />
                              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-xs">{student.avatar}</span>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{student.firstName}{student.lastName}</p>
                                {/* <p className="text-xs text-gray-600">{student.grade}</p> */}
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
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
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <p className="text-sm text-gray-600">{selectedChat.members.length} students</p>
                </div>
                <div className="flex items-center space-x-4">
                  {/* Student List */}
                  <div className="flex -space-x-2">
                    {selectedChat.members.slice(0, 5).map((member) => (
                      <div
                        key={member.id}
                        className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center border-2 border-white"
                        title={`${member.name} - ${member.grade}`}
                      >
                        <span className="text-white font-bold text-xs">{member.avatar}</span>
                      </div>
                    ))}
                    {selectedChat.members.length > 5 && (
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center border-2 border-white">
                        <span className="text-gray-600 font-bold text-xs">+{selectedChat.members.length - 5}</span>
                      </div>
                    )}
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
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
              <div className="text-center text-gray-500 py-8">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p>Chat functionality will be implemented here</p>
                <p className="text-sm">Real-time messaging with {selectedChat.name}</p>
                <div className="mt-4 text-xs text-gray-400">
                  <p>Students can ask questions about homework and assignments</p>
                  <p>Share study materials and announcements</p>
                </div>
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Type your message to students..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
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