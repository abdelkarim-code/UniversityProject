import  {  useEffect, useState,useMemo} from 'react'
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { createTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventNoteIcon from '@mui/icons-material/EventNote';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import SummarizeIcon from '@mui/icons-material/Summarize';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ChooseCompoent from './ChooseCompoent';
import { useAlert } from '../../context';
import Dialogs_Component from './Dialogs_Component';
import { useSelector,useDispatch } from 'react-redux';
import { fetchFaculties } from '../redux/Slices/FacultySlice';
import AcademicSection from './SideBarComponent/Academic_Section';
import UserDialog from './UserDialog';

const demoTheme = createTheme({

  palette: {
    // primary: {
    //   main: '#024c7dff',
    // },
    // success: {
    //   main: '#024c7dff', 
    // },
     background: {
          default: '#f7f9fc',
          paper: '#ffffff',
        },
        divider: 'rgba(0,0,0,0.12)'
  },
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
   typography: {
    fontFamily: '"Playfair Display", serif',
    
  },
   components: {
  //  MuiAppBar: {
  //     styleOverrides: {
  //       root: {
  //         backgroundColor: '#ffff',
  //         boxShadow: 'none',
  //       },
  //     },
  //   }
  }
 
});
const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main sections',
  },
  {
    kind: 'page',
    segment: 'Academics',
    title: 'Academics',
    icon: <MenuBookIcon />,
  },
  {
    segment: 'CourseManagement',
    title: 'Course Management',
    icon: <AssignmentIcon/>,
  },

  
  {
    segment: 'ExamsResults',
    title: "Exams & Results",
    icon: <EventNoteIcon/>,
   
  },
  {
    segment: 'Attendance',
    title: 'Attendance',
    icon: <FactCheckIcon/>,
  },
  {
    segment: "Reports",
    title: "Reports",
    icon: <SummarizeIcon/> ,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'User & Account',
  },
  {
    segment: 'Users',
    title: 'Users',
    icon: <PeopleIcon />,
  },
 
  {
    segment: 'Logout',
    title: 'Logout',
    icon: <LogoutIcon />,
  }

  
];
const actions = [
  { icon: <PostAddIcon />, name: 'New Academic Record' },
  { icon: <PersonAddIcon />, name: 'Register User' },
  { icon: <NoteAddIcon />, name: 'Schedule Exam' },
  { icon: <CloudUploadIcon />, name: 'Upload Document' },
];

function useDemoRouter(initialPath) {
  const [pathname, setPathname] = useState(initialPath);

  const router = useMemo(() => {
    return {
      pathname,
      
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  return router;
}
//**********************************************************************************************************/
function AdminView() {
  
  const router = useDemoRouter('/Academics');
  const [openChoosenDialog,setOpenChoosenDialog]=useState(false)
  const [openUserDialog,setOpenUserDialog]=useState(false)
  const [openDialogCompoent,setopenDialogCompoent]=useState({status:false,identifier:""})
  const {setopen}=useAlert()
  const {faculties}=useSelector(state=>state.faculty)
   const dispatch=useDispatch()
  useEffect(()=>{
  //  router.navigate("/allttem")
  if(!openDialogCompoent.status&&openDialogCompoent.identifier=="return"){
    setOpenChoosenDialog(true)
  }
  console.log("render")
  if(faculties.length===0){
    dispatch(fetchFaculties())
  }
  },[openDialogCompoent])
  
  

  const renderItem=(path)=>{
    switch(path){
      case "/Academics":
        return <AcademicSection />
      
        
        default:
          console.log("router not specified")
    }
  }
 const handleOpenChoosenDialog=(action)=>{
     switch(action){
      case "New Academic Record":
        setOpenChoosenDialog(true)
        break
      case "Register User":
           setOpenUserDialog(true)
      break
        default:console.log("no action like this")
     }
 }
   const onClosechoosenDialog=(data="",identifier)=>{
    console.log(data,identifier)
    if(identifier=="cancel_btn"){
      setOpenChoosenDialog(false)
    }else{
      if(data!=""){
        setOpenChoosenDialog(false)
        setopenDialogCompoent({status:true,identifier:data})
      }else{
        setopen({state:true,message:"please choose a option to proceed",color:"error"})
      }
    }
      
   }
  return (
    
    
   
      <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={window}
      branding={{
        logo: <DashboardIcon color='primary' />,
        title: "Administration Dashboard",
        
      }}
    >
      <DashboardLayout >
        <Box p={2}>
        
         {renderItem(router.pathname)}
      
       
        </Box>
         {/* Choosen dialog here */}
     <ChooseCompoent open={openChoosenDialog} onClose={onClosechoosenDialog}   />
       <Dialogs_Component open={openDialogCompoent.status}  Close={setopenDialogCompoent} identifier={openDialogCompoent.identifier}/>
      <UserDialog open={openUserDialog} onClose={setOpenUserDialog}/>

        <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            slotProps={{
              tooltip: {
                title: action.name,
              },
            }}
             onClick={()=>handleOpenChoosenDialog(action.name)}
          />
        ))}
        
       
        
      </SpeedDial>
      </DashboardLayout>
    </AppProvider>
      
      

    
    
    
    
  )
}

export default AdminView