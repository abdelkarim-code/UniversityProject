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

const theme = createTheme({
  typography: {
    fontFamily: '"Playfair Display", serif',
  },
});

function App() {

  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>

     
      <AlertProvider>
         <CssBaseline/>
     <Routes>
      <Route path="/" element={<Navigate to="/Liu" replace />} />
      <Route path="/Liu" element={<Home/>}/>
      <Route path="/Liu/Login" element={<Login/>}/>
      <Route path="/Liu/AdminView" element={<AdminView/>}/>
      <Route path="/home/students" element={<Student_Home_page/>}/>
      <Route path="/home/doctors" element={<Doctor_Home_page/>}/>
    </Routes>
      </AlertProvider>
       </Provider>
     
    </ThemeProvider>
  )
}

export default App
