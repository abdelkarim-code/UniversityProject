import  { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import  {useState,useMemo} from 'react'
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { createTheme } from '@mui/material/styles';
import { Avatar, Box } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import { ListAlt } from '@mui/icons-material';
import liulogo from '../../assets/liulogo.png'
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentSemester } from '../redux/Slices/SemesterSlice';
import moment from 'moment';
import { getAssignCoursesToDoctor } from '../redux/Slices/DoctorSlice';
import { CheckTokenValidation, getActiveUserInfo, Logout } from '../redux/Slices/AuthSlice';
import StudentRegistrationView from './StudentRegistrationView';
import AccountCard from './AccountCard';

const demoTheme = createTheme({
 palette: {
    primary: {
      main: '#003C64',
    },
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
 
  }
 
});
const NAVIGATION = [];


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
function Doctor_Home_page() {
  const router = useDemoRouter('/');
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const {ass_doc}=useSelector(state=>state.doctor)
  const{active_user}=useSelector(state=>state.auth)
   const [current_semester,setcurrent_semester]=useState({})
  const ref=useRef(false)
 
  const handleClose =async() => {
     
       
      const req=await dispatch(Logout(false)).unwrap()
      if(req.status==200)
      navigate("/Liu/Login",{replace:true})
    };
  const TokenCheck=async()=>{
    try{
      const req=await dispatch(CheckTokenValidation(false)).unwrap()
       
    if(req.status==200){
      
      if(active_user&&Object.keys(active_user).length==0){
          const {user_info}=req
          dispatch(getActiveUserInfo({userid:user_info.user_id,type:"getdoctorInfo"}))
    }
    }else if(req.status==401){
      
      navigate("/Liu/Login")
    }
    }catch{
   
       navigate("/Liu/Login")
    }
    
  }
   const fetchCurrentSemester=async(active_user)=>{
  
       const c_sem=await dispatch(getCurrentSemester()).unwrap()
           dispatch(getAssignCoursesToDoctor({doctor_id:active_user?.doctor_id,semester_id:c_sem?.semester_id}))
      return {...c_sem,
        start_date:moment(c_sem?.start_date).format("YYYY-MM-DD"),
        end_date:moment(c_sem?.end_date).format("YYYY-MM-DD")
    }
     }

     //token check
  useEffect(() => {
     TokenCheck()
  
  
  }, []);


useEffect(() => {
if(ass_doc.length>0&&!ref.current){
  ref.current=true
  router.navigate(`/${ass_doc[0].assignment_id.toString()}`)
}
if(active_user){
fetchCurrentSemester(active_user).then(setcurrent_semester)
}

}, [active_user,ass_doc]);

   
  useEffect(()=>{
    if(router.pathname=="/Logout"){
        handleClose()
      }
  },[router.pathname])

  const renderItem=(path)=>{
    
    if(ass_doc.some(a=>a.assignment_id==path.substring(1))){
      return <StudentRegistrationView  ass_id={path.substring(1)}/>
    }else if(path=="/account")
      return <AccountCard user={active_user||{}}/>
     
        
      
    return null;

    
  }



  
 const addClassesToDashboard = (Navigation) => {
  if (ass_doc && ass_doc.length > 0) {
    
    Navigation = ass_doc.map((ass) => ({
      segment: ass.assignment_id.toString(),    
      title: `${ass.course_name}-${ass.section}`,
      icon:<ListAlt/>
    }));
    Navigation=[{
    kind: 'header',
    title: `Assign classes`,
  },...Navigation,  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Account',
  },
    {
    segment: 'account',
    title: 'Account',
    icon: <PeopleIcon />,
  },
 
  {
    segment: 'Logout',
    title: 'Logout',
    icon: <LogoutIcon />,
  }]
  }
  return Navigation;
};
  
  return (
    
    
   
      <AppProvider
      navigation={addClassesToDashboard(NAVIGATION)||[]}
      router={router}
      theme={demoTheme}
      window={window}
      branding={{
        logo: <Avatar alt="Logo" src={liulogo} sizes='small'/>,
        title: `Current Semester: ${current_semester?current_semester?.name+" "+current_semester?.academic_year:''}`
        
      }}
    >
      <DashboardLayout >
        <Box p={2}>
        
         {renderItem(router.pathname)}
      
       
        </Box>
    
      </DashboardLayout>
    </AppProvider>
  
  )
}

export default Doctor_Home_page