import React, { useEffect, useState} from 'react';
import {Typography, Card, Box, Container, useTheme,useMediaQuery,} from '@mui/material';
import { Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import StudentInfoCard from './StudentInfoCard';
import AppBarHeader from './AppBarHeader';
import Regsitration from './sections/Registration';
import { useDispatch, useSelector } from 'react-redux';
import { CheckTokenValidation, getActiveUserInfo } from '../redux/Slices/AuthSlice';
import CurrentSemesterCard from './sections/Current_semester';
import { getCurrentSemester } from '../redux/Slices/SemesterSlice';
import moment from 'moment/moment';

const StudentPanel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const {active_user}=useSelector(state=>state.auth)
  const [scroll,setscroll]=useState(false)
  const dispatch=useDispatch()
  const [current_semester,setcurrent_semester]=useState({})
  const location=useLocation()
  const navigate=useNavigate()
  
  useEffect(()=>{
        document.querySelector("html").style.scrollBehavior = "smooth";
      const handleScroll=()=>{
        if(window.scrollY==0){
          setscroll(false)
        }else{
          
          setscroll(true)
        }
      }
      const handlePopState = (e) => {
    e.preventDefault();
   navigate("/Liu/Login")
    
}
window.addEventListener("popstate", handlePopState);
      window.addEventListener("scroll",handleScroll)
      return ()=>{
        window.removeEventListener("scroll",handleScroll,{passive: true})
        window.removeEventListener("popstate", handlePopState);
    }
    },[])
 

const TokenCheck=async()=>{
  try{
    const req=await dispatch(CheckTokenValidation(true)).unwrap()
     
  if(req.status==200){
    if(active_user&&Object.keys(active_user).length==0){
        const {user_info}=req
        dispatch(getActiveUserInfo({userid:user_info.user_id,type:"getstudentInfo"}))
  }
  }else if(req.status==401){
    navigate("/Liu/Login")
  }
  }catch(err){
    console.log("from token check: ",err)
     navigate("/Liu/Login")
  }
  
}

useEffect(() => {
   TokenCheck()


}, []);
 
 
    const fetchCurrentSemester=async()=>{
       const c_sem=await dispatch(getCurrentSemester()).unwrap()

      return {...c_sem,
        start_date:moment(c_sem?.start_date).format("YYYY-MM-DD"),
        end_date:moment(c_sem?.end_date).format("YYYY-MM-DD")
    }
     }

  
  useEffect(()=>{

    fetchCurrentSemester().then(setcurrent_semester)
  },[])
// Navigation menu items
const menuItems = [
    "Semester Timeline",
    "GPA Calculator", 
    "Registration",
    "Course Description",
    "Classes",
    "Plan of Study"
  ];

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* AppBar - Top Navigation */}
      <AppBarHeader sx={{ zIndex: 1000 }} scroll={scroll}/>
         {/* STUDENT CARD */}
        {!scroll?(
         <Box
        sx={{top:0,position:"fixed",transform:"translateX(155%)", zIndex: 100000 }}
      >
        <StudentInfoCard studentData={active_user}  />
      </Box>

        ):
        location.pathname=="/Liu/students/Registration"?
          <Box
        sx={{top:0,position:"fixed",transform:"translateX(230%)", zIndex: 100000 }}
      >
       <CurrentSemesterCard semesterData={current_semester}/>
      </Box>:
           <Box
        sx={{top:0,position:"fixed",transform:"translateX(155%)", zIndex: 100000 }}
      >
        <StudentInfoCard studentData={active_user}  />
      </Box>
        } 
      {/* Main Content */}
      <Box sx={{ position: 'relative', mt: 2 }}>
        <Container maxWidth="lg">
        

          {/* Mobile Navigation (shown only on mobile) */}
          {isMobile && (
            <Card sx={{ mb: 4, p: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {menuItems.map((item) => (
                  <Typography
                    key={item}
                    variant="body2"
                    sx={{
                      color: '#003C64',
                      cursor: 'pointer',
                      fontWeight: 500,
                      p: 1,
                      borderRadius: 1,
                      '&:hover': {
                        bgcolor: 'rgba(0,60,100,0.04)'
                      }
                    }}
                  >
                    {item}
                  </Typography>
                ))}
              </Box>
            </Card>
          )}

         
         
        </Container>
         {/* Nested Routes here */}
              <Outlet context={current_semester}/>
      </Box>
    </Box>
  );
};

export default StudentPanel;