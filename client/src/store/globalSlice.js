import { addStudent, loginStudent ,loginTeacher , loginPrinciple } from "./globalAction";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addingStudent: false,
  studentData: null,
  currentUser: null,
  teacherData: null,
  principleData:null
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    // Synchronous actions
    clearError: (state) => {
      state.error = null;
    },
    clearStudents: (state) => {
      state.students = [];
    },
    setCurrentUser: (state, action) => {
      state.teacherData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginStudent.fulfilled, (state, action) => {
      state.studentData = action.payload.data.student;
    });
    builder.addCase(loginTeacher.fulfilled, (state, action) => {
      state.teacherData = action.payload;
    });
    builder.addCase(loginPrinciple.fulfilled, (state, action) => {
      state.principleData = action.payload;
    });
  },
});

export const { clearError, clearStudents, setCurrentUser } =
  globalSlice.actions;

export default globalSlice.reducer;
