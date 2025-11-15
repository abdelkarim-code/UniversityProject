import { Box, Card, CardContent, Stack, Typography, Chip,IconButton,Collapse,Tooltip, Fab, Button, TextField} from '@mui/material'
import React, { useEffect, useState } from 'react'
  import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SchoolIcon from '@mui/icons-material/School';
import { useDispatch, useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { editFaculty, fetchFaculties } from '../../../redux/Slices/FacultySlice';
import { useAlert } from '../../../../context';
import Department_Component from './Department_Component';
import AlertDialog from '../../DeleteDialog';


function AcademicSection() {
  
    const {faculties,isloading,status}=useSelector((state)=>state.faculty)
    const {setopen}=useAlert()
    const [expanded, setExpanded] = useState(false);
    const [editdata,seteditdata]=useState({name:"",description:"",faculty_id:-1})
     const [departmentView,setdepartmentView]=useState({status:false,faculty_id:0,name:""})
      const [deleteDta,setdeleteDta]=useState({status:false,faculty_id:0,name:""})
    const dispatch=useDispatch()
useEffect(()=>{
  setdepartmentView({status:false,faculty_id:0,name:""})
 if(status==409){
     setopen({state:true,message:"Duplicate entry detected — please use a different faculty name",color:"error"})
 }else if (status==204){
    seteditdata({name:"",description:"",faculty_id:-1})
    setopen({state:true,message:"Faculty edited successfully",color:"success"})
    dispatch(fetchFaculties())
 }
},[status])
  const editFacultyData=()=>{
         dispatch(editFaculty(editdata))
  }
 
  if(departmentView.status){
    return (<Department_Component facultyid={departmentView.faculty_id} close={setdepartmentView} name={departmentView.name} />)
  }else{

  
  return (
    <Box display={"flex"} gap={"30px"} alignContent={"center"} flexWrap={"wrap"}>
         {
          (!isloading&&faculties.length>0)?(faculties.map((f)=>(
            <Card 
            key={f.faculty_id}
           
             sx={{ 
                width: '100%', 
                maxWidth: 350, 
                m: 2, 
               
                boxShadow: 3,
                transition: '0.3s',
                '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-2px)'
                }
            }}>
                <CardContent>
                    <Stack spacing={1.5} sx={{ mt: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip title="Faculty name">
                                <SchoolIcon color="primary" sx={{ mr: 1 }} />
                            </Tooltip>
                            {editdata.faculty_id!=f.faculty_id?
                           <Tooltip title="View related departments">
                                  <Typography sx={{ cursor:"pointer"}} fontWeight={"650"} onClick={()=>setdepartmentView({status:true,faculty_id:f.faculty_id,name:f.name})}>
                              {f.name}
                            </Typography>
                           </Tooltip> :
                               <TextField
                                    margin="dense"
                                    label="Faculty Name"
                                    type="text"
                                    focused
                                    value={editdata.name}
                                    fullWidth
                                    variant="standard"
                                     onChange={(e)=>seteditdata({...editdata,name:e.target.value})}
                                  />
                            }
                        </Box>
                    
                                
                             
                       
    
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <IconButton
                                onClick={()=>{
                                  setExpanded((pre)=>!pre)
                                   
                                }
                                   
                                }
                                aria-expanded={expanded}
                                aria-label="show more"
                                size="small"
                                sx={{ 
                                    transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.3s'
                                }}
                            >
                                <Tooltip title={expanded ? "Hide details" : "Show details"}>
                                    <ExpandMoreIcon />
                                </Tooltip>
                            </IconButton>
                        </Box>
                      
                    </Stack>
                <AlertDialog open={deleteDta.status} setOpen={setdeleteDta} Data={deleteDta.name} id={deleteDta.faculty_id}  />
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                   
                   
                        <Box sx={{ mt: 2, p: 1.5, backgroundColor: 'action.hover', borderRadius: 1,fontSize: 13 }}>
                            <Stack spacing={2} direction={"column"} gap={"2px"}>


                            {editdata.faculty_id!=f.faculty_id?
                            <Typography >{f.description}</Typography> :
                                <TextField
                                  label="Faculty Description"
                                    type="text"
                                    fullWidth
                                    variant="standard"
                                    multiline
                                    focused
                                    value={editdata.description}
                                    onChange={(e)=>seteditdata({...editdata,description:e.target.value})}
                                    rows={4}
                                    
                                  />
                            }


                             <Stack spacing={1} direction={"row"} >


                             {editdata.faculty_id!=f.faculty_id?
                              <Fab color='primary' size='small' onClick={()=>seteditdata({name:f.name,description:f.description,faculty_id:f.faculty_id})}>
                                <Tooltip title={"Edit faculty data"}>
                                    <EditIcon />
                                </Tooltip>
                              
                              </Fab>:
                              <>
                               <Button color='primary' loading={isloading}onClick={editFacultyData} disabled={editdata.name==""||editdata.description==""}>save</Button>
                              <Button color='error' onClick={()=>seteditdata({name:"",description:"",faculty_id:-1})}>Cancel</Button>
                              </>
                             
                             }

                             {editdata.faculty_id!=f.faculty_id&&(
                               <Fab color='error'size='small' onClick={()=>{
                                 setdeleteDta({status:true,faculty_id:f.faculty_id,name:f.name})
                               }}>
                                <Tooltip title={ "Delete faculty data"}>
                                    <DeleteIcon />
                                </Tooltip>
                              </Fab>

                             )}
                               
                            </Stack>
                          
                            </Stack >
                            
                        </Box>
                    </Collapse>
                </CardContent>
            </Card>)

          ))

             

          :
           <Card sx={{ maxWidth: 400, margin: 'auto', mt: 4, textAlign: 'center', padding: 2 }}>
        <CardContent>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Current faculties
           </Typography>
           
         </CardContent>
       </Card>
 

         }
        
    </Box>
  )
}
}

export default AcademicSection