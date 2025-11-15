// src/features/counter/counterSlice.js
import { createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import { base_url } from '../../../context';

const initialState={
    rooms:[],
    isloading:false,
    status:0,
    requestData:{
        campus:"",
        blocks:[]
    },
    duplicated:false,
    campuses:[],
    blocks:[],
    
}
//===========thunks funtions
export const createRooms = createAsyncThunk(
  "rooms/create",
  async (requestData,{rejectWithValue}) => {
    console.log(requestData)
    try {
      const response = await axios.post(`${base_url}/rooms`, requestData);
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
export const fetchCampuses = createAsyncThunk(
  "campus/fetchAll",
  async (_,{ rejectWithValue }) => {
    console.log("from fetch campuses")
    try {
      const response = await axios.get(`${base_url}/rooms/getCampuses`);
      return response.data
    } catch (err) {
      console.log(err.message)
      return rejectWithValue({ status: err});
    }
  }
);
export const fetchBlocks = createAsyncThunk(
  "block/fetchAll",
  async (campus,{ rejectWithValue }) => {
   console.log("from fetch blocks: ",campus)
    try {
      const response = await axios.get(`${base_url}/rooms/getBlocks/${campus}`);
      return response.data
    } catch (err) {
      console.log(err.message)
      return rejectWithValue({ status: err});
    }
  }
);
export const fetchRooms = createAsyncThunk(
  "rooms/fetchAll",
  async (block,{ rejectWithValue }) => {
   console.log("from fetch rooms: ",block)
    try {
      const response = await axios.get(`${base_url}/rooms/getRooms/${block}`);
      return response.data
    } catch (err) {
      console.log(err.message)
      return rejectWithValue({ status: err});
    }
  }
);

//***************End thunks funtions
const RoomSlice = createSlice({
  name: 'Course',
  initialState: initialState,
  reducers: {
    addCampus:(state,action)=>{
       state.requestData.campus=action.payload
    },
    addBlock:(state,action)=>{
        state.duplicated=false
        const matchBlock=state.requestData.blocks.some(b=>b.block==action.payload.block)
        if(!matchBlock){
            
          state.requestData.blocks.push({
            block:action.payload.block,
            floors:action.payload.floors
        })
        }else{
            state.duplicated=true
        }
       
    },
     DeleteBlock:(state,action)=>{
        console.log("delete block",action.payload)
        state.requestData.blocks.splice(action.payload.index,1)
    },
    ClearBlocks:state=>{state.blocks=[]
      state.rooms=[]
      
    }
  },
  extraReducers:(builder)=>{
     builder.addCase(createRooms.pending,(state)=>{
       state.isloading=true
       state.status=0
     }).addCase(createRooms.fulfilled,(state,action)=>{
        state.isloading=false
        state.status=action.payload
        state.requestData={
        campus:"",
        blocks:[]
    }
     }).addCase(createRooms.rejected,(state,action)=>{
         state.isloading=false
        state.status=action.payload.status
     }).addCase(fetchCampuses.fulfilled,(state,action)=>{
        state.campuses=action.payload
     }).addCase(fetchBlocks.pending,state=>{
      state.isloading=true
     }).addCase(fetchBlocks.fulfilled,(state,action)=>{
      state.isloading=false
      state.blocks=action.payload
     }).addCase(fetchRooms.pending,state=>{
      state.isloading=true
     }).addCase(fetchRooms.fulfilled,(state,action)=>{
      state.isloading=false
      state.rooms=action.payload
     })
  }
  
});

export const { addCampus,addBlock,DeleteBlock ,ClearBlocks} = RoomSlice.actions;
export default RoomSlice.reducer;
