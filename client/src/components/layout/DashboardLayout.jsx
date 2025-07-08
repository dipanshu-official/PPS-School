import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useState, useEffect, useRef } from "react";
import {
  currentStudentDataSelector,
  userProfileDataSelector,
} from "../../store/globalSelctor";
import { getCurrentStudent, getUserProfile } from "../../store/globalAction";
import { io } from "socket.io-client";
import { sendMessageFn, socket } from "../../utils/utils";

const DashboardLayout = ({
  title,
  userInfo,
  navigationItems,
  currentView,
  onNavigate,
  children,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userProfile = useSelector(userProfileDataSelector);
  const currentStudent = useSelector(currentStudentDataSelector);
  const [user, setUser] = useState(null);
  const socketRef = useRef(null);
  const {studentId} = useParams()

  // Fetch user profile
  useEffect(() => {
    if (studentId) {
      dispatch(getUserProfile());
      dispatch(getCurrentStudent(studentId));
    }
  }, [dispatch]);

  // Update user state when userProfile changes
  useEffect(() => {
    if (userProfile && userProfile._id) {
      setUser(userProfile);
    }
  }, [userProfile]);

  // Initialize socket only after user is set
  useEffect(() => {
    if (user && user._id) {
      socketRef.current = socket;
      console.log("register");
      socket.emit("register", user._id);

      socket.on("receive_message", (data) => {
        console.log("Message from", data.senderId, ":", data.content);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user, socket]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.clear();
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const getColorClasses = (color) => {
    const colorMap = {
      "from-purple-500 to-indigo-600": {
        bg: "bg-purple-500",
        text: "text-purple-600",
        border: "border-purple-500",
        hover: "hover:bg-purple-50",
      },
      "from-green-500 to-teal-600": {
        bg: "bg-green-500",
        text: "text-green-600",
        border: "border-green-500",
        hover: "hover:bg-green-50",
      },
      "from-blue-500 to-cyan-600": {
        bg: "bg-blue-500",
        text: "text-blue-600",
        border: "border-blue-500",
        hover: "hover:bg-blue-50",
      },
    };
    return colorMap[color] || colorMap["from-blue-500 to-cyan-600"];
  };

  const colors = getColorClasses(userInfo.color);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container-responsive">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div
                className={`w-10 h-10 bg-gradient-to-br ${userInfo.color} rounded-lg flex items-center justify-center shadow-lg`}
              >
                <span className="text-white font-bold text-lg">PP</span>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                  {title}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  Plasma Pathways School
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {userInfo.name}
                </p>
                <p className="text-xs text-gray-600">{userInfo.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
              >
                <span className="hidden sm:inline">Logout</span>
                <svg
                  className="w-4 h-4 sm:hidden"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4-4H7a2 2 0 00-2 2v6a2 2 0 002 2h10m-5-6l4 4"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b overflow-x-auto">
        <div className="container-responsive">
          <div className="flex space-x-4 sm:space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 transition-all duration-200 ${
                  currentView === item.id
                    ? `${colors.border} ${colors.text}`
                    : `border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300`
                }`}
              >
                <span className="text-base sm:text-lg">{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container-responsive py-4">
        <div className="animate-fade-in">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
