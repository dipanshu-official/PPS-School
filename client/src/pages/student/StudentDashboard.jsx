import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Overview from './Overview';

const StudentDashboard = () => {
  const [currentView, setCurrentView] = useState('overview');

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'assignments', label: 'Assignments', icon: '📝' },
    { id: 'grades', label: 'Grades', icon: '📊' },
    { id: 'schedule', label: 'Schedule', icon: '📅' },
    { id: 'resources', label: 'Resources', icon: '📚' },
    { id: 'profile', label: 'Profile', icon: '👤' }
  ];

  const userInfo = {
    name: 'Alex Thompson',
    role: 'Grade 8 • Student ID: STU001',
    avatar: 'AT',
    color: 'from-blue-500 to-cyan-600'
  };

  const renderContent = () => {
    switch (currentView) {
      case 'overview':
        return <Overview onNavigate={setCurrentView} />;
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
      title="Student Portal"
      userInfo={userInfo}
      navigationItems={navigationItems}
      currentView={currentView}
      onNavigate={setCurrentView}
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default StudentDashboard;