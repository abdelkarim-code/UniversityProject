import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  Typography,
  Box,
  FormControl,
  InputLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { getsemesters } from '../../../redux/Slices/SemesterSlice';
import { deleteExam, fetchExams, publishExam } from '../../../redux/Slices/ExamSlice';
import moment from 'moment';
import { useConfirm } from 'material-ui-confirm';

// Styled components using the color scheme
const StyledTableContainer = styled(TableContainer)({
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  marginTop: '16px',
});

const StyledTableHead = styled(TableHead)({
  backgroundColor: '#003C64',
});

const StyledHeaderCell = styled(TableCell)({
  color: 'white',
  fontWeight: 'bold',
  fontSize: '14px',
  padding: '16px 12px',
});

const StyledTableRow = styled(TableRow)(({ even }) => ({
  backgroundColor: even ? '#f8f9fa' : 'white',
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
}));

const StyledTableCell = styled(TableCell)({
  padding: '12px',
  borderBottom: '1px solid #e0e0e0',
});

const PublishButton = styled(Button)({
  backgroundColor: '#fdd835',
  color: '#003C64',
  fontWeight: 'bold',
  textTransform: 'none',
  padding: '6px 16px',
  '&:hover': {
    backgroundColor: '#fbc02d',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
});
const DeleteButton = styled(Button)({
  backgroundColor: '#ff4444',
  color: 'white',
  fontWeight: 'bold',
  textTransform: 'none',
  padding: '6px 16px',
  marginLeft: '8px',
  '&:hover': {
    backgroundColor: '#cc0000',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
});

const SemesterFilterContainer = styled(Box)({
  marginBottom: '24px',
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
});
const ExamTable = () => {
  const {semesters}=useSelector(state=>state.semester)
   const [selectedSemester, setSelectedSemester] = useState(
  semesters[0]?.semester_id || ''
);
   const {exams:filteredExams}=useSelector(state=>state.exam)
   const confirm = useConfirm();
  const dispatch=useDispatch()
  useEffect(() => {
    
  if (semesters.length > 0) {
    const firstSemesterId = semesters[0].semester_id;
    setSelectedSemester(firstSemesterId);
    dispatch(fetchExams(firstSemesterId));
  }else{
    dispatch(getsemesters())
  }
}, [semesters]);
  const handleSemesterChange = (event) => {
    dispatch(fetchExams(event.target.value))
    setSelectedSemester(event.target.value)
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <Box sx={{ padding: '24px' }}>
      {/* Header */}
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        sx={{ 
          color: '#003C64',
          fontWeight: 'bold',
          marginBottom: '32px'
        }}
      >
        Exam Schedule
      </Typography>

      {/* Semester Filter */}
      <SemesterFilterContainer>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="semester-filter-label">Select Semester</InputLabel>
          <Select
            labelId="semester-filter-label"
            value={selectedSemester}
            label="Select Semester"
            onChange={handleSemesterChange}
            
          >
            {semesters.length>0&&(
                semesters.map((s,index)=>(
                <MenuItem key={index} value={s.semester_id}>{s?.name+' '+s?.academic_year}</MenuItem>
                ))
            )}
            
         
          </Select>
        </FormControl>
        
        <Typography variant="body2" sx={{ color: '#666' }}>
          Showing {filteredExams.length} exam(s)
        </Typography>
      </SemesterFilterContainer>

      {/* Exam Table */}
      <StyledTableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="exam schedule table">
          <StyledTableHead>
            <TableRow>
              <StyledHeaderCell>Course Code / Name</StyledHeaderCell>
              <StyledHeaderCell>Exam Type</StyledHeaderCell>
              <StyledHeaderCell>Date</StyledHeaderCell>
              <StyledHeaderCell>Duration</StyledHeaderCell>
              <StyledHeaderCell>Total Marks</StyledHeaderCell>
              <StyledHeaderCell>Status</StyledHeaderCell>
              <StyledHeaderCell>Action</StyledHeaderCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {filteredExams.map((exam, index) => (
              <StyledTableRow key={exam.exam_id} even={index % 2 === 0}>
                <StyledTableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#003C64' }}>
                    {exam.course_code}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {exam.course_name}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell>
                  <Typography variant="body2">
                    {exam.exam_type}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {moment(exam.date).format("DD/MM/YYYY")}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell>
                  <Typography variant="body2">
                    {formatDuration(exam.duration_minutes)}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {exam.total_marks}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 'medium',
                      color: exam.publish_exam ? '#2e7d32' : '#d32f2f'
                    }}
                  >
                    {exam.publish_exam ? 'Published' : 'Unpublished'}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell>
                  {!exam.publish_exam && (
                    <PublishButton variant="contained" size="small" onClick={() => {
                                        confirm({
                                        title: "Publish Exam",
                                        description: `Are you sure you want to publish "${exam.course_name}" exam? Once published, it will be visible to students and doctors, and you cannot delete it afterwards.`
                                        })
                                        .then(() => {
                                            // Trigger publish thunk
                                            dispatch(publishExam({ 
                                            exam_id: exam.exam_id, 
                                            semester_id: selectedSemester 
                                            }));
                                        })
                                        
                                    }}>
                      Publish
                    </PublishButton>
                  )}
                   {!exam.publish_exam && (
                   <DeleteButton variant="contained" size="small" onClick={()=>{
                             confirm({title:"Confirm exam deletion", description: `Are you sure you want to delete "${exam.course_name} exam"?` })
                                        .then(() => {
                                           
                                            dispatch(deleteExam({exam_id:exam.exam_id,semester_id:selectedSemester}))
                                        })
                                       

                   }}   >
                     Delete
                    </DeleteButton>
                  )}
                  
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {/* Empty state */}
      {filteredExams.length === 0 && (
        <Box sx={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <Typography variant="h6">
            No exams found for the selected semester
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ExamTable;