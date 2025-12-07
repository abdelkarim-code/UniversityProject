// src/features/counter/counterSlice.js
import { createAsyncThunk, createSlice, } from '@reduxjs/toolkit';
import axios from 'axios';
import { base_url } from '../../../context';
const initialState={
    doctors:[],
    isloading:false,
    status:0,
    ass_doc:[]
}
//===========thunks funtions
// # user_id, first_name, last_name, email, password_hash, phone, address, gender, date_created, role

export const addDoctor = createAsyncThunk(
  "doctor/add",
  async ({address,first_name,gender,last_name,phone,department_id,specialization}, { rejectWithValue }) => {
    // const {department_id,specialization}=doctordata
   try {
      const response = await axios.post(`${base_url}/users`,{first_name,last_name,gender,address,phone,role:2});
          
      if(response.data.success&&response.status==201){
         const addDoctorRequest = await axios.post(`${base_url}/doctors/${response.data.data}/users/${department_id}/departments`
          ,{specialization,first_name,last_name});
          if(addDoctorRequest.status==201){
            return addDoctorRequest.status
          }
      }
    } catch (err) {
      if (err.response?.status === 409) {
        
        return rejectWithValue({ status: 409 });
      }
      
      return rejectWithValue({ status: err.response?.status || 500 });
    }
  }
);
export const fetchDoctorsByDepartment = createAsyncThunk(
  "doctor/fetchBydepartment",
  async (department_id,{ rejectWithValue }) => {
    try {
      const response = await axios.get(`${base_url}/doctors/${department_id}/departments`);
    
      return response.data
    } catch (err) {
      
      return rejectWithValue({ status: err});
    }
  }
);
export const getAssignCoursesToDoctor = createAsyncThunk(
  "doctor/getAssignCoursesToDoctor",
  async ({doctor_id,semester_id},{ rejectWithValue }) => {
    
    try {
      const response = await axios.get(`${base_url}/doctors/getAssignDoctorCourses/${doctor_id}/${semester_id}`);
    
      return response.data
    } catch (err) {
      
      return rejectWithValue({ status: err});
    }
  }
);

export const fetchDoctorsByYear = createAsyncThunk(
  "doctors/fetchByYear",
  async (year, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${base_url}/doctors/${year}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch doctors");
    }
  }
);

//***************End thunks funtions
const doctorslice = createSlice({
  name: 'doctor',
  initialState: initialState,
  reducers: {
   
  },
  extraReducers:(builder)=>{
      builder.addCase(addDoctor.pending,(state)=>{
        state.isloading=true
        state.status=0
      }).addCase(addDoctor.fulfilled,(state,action)=>{
        state.isloading=false
        state.status=action.payload
      }).addCase(addDoctor.rejected,(state,action)=>{
       
        state.isloading=false
        state.status=action.payload.status
      }).addCase(fetchDoctorsByDepartment.fulfilled,(state,action)=>{
       
       state.doctors=action.payload
      }).addCase(getAssignCoursesToDoctor.fulfilled,(state,action)=>{
        state.ass_doc=action.payload
      })
  }
  
});

// export const { increment, decrement } = counterSlice.actions;
export default doctorslice.reducer;
