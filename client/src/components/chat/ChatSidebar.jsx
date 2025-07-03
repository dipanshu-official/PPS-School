import React, { useEffect } from "react";
import Button from "../common/Button";
import { useSelector, useDispatch } from "react-redux";
import {
  allstudentDataSelector,
  allteacherDataSelector,
} from "../../store/globalSelctor";
import { getAllStudent, getAllTeacher } from "../../store/globalAction";
import { useState } from "react";
import { io } from "socket.io-client";
import { setSocket } from "../../store/socketSlice";

const ChatSidebar = ({
  title,
  subtitle,
  avatar,
  selectedGroup,
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

  useEffect(() => {
    if (allteacher) {
      const socketio = io("http://localhost:5000", {
        query: {
          userId: allteacher._id,
        },
      });
      dispatch(setSocket(socketio));
    } else {
      if (socket) {
        socket.close();
        dispatch(setSocket(null));
      }
    }
  }, []);

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

  return (
    <div className="w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col shadow-medium">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        {/* Avatar & Title */}
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
            Chat Groups ({visibleGroups.length})
          </h3>
          <div className="space-y-1">
            {visibleGroups.map((group) => (
              <div
               
                key={group._id}
                className={`group relative p-2 lg:p-2 rounded-xl transition-all duration-200 hover-lift ${
                  selectedGroup === group._id
                    ? `${colors.selected} border-2 bg-blue-500`
                    : "hover:bg-gray-50 border-2 border-transparent "
                }`}
              >
                <button className="w-full text-left">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900 text-base lg:text-lg">
                      {group.firstName}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs lg:text-sm text-gray-500 font-medium">
                        {group.email}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm lg:text-base text-gray-600 truncate mb-2">
                    {group.lastMessage}
                  </p>
                  <p className="text-xs lg:text-sm text-gray-400 font-medium">
                    {group.updatedAt}
                  </p>
                </button>

                
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
