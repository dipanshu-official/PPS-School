import { useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PrincipalDashboard from "./pages/principal/PrincipalDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import PrivateRoute from "./pages/PrivateRoute";
import { Toaster } from "react-hot-toast";
import { io } from "socket.io-client";

const App = () => {
  return (
    <>
      <Toaster position="top-center" />
      <Router>
        <Routes>
          <Route path="*" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/principal" element={<PrincipalDashboard />} />
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/student" element={<StudentDashboard />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
