import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginPrinciple,
  loginStudent,
  loginTeacher,
} from "../store/globalAction";
import { useNavigate, Navigate } from "react-router-dom";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const roles = [
    {
      id: "principal",
      title: "Principal",
      description: "Administrative access to all school operations",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
      color: "from-purple-500 to-indigo-600",
    },
    {
      id: "teacher",
      title: "Teacher",
      description: "Access to class management and student records",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253z"
          />
        </svg>
      ),
      color: "from-green-500 to-teal-600",
    },
    {
      id: "student",
      title: "Student",
      description: "Access to assignments, grades, and school resources",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 14l9-5-9-5-9 5 9 5z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
          />
        </svg>
      ),
      color: "from-blue-500 to-cyan-600",
    },
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const loginData = {
        email: formData.email,
        password: formData.password,
        role: selectedRole,
      };

      let response;

      switch (selectedRole) {
        case "principal":
          response = await dispatch(loginPrinciple(loginData)).unwrap();
          navigate("/principal");
          toast.success("Login successful as Principal");
          break;
        case "teacher":
          response = await dispatch(loginTeacher(loginData)).unwrap();
          navigate("/teacher");
          toast.success("Login successful as Teacher");
          break;
        case "student":
          response = await dispatch(loginStudent(loginData)).unwrap();
          navigate("/student");
          toast.success("Login successful as Student");
          break;
        default:
          throw new Error("Invalid role selected");
      }
    } catch (error) {
      console.error("Login failed:", error);
      const errMsg =
        error?.response?.data?.message || error?.message || "Login failed";
      toast.error(errMsg);
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="login"
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10"
    >
      <div className="container-responsive">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">PP</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">
                Plasma Pathways School
              </h1>
            </div>
          </div>
          <h2 className="heading-responsive font-bold text-gray-900 mb-4">
            Welcome Back
          </h2>
          <p className="text-responsive text-gray-600">
            Please select your role and sign in to access your account
          </p>
        </div>

        <div className="glass-card overflow-hidden animate-fade-scale animation-delay-300">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Role Selection */}
            <div className="bg-gray-50/50 p-6 sm:p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Select Your Role
              </h3>
              <div className="space-y-4">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className={`p-4 sm:p-6 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                      selectedRole === role.id
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    } ${isLoading ? "pointer-events-none opacity-50" : ""}`}
                  >
                    <div className="flex items-start space-x-4">
                      <div
                        className={`p-3 rounded-lg bg-gradient-to-r ${role.color} text-white shadow-lg`}
                      >
                        {role.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">
                          {role.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {role.description}
                        </p>
                      </div>
                      {selectedRole === role.id && (
                        <div className="text-blue-500">
                          <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Login Form */}
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Sign In</h3>
                <button
                  disabled={isLoading}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {!selectedRole ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400"
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
                  </div>
                  <p className="text-gray-500">
                    Please select your role to continue
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-slide-up">
                      {error}
                    </div>
                  )}

                  {/* Email field */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="input-field disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  {/* Password field */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className="input-field pr-12 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {showPassword ? (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember me and Forgot password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        disabled={isLoading}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        Remember me
                      </span>
                    </label>
                    <a
                      href="#"
                      className={`text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200 ${
                        isLoading ? "pointer-events-none opacity-50" : ""
                      }`}
                    >
                      Forgot password?
                    </a>
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <span>
                        Sign In as{" "}
                        {selectedRole.charAt(0).toUpperCase() +
                          selectedRole.slice(1)}
                      </span>
                    )}
                  </button>

                  {/* Additional links */}
                  <div className="text-center pt-4">
                    <p className="text-sm text-gray-600">
                      Need help?{" "}
                      <a
                        href="#contact"
                        className={`text-blue-600 hover:text-blue-700 transition-colors duration-200 ${
                          isLoading ? "pointer-events-none opacity-50" : ""
                        }`}
                      >
                        Contact Support
                      </a>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8 animate-fade-scale animation-delay-300">
          <button
          onClick={() => {
            navigate('/')
          }}
            disabled={isLoading}
            className="text-blue-600 hover:text-blue-700 transition-colors duration-200 font-medium flex items-center space-x-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
