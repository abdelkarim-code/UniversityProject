
import { createAsyncThunk, createSlice, } from '@reduxjs/toolkit';
import axios from 'axios';
import { base_url } from '../../../context';


const initialState={
    faculties:[],
    isloading:false,
    status:0
}
//===========thunks funtions
export const createFaculty = createAsyncThunk(
  "faculty/create",
  async ({ name, description }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${base_url}/faculties`, { name, description });
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
export const editFaculty = createAsyncThunk(
  "faculty/edit",
  async ({ name, description,faculty_id }, { rejectWithValue }) => {
  
    try {
      const response = await axios.put(`${base_url}/faculties/${faculty_id}`, { name, description });
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
export const fetchFaculties = createAsyncThunk(
  "faculty/fetchAll",
  async (_,{ rejectWithValue }) => {
    try {
      const response = await axios.get(`${base_url}/faculties`);
      return response.data
    } catch (err) {
      console.log(err.message)
      return rejectWithValue({ status: err});
    }
  }
);
//***************End thunks funtions
const FacultySlice = createSlice({
  name: 'Faculty',
  initialState: initialState,
  reducers: {
   
  },
  extraReducers:(builder)=>{
   builder.addCase(createFaculty.pending,(state)=>{
    state.isloading=true
    state.status=0
   }).addCase(createFaculty.fulfilled,(state,action)=>{
     state.isloading=false
     state.status=action.payload
   }).addCase(createFaculty.rejected,(state,action)=>{
     state.isloading=false
     state.status=action.payload?.status
     
   }).addCase(fetchFaculties.fulfilled,(state,action)=>{
    console.log("fullfilled")
     state.faculties=action.payload
   }).addCase(editFaculty.pending,(state)=>{
    state.isloading=true
    state.status=0
   }).addCase(editFaculty.fulfilled,(state,action)=>{
    state.isloading=false
    state.status=action.payload
   }).addCase(editFaculty.rejected,(state,action)=>{
    state.isloading=false
    state.status=action.payload.status
   })
  }
  
});

// export const { increment, decrement } = counterSlice.actions;
export default FacultySlice.reducer;
