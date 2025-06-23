import React, { useState } from 'react';
import ChatSidebar from './chat/ChatSidebar';
import ChatHeader from './chat/ChatHeader';
import MessageList from './chat/MessageList';
import MessageInput from './chat/MessageInput';
import GroupFormModal from './modals/GroupFormModal';
import DeleteConfirmModal from './modals/DeleteConfirmModal';
import SettingsSidebar from './settings/SettingsSidebar';
import GeneralSettings from './settings/GenralSetting';
import MembersSettings from './settings/MembersSetting';
import PrivacySettings from './settings/PravacySetting';
import NotificationSettings from './settings/NotificationSetting';
import { useGroupManagement } from '../hooks/useGroupManagement';
import { useModal } from '../hooks/useModal';
import { teacherGroups, groupMembers, sampleMessages, allStaffMembers } from '../data/MocData';

const TeacherChat = () => {
  console.log(teacherGroups)
  const [newMessage, setNewMessage] = useState('');
  const [showGroupSettings, setShowGroupSettings] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState('general');
  const [newGroupForm, setNewGroupForm] = useState({ name: '', description: '', members: [] });
  const [groupMembersData, setGroupMembersData] = useState(groupMembers);

  const { groups, selectedGroup, setSelectedGroup, createGroup, updateGroup, deleteGroup, getGroupById } = useGroupManagement(teacherGroups);
  
  const createModal = useModal();
  const editModal = useModal();
  const deleteModal = useModal();

  const currentGroup = getGroupById(selectedGroup);
  const currentMessages = sampleMessages[selectedGroup] || [];

  // Filter available members to exclude admin staff for teachers
  const availableMembers = allStaffMembers.filter(member => 
    member.department !== 'Administration' && member.department !== 'Facilities'
  );

  const handleCreateGroup = () => {
    if (newGroupForm.name.trim() && newGroupForm.description.trim()) {
      const newGroup = createGroup({
        name: newGroupForm.name,
        description: newGroupForm.description,
        createdBy: 'You',
        members: newGroupForm.members.length + 1 // +1 for the creator
      });
      setNewGroupForm({ name: '', description: '', members: [] });
      createModal.closeModal();
      setSelectedGroup(newGroup.id);
    }
  };

  const handleEditGroup = () => {
    if (editModal.data && newGroupForm.name.trim() && newGroupForm.description.trim()) {
      updateGroup(editModal.data.id, {
        name: newGroupForm.name,
        description: newGroupForm.description
      });
      setNewGroupForm({ name: '', description: '', members: [] });
      editModal.closeModal();
    }
  };

  const handleDeleteGroup = () => {
    if (deleteModal.data) {
      deleteGroup(deleteModal.data.id);
      deleteModal.closeModal();
    }
  };

  const openEditModal = (group) => {
    setNewGroupForm({
      name: group.name,
      description: group.description,
      members: []
    });
    editModal.openModal(group);
  };

  const handleGroupSettingsUpdate = (field, value) => {
    updateGroup(selectedGroup, { [field]: value });
  };

  const handleAddMember = (newMembers, groupId) => {
    // Add new members to the group members list
    const membersWithJoinDate = newMembers.map(member => ({
      ...member,
      joinedAt: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    }));
    
    setGroupMembersData(prev => [...prev, ...membersWithJoinDate]);
    
    // Update group member count
    const currentGroup = getGroupById(groupId);
    if (currentGroup) {
      updateGroup(groupId, { 
        members: currentGroup.members + newMembers.length 
      });
    }
    
    console.log(`Added ${newMembers.length} members to group ${groupId}:`, newMembers);
  };

  const handleRemoveMember = (memberId, groupId) => {
    // Remove member from the group members list
    setGroupMembersData(prev => prev.filter(member => member.id !== memberId));
    
    // Update group member count
    const currentGroup = getGroupById(groupId);
    if (currentGroup && currentGroup.members > 1) {
      updateGroup(groupId, { 
        members: currentGroup.members - 1 
      });
    }
    
    console.log(`Removed member ${memberId} from group ${groupId}`);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const canModifyGroup = (group) => {
    return group.createdBy === 'You' || group.id !== 'principal-announcements';
  };

  if (showGroupSettings && currentGroup) {
    return (
      <div className="flex h-screen bg-gray-50">
        <SettingsSidebar
          activeTab={activeSettingsTab}
          onTabChange={setActiveSettingsTab}
          onBackToChat={() => setShowGroupSettings(false)}
          groupName={currentGroup.name}
          theme="green"
        />

        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            {activeSettingsTab === 'general' && (
              <GeneralSettings
                group={currentGroup}
                onUpdate={handleGroupSettingsUpdate}
                canModify={canModifyGroup(currentGroup)}
                theme="green"
              />
            )}

            {activeSettingsTab === 'members' && (
              <MembersSettings
                members={groupMembersData}
                canModify={canModifyGroup(currentGroup)}
                onAddMember={handleAddMember}
                onRemoveMember={handleRemoveMember}
                availableMembers={availableMembers}
                groupId={selectedGroup}
                theme="green"
              />
            )}

            {activeSettingsTab === 'privacy' && (
              <PrivacySettings
                group={currentGroup}
                onUpdate={handleGroupSettingsUpdate}
                canModify={canModifyGroup(currentGroup)}
                theme="green"
              />
            )}

            {activeSettingsTab === 'notifications' && (
              <NotificationSettings
                group={currentGroup}
                onUpdate={handleGroupSettingsUpdate}
                theme="green"
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <ChatSidebar
        title="Teacher Portal"
        subtitle="Connect with colleagues"
        avatar="T"
        groups={groups}
        selectedGroup={selectedGroup}
        onGroupSelect={setSelectedGroup}
        onCreateGroup={createModal.openModal}
        onEditGroup={openEditModal}
        onDeleteGroup={deleteModal.openModal}
        canModifyGroup={canModifyGroup}
        theme="green"
      />

      <div className="flex-1 flex flex-col">
       

        <MessageList messages={currentMessages} theme="green" />

        <MessageInput
          message={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onSend={handleSendMessage}
          onKeyPress={handleKeyPress}
          theme="green"
        />
      </div>

      <GroupFormModal
        isOpen={createModal.isOpen}
        onClose={createModal.closeModal}
        onSubmit={handleCreateGroup}
        formData={newGroupForm}
        setFormData={setNewGroupForm}
        title="Create New Group"
        submitText="Create Group"
        availableMembers={availableMembers}
        theme="green"
      />

      <GroupFormModal
        isOpen={editModal.isOpen}
        onClose={editModal.closeModal}
        onSubmit={handleEditGroup}
        formData={newGroupForm}
        setFormData={setNewGroupForm}
        title="Edit Group"
        submitText="Update Group"
        availableMembers={availableMembers}
        theme="green"
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={handleDeleteGroup}
        groupName={deleteModal.data?.name}
      />
    </div>
  );
};

export default TeacherChat;