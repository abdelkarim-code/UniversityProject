// src/features/counter/counterSlice.js
import { createAsyncThunk, createSlice, } from '@reduxjs/toolkit';
import axios from 'axios';
import { base_url } from '../../../context';


const initialState={
  available_courses:[]
}
//===========thunks funtions

export const getAvailableCourses = createAsyncThunk(
  "Student/login",
  async ({department_id,semester,program_id,level,student_id}, { rejectWithValue }) => {

   try {
      const response = await axios.post(`${base_url}/users/system/getstudentInfo/${student_id}`,
        {department_id,semester,program_id,level}
      );
     
      if(response.status==200){
       
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

//***************End thunks funtions
const CourseRegistrationSlice = createSlice({
  name: 'Cou_reg',
  initialState: initialState,
  reducers: {
   
  },
  extraReducers:(builder)=>{
   builder.addCase(getAvailableCourses.fulfilled,(state,action)=>{
     state.available_courses=action.payload
   })
  }
  
});

// export const { increment, decrement } = counterSlice.actions;
export default CourseRegistrationSlice.reducer;
