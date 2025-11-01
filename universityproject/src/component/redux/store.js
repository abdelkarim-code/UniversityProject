import { configureStore } from '@reduxjs/toolkit';
import FacultySliceReducer from "./Slices/FacultySlice"
import DepartmentSliceReducer from "./Slices/DepartmentSlice"
import  CourseSliceReducer from "./Slices/CourseSlice"
import DoctorSliceReducer from './Slices/DoctorSlice'
import StudentSliceReducer from './Slices/StudentSlice'
import AuthSliceReducer from './Slices/AuthSlice'
import RoomSliceReducer from './Slices/RoomSlice'
const store = configureStore({
  reducer: {
    faculty:FacultySliceReducer,
    department:DepartmentSliceReducer,
    course:CourseSliceReducer,
    doctor:DoctorSliceReducer,
    student:StudentSliceReducer,
    auth:AuthSliceReducer,
    room:RoomSliceReducer

  },
  devTools:true
});

export default store;