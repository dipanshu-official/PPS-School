import {
  addStudent,
  loginStudent,
  loginTeacher,
  loginPrinciple,
  getAllTeacher,
  getAllStudent,
  deleteStudent,
  deleteTeacher,
  getUserProfile,
  getCurrentStudent,
} from "./globalAction";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userprofile: [],
  studentData: null,
  currentstudent: [],
  delstudent: [],
  delteacher: [],
  loading: false,
  teacherData: null,
  allTeacher: [],
  allStudent: [],
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    // Synchronous actions
    clearError: (state) => {
      state.error = null;
    },
    showLoader: (state) => {
      state.loading = true;
    },
    hideLoader: (state) => {
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginStudent.fulfilled, (state, action) => {
      state.studentData = action.payload.data.student;
    });
    builder.addCase(getAllStudent.fulfilled, (state, action) => {
      state.allStudent = action.payload.data;
    });
    builder.addCase(getCurrentStudent.fulfilled, (state, action) => {
      state.currentstudent = action.payload;
    });
    builder.addCase(deleteStudent.fulfilled, (state, action) => {
      const deletedId = action.payload.id;
      state.delstudent = state.delstudent.filter(
        (student) => student._id !== deletedId
      );
    });
    builder.addCase(deleteTeacher.fulfilled, (state, action) => {
      const deletedId = action.payload.id;
      state.delteacher = state.delteacher.filter(
        (teacher) => teacher._id !== deletedId
      );
    });
    builder.addCase(loginTeacher.fulfilled, (state, action) => {
      state.teacherData = action.payload;
    });

    builder.addCase(loginPrinciple.fulfilled, (state, action) => {
      state.principleData = action.payload;
    });
    builder.addCase(getAllTeacher.fulfilled, (state, action) => {
      state.allTeacher = action.payload.data;
    });

    // chat section
    builder.addCase(getUserProfile.fulfilled, (state, action) => {
      state.userprofile = action.payload.data;
    });
  },
});

export const { clearError, showLoader, hideLoader } =
  globalSlice.actions;

export default globalSlice.reducer;
