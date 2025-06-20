import { useState } from 'react';

export const useGroupManagement = (initialGroups = []) => {
  const [groups, setGroups] = useState(initialGroups);
  const [selectedGroup, setSelectedGroup] = useState(initialGroups[0]?.id || '');

  const createGroup = (groupData) => {
    const newGroup = {
      id: `group-${Date.now()}`,
      ...groupData,
      lastMessage: 'Group created',
      timestamp: 'Just now',
      unread: 0,
      members: 1,
      createdAt: new Date().toISOString().split('T')[0],
      isPrivate: false,
      allowMemberInvites: true,
      messageHistory: true,
      notifications: true
    };
    
    setGroups(prev => [...prev, newGroup]);
    return newGroup;
  };

  const updateGroup = (groupId, updates) => {
    setGroups(prev => prev.map(group => 
      group.id === groupId ? { ...group, ...updates } : group
    ));
  };

  const deleteGroup = (groupId) => {
    setGroups(prev => prev.filter(group => group.id !== groupId));
    if (selectedGroup === groupId && groups.length > 1) {
      const remainingGroups = groups.filter(g => g.id !== groupId);
      setSelectedGroup(remainingGroups[0]?.id || '');
    }
  };

  const getGroupById = (groupId) => {
    return groups.find(group => group.id === groupId);
  };

  return {
    groups,
    selectedGroup,
    setSelectedGroup,
    createGroup,
    updateGroup,
    deleteGroup,
    getGroupById
  };
};