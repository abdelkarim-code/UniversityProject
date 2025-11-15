import { Avatar, Box, Card, CardContent, Chip, Container, IconButton, List, 
 Menu, MenuItem, Paper, styled, Typography,
 useTheme, } from '@mui/material'
import {useEffect,  useState} from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useDispatch, useSelector } from 'react-redux';
import { deleteDepartment, fetchDepartmentByFaculty } from '../../../redux/Slices/DepartmentSlice';
import LinearProgress from '@mui/material/LinearProgress';
import CoursesView from './CoursesView';
import EditDepartmentDialog from './EditDepartmentDialog';
import { useAlert } from '../../../../context';

const SuccessCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  borderRadius: '12px',
  boxShadow: theme.shadows[4],
  marginBottom: theme.spacing(3),
}));




function Department_Component({facultyid,name,close}) {
        const theme = useTheme(); 
    const [anchor,setanchor]=useState(null)
    const [department_id,setdepartment_id]=useState(0)
      const OpenAnchor=Boolean(anchor)
      const [editData,setEditData]=useState({open:false,data:{}})
      const {setopen}=useAlert()
      const dispatch=useDispatch()
      const {deUnderFaculty,status}=useSelector(state=>state.department)
      const [confirming, setConfirming] = useState(false);
      const [view,setview]=useState("dep")
     const  onClose=()=>{
        setEditData({open:false,data:{}})
        setanchor(null)

     }
     const fetchDepartment=()=>{
        if(facultyid!=0){
          dispatch(fetchDepartmentByFaculty(facultyid))
        }
      
     }
      useEffect(()=>{
     
        fetchDepartment()

      },[facultyid])
      useEffect(()=>{
       
           if(status==409){
           setopen({state:true,message:"Duplicate entry detected — please use a different department name or code",color:"error"})
       }else if (status==204){
        fetchDepartment()
          onClose()
          setopen({state:true,message:"Department edited successfully",color:"success"})
          
       }else if (status==200){
        fetchDepartment()
          setConfirming(false)
          setanchor(null)
          setopen({state:true,message:"Department deleted successfully",color:"success"})
          
       }
        
      
      },[status])
     if(view=="cou"){
        return <CoursesView setview={setview} department_id={department_id}/>
     }else{

     

  return (
    <Container maxWidth={"xl"}>
     <EditDepartmentDialog open={editData.open} onClose={onClose} Data={editData.data}/>
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
            backgroundColor: theme.palette.primary.light,
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
      <IconButton edge="end" onClick={(e) =>{
         setanchor(e.currentTarget)
         setdepartment_id(d.department_id)
         setEditData({...editData,data:{...d}})
         }}>
        <MoreVertIcon />
      </IconButton>
    </Paper>
    )):<h1>no department</h1>}
    <Menu anchorEl={anchor} open={OpenAnchor} onClose={()=>setanchor(null)}>
      
    <MenuItem onClick={()=>{
      setanchor(null)
      setEditData({...editData,open:true})
      }}>Edit</MenuItem>
   {!confirming?
    <MenuItem onClick={()=>{
      setConfirming(true)
      
      }}>Delete</MenuItem>:  
      <MenuItem sx={{ color: 'error.main' }} onClick={()=>{
        if(department_id!=0){
          dispatch(deleteDepartment(department_id))
        }
      }}>
          ⚠️ Confirm Delete
        </MenuItem>
   }
   

       <MenuItem onClick={()=>{
      setview("cou")
      setanchor(null)
      }}>View related courses</MenuItem>
  </Menu>
    </List>
     </Container>
  )
     }
}

export default Department_Component