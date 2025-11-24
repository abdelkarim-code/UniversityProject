import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Switch, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { getCurrentSemester } from '../../redux/Slices/SemesterSlice';
import { fetchPublishedExams } from '../../redux/Slices/ExamSlice';

// Colors
const PRIMARY_YELLOW = '#fdd835';
const PRIMARY_BLUE = '#003C64';
const WHITE = '#ffffff';

// Styled Paper for semester card
const ExamCard = styled(Paper)(({ theme }) => ({
  backgroundColor: WHITE,
  padding: theme.spacing(2),
  margin: theme.spacing(2, 0),
  borderRadius: 8,
  boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));
const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };
const ExamToggle = ({ semester }) => {



  return (
    <ExamCard>
      <Box>
        <Typography variant="h6" sx={{ color: PRIMARY_BLUE, fontWeight: 'bold' }}>
          {semester.course_code} - {semester.exam_type} 
        </Typography>
        <Typography variant="h6" sx={{ color: PRIMARY_BLUE, fontWeight: 'bold' }}>
          {semester.course_name}
        </Typography>
        <Typography variant="body2" sx={{ color: '#666' }}>
          {`In: ${moment(semester.date)?.format("DD/MM/YYYY")} | Duration: ${formatDuration(semester?.duration_minutes)}`}
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" gap={1}>
        <Typography sx={{ color: PRIMARY_BLUE, fontWeight: 'bold' }}>
          Total grade: {semester?.total_marks}
        </Typography>
       
      </Box>
    </ExamCard>
  );
};

// Demo component with hardcoded semester list
const ExamSection = () => {
    const [exams,setexams]=useState({})
    const dis=useDispatch()
    async function getData(){
      const req=  await dis(getCurrentSemester()).unwrap()
        dis(fetchPublishedExams(req?.semester_id)).unwrap().then(setexams)
    }

    
  useEffect(()=>{
   getData()
  },[])


// semester_id

  return (
   
      <Container sx={{ padding: 3 }} maxWidth="lg">
        <Typography variant='h2' sx={{mt:2,textAlign:"center",color:PRIMARY_BLUE}}>Exam Sheduled</Typography>
        {exams.length>0&&exams.map((sem) => (
          <ExamToggle key={sem.semester_id} semester={sem} />
        ))}
       
      </Container>
    
  );
};

export default ExamSection;
