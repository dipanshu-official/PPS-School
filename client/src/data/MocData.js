export const principalGroups = [
  {
    id: 'all-teachers',
    name: 'All Teachers',
    description: 'General communication for all teaching staff',
    lastMessage: 'Meeting scheduled for tomorrow at 2 PM',
    timestamp: '10:30 AM',
    unread: 3,
    members: 24,
    createdBy: 'Principal',
    createdAt: '2024-01-15',
    isPrivate: false,
    allowMemberInvites: true,
    messageHistory: true,
    notifications: true
  },
  {
    id: 'department-heads',
    name: 'Department Heads',
    description: 'Leadership team discussions',
    lastMessage: 'Budget review completed',
    timestamp: '9:15 AM',
    unread: 1,
    members: 8,
    createdBy: 'Principal',
    createdAt: '2024-01-10',
    isPrivate: true,
    allowMemberInvites: false,
    messageHistory: true,
    notifications: true
  },
  {
    id: 'admin-staff',
    name: 'Administrative Staff',
    description: 'Administrative coordination',
    lastMessage: 'New policy updates available',
    timestamp: 'Yesterday',
    unread: 0,
    members: 12,
    createdBy: 'Principal',
    createdAt: '2024-01-08',
    isPrivate: false,
    allowMemberInvites: true,
    messageHistory: true,
    notifications: true
  },
  {
    id: 'parent-council',
    name: 'Parent Council',
    description: 'Parent-school communication',
    lastMessage: 'Thank you for organizing the event',
    timestamp: 'Yesterday',
    unread: 2,
    members: 15,
    createdBy: 'Principal',
    createdAt: '2024-01-05',
    isPrivate: false,
    allowMemberInvites: true,
    messageHistory: true,
    notifications: true
  }
];

export const teacherGroups = [
  {
    id: 'faculty-lounge',
    name: 'Faculty Lounge',
    description: 'Casual conversations and general discussions',
    lastMessage: 'Anyone free for lunch today?',
    timestamp: '11:20 AM',
    unread: 2,
    members: 18,
    createdBy: 'Sarah Johnson',
    createdAt: '2024-01-12',
    isPrivate: false,
    allowMemberInvites: true,
    messageHistory: true,
    notifications: true
  },
  {
    id: 'math-department',
    name: 'Math Department',
    description: 'Mathematics department coordination',
    lastMessage: 'New curriculum materials arrived',
    timestamp: '10:45 AM',
    unread: 1,
    members: 6,
    createdBy: 'Michael Chen',
    createdAt: '2024-01-10',
    isPrivate: false,
    allowMemberInvites: true,
    messageHistory: true,
    notifications: true
  },
  {
    id: 'grade-5-team',
    name: 'Grade 5 Team',
    description: 'Grade 5 teaching team collaboration',
    lastMessage: 'Field trip forms are due Friday',
    timestamp: '9:30 AM',
    unread: 0,
    members: 4,
    createdBy: 'Emma Rodriguez',
    createdAt: '2024-01-08',
    isPrivate: false,
    allowMemberInvites: true,
    messageHistory: true,
    notifications: true
  },
  {
    id: 'principal-announcements',
    name: 'Principal Announcements',
    description: 'Official announcements from school administration',
    lastMessage: 'Meeting scheduled for tomorrow at 2 PM',
    timestamp: 'Yesterday',
    unread: 1,
    members: 24,
    createdBy: 'Principal',
    createdAt: '2024-01-05',
    isPrivate: false,
    allowMemberInvites: false,
    messageHistory: true,
    notifications: true
  }
];

export const allStaffMembers = [
  { id: 1, name: 'Sarah Johnson', role: 'Math Teacher', email: 'sarah.johnson@school.edu', avatar: 'SJ', status: 'online', joinedAt: '2024-01-15', department: 'Mathematics' },
  { id: 2, name: 'Michael Chen', role: 'Science Teacher', email: 'michael.chen@school.edu', avatar: 'MC', status: 'online', joinedAt: '2024-01-15', department: 'Science' },
  { id: 3, name: 'Emma Rodriguez', role: 'English Teacher', email: 'emma.rodriguez@school.edu', avatar: 'ER', status: 'away', joinedAt: '2024-01-16', department: 'English' },
  { id: 4, name: 'David Martinez', role: 'PE Teacher', email: 'david.martinez@school.edu', avatar: 'DM', status: 'offline', joinedAt: '2024-01-16', department: 'Physical Education' },
  { id: 5, name: 'Jennifer Williams', role: 'Art Teacher', email: 'jennifer.williams@school.edu', avatar: 'JW', status: 'online', joinedAt: '2024-01-17', department: 'Arts' },
  { id: 6, name: 'Lisa Thompson', role: 'English Teacher', email: 'lisa.thompson@school.edu', avatar: 'LT', status: 'online', joinedAt: '2024-01-17', department: 'English' },
  { id: 7, name: 'Robert Wilson', role: 'History Teacher', email: 'robert.wilson@school.edu', avatar: 'RW', status: 'online', joinedAt: '2024-01-18', department: 'Social Studies' },
  { id: 8, name: 'Maria Garcia', role: 'Spanish Teacher', email: 'maria.garcia@school.edu', avatar: 'MG', status: 'away', joinedAt: '2024-01-18', department: 'World Languages' },
  { id: 9, name: 'James Brown', role: 'Music Teacher', email: 'james.brown@school.edu', avatar: 'JB', status: 'online', joinedAt: '2024-01-19', department: 'Arts' },
  { id: 10, name: 'Amanda Davis', role: 'Librarian', email: 'amanda.davis@school.edu', avatar: 'AD', status: 'online', joinedAt: '2024-01-19', department: 'Library' },
  { id: 11, name: 'Kevin Lee', role: 'Computer Science Teacher', email: 'kevin.lee@school.edu', avatar: 'KL', status: 'online', joinedAt: '2024-01-20', department: 'Technology' },
  { id: 12, name: 'Rachel Green', role: 'School Counselor', email: 'rachel.green@school.edu', avatar: 'RG', status: 'away', joinedAt: '2024-01-20', department: 'Student Services' },
  { id: 13, name: 'Thomas Anderson', role: 'Vice Principal', email: 'thomas.anderson@school.edu', avatar: 'TA', status: 'online', joinedAt: '2024-01-21', department: 'Administration' },
  { id: 14, name: 'Nancy White', role: 'School Secretary', email: 'nancy.white@school.edu', avatar: 'NW', status: 'online', joinedAt: '2024-01-21', department: 'Administration' },
  { id: 15, name: 'Daniel Kim', role: 'Maintenance Supervisor', email: 'daniel.kim@school.edu', avatar: 'DK', status: 'offline', joinedAt: '2024-01-22', department: 'Facilities' }
];

export const groupMembers = [
  { id: 1, name: 'Sarah Johnson', role: 'Math Teacher', email: 'sarah.johnson@school.edu', avatar: 'SJ', status: 'online', joinedAt: '2024-01-15' },
  { id: 2, name: 'Michael Chen', role: 'Science Teacher', email: 'michael.chen@school.edu', avatar: 'MC', status: 'online', joinedAt: '2024-01-15' },
  { id: 3, name: 'Emma Rodriguez', role: 'English Teacher', email: 'emma.rodriguez@school.edu', avatar: 'ER', status: 'away', joinedAt: '2024-01-16' },
  { id: 4, name: 'David Martinez', role: 'PE Teacher', email: 'david.martinez@school.edu', avatar: 'DM', status: 'offline', joinedAt: '2024-01-16' },
  { id: 5, name: 'Jennifer Williams', role: 'Art Teacher', email: 'jennifer.williams@school.edu', avatar: 'JW', status: 'online', joinedAt: '2024-01-17' },
  { id: 6, name: 'Lisa Thompson', role: 'English Teacher', email: 'lisa.thompson@school.edu', avatar: 'LT', status: 'online', joinedAt: '2024-01-17' }
];

export const sampleMessages = {
  'all-teachers': [
    {
      id: 1,
      sender: 'Sarah Johnson',
      role: 'Math Teacher',
      message: 'Good morning everyone! Just a reminder about our faculty meeting tomorrow at 2 PM in the main conference room.',
      timestamp: '9:30 AM',
      avatar: 'SJ',
      isDelivered: true,
      isRead: true
    },
    {
      id: 2,
      sender: 'Michael Chen',
      role: 'Science Teacher',
      message: 'Will the new lab equipment be discussed during the meeting?',
      timestamp: '9:45 AM',
      avatar: 'MC',
      isDelivered: true,
      isRead: false
    },
    {
      id: 3,
      sender: 'You',
      role: 'Principal',
      message: 'Yes, the lab equipment procurement will be one of the main agenda items. Please come prepared with your requirements.',
      timestamp: '10:00 AM',
      avatar: 'P',
      isOwn: true,
      isDelivered: true,
      isRead: true
    },
    {
      id: 4,
      sender: 'Emma Rodriguez',
      role: 'English Teacher',
      message: 'Should we also discuss the upcoming parent-teacher conferences?',
      timestamp: '10:15 AM',
      avatar: 'ER',
      isDelivered: true,
      isRead: false
    }
  ],
  'faculty-lounge': [
    {
      id: 1,
      sender: 'Jennifer Williams',
      role: 'Art Teacher',
      message: 'Good morning everyone! How is everyone doing today?',
      timestamp: '9:00 AM',
      avatar: 'JW',
      isDelivered: true,
      isRead: true
    },
    {
      id: 2,
      sender: 'David Martinez',
      role: 'PE Teacher',
      message: 'Doing well! The kids are excited about the upcoming sports day.',
      timestamp: '9:15 AM',
      avatar: 'DM',
      isDelivered: true,
      isRead: true
    },
    {
      id: 3,
      sender: 'You',
      role: 'Math Teacher',
      message: 'That sounds great! I need to finish grading these test papers. Anyone free for lunch today?',
      timestamp: '11:20 AM',
      avatar: 'T',
      isOwn: true,
      isDelivered: true,
      isRead: false
    },
    {
      id: 4,
      sender: 'Lisa Thompson',
      role: 'English Teacher',
      message: 'I can join you for lunch! Let me know what time works.',
      timestamp: '11:25 AM',
      avatar: 'LT',
      isDelivered: true,
      isRead: false
    }
  ]
};