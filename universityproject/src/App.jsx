import AdminView from "./component/Admin/AdminView"
import Home from "./component/Home_Page"
import { Routes,Route,Navigate } from "react-router-dom"
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AlertProvider } from "./component/ProviderComponent";
import { Provider } from "react-redux";
import store from "./component/redux/store";
import Login from "./component/auth/Login";
import Student_Home_page from "./component/Student/Student_Home_page";
import Doctor_Home_page from "./component/Doctor/Doctor_Home_page";
import NOTFOUND from "./component/NotFound";
import Main_Panel from "./component/Student/sections/Main_Panel";
import Registration from "./component/Student/sections/Registration";
import CourseDescriptionPage from "./component/Student/sections/CourseDescriptionPage";
import { ConfirmProvider } from 'material-ui-confirm';
import ExamsView from "./component/Student/sections/ExamsView";
import ClassesView from "./component/Student/sections/ClassesView";
const theme = createTheme({
  typography: {
    fontFamily: '"Playfair Display", serif',
  },
});

function App() {

  return (
    <ThemeProvider theme={theme}>
      <ConfirmProvider>
      <Provider store={store}>

     
      <AlertProvider>
         <CssBaseline/>
     <Routes>
      <Route path="/" element={<Navigate to="/Liu" replace />} />
      <Route path="/Liu" element={<Home/>}/>
      <Route path="/Liu/Login" element={<Login/>}/>
      <Route path="/Liu/AdminView" element={<AdminView/>}/>

      <Route path="/Liu/students/*" element={<Student_Home_page/>}>
               <Route index element={<Main_Panel  sx={{ zIndex: 11 }}/>}/>
              <Route path="Registration" element={<Registration/>}/>
              <Route path="CourseDescription" element={<CourseDescriptionPage/>}/>
              <Route path="ViewExams" element={<ExamsView/>}/>
              <Route path="Classes" element={<ClassesView/>}/>
              
      </Route>

      <Route path="/Liu/doctors" element={<Doctor_Home_page/>}/>
        <Route path="*" element={<NOTFOUND message={"The page you’re looking for doesn’t exist or may have been moved"}/>}/>
    </Routes>
      </AlertProvider>
       </Provider>
       </ConfirmProvider>
    </ThemeProvider>
  )
}

export default App
