import { configureStore } from '@reduxjs/toolkit';
import FacultySliceReducer from "./Slices/FacultySlice"
import DepartmentSliceReducer from "./Slices/DepartmentSlice"
import  CourseSliceReducer from "./Slices/CourseSlice"
const store = configureStore({
  reducer: {
    faculty:FacultySliceReducer,
    department:DepartmentSliceReducer,
    course:CourseSliceReducer
  },
  devTools:true
});

export default store;