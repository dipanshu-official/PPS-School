import { useSelector } from "react-redux";
import { allteacherDataSelector } from "../../store/globalSelctor";


const Overview = ({ onNavigate }) => {
    const allTeacher = useSelector(allteacherDataSelector);
  
  const classStats = [
    { title: 'My Classes', value: '4', change: '0', icon: '📚' },
    { title: 'Total Students', value: '156', change: '+2', icon: '👥' },
    { title: 'Assignments Due', value: '12', change: '-3', icon: '📝' },
    { title: 'Attendance Rate', value: '94%', change: '+2%', icon: '✅' }
  ];

  const myClasses = [
    { grade: 'Grade 5A', subject: 'Mathematics', students: 32, time: '9:00 AM - 10:00 AM' },
    { grade: 'Grade 5B', subject: 'Mathematics', students: 30, time: '10:15 AM - 11:15 AM' },
    { grade: 'Grade 6A', subject: 'Science', students: 28, time: '1:00 PM - 2:00 PM' },
    { grade: 'Grade 6B', subject: 'Science', students: 26, time: '2:15 PM - 3:15 PM' }
  ];

  const recentActivities = [
    { time: '1 hour ago', activity: 'Graded Math test for Grade 5A - Average: 87%', type: 'grading' },
    { time: '3 hours ago', activity: 'Uploaded new Science assignment for Grade 6', type: 'assignment' },
    { time: '5 hours ago', activity: 'Parent meeting scheduled with John Smith\'s parents', type: 'meeting' },
    { time: '1 day ago', activity: 'Submitted attendance for all classes', type: 'attendance' },
    { time: '2 days ago', activity: 'Created lesson plan for next week', type: 'planning' }
  ];

  const upcomingTasks = [
    { task: 'Grade Science projects', due: 'Today, 5:00 PM', priority: 'high' },
    { task: 'Prepare Math quiz questions', due: 'Tomorrow, 9:00 AM', priority: 'medium' },
    { task: 'Parent-teacher conference prep', due: 'Dec 20, 2:00 PM', priority: 'medium' },
    { task: 'Submit monthly progress reports', due: 'Dec 25, 11:59 PM', priority: 'low' }
  ];

  const quickActions = [
    { id: 'assignments', icon: '📝', label: 'Create Assignment', description: 'Add new assignments for students' },
    { id: 'attendance', icon: '✅', label: 'Take Attendance', description: 'Mark student attendance' },
    { id: 'grades', icon: '📊', label: 'Grade Assignments', description: 'Review and grade submissions' },
    { id: 'chat', icon: '💬', label: 'Student Chat Groups', description: 'Create and manage student chat groups' },
    { id: 'students', icon: '👥', label: 'Manage Students', description: 'View and manage student records' }
  ];

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Good morning, Ms. Johnson!</h2>
        <p className="text-gray-600">You have 4 classes scheduled today. Here's your overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {classStats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
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
        {/* My Classes */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Classes</h3>
            <div className="space-y-4">
              {myClasses.map((classItem, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 font-semibold text-sm">{classItem.grade}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{classItem.subject}</h4>
                      <p className="text-sm text-gray-600">{classItem.students} students • {classItem.time}</p>
                    </div>
                  </div>
                  <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                    View Class
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'grading' ? 'bg-blue-500' :
                    activity.type === 'assignment' ? 'bg-green-500' :
                    activity.type === 'meeting' ? 'bg-purple-500' :
                    activity.type === 'attendance' ? 'bg-orange-500' :
                    'bg-gray-500'
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
          {/* Upcoming Tasks */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Tasks</h3>
            <div className="space-y-3">
              {upcomingTasks.map((task, index) => (
                <div key={index} className="p-3 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{task.task}</p>
                      <p className="text-xs text-gray-500 mt-1">{task.due}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.priority === 'high' ? 'bg-red-100 text-red-800' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority}
                    </span>
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
                  className="w-full text-left p-3 rounded-lg hover:bg-green-50 transition-colors duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-green-600 text-xl">{action.icon}</span>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900 block">{action.label}</span>
                      <span className="text-xs text-gray-500">{action.description}</span>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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