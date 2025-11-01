import { Avatar, Box, Card, CardContent, Chip, Container, IconButton, List, 
 Menu, MenuItem, Paper, styled, Typography, } from '@mui/material'
import {useEffect, useState} from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartmentByFaculty } from '../redux/Slices/DepartmentSlice';
import LinearProgress from '@mui/material/LinearProgress';

const SuccessCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  borderRadius: '12px',
  boxShadow: theme.shadows[4],
  marginBottom: theme.spacing(3),
}));




function Department_Component({facultyid,name,close}) {
      
    const [anchor,setanchor]=useState(null)
      const OpenAnchor=Boolean(anchor)
      const dispatch=useDispatch()
      const {deUnderFaculty}=useSelector(state=>state.department)
      console.log(deUnderFaculty)
      useEffect(()=>{
        console.log(facultyid)
        if(facultyid!=0){
          dispatch(fetchDepartmentByFaculty(facultyid))
        }
      
      },[])
     

  return (
    <Container maxWidth={"xl"}>

      <SuccessCard>
        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',userSelect: "none", cursor: "default" }}>
          <Box>
           
            <Typography variant="h4" component="div" gutterBottom  fontWeight={"bold"}>
              {name}
            </Typography>
           
            <Chip 
              label={"Back"} 
              color="warning" 
              sx={{ color: 'white', fontWeight: 'bold', mt: 1 }} 
              onClick={()=>close({status:false,faculty_id:0,name:""})}
            />
          </Box>
         </CardContent>
        <LinearProgress 
        variant="determinate" value={60}
        
       sx={{ height: 8, borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px'}} 
        />
      </SuccessCard>
    <List>
  {deUnderFaculty.length>0?deUnderFaculty.map((d ) => (
        <Paper
      elevation={3}
      sx={{
        p: 2,
        my: 1,
        borderRadius: 3,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
      }}
      key={d.department_id}
    >
      {/* Left side: Avatar / code */}
      <Box sx={{ mr: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar
          sx={{
            width: 56,
            height: 56,
            backgroundColor: '#2196f3',
            fontWeight: 'bold',
            fontSize: '1rem',
          }}
        >
          {d.code}
        </Avatar>
      </Box>

      {/* Middle: Title + Description */}
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, }}>
          {d.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, }}>
          {d.description}
        </Typography>
      </Box>

      {/* Right side: Action button */}
      <IconButton edge="end" onClick={(e) => setanchor(e.currentTarget)}>
        <MoreVertIcon />
      </IconButton>
    </Paper>
    )):<h1>no department</h1>}
    <Menu anchorEl={anchor} open={OpenAnchor} onClose={()=>setanchor(null)}>
    <MenuItem onClick={()=>{
      setanchor(null)
      
      }}>Edit</MenuItem>
    <MenuItem onClick={()=>{
      setanchor(null)
      
      }}>Delete</MenuItem>
  </Menu>
    </List>
     </Container>
  )
}

export default Department_Component