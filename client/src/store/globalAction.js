import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

// Utility for setting auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return `Bearer ${token}`;
};

//  student api section
export const addStudent = createAsyncThunk(
  "student/addStudent",
  async (studentData, { rejectWithValue }) => {
    console.log("student add call");
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        phone,
        role,
        dateOfBirth,
        parentName,
        address,
      } = studentData;

      const response = await axiosInstance.post(
        "/addstudent",
        {
          email,
          password,
          firstName,
          lastName,
          phone,
          role,
          dateOfBirth,
          parentName,
          address,
        },
        {
          headers: getAuthHeaders(),
        }
      );

      return response.data;
    } catch (error) {
      console.log("err =>", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to add student";
      return rejectWithValue(errorMessage);
    }
  }
);

export const loginStudent = createAsyncThunk(
  "student/loginStudent",
  async (loginData, { rejectWithValue }) => {
    try {
      const { email, password, role } = loginData;
      console.log(email , password , role)

      const response = await axiosInstance.post("/loginstudent", {
        email,
        password,
        role,
      });

      // Store token in localStorage if provided
      if (response.data.data.token) {
        localStorage.setItem("authToken", response.data.data.token);
        localStorage.setItem("role",role)
      }

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getAllStudent = createAsyncThunk(
  "getAllStudent/allstudent",
  async (_, { rejectWithValue }) => {
    try {
      console.log("getAllStudent called")
      const response = await axiosInstance.get("/allstudent", {
        headers: {
          Authorization: getAuthHeaders(),
        },
      });
      console.log("getAuthHeaders =>", getAuthHeaders());
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch teachers"
      );
    }
  }
);

export const deleteStudent = createAsyncThunk(
  "deleteStudent/deletestudent",
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/deletestudent/${studentId}`,
        {
          headers: {
            Authorization: getAuthHeaders(),
          },
        }
      );
      console.log("getAuthHeaders =>", getAuthHeaders());
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete"
      );
    }
  }
);

// Teacher api section
export const addTeacher = createAsyncThunk(
  "teacher/register",
  async (teacherData, { rejectWithValue }) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        phone,
        department,
        subjects,
        address,
       
      } = teacherData;

      const response = await axiosInstance.post(
        "/register",
        {
          firstName,
          lastName,
          email,
          password,
          phone,
          department,
          subjects,
          address,
          
        },
        {
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.log("err =>", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to add student";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getAllTeacher = createAsyncThunk(
  "teacher/teachers",
  async (_, { rejectWithValue }) => {
    try {
      console.log("getAuthHeaders =>", getAuthHeaders());
      const response = await axiosInstance.get("/teachers", {
        headers: {
          Authorization: getAuthHeaders(),
        },
      });
      return response.data;
    } catch (error) {
      console.trace(error)
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch teachers"
      );
    }
  }
);

export const loginTeacher = createAsyncThunk(
  "student/login",
  async (loginData, { rejectWithValue }) => {
    try {
      const { email, password, role } = loginData;
      console.log('loginTeacher =>', email, password, role )

      const response = await axiosInstance.post("/login", {
        email,
        password,
        role,
      });

      // Store token in localStorage if provided
      if (response.data.data.token) {
        localStorage.setItem("authToken", response.data.data.token);
        localStorage.setItem("role",role)

      }

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      return rejectWithValue(errorMessage);
    }
  }
);

// principal api section
export const loginPrinciple = createAsyncThunk(
  "loginPrinciple/login-principle",
  async (principleData, { rejectWithValue }) => {
    try {
      const { email, password, role } = principleData;
      console.log("loginPrincipal =>",email, password, role )

      const response = await axiosInstance.post("/login-principle", {
        email,
        password,
        role,
      });

      if (response.data.data.token) {
        localStorage.setItem("authToken", response.data.data.token);
        localStorage.setItem("role" ,role)
      }

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      return rejectWithValue(errorMessage);
    }
  }
);

//create chatgroup message section

export const getUserProfile = createAsyncThunk(
  "getUserProfile/teachers",
  async (_, { rejectWithValue }) => {
    try {
      
      const response = await axiosInstance.get("/user/profile", {
        headers: {
          Authorization: getAuthHeaders(),
        },
      });
      return response.data;
    } catch (error) {
      console.trace(error)
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch teachers"
      );
    }
  }
);


