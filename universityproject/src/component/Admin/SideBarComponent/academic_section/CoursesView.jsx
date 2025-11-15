import React, { useEffect, useRef, useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Grid,
  Box,
  Container,
  Avatar,
  Breadcrumbs,
  Link,
  Autocomplete,
  TextField,
  useTheme
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  Class as ClassIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
 
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProgramsByDepartment } from '../../../redux/Slices/DepartmentSlice';
import { fetchCoursesByProgram } from '../../../redux/Slices/CourseSlice';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import NOTFOUND from '../../../NotFound';
import AssignPrerequisitesDialog from './AssignPrerequisitesDialog';
const CourseView = ({setview,department_id}) => {
  const dispatch=useDispatch()
  const theme=useTheme()
  const ref=useRef(false)
  const {programs}=useSelector(state=>state.department)
  const {courses}=useSelector(state=>state.course)
  const [AssignDialog,setAssignDialog]=useState({status:false,course_id:0,course_name:""})
  useEffect(()=>{
    if(department_id)
    dispatch(fetchProgramsByDepartment(department_id))
  },[setview,department_id])
 useEffect(()=>{
  if(programs.length>0&&!ref.current){
     ref.current=true
    dispatch(fetchCoursesByProgram(programs[0]?.program_id))
   
  }
 },[programs])

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Classroom-style App Bar */}
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          backgroundColor: theme.palette.primary.dark,
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.light} 100%)`,
          borderBottom: '1px solid #e0e0e0',
          borderRadius:10
        }}
      >
        <Toolbar sx={{ minHeight: 150 }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="back"
            sx={{ 
              mr: 3,
              backgroundColor: 'rgba(255,255,255,0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)'
              }
            }}
            onClick={()=>setview("dep")}
          >
            <ArrowBackIcon />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="div" sx={{ fontWeight: 500, mb: 0.5,userSelect:"none" }}>
              Course Management
            </Typography>
           
          </Box>
           <Autocomplete
           options={programs||[]}
           getOptionLabel={op=>op?.name}
           key={new Date()}
           defaultValue={programs[0]}
           defaultChecked
            sx={{ 
              minWidth: 220,
              
              backgroundColor: 'rgba(255,255,255,0.9)',
              borderRadius: 2,
              
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none'
              }
            }}
            onChange={(_,value)=>{
              
              if(value?.program_id)
              dispatch(fetchCoursesByProgram(value?.program_id))
            }}
           renderInput={(pa)=>(
            
            <TextField
            {...pa}
            label={"Filter by Program"}
            variant='filled'
             color='primary'
            />
           )}
           
           />
         
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4, px: 3 }}>
        {/* Summary Row */}
        {/* <Box sx={{ 
          mb: 4, 
          p: 3, 
          backgroundColor: 'white', 
          borderRadius: 3,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          border: '1px solid #e0e0e0'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" component="h2" fontWeight="600" gutterBottom>
                Academic Courses
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Total Courses: <strong>{courses.length}</strong> • 
                Active Semesters: <strong>Fall 2024, Spring 2024</strong>
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #1a73e8 0%, #6c8ef5 100%)'
              }}
            >
              Add New Course
            </Button>
          </Box>
        </Box> */}

        {/* Course Grid */}
        <AssignPrerequisitesDialog AssignDialog={AssignDialog} setAssignDialog={setAssignDialog}/>
        <Grid container spacing={3}>
          {courses.length>0?courses.map((course, index) => (
            <Grid item xs={12} sm={6} lg={4} key={index}>
              <Card 
                elevation={0}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  border: '1px solid #e0e0e0',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: 'white',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                    borderColor:  theme.palette.primary.dark
                  }
                }}
              >
                {/* Course Header with Color Accent */}
                <Box sx={{ 
                  height: 6,
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.light} 100%)`
                }} />
                
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  {/* Course Code and Credit Hours */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Chip 
                      label={course.code}
                      color="primary"
                      sx={{ 
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        borderRadius: 2,
                        backgroundColor:  theme.palette.primary.dark
                      }}
                    />
                    <Chip 
                      label={`${course.credit_hours} Credits`}
                      variant="outlined"
                      sx={{ 
                        fontWeight: 600,
                        borderRadius: 2,
                        borderColor:  theme.palette.primary.dark,
                        color:  theme.palette.primary.dark
                      }}
                    />
                  </Box>

                  {/* Course Name */}
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 600,
                      lineHeight: 1.3,
                      mb: 2,
                      color:  theme.palette.primary.main
                    }}
                  >
                    {course.name}
                  </Typography>

                  {/* Course Description */}
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 3,
                      lineHeight: 1.6,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {course.description}
                  </Typography>

                  {/* Course Metadata */}
                  <Box sx={{ mb: 2 }}>
                    
                    
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        label={course.semester}
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: 2, fontWeight: 500 }}
                      />
                      <Chip 
                        label={`Year ${course.level}`}
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: 2, fontWeight: 500 }}
                      />
                     
                    </Box>
                  </Box>
                </CardContent>

                {/* Action Buttons */}
                <CardActions sx={{ 
                  p: 3, 
                  pt: 0, 
                  gap: 1,
                  borderTop: '1px solid #f0f0f0',
                  mt: 'auto'
                }}>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    color="primary"
                    startIcon={<EditIcon />}
                    sx={{ 
                      borderRadius: 3,
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 2,
                      flex: 1
                    }}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    color="error"
                    startIcon={<DeleteIcon />}
                    sx={{ 
                      borderRadius: 3,
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 2,
                      flex: 1
                    }}
                  >
                    Delete
                  </Button>
                   <Button 
                    size="small" 
                    variant="outlined" 
                    color="success"
                    startIcon={<LibraryBooksIcon />}
                    sx={{ 
                      borderRadius: 3,
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 2,
                      flex: 1
                    }}
                    onClick={()=>setAssignDialog({status:true,course_id:course?.course_id,course_name:course.name})}
                  >
                    Assign prerequisites courses
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          )):<NOTFOUND message={"No courses detected under this program"}/>}
        </Grid>
      </Container>
    </Box>
  );
};

export default CourseView;