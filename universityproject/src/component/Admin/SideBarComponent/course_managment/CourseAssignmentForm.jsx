import { Card,  Box, Typography,  TextField,  AppBar, Button, CircularProgress, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import {   IconButton, Autocomplete } from "@mui/material";
import { AddCircleOutline, Visibility } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AssignCourseToDoctor, clearCourses, fetchCoursesByDepartment } from "../../../redux/Slices/CourseSlice";
import { fetchDoctorsByDepartment } from "../../../redux/Slices/DoctorSlice";
import { fetchDepartments } from "../../../redux/Slices/DepartmentSlice";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ClearBlocks, fetchBlocks, fetchCampuses, fetchRooms } from "../../../redux/Slices/RoomSlice";
import { useAlert } from "../../../../context";
import { getsemesters } from "../../../redux/Slices/SemesterSlice";
const DashboardCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  border: `1px solid ${theme.palette.divider}`,
  width: "100%",
  maxWidth: "1200px",
  margin: "0 auto",
}));

const FormAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderRadius: "12px 12px 0 0",
  boxShadow: "none",
  padding: theme.spacing(0),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: "8px",
    backgroundColor: theme.palette.background.default,
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: "2px",
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: theme.palette.primary.main,
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  fontWeight: "bold",
  textTransform: "none",
  padding: theme.spacing(1, 3),
  fontSize: "0.875rem",
}));

export default function CourseAssignmentForm() {
 const [view,setview]=useState("choice")
 const [loading,setloading]=useState(false)
 const alert=useAlert()
 const {departments}=useSelector(state=>state.department)
const [selectedCampus,setSelectedCampus]=useState("")
 const courseState=useSelector(state=>state.course)
 const doctorState=useSelector(state=>state.doctor)
 const {semesters}=useSelector(state=>state.semester)
 const {campuses,blocks,isloading,rooms}=useSelector(state=>state.room)
const dispatch=useDispatch()


 useEffect(()=>{

  if(view!="choice1"){
    
  dispatch(fetchDepartments())
  setloading(false)
  dispatch(ClearBlocks())
  dispatch(clearCourses())
  
}
 
 },[view])

 

const handleDepartmentSelect = async (department_id) => {
 
  try {
     setloading(true)
    const [courses, doctors, semesters] = await Promise.all([
       dispatch(fetchCoursesByDepartment(department_id)).unwrap(),
      dispatch(fetchDoctorsByDepartment(department_id)).unwrap(),
       dispatch(getsemesters()).unwrap(),
       dispatch(fetchCampuses())
    ]);

    if (!courses.length || !doctors.length||!semesters.length) {
      alert.setopen({
        state: true,
        message: "This department has no courses or doctors assigned. Please add them to proceed.",
        color: "error",
      });
      
    } else {
        setview("choice1")
    }
  } catch (err) {
    console.error("Error fetching data:", err);
  } finally {
     setloading(false)
  }
};
useEffect(()=>{
 
   if(courseState.status==201){
    setview("choice")
    alert.setopen({state:true,message:"Course assign successfully",color:"success"})
  }else if(courseState.status==409){
    alert.setopen({state:true,message:courseState?.message,color:"error"})
  }
},[courseState.status,courseState?.message])


 const handleSubmit = async(event) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
       const Data=Object.fromEntries(formData.entries())
       
    
       if(Data?.room_id){
        
        const room_id=rooms.find((r)=>r.room_number==Data.room_id)?.id
        const course_id=courseState.courses.find((r)=>r.name==Data.course_id)?.course_id
        const revertName=Data.doctor_id.split(" ")
        const doctor_id=doctorState.doctors.find((r)=>r.employee_code==`${revertName[0]}.${revertName[1]}`)?.doctor_id
      const schedule_time=`${Data?.day}-${Data?.schedule_time}`
      const semester=semesters.find(op=>op?.name+" "+op?.academic_year.trim()==Data.semester.trim())?.semester_id
      
      dispatch(AssignCourseToDoctor({room_id,course_id,doctor_id,schedule_time
                                     ,semester:semester,section:Data?.section,campus:selectedCampus}))


       }else{
        alert.setopen({
        state: true,
        message: "Select a room to proceed",
        color: "error",
      });
       }
      
    
      
    };


 return(
 <DashboardCard
      sx={{
        maxWidth: 600,
      
        mx: "auto",
        mt: 1,
        ml:10,
        p: 3,
        borderRadius: 3,
        boxShadow: 3,
        bgcolor: "background.paper",
        position:"fixed"
      }}
    >
      {/* Header */}
       <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {view=="choice"?<AddCircleOutline color="primary" fontSize="large" />:<ArrowBackIcon onClick={()=>{
            
            setview("choice") 
            // dispatch(ClearBlocks())
            // dispatch(clearCourses())
          }} sx={{cursor:"pointer"}}/>}
          <Typography variant="h6" fontWeight="bold">
            Assign Courses to doctors
          </Typography>
        </Box>

      
      </Box>
      {view=="choice"?(
      
        <Box
       
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
      {!loading?<Autocomplete
          onChange={(_,value)=>{
           handleDepartmentSelect(value?.department_id||0)
          }}
          options={departments}
          getOptionLabel={(option)=>option.name}
          renderInput={(params) => {
            
            return <TextField {...params} label="Departemnt name"   />
          }}
        />:<CircularProgress color="primary" sx={{width:50,height:50,ml:25}}/>} 
       
      </Box>


      ):(
      <form
       id="subscription-form"
       onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
      
        {/* Doctor Name */}
        <Autocomplete
          
          options={doctorState.doctors}
          getOptionLabel={(option)=>option?.first_name+" "+option?.last_name}
          renderInput={(params) => (
            <TextField {...params} label="Doctor Name" name="doctor_id" required />
          )}
        />

        {/* Course Name */}
        <Autocomplete
          options={courseState.courses}
          getOptionLabel={(option)=>option?.name}
          renderInput={(params) => (
            <TextField {...params} label="Course Name" name="course_id" required />
          )}
        />

        

        {/* Semester */}
        <Autocomplete
         options={semesters||[]}
         getOptionLabel={op=>op?.name+" "+op?.academic_year}
        renderInput={(params)=>(
         <StyledTextField
         {...params}
          label="Semester"
          name="semester"
          placeholder="Fall or Spring"
          required
        />
        )}
        />
       

        {/* Section */}
        <StyledTextField
          label="Section"
          name="section"
          placeholder="e.g. A, B, C"
          inputProps={{ pattern: "^[A-Za-z0-9]+$" }}
          required
        />

        {/* Schedule Time */}
        <Stack  direction={"row"} spacing={2}>
            <StyledTextField
          label="Schedule Time"
          fullWidth
          name="schedule_time"
          type="time"
          required
          InputLabelProps={{ shrink: true }}
        />
         <Autocomplete
         fullWidth
         options={["Monday","Tuesday","Wednesday","Thurday","Friday"]}
        renderInput={(params)=>(
         <StyledTextField
         {...params}
          label="Day"
          name="day"
          placeholder="choose the Day"
          required
        />
        )}
        />
        </Stack>
       {blocks?.length==0?
       (
        <Autocomplete
         options={campuses.map(camp=>camp.campus)}
         loading={isloading}
         loadingText={"fetching blocks..."}
         key="first_combo"
         onChange={(_,value)=>{
         if(value&&value!="")
          setSelectedCampus(value.trim())
          dispatch(fetchBlocks(value.trim()))
         }}
        
        renderInput={(params)=>(
         <StyledTextField
         {...params}
          label="Select the campus where this class will take place."
          name="semester"
          placeholder="e.g. Saida"
          required
        />
        )}
        />
       ):
       rooms.length==0?
       (
          <Autocomplete
         options={blocks.map(block=>block.block)}
         key="second_combo"
         onChange={(_,value)=>{
          if(value&&value!=""&&selectedCampus)
           dispatch(fetchRooms({block:value?.trim(),campus:selectedCampus}))
         }}
      
        renderInput={(params)=>(
         <StyledTextField
         {...params}
          label="Select the block where this class will take place."
          name="semester"
          placeholder="e.g. A,B"
          required
        />
        )}
        />
       ):
        (
          <Autocomplete
         options={rooms}
         getOptionLabel={(option)=>option?.room_number}
         key="third_combo"
        
         autoComplete
         autoHighlight
         autoSelect
        renderInput={(params)=>(
         <StyledTextField
         {...params}
          label="Select the Room where this class will take place."
          name="room_id"
          placeholder="e.g. 201-A"
          required
        />
        )}
        />
       )
       
       }
        

        <ActionButton variant="contained" type="submit" loading={isloading} form="subscription-form" sx={{ mt: 2 }}>
          Submit
        </ActionButton>
      </form>



      )}
      
       
      {/* Form */}
     
    </DashboardCard>
 )
}