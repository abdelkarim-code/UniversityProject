import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { Avatar, Card, CardHeader,  TextField } from '@mui/material';
import liulogo from "../../assets/liulogo.png"
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

 function LoginDesktop({handleSubmit,isloading}) {
    
    React.useEffect(()=>{
      document.body.style.backgroundColor="#044774ff"
      return () =>document.body.style.backgroundColor="#ffff"
    },[])
    
  return (
    <Box sx={{ flexGrow: 1,display:"flex",flexDirection:"column",alignItems:"center",gap:5 }}>
      <AppBar position="static" sx={{ backgroundColor: "#003C64" }} >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
           <Avatar
                alt="Remy Sharp"
                src={liulogo}
                sx={{ width: 56, height: 56 }}
                />
          </IconButton>
          <Typography
                variant="h6"
                component="div"
                sx={{
                    flexGrow: 1,
                    fontFamily: '"Playfair Display", serif', 
                    fontWeight: 700,
                    fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                    color: '#ffffff',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                    letterSpacing: '1px',
                   
                }}
       >
                    Welcome to Liu University
                    </Typography>
          
        </Toolbar>
      </AppBar >


       {/* login card */}
    <Card
      sx={{
        minWidth: 500,
        minHeight:300,
        margin: "auto",
        mt: 8,
        borderRadius: 3,
        boxShadow: "0 8px 24px rgba(224, 201, 201, 0.02)",
        backgroundColor:"#e8dfdfff",
      }}
    >
      <CardHeader
        title={
          <Typography
            variant="h5"
            component="div"
            sx={{
              color: "#003C64",
              fontWeight: 700,
              textAlign: "center",
              letterSpacing: "1px",
            }}
          >
            Liu Login
          </Typography>
        }
      />

      <CardContent>
        <form
         id="subscription-form"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
          onSubmit={handleSubmit}
        >
          <TextField
            label="Username/ID"
            name="user_identifier"
            variant="standard"
            color="default"
            type='password'
            required
            fullWidth
            autoFocus
          
          
          />
          <TextField
            label="Password"
            name="password"
             color="default"
            type="password"
            variant="standard"
            required
            fullWidth
             
          />
        </form>
      </CardContent>

      <CardActions
        sx={{
          display: "flex",
          flexDirection:"column",
          justifyContent: "space-between",
          px: 2,
          pb: 2,
        }}
      >
        <Button
          variant="contained"
          size='large'
          sx={{
            backgroundColor: "#003C64",
            color: "#fff",
            
            "&:hover": { backgroundColor: "#1f2a63" },
          }}
          type='submit'
          form="subscription-form"
          loading={isloading}
        >
          Login
        </Button>
        <Button
          variant="text"
          sx={{
            color: "#003C64",
            textTransform: "none",
            mt:2,
            "&:hover": { backgroundColor: "rgba(44,56,126,0.1)" },
          }}
        >
          Forgot Password?
        </Button>
      </CardActions>
    </Card>
    {/* END *********** login card */}
    </Box>
  );
}
export default LoginDesktop