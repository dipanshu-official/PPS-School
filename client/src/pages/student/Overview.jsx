const Overview = ({ onNavigate }) => {
  const studentStats = [
    { title: 'Current Grade', value: 'Grade 8', change: '', icon: '🎓' },
    { title: 'Overall Average', value: '87%', change: '+3%', icon: '📊' },
    { title: 'Assignments Due', value: '5', change: '-2', icon: '📝' },
    { title: 'Attendance Rate', value: '96%', change: '+1%', icon: '✅' }
  ];

  const todaySchedule = [
    { time: '8:00 AM', subject: 'Mathematics', teacher: 'Ms. Johnson', room: 'Room 201' },
    { time: '9:15 AM', subject: 'English Literature', teacher: 'Mr. Davis', room: 'Room 105' },
    { time: '10:30 AM', subject: 'Science', teacher: 'Dr. Smith', room: 'Lab 1' },
    { time: '11:45 AM', subject: 'History', teacher: 'Ms. Wilson', room: 'Room 301' },
    { time: '1:00 PM', subject: 'Physical Education', teacher: 'Coach Brown', room: 'Gymnasium' },
    { time: '2:15 PM', subject: 'Art', teacher: 'Ms. Garcia', room: 'Art Studio' }
  ];

  const recentGrades = [
    { subject: 'Mathematics', assignment: 'Chapter 5 Test', grade: 'A-', score: '92%', date: 'Dec 10' },
    { subject: 'Science', assignment: 'Lab Report #3', grade: 'B+', score: '88%', date: 'Dec 8' },
    { subject: 'English', assignment: 'Essay: Climate Change', grade: 'A', score: '95%', date: 'Dec 5' },
    { subject: 'History', assignment: 'World War II Project', grade: 'A-', score: '91%', date: 'Dec 3' }
  ];

  const upcomingAssignments = [
    { subject: 'Mathematics', assignment: 'Algebra Worksheet', due: 'Today, 11:59 PM', priority: 'high' },
    { subject: 'Science', assignment: 'Physics Lab Report', due: 'Tomorrow, 9:00 AM', priority: 'high' },
    { subject: 'English', assignment: 'Book Review: To Kill a Mockingbird', due: 'Dec 18, 11:59 PM', priority: 'medium' },
    { subject: 'History', assignment: 'Research Paper: Industrial Revolution', due: 'Dec 22, 11:59 PM', priority: 'low' }
  ];

  const announcements = [
    { title: 'Winter Break Schedule', content: 'Winter break starts December 22nd. Classes resume January 8th.', date: '2 hours ago' },
    { title: 'Sports Day Registration', content: 'Register for Annual Sports Day events by December 15th.', date: '1 day ago' },
    { title: 'Library Hours Extended', content: 'Library will be open until 7 PM during exam week.', date: '3 days ago' }
  ];

  const quickActions = [
    { id: 'assignments', icon: '📚', label: 'View All Assignments', description: 'Check upcoming and past assignments' },
    { id: 'grades', icon: '📊', label: 'Check Grades', description: 'View your academic performance' },
    { id: 'schedule', icon: '📅', label: 'View Calendar', description: 'See your class schedule and events' },
    { id: 'messages', icon: '💬', label: 'Message Teachers', description: 'Contact your teachers directly' }
  ];

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, Alex!</h2>
        <p className="text-gray-600">You have 6 classes today and 5 assignments due this week.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {studentStats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                {stat.change && (
                  <p className="text-sm text-green-600 mt-1">
                    {stat.change.startsWith('+') ? '↗' : '↘'} {stat.change}
                  </p>
                )}
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Schedule */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
            <div className="space-y-3">
              {todaySchedule.map((class_, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-sm font-semibold text-blue-600">{class_.time}</div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{class_.subject}</h4>
                      <p className="text-sm text-gray-600">{class_.teacher} • {class_.room}</p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    Join Class
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Grades */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Grades</h3>
            <div className="space-y-3">
              {recentGrades.map((grade, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{grade.assignment}</h4>
                    <p className="text-sm text-gray-600">{grade.subject} • {grade.date}</p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      grade.grade.startsWith('A') ? 'bg-green-100 text-green-800' :
                      grade.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                      grade.grade.startsWith('C') ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {grade.grade}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{grade.score}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Assignments */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Assignments</h3>
            <div className="space-y-3">
              {upcomingAssignments.map((assignment, index) => (
                <div key={index} className="p-3 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">{assignment.assignment}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      assignment.priority === 'high' ? 'bg-red-100 text-red-800' :
                      assignment.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {assignment.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{assignment.subject}</p>
                  <p className="text-xs text-gray-500 mt-1">Due: {assignment.due}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Announcements</h3>
            <div className="space-y-4">
              {announcements.map((announcement, index) => (
                <div key={index} className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <h4 className="font-medium text-gray-900 text-sm mb-1">{announcement.title}</h4>
                  <p className="text-xs text-gray-600 mb-2">{announcement.content}</p>
                  <p className="text-xs text-gray-500">{announcement.date}</p>
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
                  className="w-full text-left p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-blue-600 text-xl">{action.icon}</span>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900 block">{action.label}</span>
                      <span className="text-xs text-gray-500">{action.description}</span>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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