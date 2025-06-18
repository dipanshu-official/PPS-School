import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Overview from './Overview';
import TeacherManagement from './TeacherManagement';
import ChatManagement from './ChatManagement';

const PrincipalDashboard = () => {
  const [currentView, setCurrentView] = useState('overview');

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'teachers', label: 'Teachers', icon: '👥' },
    { id: 'students', label: 'Students', icon: '🎓' },
    { id: 'classes', label: 'Classes', icon: '🏫' },
    { id: 'chat', label: 'Chat Groups', icon: '💬' },
    { id: 'reports', label: 'Reports', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  const userInfo = {
    name: 'Dr. Sarah Wilson',
    role: 'Principal',
    avatar: 'SW',
    color: 'from-purple-500 to-indigo-600'
  };

  const renderContent = () => {
    switch (currentView) {
      case 'overview':
        return <Overview onNavigate={setCurrentView} />;
      case 'teachers':
        return <TeacherManagement />;
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
      title="Principal Dashboard"
      userInfo={userInfo}
      navigationItems={navigationItems}
      currentView={currentView}
      onNavigate={setCurrentView}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default PrincipalDashboard;