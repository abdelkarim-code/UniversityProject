// src/features/counter/counterSlice.js
import { createAsyncThunk, createSlice, } from '@reduxjs/toolkit';
import axios from 'axios';
import { base_url } from '../../../context';
const initialState={
    courses:[],
    isloading:false,
    status:0
}
//===========thunks funtions

export const addCourse = createAsyncThunk(
  "Course/add",
  async ({code,name,description,duration_years,credit_hours,level,semester,department_id}, { rejectWithValue }) => {
    
   try {
      const response = await axios.post(`${base_url}/courses/${Number(department_id)}/departments`,
       {code,name,description,duration_years,credit_hours,level,semester});
      return response.status
    } catch (err) {
      
      console.log(err.message)
      if (err.response?.status === 409) {
        return rejectWithValue({ status: 409 });
      }
      
      return rejectWithValue({ status: err.response?.status || 500 });
    }
  }
);
//***************End thunks funtions
const CourseSlice = createSlice({
  name: 'Course',
  initialState: initialState,
  reducers: {
   
  },
  extraReducers:(builder)=>{
  builder.addCase(addCourse.pending,(state)=>{
    state.isloading=true
    state.status=0
  }).addCase(addCourse.fulfilled,(state,action)=>{
    state.isloading=false
    state.status=action.payload
  }).addCase(addCourse.rejected,(state,action)=>{
    state.isloading=false
    state.status=action.payload.status
  })
  }
  
});

// export const { increment, decrement } = counterSlice.actions;
export default CourseSlice.reducer;
