import React, { useState } from "react";
import ChatSidebar from "./chat/ChatSidebar";
import ChatHeader from "./chat/ChatHeader";
import MessageList from "./chat/MessageList";
import MessageInput from "./chat/MessageInput";
import DeleteConfirmModal from "./modals/DeleteConfirmModal";
import { useModal } from "../hooks/useModal";

const TeacherChat = () => {
  const [newMessage, setNewMessage] = useState("");

  const [newGroupForm, setNewGroupForm] = useState({
    name: "",
    description: "",
    members: [],
  });

  

  const createModal = useModal();
  const editModal = useModal();
  const deleteModal = useModal();




  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <ChatSidebar
        title="Teacher Portal"
        subtitle="Connect with colleagues"
        avatar="T"
        
        theme="green"
      />

      <div className="flex-1 flex flex-col">
        <MessageList  theme="green" />

        <MessageInput
          message={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onSend={handleSendMessage}
          theme="green"
        />
      </div>


      

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        groupName={deleteModal.data?.name}
      />
    </div>
  );
};

export default TeacherChat;
