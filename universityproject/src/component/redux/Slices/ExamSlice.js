import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { base_url } from "../../../context";

const initialState = {
  exams: [],
  isloading: false,
  status: 0,
  message:""
};

// ======================= THUNKS =======================

// CREATE Exam
export const createExam = createAsyncThunk(
  "exam/create",
  async ({ course_id, semester_id, exam_type, date, duration_minutes, total_marks }, { rejectWithValue, dispatch }) => {
    try {
      const body = { course_id, semester_id, exam_type, date, duration_minutes, total_marks };

      const response = await axios.post(
        `${base_url}/exams/${course_id}/courses/${semester_id}/semester`,
        body
      );

      if (response.status === 201) {
        dispatch(fetchExams(semester_id));
      }

      return {status:response.status,message:response.data.message};
    } catch (err) {
      

      if (err.response?.status === 409) {
        return rejectWithValue({ status: 409,message:err.response.data.message });
      }

      return rejectWithValue({ status: err.response?.status || 500,message:err.response.data.message  });
    }
  }
);

// EDIT Exam
// export const editExam = createAsyncThunk(
//   "exam/edit",
//   async (
//     { exam_id, course_id, semester_id, exam_type, date, duration_minutes, total_marks },
//     { rejectWithValue }
//   ) => {
//     try {
//       const body = { course_id, semester_id, exam_type, date, duration_minutes, total_marks };

//       const response = await axios.put(`${base_url}/exams/${exam_id}`, body);

//       return response.status;
//     } catch (err) {
//       console.log(err.message);

//       if (err.response?.status === 409) {
//         return rejectWithValue({ status: 409 });
//       }

//       return rejectWithValue({ status: err.response?.status || 500 });
//     }
//   }
// );

// FETCH all Exams under a Semester
export const fetchExams = createAsyncThunk(
  "exam/fetchAll",
  async (semester_id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${base_url}/exams/${semester_id}/semester`);
      return response.data;
    } catch (err) {
      
      return rejectWithValue({ status: err.response?.status || 500 });
    }
  }
);

// DELETE Exam
export const deleteExam = createAsyncThunk(
  "exam/delete",
  async ({exam_id,semester_id}, { rejectWithValue,dispatch }) => {
    try {
      const response = await axios.delete(`${base_url}/exams/${exam_id}`);
      dispatch(fetchExams(semester_id))
      return response.status;
    } catch (err) {
      

      if (err.response?.status === 404) {
        return rejectWithValue({ status: 404 });
      }

      return rejectWithValue({ status: err.response?.status || 500 });
    }
  }
);
export const publishExam = createAsyncThunk(
  "exam/publish",
  async ({ exam_id, semester_id }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.put(`${base_url}/exams/${exam_id}/publish`);
      
      // If successful, refetch exams for the current semester
      if (response.status === 204) {
        dispatch(fetchExams(semester_id));
      }

      return response.status;
    } catch (err) {
      
      return rejectWithValue(err.response?.status || 500);
    }
  }
);
export const fetchPublishedExams = createAsyncThunk(
  "exam/fetchPublishedExams",
  async (semester_id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${base_url}/exams/${semester_id}/semester/published`);
      return response.data;
    } catch (err) {
      
      return rejectWithValue({ status: err.response?.status || 500 });
    }
  }
);
// ======================= SLICE =======================

const ExamSlice = createSlice({
  name: "Exam",
  initialState,
  reducers: {
    resetStatus: (state) => {
    state.status = 0;
  }
  },
  extraReducers: (builder) => {
    builder
      // CREATE exam
      .addCase(createExam.pending, (state) => {
        state.isloading = true;
        state.status = 0;
      })
      .addCase(createExam.fulfilled, (state, action) => {
        state.isloading = false;
        state.status = action.payload?.status;
        state.message=action.payload?.message
      })
      .addCase(createExam.rejected, (state, action) => {
        state.isloading = false;
        state.status = action.payload?.status;
        state.message=action.payload?.message
      })

      // FETCH exams
      .addCase(fetchExams.fulfilled, (state, action) => {
        state.exams = action.payload;
        state.status = 0;
      })

    //   // EDIT Exam
    //   .addCase(editExam.pending, (state) => {
    //     state.isloading = true;
    //     state.status = 0;
    //   })
    //   .addCase(editExam.fulfilled, (state, action) => {
    //     state.isloading = false;
    //     state.status = action.payload;
    //   })
    //   .addCase(editExam.rejected, (state, action) => {
    //     state.isloading = false;
    //     state.status = action.payload?.status;
    //   })

      // DELETE Exam
      .addCase(deleteExam.pending, (state) => {
        state.isloading = true;
        state.status = 0;
      })
      .addCase(deleteExam.fulfilled, (state, action) => {
        state.isloading = false;
        state.status = action.payload;
      })
      .addCase(deleteExam.rejected, (state, action) => {
        state.isloading = false;
        state.status = action.payload?.status;
      });
  },
});
export const {resetStatus } =ExamSlice.actions;
export default ExamSlice.reducer;
