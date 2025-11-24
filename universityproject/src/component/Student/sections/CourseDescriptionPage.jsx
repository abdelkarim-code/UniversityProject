import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  Divider,
  Grid,
  Box,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoursesByDepartment, fetchTypeOfcourses } from '../../redux/Slices/CourseSlice';

// Styled components
const SectionContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  padding: theme.spacing(2, 0),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: '#003C64',
  fontSize: '22px',
  marginBottom: theme.spacing(1),
}));

const CourseCard = styled(Card)(({ theme }) => ({
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  padding: theme.spacing(2),
  backgroundColor: 'white',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 8px 15px rgba(0, 0, 0, 0.15)',
    transform: 'translateY(-2px)',
  },
}));

const CourseCode = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: '#fdd835',
  fontSize: '16px',
  marginBottom: theme.spacing(0.5),
}));

const CourseTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: '#003C64',
  fontSize: '18px',
  marginBottom: theme.spacing(1),
}));

const CourseCredits = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  color: '#666',
  fontStyle: 'italic',
  marginBottom: theme.spacing(1),
}));

const CourseDescription = styled(Typography)(() => ({
  fontSize: '14px',
  color: '#003C64',
  lineHeight: 1.5,
  fontWeight: 'regular',
}));


// Type to section title mapping
const typeToTitle = {
  major: "Major Requirements",
  major_elective: "Major Electives",
  elective: "Electives",
  remedial: "Remedial Courses",
  lab: "Laboratory Courses",
  graduation_project: "Graduation Project"
};



const CourseDescriptionPage = () => {
  
  const {active_user}=useSelector(state=>state.auth)
  const dispatch=useDispatch()
  const {courses}=useSelector(state=>state.course)
  const [types_courses,settypes_courses]=useState(false)
  console.log(active_user?.department_id)
  useEffect(()=>{
        if(active_user){
            dispatch(fetchCoursesByDepartment(active_user?.department_id))
            dispatch(fetchTypeOfcourses(active_user?.department_id)).unwrap().then(settypes_courses)
        }
  },[])
  return (
    <Container maxWidth="lg" sx={{ py: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography 
        variant="h3" 
        component="h1" 
        sx={{ 
          fontWeight: 'bold', 
          color: '#003C64', 
          textAlign: 'center', 
          mb: 4,
          fontSize: { xs: '28px', md: '32px' }
        }}
      >
        {active_user?.name} Curriculum
      </Typography>
      
      <Stack spacing={4}>
        {types_courses.length>0&&types_courses.map(({type}) => (
          <SectionContainer key={type}>
            <SectionTitle variant="h2">
              {typeToTitle[type]}
            </SectionTitle>
            <Divider sx={{ mb: 3, backgroundColor: '#003C64', opacity: 0.3 }} />
            
            <Grid container spacing={3}>
              {courses.length>0&&courses.filter(c=>c?.course_category==type).map((course, index) => (
                <Grid item size={12} key={index}>
                  <CourseCard>
                    <CourseCode variant="h6">
                      {course?.code}
                    </CourseCode>
                    <CourseTitle variant="h5">
                      {course?.name}
                    </CourseTitle>
                    <CourseCredits variant="body2">
                      {course?.credit_hours} Credit{course?.credit_hours !== 1 ? 's' : ''}
                    </CourseCredits>
                    <CourseDescription variant="body1">
                      {course?.description}
                    </CourseDescription>
                  </CourseCard>
                </Grid>
              ))}
            </Grid>
          </SectionContainer>
        ))}
      </Stack>
    </Container>
  );
};

export default CourseDescriptionPage;