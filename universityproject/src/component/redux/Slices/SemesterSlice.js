// src/features/counter/counterSlice.js
import { createAsyncThunk, createSlice, } from '@reduxjs/toolkit';
import axios from 'axios';
import { base_url } from '../../../context';
const initialState={
    semesters:[],
    isloading:false,
    status:0,
    message:''
}
//===========thunks funtions
// # user_id, first_name, last_name, email, password_hash, phone, address, gender, date_created, role

export const addsemester = createAsyncThunk(
  "semester/add",
  async (semester_data, { rejectWithValue }) => {
    
   try {
      const response = await axios.post(`${base_url}/semesters`,semester_data);
          return response.status
     
    } catch (err) {
        if(err.response?.status==409){
            return rejectWithValue({status:err.response?.status,message:err.response?.data?.message})
        }
      return rejectWithValue({ status: err.response?.status || 500,error:err });
    }
  }
);
export const getsemesters = createAsyncThunk(
  "semester/get",
  async () => {
    
   try {
      const response = await axios.get(`${base_url}/semesters`);
          return response.data
     
    } catch (err) {
       console.log(err)
    }
  }
);
export const getCurrentSemester = createAsyncThunk(
  "semester/getCurrentSemester",
  async () => {
    
   try {
      const response = await axios.get(`${base_url}/semesters/CurrentSemester`);
          return response.data
     
    } catch (err) {
       console.log(err)
    }
  }
);
//***************End thunks funtions
const semesterslice = createSlice({
  name: 'semester',
  initialState: initialState,
  reducers: {
   
  },
  extraReducers:(builder)=>{
      builder.addCase(addsemester.pending,(state)=>{
        state.isloading=true
        state.status=0
      }).addCase(addsemester.fulfilled,(state,action)=>{
        
        state.isloading=false
        state.status=action.payload
      }).addCase(addsemester.rejected,(state,action)=>{
       
        state.isloading=false
        state.status=action.payload.status
        state.message=action.payload?.message
      }).addCase(getsemesters.fulfilled,(state,action)=>{
        state.semesters=action.payload
      })
  }
  
});

// export const { increment, decrement } = counterSlice.actions;
export default semesterslice.reducer;
