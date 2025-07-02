import React, { useState } from "react";
import ChatSidebar from "../../components/chat/ChatSidebar";
import ChatHeader from "../../components/chat/ChatHeader";
import MessageList from "../../components/chat/MessageList";
import MessageInput from "../../components/chat/MessageInput";
import DeleteConfirmModal from "../../components/modals/DeleteConfirmModal";
import { useModal } from "../../hooks/useModal";
import { sendMessageFn } from "../../utils/utils";
import GroupFormModal from "../../components/modals/GroupFormModal";

const PrincipalChat = () => {
  const [newMessage, setNewMessage] = useState("");

  const [newGroupForm, setNewGroupForm] = useState({
    name: "",
    description: "",
    members: [],
  });
  
  const [selectedChat, setSelectedChat] = useState(false);
 

  const createModal = useModal();
  const editModal = useModal();
  const deleteModal = useModal();

  const openEditModal = (group) => {
    setNewGroupForm({
      name: group.name,
      description: group.description,
      members: [],
    });
    editModal.openModal(group);
  };

  const handleSendMessage = () => {
    sendMessageFn(newMessage);
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

  return (
    <div className="flex h-screen bg-gray-50">
      <ChatSidebar
        title="Principal Dashboard"
        subtitle="Manage school communications"
        avatar="P"
        onCreateGroup={createModal.openModal}
        onEditGroup={openEditModal}
        onDeleteGroup={deleteModal.openModal}
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
        title="Create New Group"
        submitText="Create Group"
        theme="blue"
      />

      <GroupFormModal
        isOpen={editModal.isOpen}
        onClose={editModal.closeModal}
        formData={newGroupForm}
        setFormData={setNewGroupForm}
        title="Edit Group"
        submitText="Update Group"
        theme="blue"
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        groupName={deleteModal.data?.name}
      />
    </div>
  );
};

export default PrincipalChat;
