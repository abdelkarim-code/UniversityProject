import React, { useEffect, useState } from 'react';
import {Dialog,DialogTitle,DialogContent,DialogActions,Button,TextField,MenuItem,Box,Stack,Typography,Autocomplete} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from '../../../context';
import { fetchCoursesByDepartment } from '../../redux/Slices/CourseSlice';
import { createExam, resetStatus } from '../../redux/Slices/ExamSlice';

const AddExamDialog = ({ open, onClose, semesters = [],departments=[] }) => {
  const [formValues, setFormValues] = useState({
    course_id: '',
    semester_id: '',
    exam_type: '',
    date: '',
    duration_minutes: '',
    total_marks: ''
  });
  const { status, isloading,message } = useSelector((state) => state.exam);
  const {setopen}=useAlert()
  const {courses}=useSelector(state=>state.course)
  const [errors, setErrors] = useState({});
  const [selectedDepartment,setSeletedDepartment]=useState(0)
  const dispatch=useDispatch()
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
useEffect(()=>{
 setSeletedDepartment(0)
},[open])
useEffect(() => {
  if (status === 201) {
    setopen({
      state: true,
      message: message,
      color: "success"
    });
     onClose()
    setFormValues({
      course_id: '',
      semester_id: '',
      exam_type: '',
      date: '',
      duration_minutes: '',
      total_marks: ''
    });

    dispatch(resetStatus());
  }

  if (status === 409) {
    setopen({
      state: true,
      message: message,
      color: "error"
    });

    dispatch(resetStatus());
  }

  if (status === 500) {
    setopen({
      state: true,
      message: message,
      color: "error"
    });

    dispatch(resetStatus());
  }
}, [status]);

  const validateForm = () => {
    const newErrors = {};

    if (!formValues.course_id) newErrors.course_id = 'Course is required';
    if (!formValues.semester_id) newErrors.semester_id = 'Semester is required';
    if (!formValues.exam_type) newErrors.exam_type = 'Exam type is required';
    if (!formValues.date) newErrors.date = 'Date is required';
    
    if (!formValues.duration_minutes) {
      newErrors.duration_minutes = 'Duration is required';
    } else if (formValues.duration_minutes < 1) {
      newErrors.duration_minutes = 'Duration must be at least 1 minute';
    } else if (formValues.duration_minutes > 480) {
      newErrors.duration_minutes = 'Duration cannot exceed 8 hours';
    }
    
    if (!formValues.total_marks) {
      newErrors.total_marks = 'Total marks is required';
    } else if (formValues.total_marks < 1) {
      newErrors.total_marks = 'Total marks must be at least 1';
    } else if (formValues.total_marks > 1000) {
      newErrors.total_marks = 'Total marks cannot exceed 1000';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
    // TODO: Call API here
      dispatch(createExam(formValues));
    }
  };
const handleChooseDepartemnt=()=>{
    if(selectedDepartment!=0){
       dispatch(fetchCoursesByDepartment(selectedDepartment))
    }else{
      setopen({state:true,message:"You need to choose a department to proceed",color:"error"})
    }
}
  const handleClose = () => {
    setFormValues({
      course_id: '',
      semester_id: '',
      exam_type: '',
      date: '',
      duration_minutes: '',
      total_marks: ''
    });
    setErrors({});
    onClose();
  };
  if(selectedDepartment==0||courses.length==0){
    return (
       <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            width: '320px',
            mx: 'auto'
          }
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          color: '#003C64', 
          fontWeight: 600,
          fontSize: '1rem',
          py: 2,
          textAlign: 'center'
        }}
      >
        Choose Department
      </DialogTitle>
      
      <DialogContent sx={{p:2}}>
        <Autocomplete
          onChange={(_, value) => setSeletedDepartment(value?.department_id)}
          options={departments}
          sx={{p:2}}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField 
              {...params} 
              label="Department" 
              size="small"

              sx={{
                
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  fontSize: '0.875rem',
                  '&:hover fieldset': {
                    borderColor: '#003C64',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#003C64',
                    borderWidth: '2px'
                  }
                }
              }}
            />
          )}
        />
      </DialogContent>
      
      <DialogActions sx={{ px: 2, py: 1.5, gap: 1 }}>
        <Button 
          onClick={onClose}
          size="small"
          sx={{ 
            color: '#003C64',
            textTransform: 'none',
            fontSize: '0.875rem',
            px: 2
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleChooseDepartemnt}
          size="small"
          variant="contained"
          sx={{ 
            backgroundColor: '#003C64',
            textTransform: 'none',
            fontSize: '0.875rem',
            px: 2,
            '&:hover': {
              backgroundColor: '#002A4A'
            }
          }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
    )
  }else{
  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="lg" 
      fullWidth
       slotProps={{
        paper: {
         sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 60, 100, 0.1)'
        }
        }
      }}
      
    >
      <DialogTitle 
        sx={{ 
          color: '#003C64', 
          fontWeight: 600,
          fontSize: '1.25rem',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid',
          borderColor: 'divider',
          py: 2
        }}
      >
        Add New Exam
      </DialogTitle>
      
      <Box component="form" id="add-exam-form" onSubmit={handleSubmit} noValidate>
        <DialogContent sx={{ py: 3 }}>
          <Stack spacing={3}>
            <TextField
              select
              label="Course"
              name="course_id"
              value={formValues.course_id}
              onChange={handleChange}
              required
              fullWidth
              size="medium"
              error={!!errors.course_id}
              helperText={errors.course_id}
              slotProps={{
                htmlInpu: {
                  required: true,
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  '&:hover fieldset': {
                    borderColor: '#003C64',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#003C64',
                    borderWidth: '2px'
                  }
                }
              }}
            >
              <MenuItem value="">
                <Typography color="text.secondary">Select Course</Typography>
              </MenuItem>
              {courses.map((course) => (
                <MenuItem key={course.course_id} value={course.course_id}>
                  {course.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Semester"
              name="semester_id"
              value={formValues.semester_id}
              onChange={handleChange}
              required
              fullWidth
              size="medium"
              error={!!errors.semester_id}
              helperText={errors.semester_id}
              slotProps={{
                htmlInput: {
                  required: true,
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  '&:hover fieldset': {
                    borderColor: '#003C64',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#003C64',
                    borderWidth: '2px'
                  }
                }
              }}
            >
              <MenuItem value="">
                <Typography color="text.secondary">Select Semester</Typography>
              </MenuItem>
              {semesters.map((semester) => (
                <MenuItem key={semester.semester_id} value={semester.semester_id}>
                  {semester.name+" "+semester?.academic_year}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Exam Type"
              name="exam_type"
              value={formValues.exam_type}
              onChange={handleChange}
              required
              fullWidth
              size="medium"
              error={!!errors.exam_type}
              helperText={errors.exam_type}
              slotProps={{
                htmlInpu: {
                  required: true,
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  '&:hover fieldset': {
                    borderColor: '#003C64',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#003C64',
                    borderWidth: '2px'
                  }
                }
              }}
            >
              <MenuItem value="">
                <Typography color="text.secondary">Select Exam Type</Typography>
              </MenuItem>
              <MenuItem value="midterm">Midterm</MenuItem>
              <MenuItem value="final">Final</MenuItem>
              <MenuItem value="quiz">Quiz</MenuItem>
              <MenuItem value="assignment">Assignment</MenuItem>
            </TextField>

            <TextField
              label="Exam Date"
              type="date"
              name="date"
              value={formValues.date}
              onChange={handleChange}
              required
              fullWidth
              size="medium"
              focused
              error={!!errors.date}
              helperText={errors.date}
              slotProps={{
                htmlInput: {
                  required: true,
                  min: new Date().toISOString().split('T')[0],
                  title:"Past Date is not allowed" // Prevent past dates
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  '&:hover fieldset': {
                    borderColor: '#003C64',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#003C64',
                    borderWidth: '2px'
                  }
                }
              }}
            />

            <TextField
              label="Duration (minutes)"
              type="number"
              name="duration_minutes"
              value={formValues.duration_minutes}
              onChange={handleChange}
              required
              fullWidth
              size="medium"
              error={!!errors.duration_minutes}
              helperText={errors.duration_minutes}
              slotProps={{
                htmlInpu: {
                  required: true,
                  min: 1,
                  max: 480
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  '&:hover fieldset': {
                    borderColor: '#003C64',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#003C64',
                    borderWidth: '2px'
                  }
                }
              }}
            />

            <TextField
              label="Total Marks"
              type="number"
              name="total_marks"
              value={formValues.total_marks}
              onChange={handleChange}
              required
              fullWidth
              size="medium"
              error={!!errors.total_marks}
              helperText={errors.total_marks}
              slotProps={{
                htmlInpu: {
                  required: true,
                  min: 1,
                  max: 1000
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  '&:hover fieldset': {
                    borderColor: '#003C64',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#003C64',
                    borderWidth: '2px'
                  }
                }
              }}
            />
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button 
            onClick={handleClose}
            variant="outlined"
            sx={{ 
              color: '#003C64',
              borderColor: '#003C64',
              borderRadius: 1,
              textTransform: 'none',
              px: 3,
              '&:hover': {
                borderColor: '#003C64',
                backgroundColor: '#003C6408'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            form="add-exam-form"
            variant="contained"
            sx={{ 
              backgroundColor: '#003C64',
              borderRadius: 1,
              textTransform: 'none',
              px: 4,
              '&:hover': {
                backgroundColor: '#002A4A'
              }
            }}
            loading={isloading}
          >
            Add Exam
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
  }


  
};

export default AddExamDialog;