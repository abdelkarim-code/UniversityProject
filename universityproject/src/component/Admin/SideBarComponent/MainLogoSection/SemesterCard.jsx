import React, { useEffect } from 'react';
import { Box, Typography, Paper, Switch } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useDispatch, useSelector } from 'react-redux';
import { getsemesters } from '../../../redux/Slices/SemesterSlice';
import moment from 'moment';

// Colors
const PRIMARY_YELLOW = '#fdd835';
const PRIMARY_BLUE = '#003C64';
const WHITE = '#ffffff';

// Styled Paper for semester card
const SemesterCard = styled(Paper)(({ theme }) => ({
  backgroundColor: WHITE,
  padding: theme.spacing(2),
  margin: theme.spacing(2, 0),
  borderRadius: 8,
  boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const SemesterToggle = ({ semester }) => {

//   const [active, setActive] = useState(semester.status === 'active');

//   const handleToggle = () => {
//     setActive(pre=>!pre);
    
//   };

  return (
    <SemesterCard>
      <Box>
        <Typography variant="h6" sx={{ color: PRIMARY_BLUE, fontWeight: 'bold' }}>
          {semester.name} - {semester.academic_year}
        </Typography>
        <Typography variant="body2" sx={{ color: '#666' }}>
          {`Start: ${moment(semester.start_date)?.format("DD/MM/YYYY")} | End: ${moment(semester.end_date)?.format("DD/MM/YYYY")}`}
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" gap={1}>
        <Typography sx={{ color: PRIMARY_BLUE, fontWeight: 'bold' }}>
          {semester.status==="active" ? 'Active' : 'Upcoming'}
        </Typography>
        <Switch
          checked={semester.status==="active"}
        //   onChange={handleToggle}
          sx={{
            '& .MuiSwitch-switchBase.Mui-checked': {
              color: PRIMARY_YELLOW,
            },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              backgroundColor: PRIMARY_YELLOW,
            },
          }}
        />
      </Box>
    </SemesterCard>
  );
};

// Demo component with hardcoded semester list
const SemesterSectionDemo = () => {
    const {semesters}=useSelector(state=>state.semester)
    const dis=useDispatch()
  useEffect(()=>{
   dis(getsemesters())
  },[])

  return (
   
      <Box sx={{ padding: 3 }}>
        {semesters.length>0&&semesters.map((sem) => (
          <SemesterToggle key={sem.semester_id} semester={sem} />
        ))}
      </Box>
    
  );
};

export default SemesterSectionDemo;
