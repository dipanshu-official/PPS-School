import React, { useEffect, useState } from "react";
import Avatar from "../common/Avatar";
import Button from "../common/Button";
import Modal from "../common/Modal";
import Input from "../common/Input";
import { useDispatch, useSelector } from "react-redux";
import { allteacherDataSelector } from "../../store/globalSelctor";
import { getAllTeacher } from "../../store/globalAction";

const MembersSettings = ({
  members,
  canModify,
  onAddMember,
  onRemoveMember,
  theme = "blue",
  availableMembers = [],
  groupId,
}) => {
  const teacherList = useSelector(allteacherDataSelector);
  const dispatch =useDispatch()

  useEffect(() => {
    dispatch(getAllTeacher) 
  })

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedNewMembers, setSelectedNewMembers] = useState([]);
  const [addSearchTerm, setAddSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800 border border-green-300";
      case "away":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "offline":
        return "bg-gray-100 text-gray-800 border border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  const themeClasses = {
    blue: {
      button: "btn-primary",
      checkbox: "text-principal-600 focus-ring-blue",
      badge:
        "bg-gradient-to-r from-principal-100 to-principal-200 text-principal-800 border border-principal-300",
      selected:
        "bg-gradient-to-r from-principal-50 to-principal-100 border-principal-200",
    },
    green: {
      button: "btn-secondary",
      checkbox: "text-teacher-600 focus-ring-green",
      badge:
        "bg-gradient-to-r from-teacher-100 to-teacher-200 text-teacher-800 border border-teacher-300",
      selected:
        "bg-gradient-to-r from-teacher-50 to-teacher-100 border-teacher-200",
    },
  };

  const colors = themeClasses[theme];

  // Filter current members based on search
  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter available members (exclude current members)
  const currentMemberIds = members.map((m) => m.id);
  const availableToAdd = availableMembers.filter(
    (member) =>
      !currentMemberIds.includes(member.id) &&
      (member.name.toLowerCase().includes(addSearchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(addSearchTerm.toLowerCase()) ||
        member.department.toLowerCase().includes(addSearchTerm.toLowerCase()))
  );

  const handleMemberToggle = (member) => {
    const isSelected = selectedNewMembers.some((m) => m.id === member.id);
    if (isSelected) {
      setSelectedNewMembers((prev) => prev.filter((m) => m.id !== member.id));
    } else {
      setSelectedNewMembers((prev) => [...prev, member]);
    }
  };

  const handleAddMembers = () => {
    if (selectedNewMembers.length > 0) {
      onAddMember(selectedNewMembers, groupId);
      setSelectedNewMembers([]);
      setAddSearchTerm("");
      setShowAddModal(false);
    }
  };

  const handleDeleteMember = (member) => {
    setMemberToDelete(member);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteMember = () => {
    if (memberToDelete) {
      onRemoveMember(memberToDelete.id, groupId);
      setMemberToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  const cancelDelete = () => {
    setMemberToDelete(null);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-xl lg:text-2xl font-semibold text-gray-900">
          Group Members ({members.length})
        </h3>
        {canModify && (
          <Button
            onClick={() => setShowAddModal(true)}
            className={`${colors.button} px-6 py-3 hover-lift`}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Members
          </Button>
        )}
      </div>

      <div className="card">
        {/* Search Bar */}
        <div className="p-4 lg:p-6 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus-ring-blue text-base"
            />
          </div>
        </div>

        {/* Members List */}
        <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
          {filteredMembers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <svg
                className="w-12 h-12 mx-auto mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <div className="text-lg font-medium">
                {searchTerm
                  ? "No members found matching your search."
                  : "No members in this group."}
              </div>
            </div>
          ) : (
            teacherList.map((member) => (
              <div
                key={member.id}
                className="p-4 lg:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <Avatar name={member.firstName} status={member.status} size="lg" />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 text-lg truncate">
                          {member.name}
                        </div>
                        <div className="text-sm text-gray-600 truncate">
                          {member.role}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">
                          {member.email && (
                            <span className="block sm:inline truncate">
                              {member.email}
                            </span>
                          )}
                          {member.joinedAt && (
                            <span className="block sm:inline sm:ml-2">
                              Joined {member.joinedAt}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 flex-shrink-0">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(
                            member.status
                          )}`}
                        >
                          {member.status}
                        </span>
                        {canModify && (
                          <button
                            onClick={() => handleDeleteMember(member)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                            title="Remove Member"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Members Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedNewMembers([]);
          setAddSearchTerm("");
        }}
        title="Add Members to Group"
        size="xl"
      >
        <div className="space-y-6">
          {/* Selected Members Preview */}
          {selectedNewMembers.length > 0 && (
            <div className="card p-4 lg:p-6">
              <div className="text-sm font-semibold text-gray-700 mb-4">
                Selected Members ({selectedNewMembers.length}):
              </div>
              <div className="flex flex-wrap gap-3">
                {selectedNewMembers.map((member) => (
                  <span
                    key={member.id}
                    className={`inline-flex items-center px-3 py-2 rounded-xl text-sm font-medium ${colors.badge} shadow-soft hover-lift`}
                  >
                    <Avatar name={member.name} size="sm" className="mr-2" />
                    {member.name}
                    <button
                      type="button"
                      onClick={() => handleMemberToggle(member)}
                      className="ml-2 text-current hover:text-gray-600 transition-colors duration-200"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Search Available Members */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="h-6 w-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search available members by name, role, or department..."
              value={addSearchTerm}
              onChange={(e) => setAddSearchTerm(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus-ring-blue text-base"
            />
          </div>

          {/* Available Members List */}
          <div className="card max-h-80 overflow-y-auto">
            {availableToAdd.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <svg
                  className="w-12 h-12 mx-auto mb-4 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <div className="text-lg font-medium">
                  {addSearchTerm
                    ? "No available members found matching your search."
                    : "All available members are already in this group."}
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {availableToAdd.map((member) => {
                  const isSelected = selectedNewMembers.some(
                    (m) => m.id === member.id
                  );
                  return (
                    <div
                      key={member.id}
                      className={`p-4 lg:p-6 hover:bg-gray-50 transition-all duration-200 ${
                        isSelected ? colors.selected : ""
                      }`}
                    >
                      <label className="flex items-center space-x-4 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleMemberToggle(member)}
                          className={`w-5 h-5 ${colors.checkbox} border-2 border-gray-300 rounded`}
                        />
                        <Avatar
                          name={member.name}
                          status={member.status}
                          size="md"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-gray-900 text-lg">
                                hello
                              </div>
                              <div className="text-sm text-gray-600">
                                {member.role}
                              </div>
                              <div className="text-xs text-gray-500 font-medium">
                                {member.department}
                              </div>
                            </div>
                            <span
                              className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(
                                member.status
                              )}`}
                            >
                              {member.status}
                            </span>
                          </div>
                        </div>
                      </label>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              variant="ghost"
              onClick={() => {
                setShowAddModal(false);
                setSelectedNewMembers([]);
                setAddSearchTerm("");
              }}
              className="px-6 py-3 text-base"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddMembers}
              disabled={selectedNewMembers.length === 0}
              className={`${colors.button} px-8 py-3 text-base font-semibold hover-lift disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Add {selectedNewMembers.length} Member
              {selectedNewMembers.length !== 1 ? "s" : ""}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={cancelDelete}
        title="Remove Member"
        size="md"
      >
        <div className="space-y-6">
          <div className="flex items-center space-x-4 p-4 bg-red-50 rounded-xl border border-red-200">
            <div className="flex-shrink-0">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-red-900">
                Remove Member
              </h4>
              <p className="text-red-700">
                Are you sure you want to remove{" "}
                <strong>{memberToDelete?.name}</strong> from this group? They
                will no longer have access to group messages and discussions.
              </p>
            </div>
          </div>

          {memberToDelete && (
            <div className="card p-4">
              <div className="flex items-center space-x-4">
                <Avatar
                  name={memberToDelete.name}
                  status={memberToDelete.status}
                  size="md"
                />
                <div>
                  <div className="font-semibold text-gray-900">
                    {memberToDelete.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {memberToDelete.role}
                  </div>
                  <div className="text-xs text-gray-500">
                    {memberToDelete.email}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              variant="ghost"
              onClick={cancelDelete}
              className="px-6 py-3 text-base"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDeleteMember}
              className="px-8 py-3 text-base font-semibold hover-lift"
            >
              Remove Member
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MembersSettings;
