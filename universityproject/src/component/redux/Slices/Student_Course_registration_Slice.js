// src/features/counter/counterSlice.js
import { createAsyncThunk, createSlice, } from '@reduxjs/toolkit';
import axios from 'axios';
import { base_url } from '../../../context';


const initialState={
  available_courses:[],
  sections:[],
   reg_courses:[]
}
//===========thunks funtions

export const getAvailableCourses = createAsyncThunk(
  "Student/availableCourses",
  async (DATA, { rejectWithValue }) => {

    
   try {
    const response = await axios.post(`${base_url}/students/availableCourses`,
      DATA 
      );
     
      if(response.status==200){
         console.log("from thunk: ",JSON.stringify(DATA||1))
       console.log("from thunk: ",JSON.stringify(response.data||1))
        return response.data
      }
      
    } catch (err) {
      
      console.log(err.message)
      if (err.response?.status === 401) {
        return rejectWithValue({ status: 401 });
      }
      
      return rejectWithValue({ status: err.response?.status || 500 });
    }
  }
);
export const getSections = createAsyncThunk(
  "Student_reg/getSections",
  async ({course_id,campus,semester_id}, { rejectWithValue }) => {

    
   try {
    const response = await axios.get(`${base_url}/students/getSections/${course_id}/${semester_id}/${campus}`);
     
      if(response.status==200){
        console.log(response.data)
        return response.data
      }
      
    } catch (err) {
      
      console.log(err.message)
      if (err.response?.status === 401) {
        return rejectWithValue({ status: 401 });
      }
      
      return rejectWithValue({ status: err.response?.status || 500 });
    }
  }
);
export const getStudentRegiteredCourses = createAsyncThunk(
  "student_reg/getStudentRegsiteredCourses",
  async ({student_id,semester_id}, { rejectWithValue }) => {
    
    
   try {
      const response = await axios.get(`${base_url}/students/getRegisteredCourses/${student_id}/${semester_id}`);
      return response.data
    } catch (err) {
      
     
      
      
      return rejectWithValue({ status: err.response?.status || 500 });
    }
  }
);
//***************End thunks funtions
const CourseRegistrationSlice = createSlice({
  name: 'Cou_reg',
  initialState: initialState,
  reducers: {
   
  },
  extraReducers:(builder)=>{
   builder.addCase(getAvailableCourses.fulfilled,(state,action)=>{
    
     state.available_courses=action.payload
   }).addCase(getSections.fulfilled,(state,action)=>{
    state.sections=action.payload
   }).addCase(getStudentRegiteredCourses.fulfilled,(state,action)=>{
        state.reg_courses=action.payload
      })
  }
  
});

// export const { increment, decrement } = counterSlice.actions;
export default CourseRegistrationSlice.reducer;
