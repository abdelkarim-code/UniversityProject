import React, {useEffect,useRef,useState } from 'react'
import { Dialog, DialogContent,List,IconButton,ListItemText,Fab,DialogActions, Grid, ListItemButton, Paper, Typography, CircularProgress } from '@mui/material'
import AssignmentAddIcon from '@mui/icons-material/AssignmentAdd';
import Checkbox from '@mui/material/Checkbox';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useDispatch, useSelector } from 'react-redux';
import { addPrerequisitesToCourse, clearStatus, deletePrerequestcourse, fetchPrerequisitesByCourse_id } from '../../../redux/Slices/CourseSlice';
import { useAlert } from '../../../../context';

function AssignPrerequisitesDialog({AssignDialog,setAssignDialog}) {
  const{course_id,status,course_name}=AssignDialog
   const {setopen}=useAlert()
    const {courses,pre_course,status:state,isloading}=useSelector(state=>state.course)
    const [checked,setchecked]=useState({prerequestCoursesid:[]})
    const dispatch=useDispatch()
   const ref=useRef(false)
    console.log(checked)
    const handleCheckedBox=(e,{main_course,pre_course})=>{
        //# course_id, prerequisite_course_id
       
       if(e.target.checked){
          setchecked({prerequestCoursesid:[...checked.prerequestCoursesid,{course_id:main_course,prerequisite_course_id:pre_course}]})
          
        }else{
          
            const updatecourses_ids=checked.prerequestCoursesid.filter((st)=>st.prerequisite_course_id!==pre_course)
            setchecked({prerequestCoursesid:updatecourses_ids})
            
        }
      }
      const handleAssignprerequestCourses=async()=>{
        dispatch(addPrerequisitesToCourse({prerequisites_courses:checked.prerequestCoursesid}))
      }
      const deletePrerequestsCoursess=async(main_cid,pre_cid)=>{
        
         dispatch(deletePrerequestcourse({main_cid,pre_cid}))
         
      }
    
    

      useEffect(()=>{
             if(!ref.current){
               setchecked({prerequestCoursesid:[]})
           dispatch(fetchPrerequisitesByCourse_id(course_id))
           ref.current=true
             }
            
           return ()=>{ref.current=false}   
            
      },[AssignDialog])
      
      useEffect(()=>{
       if(state==201){
        dispatch(fetchPrerequisitesByCourse_id(course_id))
         setchecked({prerequestCoursesid:[]})
         dispatch(clearStatus())
         
       }else if (state==500){
        setopen({state:true,message:"an error occurs,please try again",color:"error"})
         dispatch(clearStatus())
       }else if(state==200){
         dispatch(fetchPrerequisitesByCourse_id(course_id))
         dispatch(clearStatus())
       }
      },[state])
      const onCloseDialog=()=>{
           setAssignDialog({status:false,course_id:0,course_name:""})
          setchecked({prerequestCoursesid:[]})
      }
    
  return (
    <Dialog
    open={status} onClose={()=>{
       onCloseDialog()
        }
    } maxWidth="lg" fullWidth>
    
    <DialogContent >
        <Grid container>
          <Grid size={6} spacing={2}>
            <Typography variant='h6'sx={{width:"80%",marginLeft:"20px"}} color='primary'>All courses</Typography>
            <List sx={{overflow:"anto",height:"450px"}}>
              {
           courses.length>0?courses.map(({code,name,course_id:id} ,index)=>{
           if(name!=course_name&&!pre_course.some(e=>e?.pre_id==id)){
           return(
                <Paper key={index} elevation={3} sx={{width:"80%",marginLeft:"20px"}}>
                <ListItemButton sx={{marginTop:"10px"}}>
                  <ListItemText primary={code} secondary={name}/>
                  <IconButton edge="end" >
                  <Checkbox  onClick={(e)=>handleCheckedBox(e,{main_course:course_id,pre_course:id})} />
                </IconButton>
                </ListItemButton>
                
                </Paper>


              )
           }

              
           }):undefined
              }
             
            </List>
          </Grid>
          <Grid size={6}>
          <Typography variant='h6'color="primary"sx={{width:"80%",marginLeft:"20px"}}>Prerequisites of {course_name}</Typography>
          <List sx={{overflow:"auto"}}>
              {
                pre_course.length>0?pre_course.map(({pre_name,pre_id})=>{
                  
                 
                    return(
                      <Paper key={pre_id} elevation={1} sx={{width:"80%",marginLeft:"20px"}}>
                      <ListItemButton sx={{marginTop:"10px"}} >
                      <ListItemText primary={pre_name} />
                      <IconButton edge="end" onClick={()=>deletePrerequestsCoursess(course_id,pre_id)}>
                      <RemoveCircleIcon color='primary'    />
                    </IconButton>
                    </ListItemButton>
                    </Paper>
  
                    )
                  
                 
                }):undefined
             

              }
            
             
            </List>
          </Grid>
        </Grid>
     
    </DialogContent>
    <DialogActions >
      {isloading?<CircularProgress color='primary'/>:undefined}
      <Fab color='primary'  disabled={checked.prerequestCoursesid.length==0?true:false}onClick={handleAssignprerequestCourses}>
      <AssignmentAddIcon/>
      </Fab>
    </DialogActions>
  </Dialog>
  )
}

export default AssignPrerequisitesDialog