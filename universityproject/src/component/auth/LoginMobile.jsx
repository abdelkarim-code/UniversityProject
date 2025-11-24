import * as React from 'react';
import {
  AppBar, Box, Toolbar, Typography, Button,
  IconButton, Avatar, Card, CardContent, TextField
} from '@mui/material';
import liulogo from "../../assets/liulogo.png";

 function LoginMobile({handleSubmit,isloading}) {

  React.useEffect(() => {
    document.body.style.backgroundColor = "#044774ff";
    return () => document.body.style.backgroundColor = "#ffff";
  }, []);

 

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        px: 2,
        pt: 3,
        height: "100vh",
        background: "linear-gradient(180deg, #044774 0%, #002F4B 100%)"
      }}
    >

      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ background: "transparent", boxShadow: "none" }}>
        <Toolbar sx={{ justifyContent: "center" }}>
          <Avatar alt="Logo" src={liulogo} sx={{ width: 60, height: 60 }} />
        </Toolbar>
      </AppBar>

      <Typography
        variant="h6"
        sx={{
          color: "#fff",
          fontWeight: 700,
          fontFamily: '"Playfair Display", serif',
          mt: 1,
          mb: 3,
          textAlign: "center",
          letterSpacing: "0.5px",
        }}
      >
        Welcome to Liu University
      </Typography>

      {/* Login Card */}
      <Card
        sx={{
          width: "100%",
          maxWidth: 360,
          borderRadius: 4,
          backgroundColor: "#ffffff",
          p: 2,
          boxShadow: "0 4px 16px rgba(0,0,0,0.15)"
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#003C64",
            fontWeight: 700,
            textAlign: "center",
            mb: 2,
          }}
        >
          Liu Login
        </Typography>

        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <form id="login-form" onSubmit={handleSubmit}>
            <TextField
              label="Username/ID"
              name="user_identifier"
              variant="outlined"
              color="default"
              type='password'
              size="small"
              fullWidth
              required
             
            />
            <TextField
              label="Password"
              name="password"
              variant="outlined"
              color="default"
              size="small"
              type="password"
              fullWidth
              required
              sx={{mt:2}}
            />
          </form>

          <Button
            variant="contained"
            size="large"
            sx={{
              mt: 2,
              backgroundColor: "#003C64",
              color: "#fff",
              fontWeight: 600,
              py: 1,
              "&:hover": { backgroundColor: "#1f2a63" },
            }}
            type="submit"
            form="login-form"
             loading={isloading}
          >
            Login
          </Button>

          {/* <Button
            variant="text"
            sx={{
              color: "#003C64",
              textTransform: "none",
              mt: 1,
              fontSize: "0.9rem",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" },
            }}
          >
            Forgot Password?
          </Button> */}
        </CardContent>
      </Card>

      {/* Footer Text */}
      <Typography
        variant="caption"
        sx={{
          mt: 3,
          color: "rgba(255,255,255,0.7)",
          textAlign: "center",
        }}
      >
        © 2025 Liu University. All rights reserved.
      </Typography>
    </Box>
  );
}
export default LoginMobile