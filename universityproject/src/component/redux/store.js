import { configureStore } from '@reduxjs/toolkit';
import FacultySliceReducer from "./Slices/FacultySlice"
import DepartmentSliceReducer from "./Slices/DepartmentSlice"
import  CourseSliceReducer from "./Slices/CourseSlice"
import DoctorSliceReducer from './Slices/DoctorSlice'
import StudentSliceReducer from './Slices/StudentSlice'
import AuthSliceReducer from './Slices/AuthSlice'
import RoomSliceReducer from './Slices/RoomSlice'
import SemesterSliceReducer from './Slices/SemesterSlice'
import Cou_reg_SliceReducer from './Slices/Student_Course_registration_Slice'
import ExamSliceReducer from "./Slices/ExamSlice"
const store = configureStore({
  reducer: {
    faculty:FacultySliceReducer,
    department:DepartmentSliceReducer,
    course:CourseSliceReducer,
    doctor:DoctorSliceReducer,
    student:StudentSliceReducer,
    auth:AuthSliceReducer,
    room:RoomSliceReducer,
    semester:SemesterSliceReducer,
    cou_reg:Cou_reg_SliceReducer,
    exam:ExamSliceReducer
  },
  devTools:true
});

export default store;