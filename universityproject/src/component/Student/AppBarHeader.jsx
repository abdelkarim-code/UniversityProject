import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useMediaQuery,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import liulogo from "../../assets/liulogo.png";
import { Link, useNavigate } from "react-router-dom";

const AppBarHeader = ({scroll}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const isMobile = useMediaQuery("(max-width:900px)");
  const nav=useNavigate()
  


  const handleAccountMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const redirectToSection=(view)=>{
    if(view=="Registration"){
      nav("Registration")
    }
  }
  const menuItems = [
    "Classes",
    "Plan of Study",
    "Registration",
   
  ];
  const menuItems1=[
     "Course offering",
    "GPA Calculator",
    "Course Description",
  ]
  

  return (
    <Box sx={{ position: "relative", pb: 6 ,mt:0}}>
     <Box
  sx={{
    position: "relative",
    pb: 8,
    backgroundColor: "#ddba20ff", // gold background
    backgroundImage: `
      repeating-linear-gradient(
        45deg,
        rgba(255,255,255,0.08) 0,
        rgba(255,255,255,0.08) 2px,
        transparent 2px,
        transparent 40px
      ),
      repeating-linear-gradient(
        -45deg,
        rgba(255,255,255,0.08) 0,
        rgba(255,255,255,0.08) 2px,
        transparent 2px,
        transparent 40px
      )
    `,
    "&::before": {
      content: '"LIU LIU LIU LIU LIU LIU LIU LIU LIU LIU"',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      color: "rgba(255,255,255,0.1)",
      fontSize: "60px",
      fontWeight: 700,
      letterSpacing: "30px",
      whiteSpace: "pre-wrap",
      lineHeight: 1,
      textAlign: "center",
      overflow: "hidden",
      userSelect: "none",
      pointerEvents: "none",
      zIndex: 0,
      backgroundRepeat: "repeat",
    },
  }}
>
  {/* Your content here */}
</Box>
      {/* AppBar */}
      <AppBar
      position={scroll?"fixed":"static"}
          sx={{
            top: 0, // stays at top
            bgcolor: "#003C64",
            height: 60,
            display: "flex",
            justifyContent: "center",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            zIndex: 10, // ensure above content
  }}
      >
        <Toolbar sx={{ display: "flex", alignItems: "center" }}>
          {/* Left side - Logo and University Name */}
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            
            <Box
              component="img"
              src={liulogo}
              alt="LIU Logo"
              sx={{
                height: 50,
                width: 50,
                mr: 1,
                borderRadius: "50%",
                bgcolor: "transparent",
                p: "2px",
              }}
            />
            <Link to={"/Liu/students"}><Typography
              variant="h6"
              sx={{
                color: "white",
                fontWeight: 600,
                fontSize: { xs: "1rem", sm: "1.3rem" },
              }}
            >
              LIU University
            </Typography></Link>
          </Box>

          {/* Center navigation (desktop only) */}
          {!isMobile && (
            <>
                <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexGrow: 2,
                gap: 2,
                mr:50
              }}
            >
              {menuItems.map((item) => (
                <Typography
                  key={item}
                  onClick={()=>redirectToSection(item)}
                  sx={{
                    color: "white",
                    cursor: "pointer",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    transition: "0.2s",
                    "&:hover": { color: "#fdd835" },
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Box>
             <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexGrow: 2,
                 gap: 2,
              }}
            >
              {menuItems1.map((item) => (
                <Typography
                  key={item}
                  sx={{
                    color: "white",
                    cursor: "pointer",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    transition: "0.2s",
                    "&:hover": { color: "#fdd835" },
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Box>

            </>
           
          )}

          {/* Right side - Account */}
      <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              pr: 2,
            }}
          >
            <IconButton
              onClick={handleAccountMenu}
              size="medium"
              sx={{
                color: "white",
                backgroundColor: "#deb70aff",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.25)",
                  transform: "scale(1.1)",
                },
                "&:active": {
                  transform: "scale(0.95)",
                },
              }}
            >
              <AccountCircle sx={{ fontSize: 32 }} />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              sx={{
                "& .MuiPaper-root": {
                  mt: 1.5,
                  minWidth: 180,
                  borderRadius: 3,
                  overflow: "hidden",
                  backdropFilter: "blur(6px)",
                  backgroundColor: "rgba(255,255,255,0.95)",
                  boxShadow: "0 6px 25px rgba(0,0,0,0.15)",
                },
                "& .MuiMenuItem-root": {
                  fontSize: 15,
                  fontWeight: 500,
                  color: "#333",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    backgroundColor: "#f3f3f3",
                    color: "#b8860b", // goldish accent
                  },
                },
              }}
            >
              <MenuItem onClick={handleClose}>Change Password</MenuItem>
              <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

    
    </Box>
  );
};

export default AppBarHeader;
