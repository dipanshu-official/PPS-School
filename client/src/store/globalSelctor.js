import { createSelector } from "@reduxjs/toolkit";

// Input selector
const globlState = (state) => state.global;

// Memoized selector
export const studentDataSelector = createSelector(
  [globlState],
  (state) => state.studentData
);
export const allstudentDataSelector = createSelector(
  [globlState],
  (state) => state.allStudent
);
export const deleteStudentDataSelector = createSelector(
  [globlState],
  (state) => state.delstudent
);
export const teacherDataSelector = createSelector(
  [globlState],
  (state) => state.teacherData
);

export const allteacherDataSelector = createSelector(
  [globlState],
  (state) => state.allTeacher
);

export const userProfileDataSelector = createSelector(
  [globlState],
  (state) => state.userprofile
);

