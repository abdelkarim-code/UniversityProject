import  {  useEffect, useState,useMemo} from 'react'
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { createTheme } from '@mui/material/styles';
import { Avatar, Box } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventNoteIcon from '@mui/icons-material/EventNote';
import FactCheckIcon from '@mui/icons-material/FactCheck';
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
import AcademicSection from './SideBarComponent/academic_section/Academic_Section';
import UserDialog from './UserDialog';
import DoorFrontIcon from '@mui/icons-material/DoorFront';
import RoomManagment from './SideBarComponent/rooms/RoomsManagment';
import CourseManagment from './SideBarComponent/course_managment/CourseManagment';
import { AddCircleOutline } from '@mui/icons-material';
import { ListAlt } from '@mui/icons-material';
import CourseAssignmentForm from './SideBarComponent/course_managment/CourseAssignmentForm';
import liulogo from '../../assets/liulogo.png'
import AddSemesterDialog from './Dialogs/AddSemesterDialog';
import SchoolIcon from '@mui/icons-material/School';
import AddExamDialog from './Dialogs/AddExamDialog';
import { fetchDepartments } from '../redux/Slices/DepartmentSlice';
import { getsemesters } from '../redux/Slices/SemesterSlice';
import ExamTable from './SideBarComponent/Exams/ExamTable';
import Display from './SideBarComponent/users/Display';
import SemesterSectionDemo from './SideBarComponent/MainLogoSection/SemesterCard';
const demoTheme = createTheme({

  palette: {
    primary: {
      main: '#003C64',
    },
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
  colorSchemes: { light: true, dark: false},
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
     children: [
      {
        segment: 'addassigmentcourse',
        title: 'Assign Course',
        icon: <AddCircleOutline />,
      },
      {
        segment: 'viewassignments',
        title: 'View Assignments',
        icon: <ListAlt />,
      },
    ],
  },
  
  {
    segment: 'ExamsResults',
    title: "Exams & Results",
    icon: <EventNoteIcon/>,
   
  },
  // {
  //   segment: 'Attendance',
  //   title: 'Attendance',
  //   icon: <FactCheckIcon/>,
  // },
  {
    segment: "Rooms",
    title: "Rooms",
    icon: <DoorFrontIcon/> ,
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
  { icon: <SchoolIcon />, name: 'Add Semester' },
  
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
   const [openSemesterDialog,setOpenSemesterDialog]=useState(false)
   const [AddExamDialogOpen,setAddExamDialogOpen]=useState(false)
  const [openDialogCompoent,setopenDialogCompoent]=useState({status:false,identifier:""})
  const {setopen}=useAlert()
  const {faculties}=useSelector(state=>state.faculty)
  const [semesters, setSemesters] = useState([]);
  const [departments, setDepartments] = useState([]);
   const dispatch=useDispatch()
  useEffect(()=>{
  //  router.navigate("/allttem")
  if(!openDialogCompoent.status&&openDialogCompoent.identifier=="return"){
    setOpenChoosenDialog(true)
  }
  
  if(faculties.length===0){
    dispatch(fetchFaculties())
  }
  },[openDialogCompoent.status])
  
  

  const renderItem=(path)=>{
    switch(path){
      case "/Academics":
        return <AcademicSection {...demoTheme}/>
      case "/Rooms":
        return <RoomManagment/>
      case '/CourseManagement/viewassignments':
        return <CourseManagment/>
      case '/CourseManagement/addassigmentcourse':
        return <CourseAssignmentForm/>
        case '/ExamsResults':
          return <ExamTable/>
        case "/Users":
          return <Display/>
        case '/':
          return <SemesterSectionDemo/>
      
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
      case 'Add Semester':
        setOpenSemesterDialog(true)
        break
      case'Schedule Exam':
      setAddExamDialogOpen(true)
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

   useEffect(() => {
    const fetchData = async () => {
    
        const sem = await dispatch(getsemesters()).unwrap();
        const deps = await dispatch(fetchDepartments()).unwrap();

        setSemesters(sem);
        setDepartments(deps);
      
    };

    fetchData();
  }, [dispatch]);
  return (
    
    
   
      <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={window}
      branding={{
        logo: <Avatar alt="Logo" src={liulogo} sizes='small'/>,
        title: "Liu Administration Dashboard",
        
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
      <AddSemesterDialog open={openSemesterDialog} onClose={setOpenSemesterDialog}/>
       <AddExamDialog
      open={AddExamDialogOpen}
      onClose={() => setAddExamDialogOpen(false)}
      semesters={semesters}
      departments={departments}
    />
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