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
    duplicated:false
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
     })
  }
  
});

export const { addCampus,addBlock,DeleteBlock } = RoomSlice.actions;
export default RoomSlice.reducer;
