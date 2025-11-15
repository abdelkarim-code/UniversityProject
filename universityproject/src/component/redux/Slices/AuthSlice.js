// src/features/counter/counterSlice.js
import { createAsyncThunk, createSlice, } from '@reduxjs/toolkit';
import axios from 'axios';
import { base_url } from '../../../context';


const initialState={
    path:"",
    status:0,
    isloading:false,
    active_user:{}
}
//===========thunks funtions

export const UserLogin = createAsyncThunk(
  "auth/login",
  async (userdata, { rejectWithValue,dispatch }) => {
    
   try {
      const response = await axios.post(`${base_url}/users/Login`,userdata,{withCredentials: true});
     
      if(response.status==200){
        const path=response.data.user_role=="Student"?"/Liu/students":"/Liu/doctors"
        if(response.data.user_role=="Student"){
          dispatch(getActiveUserInfo(response.data.user_id))
        }
        return {path:path,status:response.status}
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
export const getActiveUserInfo = createAsyncThunk(
  "auth/getStudentInfo",
  async (userid, { rejectWithValue }) => {
    
   try {
      const response = await axios.get(`${base_url}/users/system/getstudentInfo/${userid}`);
        localStorage.setItem("user_id",response.data?.user_id)
      if(response.status==200){
       return response.data
      }
      
    } catch (err) {
      return rejectWithValue({ status: err.response?.status || 500 });
    }
  }
);
//***************End thunks funtions
const AuthSlice = createSlice({
  name: 'Auth',
  initialState: initialState,
  reducers: {
   
  },
  extraReducers:(builder)=>{
  builder.addCase(UserLogin.pending,(state)=>{
    state.isloading=true
    state.status=0
  }).addCase(UserLogin.fulfilled,(state,action)=>{
    console.log("fullfilled ",action.payload)
    state.isloading=false
    state.path=action.payload?.path
    state.status=action.payload?.status
  }).addCase(UserLogin.rejected,(state,action)=>{
    state.isloading=false
    state.status=action.payload.status
  }).addCase(getActiveUserInfo.fulfilled,(state,action)=>{
    state.active_user=action.payload
  })
  }
  
});

// export const { increment, decrement } = counterSlice.actions;
export default AuthSlice.reducer;
