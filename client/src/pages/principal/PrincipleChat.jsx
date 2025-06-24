import React, { useState } from "react";
import ChatSidebar from "../../components/chat/ChatSidebar";
import ChatHeader from "../../components/chat/ChatHeader";
import MessageList from "../../components/chat/MessageList";
import MessageInput from "../../components/chat/MessageInput";
import GroupFormModal from "../../components/modals/GroupFormModal";
import DeleteConfirmModal from "../../components/modals/DeleteConfirmModal";
import SettingsSidebar from "../../components/settings/SettingsSidebar";
import GeneralSettings from "../../components/settings/GenralSetting";
import MembersSettings from "../../components/settings/MembersSetting";
import PrivacySettings from "../../components/settings/PravacySetting";
import NotificationSettings from "../../components/settings/NotificationSetting";
import { useGroupManagement } from "../../hooks/useGroupManagement";
import { useModal } from "../../hooks/useModal";
import {
  principalGroups,
  groupMembers,
  sampleMessages,
  allStaffMembers,
} from "../../data/MocData";
import { sendMessageFn } from "../../utils/utils";

const PrincipalChat = () => {
  const [newMessage, setNewMessage] = useState("");
  const [showGroupSettings, setShowGroupSettings] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState("general");
  const [newGroupForm, setNewGroupForm] = useState({
    name: "",
    description: "",
    members: [],
  });
  const [groupMembersData, setGroupMembersData] = useState(groupMembers);
  const [selectedChat, setSelectedChat] = useState(false);
  const {
    groups,
    selectedGroup,
    setSelectedGroup,
    createGroup,
    updateGroup,
    deleteGroup,
    getGroupById,
  } = useGroupManagement(principalGroups);

  const createModal = useModal();
  const editModal = useModal();
  const deleteModal = useModal();

  const currentGroup = getGroupById(selectedGroup);
  const currentMessages = sampleMessages[selectedGroup] || [];

  const handleCreateGroup = () => {
    if (newGroupForm.name.trim() && newGroupForm.description.trim()) {
      const newGroup = createGroup({
        name: newGroupForm.name,
        description: newGroupForm.description,
        createdBy: "Principal",
        members: newGroupForm, // +1 for the creator
      });
      setNewGroupForm({ name: "", description: "", members: [] });
      createModal.closeModal();
      setSelectedGroup(newGroup.id);
    }
  };

  const handleEditGroup = () => {
    if (
      editModal.data &&
      newGroupForm.name.trim() &&
      newGroupForm.description.trim()
    ) {
      updateGroup(editModal.data.id, {
        name: newGroupForm.name,
        description: newGroupForm.description,
      });
      setNewGroupForm({ name: "", description: "", members: [] });
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
      members: [],
    });
    editModal.openModal(group);
  };

  const handleGroupSettingsUpdate = (field, value) => {
    updateGroup(selectedGroup, { [field]: value });
  };

  const handleAddMember = (newMembers, groupId) => {
    // Add new members to the group members list
    const membersWithJoinDate = newMembers.map((member) => ({
      ...member,
      joinedAt: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    }));

    setGroupMembersData((prev) => [...prev, ...membersWithJoinDate]);

    // Update group member count
    const currentGroup = getGroupById(groupId);
    if (currentGroup) {
      updateGroup(groupId, {
        members: currentGroup.members + newMembers.length,
      });
    }

    console.log(
      `Added ${newMembers.length} members to group ${groupId}:`,
      newMembers
    );
  };

  const handleRemoveMember = (memberId, groupId) => {
    // Remove member from the group members list
    setGroupMembersData((prev) =>
      prev.filter((member) => member.id !== memberId)
    );

    // Update group member count
    const currentGroup = getGroupById(groupId);
    if (currentGroup && currentGroup.members > 1) {
      updateGroup(groupId, {
        members: currentGroup.members - 1,
      });
    }

    console.log(`Removed member ${memberId} from group ${groupId}`);
  };

  const handleSendMessage = () => {
    sendMessageFn(newMessage)
    if (newMessage.trim()) {
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const canModifyGroup = (group) => {
    return group.createdBy === "Principal";
  };

 

  return (
    <div className="flex h-screen bg-gray-50">
      <ChatSidebar
        title="Principal Dashboard"
        subtitle="Manage school communications"
        avatar="P"
        groups={groups}
        selectedGroup={selectedGroup}
        onGroupSelect={setSelectedGroup}
        onCreateGroup={createModal.openModal}
        onEditGroup={openEditModal}
        onDeleteGroup={deleteModal.openModal}
        canModifyGroup={canModifyGroup}
        theme="blue"
        showMessageBar={setSelectedChat}
      />

      <div className="flex-1 flex flex-col">
        {selectedChat && (
          <>
            <MessageList messages={currentMessages} theme="blue" /> ,
            <MessageInput
              message={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onSend={handleSendMessage}
              onKeyPress={handleKeyPress}
              theme="blue"
            />
          </>
        )}
      </div>

      <GroupFormModal
        isOpen={createModal.isOpen}
        onClose={createModal.closeModal}
        onSubmit={handleCreateGroup}
        formData={newGroupForm}
        setFormData={setNewGroupForm}
        title="Create New Group"
        submitText="Create Group"
        availableMembers={allStaffMembers}
        theme="blue"
      />

      <GroupFormModal
        isOpen={editModal.isOpen}
        onClose={editModal.closeModal}
        onSubmit={handleEditGroup}
        formData={newGroupForm}
        setFormData={setNewGroupForm}
        title="Edit Group"
        submitText="Update Group"
        availableMembers={allStaffMembers}
        theme="blue"
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

export default PrincipalChat;
