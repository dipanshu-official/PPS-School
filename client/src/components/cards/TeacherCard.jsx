const TeacherCard = ({ teacher, onEdit, onDelete }) => {

  return (
    <div className="card-interactive p-6 animate-fade-scale">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg">
            {teacher.firstName.charAt(0)}
            {teacher.lastName.charAt(0)}
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(teacher)}
            className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-all duration-200 group"
            title="Edit Teacher"
          >
            <svg
              className="w-4 h-4 group-hover:scale-110 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={() => onDelete(teacher.id)}
            className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all duration-200 group"
            title="Delete Teacher"
          >
            <svg
              className="w-4 h-4 group-hover:scale-110 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {teacher.firstName} {teacher.lastName}
          </h3>
          <p className="text-sm font-medium text-purple-600">
            {teacher.subject}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <svg
              className="w-4 h-4 text-gray-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm text-gray-600 truncate">
              {teacher.email}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <svg
              className="w-4 h-4 text-gray-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span className="text-sm text-gray-600">••••••••</span>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-200">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            {teacher.subject}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TeacherCard;
