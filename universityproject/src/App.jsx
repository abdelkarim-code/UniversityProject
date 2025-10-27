import AdminView from "./component/Admin/AdminView"
import Home from "./component/Home_Page"
import { Routes,Route } from "react-router-dom"
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AlertProvider } from "./component/ProviderComponent";
import { Provider } from "react-redux";
import store from "./component/redux/store";

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
      <Route path="/" element={<Home/>}/>
      <Route path="/AdminView" element={<AdminView/>}/>
    </Routes>
      </AlertProvider>
       </Provider>
     
    </ThemeProvider>
  )
}

export default App
