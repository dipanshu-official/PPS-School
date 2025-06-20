import React from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, groupName }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Group">
      <div className="mb-6">
        <p className="text-gray-600">
          Are you sure you want to delete the group "{groupName}"? This action cannot be undone.
        </p>
      </div>
      
      <div className="flex items-center justify-end space-x-3">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete Group
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;