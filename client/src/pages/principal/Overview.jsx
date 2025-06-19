import { useSelector } from "react-redux";
import { allstudentDataSelector, allteacherDataSelector } from "../../store/globalSelctor";

const Overview = ({ onNavigate }) => {
  const allTeacher = useSelector(allteacherDataSelector)
  const allStudent = useSelector(allstudentDataSelector)
  const studentLength = allStudent.length
  const teacherlength = allTeacher.length
  const stats = [
    { title: 'Total Students', value:studentLength, change: '+12', icon: '👥' },
    { title: 'Total Teachers', value: teacherlength, change: '+3', icon: '👨‍🏫' },
    { title: 'Total Classes', value: '45', change: '0', icon: '🏫' },
    { title: 'Monthly Revenue', value: '$125,000', change: '+8%', icon: '💰' }
  ];

  const recentActivities = [
    { time: '2 hours ago', activity: 'New teacher Sarah Johnson joined Grade 5', type: 'staff' },
    { time: '4 hours ago', activity: 'Monthly fee collection completed - 98% collected', type: 'finance' },
    { time: '6 hours ago', activity: 'Parent-teacher meeting scheduled for Grade 8', type: 'event' },
    { time: '1 day ago', activity: 'New student admission approved for Grade 3', type: 'admission' },
    { time: '2 days ago', activity: 'Annual sports day event planning completed', type: 'event' }
  ];

  const upcomingEvents = [
    { date: 'Dec 15', event: 'Board Meeting', time: '10:00 AM' },
    { date: 'Dec 18', event: 'Annual Sports Day', time: '9:00 AM' },
    { date: 'Dec 20', event: 'Parent-Teacher Conference', time: '2:00 PM' },
    { date: 'Dec 22', event: 'Winter Break Begins', time: 'All Day' }
  ];

  const quickActions = [
    { id: 'reports', icon: '📊', label: 'View Reports', description: 'Check school performance metrics' },
    { id: 'teachers', icon: '👥', label: 'Manage Teachers', description: 'Add, edit, or remove teachers' },
    { id: 'chat', icon: '💬', label: 'Chat Groups', description: 'Create and manage teacher chat groups' },
    { id: 'schedule', icon: '📅', label: 'Schedule Meeting', description: 'Plan meetings and events' },
    { id: 'announcements', icon: '📢', label: 'Send Announcement', description: 'Communicate with school community' }
  ];

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, Dr. Wilson!</h2>
        <p className="text-gray-600">Here's what's happening at Plasma Pathways School today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{length}</p>
                <p className="text-sm text-green-600 mt-1">
                  {stat.change !== '0' && (stat.change.startsWith('+') ? '↗' : '↘')} {stat.change}
                </p>
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'staff' ? 'bg-blue-500' :
                    activity.type === 'finance' ? 'bg-green-500' :
                    activity.type === 'event' ? 'bg-purple-500' :
                    'bg-orange-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.activity}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className="text-center">
                    <div className="text-sm font-semibold text-purple-600">{event.date}</div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{event.event}</p>
                    <p className="text-xs text-gray-500">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => onNavigate(action.id)}
                  className="w-full text-left p-3 rounded-lg hover:bg-purple-50 transition-colors duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-purple-600 text-xl">{action.icon}</span>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900 block">{action.label}</span>
                      <span className="text-xs text-gray-500">{action.description}</span>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Overview;