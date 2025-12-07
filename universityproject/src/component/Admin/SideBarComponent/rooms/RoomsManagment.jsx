import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  Divider,
  IconButton,
  Button,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  ListItem,
  List,
  Stack,
  AppBar,
  Toolbar,
  Autocomplete
} from "@mui/material";
import { Add, Delete, ViewList } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { addBlock, addCampus, createRooms, DeleteBlock } from "../../../redux/Slices/RoomSlice";
import { useAlert } from "../../../../context";
import BlockPrint from "./blockPrint";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import RoomsViewComponent from "./RoomsViewComponent";
// ===== Styled Components =====
const AddButton = styled(Button)(({ theme }) => ({
  borderRadius: 10,
  textTransform: "none",
  fontWeight: 600,
  padding: theme.spacing(1, 2),
}));
const DashboardCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  border: `1px solid ${theme.palette.divider}`,
  width: "100%",
  maxWidth: "1200px",
  margin: "0 auto",
}));

const FormAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderRadius: "12px 12px 0 0",
  boxShadow: "none",
  padding: theme.spacing(0),
}));
const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  fontWeight: "bold",
  textTransform: "none",
  padding: theme.spacing(1, 3),
  fontSize: "0.875rem",
}));

// ===== Main Component =====
function RoomManagment() {
  const [section, setSection] = useState("add");
  const {setopen}=useAlert()
  const dispatch=useDispatch()
  const [block,setblock]=useState("")
  const [floor,setfloor]=useState({floor: 1,startRoom: 100,endRoom: 101})
  const [floors,setfloors]=useState([])
  const blocks=useSelector(state=>state.room.requestData.blocks)
  const requestData=useSelector(state=>state.room.requestData)
  const {duplicated,isloading,status}=useSelector(state=>state.room)
  const campus=useSelector(state=>state.room.requestData.campus)
  const addfloor=()=>{
    if(floor.startRoom>=100&&floor.endRoom>floor.startRoom){
        if(floors.length>0){
            const matchfloor=floors.some(f=>f.floor==floor.floor)
           
            if(!matchfloor){
                 setfloors([...floors,floor])
                 setfloor(state=>({...state,floor:state.floor+1}))
            }else{
                  setopen({state:true,message:"duplicated floor number detected",color:"error"})
            }
        
        }else{
             setfloors([...floors,floor])
             setfloor(state=>({...state,floor:state.floor+1}))
        }
      
    }else{
        setopen({state:true,message:"invalid floor data(make sure that startRoom >=100 and endRoom>startRoom",color:"error"})
    }
  }
useEffect(()=>{
if(duplicated){
 setopen({state:true,message:"duplicated block detected",color:"error"})
}else{
 setfloor({floor: 1,startRoom: 100,endRoom: 101})
}

setblock("")
setfloors([])
},[blocks,duplicated])
useEffect(()=>{

if(status==201){
  setopen({state:true,message:"Rooms added successfully",color:"success"})
}else if (status==409){
  setopen({state:true,message:"duplicated entry detected ,please try again",color:"error"})
}
},[status])
  if(isloading){
    return (
       <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={isloading}
        
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    )
  }else{

  
   return (
    <DashboardCard>
      {/* App Bar Header */}
      <FormAppBar position="static">
        <Toolbar sx={{ minHeight: "64px !important", px: 3 }}>
          <Typography variant="h5" component="div" fontWeight="600" sx={{ flexGrow: 1 }}>
            Room Management
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
             <ToggleButtonGroup
                       color="warning"
                       value={section}
                       exclusive
                       onChange={(e) => setSection(e.target.value)}
                        sx={{ 
                backgroundColor: "white",
                color: "primary.main",
                '&:hover': {
                  backgroundColor: "grey.50",
                }
              }}
                     >
                       <ToggleButton value="add" sx={{ borderRadius: "0 12px 12px 0" }}>
                         <Add sx={{ mr: 1 }} /> Add Rooms
                       </ToggleButton>
                       <ToggleButton value="view" sx={{ borderRadius: "0 12px 12px 0" }}>
                         <ViewList sx={{ mr: 1 }} /> View Rooms
                       </ToggleButton>
              </ToggleButtonGroup>
            <ActionButton 
              variant="contained" 
              sx={{ 
                backgroundColor: "warning.main",
                '&:hover': {
                  backgroundColor: "warning.dark",
                },
                '&.Mui-disabled': {
                      backgroundColor: '#ccc',
                      color: '#555',
                      borderRadius: '10px',
                      cursor: 'not-allowed'
                    }
              }}
              disabled={blocks.length==0}
               onClick={()=>dispatch(createRooms(requestData))}
            >
              Submit
            </ActionButton>
          </Box>
         
        </Toolbar>
      </FormAppBar>

      <CardContent sx={{ p: 4 }}>
        {section=="add"&&(
          <>
            {/* Form Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight="600" color="primary" sx={{ mb: 3 }}>
            Campus name
          </Typography>
          <Autocomplete
          fullWidth
           options={["Bekaa", "Beirut", "Saida", "Tripoli", "Nabatieh", "Mount Lebanon", "Tyre", "Rayak"]}
           renderInput={(data)=>(
                <TextField
                           {...data}
                            fullWidth
                            label="Campus Name"
                            placeholder="e.g. Saida"
                            variant="outlined"
                            value={campus}
                            onChange={(e)=>dispatch(addCampus(e.target.value))}
                          />
           )}
          
          />
            
         
         
          
        </Box>
          
        

        <Box>
          <Typography variant="h6" fontWeight="600" color="primary" sx={{ mb: 3 }}>
           Blocks
          </Typography>
          <Stack direction={"row"} spacing={2} sx={{mb:2}}>
                             {blocks.length>0&&blocks.map((block,index)=><BlockPrint blockData={block} index={index}  />)}
         
          </Stack>
            <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 3,
                    background: "#fafafa",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                 
                
                  <TextField
                    label="Block Name"
                    variant="outlined"
                    value={block}
                    slotProps={{
                        htmlInput:{maxLength:1}
                    }}
                    fullWidth
                    onChange={(e)=>setblock(e.target.value)}
                    sx={{ my: 2 }}
                    placeholder="A"
                  />

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" gutterBottom>
                    Floors
                  </Typography>

                  {/* Floor 1 */}
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: 2,
                      bgcolor: "#fff",
                      borderColor: "#e0e0e0",
                    }}
                  >
{floors.length > 0 ? (
  <List
    sx={{
      width: "100%",
      bgcolor: "#fff",
      borderRadius: 2,
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      mt: 2,
    }}
  >
    {floors.map((f, index) => (
      <ListItem
        key={index}
        sx={{
          mb: 1,
          border: "1px solid #e0e0e0",
          borderRadius: 2,
          px: 3,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          "&:hover": { backgroundColor: "#f8f8f8" },
        }}
      >
        {/* Floor Information */}
        <Box sx={{ display: "flex", gap: 4, alignItems: "center", flexGrow: 1 }}>
          <Typography variant="body1" fontWeight="600" color="primary">
            Floor {f.floor}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Rooms {f.startRoom} → {f.endRoom}
          </Typography>
        </Box>

        {/* Delete Button */}
        <IconButton
          color="error"
          onClick={() => {
            const copy = [...floors];
            copy.splice(index, 1);
            setfloors(copy);
          }}
        >
          <Delete />
        </IconButton>
      </ListItem>
    ))}
  </List>
) : undefined}


                    <Grid container spacing={2} alignItems="center" sx={{mt:4}}>
                      <Grid item xs={3}>
                        <TextField label="Floor" value={floor.floor} disabled fullWidth placeholder="1" type="number"  />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          label="Start Room"
                        type="number"
                        value={floor.startRoom}
                        onChange={(e)=>setfloor({...floor,startRoom:e.target.value})}
                          fullWidth
                          placeholder="100"
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          label="End Room"
                          fullWidth
                          value={floor.endRoom}
                          type="number"
                          onChange={(e)=>setfloor({...floor,endRoom:e.target.value})}
                          placeholder="120"
                        />
                      </Grid>
                      
                    </Grid>
                  </Paper>

                  <AddButton variant="outlined" startIcon={<Add />} size="small" onClick={addfloor}>
                    Add Floor
                  </AddButton>
                </Paper>
                   <AddButton
                                  variant="contained"
                                  startIcon={<Add />}
                                  sx={{ mt: 1 }}
                                  onClick={()=>{
                                    if(block!=""&&isNaN(block)&&floors.length>0){
                                      dispatch(addBlock({block:block,floors:floors}))
                                    }
                                   //add alert 
                
                                  }}
                                  disabled={floors.length==0||block==""}
                                >
                                  Add Block
                </AddButton>
        </Box>
           
          
          
          
          
          </>


        )}
        {section=="view"&&(
          <RoomsViewComponent/>
        )}
      
      </CardContent>
    </DashboardCard>
  );
}
}

export default RoomManagment;
