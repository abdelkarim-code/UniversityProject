// src/features/counter/counterSlice.js
import { createAsyncThunk, createSlice, } from '@reduxjs/toolkit';
import axios from 'axios';
import { base_url } from '../../../context';
import { omit } from 'lodash';
const initialState={
    students:[],
    isloading:false,
    status:0,
    
   
}
//===========thunks funtions
// # user_id, first_name, last_name, email, password_hash, phone, address, gender, date_created, role

export const addstudent = createAsyncThunk(
  "student/add",
  async ({address,first_name,gender,last_name,phone,department_id,program_id}, { rejectWithValue }) => {
    // const {department_id,specialization}=studentdata
   try {
      const response = await axios.post(`${base_url}/users`,{first_name,last_name,gender,address,phone,role:3,department_id});
           
      if(response.data.success&&response.status==201){
        
         const addstudentRequest = await axios.post(
            `${base_url}/students/${response.data.data}/users/${department_id}/departments/${program_id}/programs`,
            {student_code:response.data.student_code}
          );
          if(addstudentRequest.status==201){
            return addstudentRequest.status
          }
      }
    } catch (err) {
      return rejectWithValue({ status: err.response?.status || 500,error:err });
    }
  }
);
export const registerCourseBystudent = createAsyncThunk(
  "student/registerCourseToStudent",
  async (data, { rejectWithValue }) => {
    
    
   try {
      const response = await axios.post(`${base_url}/students/registerCourse/${data?.student_id}`, omit(data,["student_id"]));
      return response.status
    } catch (err) {
      
      
      
      
      return rejectWithValue({ status: err.response?.status || 500 });
    }
  }
);
// Fetch students by year
export const fetchStudentsByYear = createAsyncThunk(
  "students/fetchByYear",
  async (year, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${base_url}/students/${year}`);
      return response.data;
    } catch (err) {
      
      return rejectWithValue(err.response?.data || { status: 500, message: err.message });
    }
  }
);
export const UploadStudentViaExcel = createAsyncThunk(
  "student/UploadStudentViaExcel",
  async (data, ) => {
    
    
   try {
    const formData = new FormData();
    formData.append('file', data);
      const response = await axios.post(`${base_url}/students/uploadStudents`,formData,{
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      return {status:response.status,message:response.data?.message};
    } catch (err) {
       return {status:err.response?.status||500,message:err.response?.data.err||"An error occurred"};
      // return rejectWithValue({ status: err.response?.status || 500 });
    }
  }
);
//***************End thunks funtions
const studentslice = createSlice({
  name: 'student',
  initialState: initialState,
  reducers: {
   
  },
  extraReducers:(builder)=>{
      builder.addCase(addstudent.pending,(state)=>{
        state.isloading=true
        state.status=0
      }).addCase(addstudent.fulfilled,(state,action)=>{
        
        state.isloading=false
        state.status=action.payload
      }).addCase(addstudent.rejected,(state,action)=>{
       
        state.isloading=false
        state.status=action.payload.status
      })
  }
  
});

// export const { increment, decrement } = counterSlice.actions;
export default studentslice.reducer;
