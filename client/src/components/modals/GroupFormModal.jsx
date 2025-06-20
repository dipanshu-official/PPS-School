import React, { useEffect, useState } from "react";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";
import Avatar from "../common/Avatar";
import { useDispatch, useSelector } from "react-redux";
import { allteacherDataSelector } from "../../store/globalSelctor";
import { getAllTeacher } from "../../store/globalAction";

const GroupFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  title,
  submitText = "Create Group",
  availableMembers = [],
  theme = "blue",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMembers, setSelectedMembers] = useState(
    formData.members || []
  );
  const dispatch = useDispatch();
  const allTeacher = useSelector(allteacherDataSelector);
  console.log("allTeacher =>", allTeacher);
 
  useEffect(() => {
    dispatch(getAllTeacher())
  },[])

  const themeClasses = {
    blue: {
      checkbox: "text-principal-600 focus-ring-blue",
      badge:
        "bg-gradient-to-r from-principal-100 to-principal-200 text-principal-800 border border-principal-300",
      button: "btn-primary",
      selected:
        "bg-gradient-to-r from-principal-50 to-principal-100 border-principal-200",
    },
    green: {
      checkbox: "text-teacher-600 focus-ring-green",
      badge:
        "bg-gradient-to-r from-teacher-100 to-teacher-200 text-teacher-800 border border-teacher-300",
      button: "btn-secondary",
      selected:
        "bg-gradient-to-r from-teacher-50 to-teacher-100 border-teacher-200",
    },
  };

  const colors = themeClasses[theme];

  const filteredMembers = availableMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMemberToggle = (member) => {
    const isSelected = selectedMembers.some((m) => m.id === member.id);
    let newSelectedMembers;

    if (isSelected) {
      newSelectedMembers = selectedMembers.filter((m) => m.id !== member.id);
    } else {
      newSelectedMembers = [...selectedMembers, member];
    }

    setSelectedMembers(newSelectedMembers);
    setFormData({ ...formData, members: newSelectedMembers });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const handleClose = () => {
    setSearchTerm("");
    setSelectedMembers([]);
    onClose();
  };

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

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} size="xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Group Info */}
        <div className="space-y-6">
          <Input
            label="Group Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter group name"
            required
            className="text-lg"
          />

          <Input
            label="Description"
            type="textarea"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Enter group description"
            required
            rows={4}
          />
        </div>

        {/* Member Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-lg font-semibold text-gray-900">
              Add Members ({allTeacher.length} selected)
            </label>
            {allTeacher.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSelectedMembers([]);
                  setFormData({ ...formData, members: [] });
                }}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Selected Members Preview */}
          {allTeacher.length > 0 && (
            <div className="card p-4 lg:p-6">
              <div className="text-sm font-semibold text-gray-700 mb-4">
                Selected Members:
              </div>
              <div className="flex flex-wrap gap-3">
                {allTeacher.map((member) => (
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

          {/* Member Search */}
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
              placeholder="Search members by name, role, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus-ring-blue text-base"
            />
          </div>

          {/* Members List */}
          <div className="card max-h-80 overflow-y-auto">
            {allTeacher.length === 0 ? (
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
                    : "No members available."}
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {allTeacher.map((member) => {
                  const isSelected = selectedMembers.some(
                    (m) => m._id === member._id
                  );
                  return (
                    <div
                      key={member._id}
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
                               {member.firstName} {member.lastName}
                              </div>
                              <div className="text-sm text-gray-600">
                                {member.email}
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
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            className="px-6 py-3 text-base"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className={`${colors.button} px-8 py-3 text-base font-semibold hover-lift`}
          >
            {submitText}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default GroupFormModal;
