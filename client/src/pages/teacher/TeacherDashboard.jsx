import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Overview from './Overview';
import StudentManagement from './StudentManagement';
import ChatManagement from './ChatManagement';

const TeacherDashboard = () => {
  const [currentView, setCurrentView] = useState('overview');

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'students', label: 'Students', icon: '👥' },
    { id: 'classes', label: 'Classes', icon: '📚' },
    { id: 'chat', label: 'Chat Groups', icon: '💬' },
    { id: 'assignments', label: 'Assignments', icon: '📝' },
    { id: 'grades', label: 'Grades', icon: '📊' },
    { id: 'attendance', label: 'Attendance', icon: '✅' }
  ];

  const userInfo = {
    name: 'Ms. Emily Johnson',
    role: 'Mathematics & Science Teacher',
    avatar: 'EJ',
    color: 'from-green-500 to-teal-600'
  };

  const renderContent = () => {
    switch (currentView) {
      case 'overview':
        return <Overview onNavigate={setCurrentView} />;
      case 'students':
        return <StudentManagement />;
      case 'chat':
        return <ChatManagement />;
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {navigationItems.find(item => item.id === currentView)?.label}
            </h2>
            <p className="text-gray-600">This section is under development.</p>
          </div>
        );
    }
  };

  return (
    <DashboardLayout
      title="Teacher Dashboard"
      userInfo={userInfo}
      navigationItems={navigationItems}
      currentView={currentView}
      onNavigate={setCurrentView}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default TeacherDashboard;