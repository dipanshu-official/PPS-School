// store.js
import { configureStore } from '@reduxjs/toolkit';
import globalSlice from './globalSlice';

export const store = configureStore({
  reducer: {
    global: globalSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['global/setSocket'],
        ignoredPaths: ['global.socket'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// globalSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { io } from 'socket.io-client';

// Async thunks for API calls
export const fetchUserGroups = createAsyncThunk(
  'global/fetchUserGroups',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/groups/user/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch groups');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createGroup = createAsyncThunk(
  'global/createGroup',
  async (groupData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(groupData),
      });
      if (!response.ok) throw new Error('Failed to create group');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateGroup = createAsyncThunk(
  'global/updateGroup',
  async ({ groupId, updates }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update group');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteGroup = createAsyncThunk(
  'global/deleteGroup',
  async ({ groupId, userId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) throw new Error('Failed to delete group');
      return groupId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addMemberToGroup = createAsyncThunk(
  'global/addMemberToGroup',
  async ({ groupId, userId, username, addedBy }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/groups/${groupId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, username, addedBy }),
      });
      if (!response.ok) throw new Error('Failed to add member');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeMemberFromGroup = createAsyncThunk(
  'global/removeMemberFromGroup',
  async ({ groupId, userId, removedBy }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/groups/${groupId}/members/${userId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ removedBy }),
      });
      if (!response.ok) throw new Error('Failed to remove member');
      return { groupId, userId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchGroupMessages = createAsyncThunk(
  'global/fetchGroupMessages',
  async ({ groupId, page = 1, limit = 50 }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/messages/group/${groupId}?page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      const messages = await response.json();
      return { groupId, messages, page };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editMessage = createAsyncThunk(
  'global/editMessage',
  async ({ messageId, content, userId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, userId }),
      });
      if (!response.ok) throw new Error('Failed to edit message');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteMessage = createAsyncThunk(
  'global/deleteMessage',
  async ({ messageId, userId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) throw new Error('Failed to delete message');
      return messageId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  // User state
  currentUser: {
    userId: null,
    username: null,
    isAuthenticated: false,
  },
  
  // Groups state
  groups: [],
  activeGroup: null,
  groupsLoading: false,
  groupsError: null,
  
  // Messages state
  messages: {}, // { groupId: [messages] }
  messagesLoading: {},
  messagesError: {},
  
  // Socket state
  socket: null,
  isConnected: false,
  
  // UI state
  activeUsers: {},
  typingUsers: {},
  notifications: [],
  
  // Loading states
  loading: {
    createGroup: false,
    updateGroup: false,
    deleteGroup: false,
    addMember: false,
    removeMember: false,
    editMessage: false,
    deleteMessage: false,
  },
  
  // Error states
  errors: {
    groups: null,
    messages: null,
    socket: null,
  },
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    // User actions
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    
    logout: (state) => {
      state.currentUser = initialState.currentUser;
      state.groups = [];
      state.activeGroup = null;
      state.messages = {};
      if (state.socket) {
        state.socket.disconnect();
        state.socket = null;
      }
      state.isConnected = false;
    },
    
    // Socket actions
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload;
    },
    
    // Group actions
    setActiveGroup: (state, action) => {
      state.activeGroup = action.payload;
    },
    
    updateGroupInList: (state, action) => {
      const updatedGroup = action.payload;
      const index = state.groups.findIndex(g => g._id === updatedGroup._id);
      if (index !== -1) {
        state.groups[index] = updatedGroup;
      }
      if (state.activeGroup?._id === updatedGroup._id) {
        state.activeGroup = updatedGroup;
      }
    },
    
    removeGroupFromList: (state, action) => {
      const groupId = action.payload;
      state.groups = state.groups.filter(g => g._id !== groupId);
      if (state.activeGroup?._id === groupId) {
        state.activeGroup = null;
      }
      delete state.messages[groupId];
    },
    
    // Message actions
    addMessage: (state, action) => {
      const message = action.payload;
      const groupId = message.groupId;
      
      if (!state.messages[groupId]) {
        state.messages[groupId] = [];
      }
      
      state.messages[groupId].push(message);
      
      // Update group last activity
      const group = state.groups.find(g => g._id === groupId);
      if (group) {
        group.lastActivity = new Date().toISOString();
      }
    },
    
    updateMessage: (state, action) => {
      const { messageId, newContent, editedAt } = action.payload;
      
      Object.keys(state.messages).forEach(groupId => {
        const messageIndex = state.messages[groupId].findIndex(m => m._id === messageId);
        if (messageIndex !== -1) {
          state.messages[groupId][messageIndex].content = newContent;
          state.messages[groupId][messageIndex].edited = true;
          state.messages[groupId][messageIndex].editedAt = editedAt;
        }
      });
    },
    
    removeMessage: (state, action) => {
      const messageId = action.payload;
      
      Object.keys(state.messages).forEach(groupId => {
        state.messages[groupId] = state.messages[groupId].filter(m => m._id !== messageId);
      });
    },
    
    // Typing indicators
    setUserTyping: (state, action) => {
      const { groupId, userId, username } = action.payload;
      if (!state.typingUsers[groupId]) {
        state.typingUsers[groupId] = {};
      }
      state.typingUsers[groupId][userId] = username;
    },
    
    removeUserTyping: (state, action) => {
      const { groupId, userId } = action.payload;
      if (state.typingUsers[groupId]) {
        delete state.typingUsers[groupId][userId];
        if (Object.keys(state.typingUsers[groupId]).length === 0) {
          delete state.typingUsers[groupId];
        }
      }
    },
    
    // Active users
    setActiveUsers: (state, action) => {
      state.activeUsers = action.payload;
    },
    
    // Notifications
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    
    clearNotifications: (state) => {
      state.notifications = [];
    },
    
    // Error handling
    clearError: (state, action) => {
      const errorType = action.payload;
      if (state.errors[errorType]) {
        state.errors[errorType] = null;
      }
    },
    
    clearAllErrors: (state) => {
      state.errors = initialState.errors;
      state.groupsError = null;
      Object.keys(state.messagesError).forEach(key => {
        state.messagesError[key] = null;
      });
    },
  },
  
  extraReducers: (builder) => {
    // Fetch user groups
    builder
      .addCase(fetchUserGroups.pending, (state) => {
        state.groupsLoading = true;
        state.groupsError = null;
      })
      .addCase(fetchUserGroups.fulfilled, (state, action) => {
        state.groupsLoading = false;
        state.groups = action.payload;
      })
      .addCase(fetchUserGroups.rejected, (state, action) => {
        state.groupsLoading = false;
        state.groupsError = action.payload;
      })
      
      // Create group
      .addCase(createGroup.pending, (state) => {
        state.loading.createGroup = true;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.loading.createGroup = false;
        state.groups.unshift(action.payload);
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.loading.createGroup = false;
        state.errors.groups = action.payload;
      })
      
      // Update group
      .addCase(updateGroup.pending, (state) => {
        state.loading.updateGroup = true;
      })
      .addCase(updateGroup.fulfilled, (state, action) => {
        state.loading.updateGroup = false;
        const updatedGroup = action.payload;
        const index = state.groups.findIndex(g => g._id === updatedGroup._id);
        if (index !== -1) {
          state.groups[index] = updatedGroup;
        }
        if (state.activeGroup?._id === updatedGroup._id) {
          state.activeGroup = updatedGroup;
        }
      })
      .addCase(updateGroup.rejected, (state, action) => {
        state.loading.updateGroup = false;
        state.errors.groups = action.payload;
      })
      
      // Delete group
      .addCase(deleteGroup.pending, (state) => {
        state.loading.deleteGroup = true;
      })
      .addCase(deleteGroup.fulfilled, (state, action) => {
        state.loading.deleteGroup = false;
        const groupId = action.payload;
        state.groups = state.groups.filter(g => g._id !== groupId);
        if (state.activeGroup?._id === groupId) {
          state.activeGroup = null;
        }
        delete state.messages[groupId];
      })
      .addCase(deleteGroup.rejected, (state, action) => {
        state.loading.deleteGroup = false;
        state.errors.groups = action.payload;
      })
      
      // Add member
      .addCase(addMemberToGroup.pending, (state) => {
        state.loading.addMember = true;
      })
      .addCase(addMemberToGroup.fulfilled, (state, action) => {
        state.loading.addMember = false;
        const updatedGroup = action.payload;
        const index = state.groups.findIndex(g => g._id === updatedGroup._id);
        if (index !== -1) {
          state.groups[index] = updatedGroup;
        }
        if (state.activeGroup?._id === updatedGroup._id) {
          state.activeGroup = updatedGroup;
        }
      })
      .addCase(addMemberToGroup.rejected, (state, action) => {
        state.loading.addMember = false;
        state.errors.groups = action.payload;
      })
      
      // Remove member
      .addCase(removeMemberFromGroup.pending, (state) => {
        state.loading.removeMember = true;
      })
      .addCase(removeMemberFromGroup.fulfilled, (state, action) => {
        state.loading.removeMember = false;
        // Member removal is handled by socket events
      })
      .addCase(removeMemberFromGroup.rejected, (state, action) => {
        state.loading.removeMember = false;
        state.errors.groups = action.payload;
      })
      
      // Fetch messages
      .addCase(fetchGroupMessages.pending, (state, action) => {
        const groupId = action.meta.arg.groupId;
        state.messagesLoading[groupId] = true;
        state.messagesError[groupId] = null;
      })
      .addCase(fetchGroupMessages.fulfilled, (state, action) => {
        const { groupId, messages, page } = action.payload;
        state.messagesLoading[groupId] = false;
        
        if (page === 1) {
          state.messages[groupId] = messages;
        } else {
          // Prepend older messages for pagination
          state.messages[groupId] = [...messages, ...(state.messages[groupId] || [])];
        }
      })
      .addCase(fetchGroupMessages.rejected, (state, action) => {
        const groupId = action.meta.arg.groupId;
        state.messagesLoading[groupId] = false;
        state.messagesError[groupId] = action.payload;
      })
      
      // Edit message
      .addCase(editMessage.pending, (state) => {
        state.loading.editMessage = true;
      })
      .addCase(editMessage.fulfilled, (state, action) => {
        state.loading.editMessage = false;
        // Message update is handled by socket events
      })
      .addCase(editMessage.rejected, (state, action) => {
        state.loading.editMessage = false;
        state.errors.messages = action.payload;
      })
      
      // Delete message
      .addCase(deleteMessage.pending, (state) => {
        state.loading.deleteMessage = true;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.loading.deleteMessage = false;
        // Message deletion is handled by socket events
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.loading.deleteMessage = false;
        state.errors.messages = action.payload;
      });
  },
});

export const {
  setCurrentUser,
  logout,
  setSocket,
  setConnectionStatus,
  setActiveGroup,
  updateGroupInList,
  removeGroupFromList,
  addMessage,
  updateMessage,
  removeMessage,
  setUserTyping,
  removeUserTyping,
  setActiveUsers,
  addNotification,
  removeNotification,
  clearNotifications,
  clearError,
  clearAllErrors,
} = globalSlice.actions;

export default globalSlice.reducer;

// globalActions.js
import { io } from 'socket.io-client';
import {
  setSocket,
  setConnectionStatus,
  addMessage,
  updateMessage,
  removeMessage,
  setUserTyping,
  removeUserTyping,
  updateGroupInList,
  removeGroupFromList,
  addNotification,
  fetchUserGroups,
} from './globalSlice';

// Socket connection and event handling
export const connectSocket = (serverUrl = 'http://localhost:3000') => (dispatch, getState) => {
  const socket = io(serverUrl);
  dispatch(setSocket(socket));
  
  // Connection events
  socket.on('connect', () => {
    dispatch(setConnectionStatus(true));
    
    // Join user with their credentials
    const { currentUser } = getState().global;
    if (currentUser.isAuthenticated) {
      socket.emit('user_join', {
        userId: currentUser.userId,
        username: currentUser.username,
      });
    }
  });
  
  socket.on('disconnect', () => {
    dispatch(setConnectionStatus(false));
  });
  
  socket.on('user_joined', (data) => {
    if (data.success) {
      dispatch(addNotification({
        type: 'success',
        message: 'Connected to chat server',
      }));
    }
  });
  
  // Message events
  socket.on('new_message', (message) => {
    dispatch(addMessage(message));
    
    // Show notification if not in active group
    const { activeGroup, currentUser } = getState().global;
    if (activeGroup?._id !== message.groupId && message.senderId !== currentUser.userId) {
      dispatch(addNotification({
        type: 'message',
        message: `New message from ${message.senderName}`,
        groupId: message.groupId,
      }));
    }
  });
  
  socket.on('message_edited', (data) => {
    dispatch(updateMessage(data));
  });
  
  socket.on('message_deleted', (data) => {
    dispatch(removeMessage(data.messageId));
  });
  
  // Typing events
  socket.on('user_typing', (data) => {
    dispatch(setUserTyping({
      groupId: getState().global.activeGroup?._id,
      userId: data.userId,
      username: data.username,
    }));
  });
  
  socket.on('user_stopped_typing', (data) => {
    dispatch(removeUserTyping({
      groupId: getState().global.activeGroup?._id,
      userId: data.userId,
    }));
  });
  
  // Group events
  socket.on('group_created', (data) => {
    dispatch(fetchUserGroups(getState().global.currentUser.userId));
    dispatch(addNotification({
      type: 'info',
      message: 'New group created',
    }));
  });
  
  socket.on('group_updated', (data) => {
    dispatch(updateGroupInList(data.updates));
    dispatch(addNotification({
      type: 'info',
      message: 'Group updated',
    }));
  });
  
  socket.on('group_deleted', (data) => {
    dispatch(removeGroupFromList(data.groupId));
    dispatch(addNotification({
      type: 'warning',
      message: 'Group was deleted',
    }));
  });
  
  socket.on('member_added', (data) => {
    dispatch(addNotification({
      type: 'info',
      message: `${data.newMember.username} joined the group`,
    }));
  });
  
  socket.on('member_removed', (data) => {
    dispatch(addNotification({
      type: 'info',
      message: 'A member left the group',
    }));
  });
  
  // Error handling
  socket.on('error', (error) => {
    dispatch(addNotification({
      type: 'error',
      message: error.message || 'An error occurred',
    }));
  });
  
  return socket;
};

export const disconnectSocket = () => (dispatch, getState) => {
  const { socket } = getState().global;
  if (socket) {
    socket.disconnect();
    dispatch(setSocket(null));
    dispatch(setConnectionStatus(false));
  }
};

// Message actions
export const sendMessage = (messageData) => (dispatch, getState) => {
  const { socket } = getState().global;
  if (socket && socket.connected) {
    socket.emit('send_message', messageData);
  }
};

export const editMessageSocket = (messageData) => (dispatch, getState) => {
  const { socket } = getState().global;
  if (socket && socket.connected) {
    socket.emit('edit_message', messageData);
  }
};

export const deleteMessageSocket = (messageData) => (dispatch, getState) => {
  const { socket } = getState().global;
  if (socket && socket.connected) {
    socket.emit('delete_message', messageData);
  }
};

// Typing actions
export const startTyping = (groupId) => (dispatch, getState) => {
  const { socket, currentUser } = getState().global;
  if (socket && socket.connected) {
    socket.emit('typing_start', {
      groupId,
      userId: currentUser.userId,
      username: currentUser.username,
    });
  }
};

export const stopTyping = (groupId) => (dispatch, getState) => {
  const { socket, currentUser } = getState().global;
  if (socket && socket.connected) {
    socket.emit('typing_stop', {
      groupId,
      userId: currentUser.userId,
    });
  }
};

// Group room actions
export const joinGroupRoom = (groupId) => (dispatch, getState) => {
  const { socket } = getState().global;
  if (socket && socket.connected) {
    socket.emit('join_group', groupId);
  }
};

export const leaveGroupRoom = (groupId) => (dispatch, getState) => {
  const { socket } = getState().global;
  if (socket && socket.connected) {
    socket.emit('leave_group', groupId);
  }
};

// Authentication actions
export const loginUser = (userData) => (dispatch) => {
  dispatch(setCurrentUser({
    ...userData,
    isAuthenticated: true,
  }));
  
  // Connect socket after login
  dispatch(connectSocket());
  
  // Fetch user's groups
  dispatch(fetchUserGroups(userData.userId));
};

export const logoutUser = () => (dispatch) => {
  dispatch(disconnectSocket());
  dispatch(logout());
};

// globalSelectors.js
import { createSelector } from '@reduxjs/toolkit';

// Base selectors
export const selectGlobalState = (state) => state.global;
export const selectCurrentUser = (state) => state.global.currentUser;
export const selectGroups = (state) => state.global.groups;
export const selectActiveGroup = (state) => state.global.activeGroup;
export const selectSocket = (state) => state.global.socket;
export const selectIsConnected = (state) => state.global.isConnected;
export const selectMessages = (state) => state.global.messages;
export const selectTypingUsers = (state) => state.global.typingUsers;
export const selectActiveUsers = (state) => state.global.activeUsers;
export const selectNotifications = (state) => state.global.notifications;
export const selectLoading = (state) => state.global.loading;
export const selectErrors = (state) => state.global.errors;

// Memoized selectors
export const selectGroupById = createSelector(
  [selectGroups, (state, groupId) => groupId],
  (groups, groupId) => groups.find(group => group._id === groupId)
);

export const selectMessagesByGroupId = createSelector(
  [selectMessages, (state, groupId) => groupId],
  (messages, groupId) => messages[groupId] || []
);

export const selectUserGroups = createSelector(
  [selectGroups, selectCurrentUser],
  (groups, currentUser) => 
    groups.filter(group => 
      group.members.some(member => member.userId === currentUser.userId)
    )
);

export const selectGroupsWhereUserIsAdmin = createSelector(
  [selectGroups, selectCurrentUser],
  (groups, currentUser) =>
    groups.filter(group =>
      group.members.some(member => 
        member.userId === currentUser.userId && member.role === 'admin'
      )
    )
);

export const selectTypingUsersInActiveGroup = createSelector(
  [selectTypingUsers, selectActiveGroup],
  (typingUsers, activeGroup) => {
    if (!activeGroup) return {};
    return typingUsers[activeGroup._id] || {};
  }
);

export const selectUnreadNotifications = createSelector(
  [selectNotifications],
  (notifications) => notifications.filter(n => !n.read)
);

export const selectGroupMemberCount = createSelector(
  [selectActiveGroup],
  (activeGroup) => activeGroup?.members?.length || 0
);

export const selectIsUserGroupAdmin = createSelector(
  [selectActiveGroup, selectCurrentUser],
  (activeGroup, currentUser) => {
    if (!activeGroup || !currentUser.userId) return false;
    const member = activeGroup.members.find(m => m.userId === currentUser.userId);
    return member?.role === 'admin';
  }
);

export const selectGroupsLoading = createSelector(
  [selectGlobalState],
  (globalState) => globalState.groupsLoading
);

export const selectMessagesLoading = createSelector(
  [selectGlobalState, (state, groupId) => groupId],
  (globalState, groupId) => globalState.messagesLoading[groupId] || false
);

export const selectGroupsError = createSelector(
  [selectGlobalState],
  (globalState) => globalState.groupsError
);

export const selectMessagesError = createSelector(
  [selectGlobalState, (state, groupId) => groupId],
  (globalState, groupId) => globalState.messagesError[groupId] || null
);

export const selectSortedGroups = createSelector(
  [selectGroups],
  (groups) => [...groups].sort((a, b) => 
    new Date(b.lastActivity || b.updatedAt) - new Date(a.lastActivity || a.updatedAt)
  )
);

export const selectActiveGroupMessages = createSelector(
  [selectMessages, selectActiveGroup],
  (messages, activeGroup) => {
    if (!activeGroup) return [];
    return messages[activeGroup._id] || [];
  }
);

// package.json additions for frontend
{
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.5",
    "react-redux": "^8.1.2",
    "socket.io-client": "^4.7.2"
  }
}