// src/features/counter/counterSlice.js
import { createAsyncThunk, createSlice, } from '@reduxjs/toolkit';
import axios from 'axios';
import { base_url } from '../../../context';
import { omit } from 'lodash';

const initialState={
    courses:[],
    isloading:false,
    status:0,
    pre_course:[],
    message:""
}
//===========thunks funtions

export const addCourse = createAsyncThunk(
  "Course/add",
  async (data, { rejectWithValue,dispatch }) => {
    
   try {
      const response = await axios.post(`${base_url}/courses/${Number(data?.department_id)}/departments`,
       omit(data,["department_id"]));
       if(response.status==201){
        dispatch(fetchCoursesByDepartment(data?.department_id))
       }
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
export const updateCourse = createAsyncThunk(
  "course/update",
  async ({ courseid, data }, {  dispatch }) => {
    console.log(data)
    try {
      const response = await axios.put(`${base_url}/courses/${courseid}`,{...data
        ,semester:data?.semester=="Fall"?1:2
      } );

      if (response.status === 204) {
        // refresh the course list if needed
        if (data.program_id) {
          dispatch(fetchCoursesByProgram(data?.program_id||0));
        }
      }

      return response.status;
    } catch (err) {
      console.log(err.message);
      if (err.response?.status === 409) {
        return { status: 409, message: "Course code or name already exists." }
        // return rejectWithValue({ status: 409, message: "Course code or name already exists." });
      }
      return { status: err.response?.status || 500 }
    }
  }
);
export const deleteCourse = createAsyncThunk(
  "course/delete",
  async ({ course_id, program_id }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.delete(`${base_url}/courses/${course_id}`);

      if (response.status === 200) {
        // refresh course list after deletion
        if (program_id) {
          dispatch(fetchCoursesByProgram(program_id||0));
        }
      }

      return response.status;
    } catch (err) {
      console.log(err.message);
      return rejectWithValue({ status: err.response?.status || 500 });
    }
  }
);

export const fetchCoursesByDepartment = createAsyncThunk(
  "course/fetchBydepartment",
  async (department_id,{ rejectWithValue }) => {
    try {
      const response = await axios.get(`${base_url}/courses/${department_id}/departments`);
    
      return response.data
    } catch (err) {
      console.log(err.message)
      return rejectWithValue({ status: err});
    }
  }
);
export const fetchTypeOfcourses = createAsyncThunk(
  "course/fetchTypeOfcourses",
  async (department_id,{ rejectWithValue }) => {
    try {
      const response = await axios.get(`${base_url}/courses/${department_id}/departments/getCoursesTypes`);
    
      return response.data
    } catch (err) {
      console.log(err.message)
      return rejectWithValue({ status: err});
    }
  }
);
export const fetchCoursesByProgram = createAsyncThunk(
  "course/fetchCoursesByProgram",
  async (program_id,{ rejectWithValue }) => {
    try {
      const response = await axios.get(`${base_url}/courses/${program_id}/programs`);
    
      return response.data
    } catch (err) {
      console.log(err.message)
      return rejectWithValue({ status: err});
    }
  }
);
export const AssignCourseToDoctor = createAsyncThunk(
  "Course/AssignCourseToDoctor",
  async (data, { rejectWithValue }) => {
    
   try {
      const response = await axios.post(`${base_url}/courses/AssignCoursetoDoctor/${data?.campus}`,omit(data,["campus"]));
      return response.status
    } catch (err) {
      
      console.log(err.message)
      if (err.response?.status === 409) {
        return rejectWithValue({ status: 409,message:err?.response?.data?.message });
      }
      
      return rejectWithValue({ status: err.response?.status || 500 });
    }
  }
);
export const fetchPrerequisitesByCourse_id = createAsyncThunk(
  "course/fetchPrerequisitesByCourse_id",
  async (course_id,{ rejectWithValue }) => {
    try {
      const response = await axios.get(`${base_url}/courses/getPrerequisites/${course_id}`);
    
      return response.data
    } catch (err) {
      console.log(err.message)
      return rejectWithValue({status: err});
    }
  }
);
export const addPrerequisitesToCourse = createAsyncThunk(
  "course/ADDpre",
  async (pre_set, { rejectWithValue }) => {
    console.log(pre_set)
    
   try {
      const response = await axios.post(`${base_url}/courses/AssignPrerequisitesToCourses`, pre_set);
      return response.status
    } catch (err) {
      
      console.log(err.message)
      
      
      return rejectWithValue({ status: err.response?.status || 500 });
    }
  }
);
export const deletePrerequestcourse = createAsyncThunk(
  "course/deletePre",
  async ( {main_cid,pre_cid}, { rejectWithValue }) => {
  
    try {
      const response = await axios.delete(`${base_url}/courses/deletePrerequest/${main_cid}/${pre_cid}`);
      console.log(response.status)
      return response.status
    } catch (err) {

      
      return rejectWithValue({ status: err.response?.status || 500 });
    }
  }
);
export const fetchAssignmentsByDeptAndSemester = createAsyncThunk(
  "assignments/fetchByDeptSemester",
  async ({ department_id, semester_id }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${base_url}/courses/getAssignDoctorCoursesByDept/${department_id}/${semester_id}`
      );
      return response.data;
    } catch (err) {
      console.log(err.message);
      return rejectWithValue({ status: err.response?.status || 500 });
    }
  }
)
export const deleteAssignment = createAsyncThunk(
  "assignments/delete",
  async ({ assignment_id  }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${base_url}/courses/deleteAssign/${assignment_id}`);
        console.log(response.status)
      if (response.status === 200) {
        // refresh assignment list after deletion
       return response.status;
      }

      
    } catch (err) {
      console.log(err.message);
      return rejectWithValue({ status: err.response?.status || 500 });
    }
  }
);
export const fetchStudentsByAssignment = createAsyncThunk(
  "registration/fetchStudentsByAssignment",
  async (assignmentId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${base_url}/courses/assignment/${assignmentId}/registrations`);
      return res.data.data; // returns student list
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch students"
      );
    }
  }
);

//***************End thunks funtions
const CourseSlice = createSlice({
  name: 'Course',
  initialState: initialState,
  reducers: {
    clearStatus:state=>{state.status=0},
    clearCourses:state=>{state.courses=[]}
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
  }).addCase(fetchCoursesByDepartment.fulfilled,(state,action)=>{
    state.courses=action.payload
  }).addCase(AssignCourseToDoctor.pending,(state)=>{
    state.isloading=true
    state.status=0
  }).addCase(AssignCourseToDoctor.fulfilled,(state,action)=>{
    state.isloading=false
    state.status=action.payload
  }).addCase(AssignCourseToDoctor.rejected,(state,action)=>{
   state.isloading=false
    state.status=action.payload.status
    state.message=action.payload?.message

  }).addCase(fetchCoursesByProgram.fulfilled,(state,action)=>{
    state.courses=action.payload
  }).addCase(fetchPrerequisitesByCourse_id.fulfilled,(state,action)=>{
    state.pre_course=action.payload
  }).addCase(addPrerequisitesToCourse.pending,(state)=>{
    state.isloading=true
    state.status=0
  }).addCase(addPrerequisitesToCourse.fulfilled,(state,action)=>{
    state.isloading=false
    state.status=action.payload
  }).addCase(addPrerequisitesToCourse.rejected,(state,action)=>{
    state.status=action.payload.status
    state.isloading=false
  }).addCase(deletePrerequestcourse.fulfilled,(state,action)=>{
    console.log("payload: ",action.payload)
    state.status=action.payload
  })
  }
  
});

export const { clearStatus,clearCourses} = CourseSlice.actions;
export default CourseSlice.reducer;
