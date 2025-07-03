import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  allstudentDataSelector,
  allteacherDataSelector,
} from "../../store/globalSelctor";
import { getAllStudent, getAllTeacher } from "../../store/globalAction";
import { io } from "socket.io-client";
import { setSocket } from "../../store/socketSlice";

const ChatSidebar = ({
  title,
  subtitle,
  avatar,
  selectedGroup,
  onGroupSelect,
  theme = "blue",
  showMessageBar,
}) => {
  const themeClasses = {
    blue: {
      avatar: "bg-gradient-to-br from-principal-500 to-principal-600",
      button: "btn-primary",
      selected:
        "bg-gradient-to-r from-principal-50 to-principal-100 border-principal-200 shadow-soft",
      badge: "bg-gradient-to-r from-principal-500 to-principal-600",
      hover: "hover:text-principal-600",
    },
    green: {
      avatar: "bg-gradient-to-br from-teacher-500 to-teacher-600",
      button: "btn-secondary",
      selected:
        "bg-gradient-to-r from-teacher-50 to-teacher-100 border-teacher-200 shadow-soft",
      badge: "bg-gradient-to-r from-teacher-500 to-teacher-600",
      hover: "hover:text-teacher-600",
    },
  };

  const dispatch = useDispatch();
  const role = localStorage.getItem("role");
  const allteacher = useSelector(allteacherDataSelector);
  const allstudent = useSelector(allstudentDataSelector);
  const { socket } = useSelector((store) => store.socket);

  // Initialize socket connection
  useEffect(() => {
    const currentUser = role === "teacher" ? allteacher : allstudent;
    
    if (currentUser && currentUser._id) {
      const socketio = io("http://localhost:5000", {
        query: {
          userId: currentUser._id,
        },
      });
      dispatch(setSocket(socketio));

      // Cleanup on unmount
      return () => {
        socketio.close();
      };
    }
  }, [allteacher, allstudent, role, dispatch]);

  // Fetch data based on role
  useEffect(() => {
    if (role === "principle") {
      dispatch(getAllTeacher());
    } else if (role === "teacher") {
      dispatch(getAllStudent());
    }
  }, [dispatch, role]);

  const colors = themeClasses[theme];

  // Select correct data to display
  const visibleGroups = role === "teacher" ? allstudent : allteacher;

  const handleGroupClick = (group) => {
    if (onGroupSelect) {
      onGroupSelect(group);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col shadow-medium">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div
              className={`w-12 h-12 lg:w-14 lg:h-14 ${colors.avatar} rounded-2xl flex items-center justify-center shadow-medium`}
            >
              <span className="text-white font-bold text-lg lg:text-xl">
                {avatar}
              </span>
            </div>
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
                {title}
              </h2>
              <p className="text-sm lg:text-base text-gray-500">{subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Group list */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 lg:mb-6">
            Chat Groups ({visibleGroups?.length || 0})
          </h3>
          <div className="space-y-1">
            {visibleGroups?.map((group) => (
              <div
                key={group._id}
                className={`group relative p-2 lg:p-3 rounded-xl transition-all duration-200 hover-lift cursor-pointer ${
                  selectedGroup === group._id
                    ? colors.selected
                    : "hover:bg-gray-50 border-2 border-transparent"
                }`}
                onClick={() => handleGroupClick(group)}
              >
                <div className="w-full text-left">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900 text-base lg:text-lg">
                      {group.firstName} {group.lastName}
                    </span>
                    <div className="flex items-center space-x-2">
                      {group.isOnline && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                      <span className="text-xs lg:text-sm text-gray-500 font-medium">
                        {formatTime(group.updatedAt)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">
                    {group.email}
                  </p>
                  {group.lastMessage && (
                    <p className="text-sm lg:text-base text-gray-600 truncate">
                      {group.lastMessage}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;