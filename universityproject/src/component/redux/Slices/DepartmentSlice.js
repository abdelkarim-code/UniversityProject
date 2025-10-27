// src/features/counter/counterSlice.js
import { createAsyncThunk, createSlice, } from '@reduxjs/toolkit';
import axios from 'axios';
import { base_url } from '../../../context';
const initialState={
    departments:[],
    programs:[],
    isloading:false,
    status:0
}
//===========thunks funtions
export const createDepartment = createAsyncThunk(
  "Department/create",
  async ({code,description,name,faculty_id}, { rejectWithValue }) => {
    console.log("from thunk data: ",name,faculty_id)
    
    try {
      const response = await axios.post(`${base_url}/departments/${Number(faculty_id)}/faculties`, {name,code,description});
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
export const createProgram = createAsyncThunk(
  "Program/create",
  async ({credit_price,degree_type,department_id,duration_years,name,total_credits}, { rejectWithValue }) => {
    
   try {
      const response = await axios.post(`${base_url}/programs/${Number(department_id)}/departments`, {credit_price,degree_type,duration_years,name,total_credits});
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
export const fetchDepartments = createAsyncThunk(
  "Department/fetchAll",
  async (_,{ rejectWithValue }) => {
    try {
      const response = await axios.get(`${base_url}/departments`);
      return response.data
    } catch (err) {
      console.log(err.message)
      return rejectWithValue({ status: err});
    }
  }
);
export const fetchProgramsByDepartment = createAsyncThunk(
  "Program/fetchBydepartment",
  async (department_id,{ rejectWithValue }) => {
    try {
      const response = await axios.get(`${base_url}/programs/${department_id}/departments`);
    
      return response.data
    } catch (err) {
      console.log(err.message)
      return rejectWithValue({ status: err});
    }
  }
);
//***************End thunks funtions
const DepartmentSlice = createSlice({
  name: 'Department',
  initialState: initialState,
  reducers: {
   
  },
  extraReducers:(builder)=>{
   builder.addCase(createDepartment.pending,(state)=>{
       state.isloading=true
       state.status=0
      }).addCase(createDepartment.fulfilled,(state,action)=>{
        state.isloading=false
        state.status=action.payload
      }).addCase(createDepartment.rejected,(state,action)=>{
        state.isloading=false
        state.status=action.payload?.status
        
      }).addCase(fetchDepartments.fulfilled,(state,action)=>{
        state.departments=action.payload
      }).addCase(createProgram.pending,(state)=>{
         state.isloading=true
       state.status=0
      })
      .addCase(createProgram.fulfilled,(state,action)=>{
        state.isloading=false
        state.status=action.payload
      }).addCase(createProgram.rejected,(state,action)=>{
        state.isloading=false
        state.status=action.payload?.status
        
      }).addCase(fetchProgramsByDepartment.fulfilled,(state,action)=>{
        console.log("payload"+JSON.stringify(action.payload))
        state.programs=action.payload
      })
  }
  
});

// export const { increment, decrement } = counterSlice.actions;
export default DepartmentSlice.reducer;
