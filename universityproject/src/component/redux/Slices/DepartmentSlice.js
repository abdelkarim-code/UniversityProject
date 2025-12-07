// src/features/counter/counterSlice.js
import { createAsyncThunk, createSlice, } from '@reduxjs/toolkit';
import axios from 'axios';
import { base_url } from '../../../context';
const initialState={
    departments:[],
    deUnderFaculty:[],
    programs:[],
    isloading:false,
    status:0
}
//===========thunks funtions
export const createDepartment = createAsyncThunk(
  "Department/create",
  async ({code,description,name,faculty_id}, { rejectWithValue,dispatch }) => {
   
    
    try {
      const response = await axios.post(`${base_url}/departments/${Number(faculty_id)}/faculties`, {name,code,description});
      if(response.status==201)
        dispatch(fetchDepartmentByFaculty(faculty_id))
      return response.status
    } catch (err) {
      
      
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
      
      return rejectWithValue({ status: err.message});
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
      
      return rejectWithValue({ status: err.message});
    }
  }
);
export const fetchDepartmentByFaculty = createAsyncThunk(
  "Department/fetchByFaculty",
  async (faculty_id,{ rejectWithValue }) => {
    try {
      const response = await axios.get(`${base_url}/departments/${faculty_id}/faculties`);
    
      return response.data
    } catch (err) {
      
      return rejectWithValue({ status: err});
    }
  }
);
export const editDepartment = createAsyncThunk(
  "Department/edit",
  async ({code,description,name,department_id}, { rejectWithValue }) => {
  
    try {
      const response = await axios.put(`${base_url}/departments/${department_id}`, {code,description,name});
      return response.status
    } catch (err) {
      
      
      if (err.response?.status === 409) {
        return rejectWithValue({ status: 409 });
      }
      
      return rejectWithValue({ status: err.response?.status || 500 });
    }
  }
);
export const deleteDepartment = createAsyncThunk(
  "Department/delete",
  async ( department_id, { rejectWithValue }) => {
  
    try {
      const response = await axios.delete(`${base_url}/departments/${department_id}`);
      return response.status
    } catch (err) {
      
     
      if (err.response?.status === 409) {
        return rejectWithValue({ status: 409 });
      }
      
      return rejectWithValue({ status: err.response?.status || 500 });
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
      state.programs=action.payload
        state.status=0
      }).addCase(fetchDepartmentByFaculty.fulfilled,(state,action)=>{
        state.deUnderFaculty=action.payload
          state.status=0
      }).addCase(editDepartment.pending,(state)=>{
          state.isloading=true
          state.status=0
         }).addCase(editDepartment.fulfilled,(state,action)=>{
          state.isloading=false
          state.status=action.payload
         }).addCase(editDepartment.rejected,(state,action)=>{
          state.isloading=false
          state.status=action.payload.status
         }).addCase(deleteDepartment.pending,(state)=>{
             state.isloading=true
             state.status=0
            }).addCase(deleteDepartment.fulfilled,(state,action)=>{
             state.isloading=false
             state.status=action.payload
            }).addCase(deleteDepartment.rejected,(state,action)=>{
             state.isloading=false
             state.status=action.payload.status
            })
  }
  
});

// export const { clearstatus } = DepartmentSlice.actions;
export default DepartmentSlice.reducer;
