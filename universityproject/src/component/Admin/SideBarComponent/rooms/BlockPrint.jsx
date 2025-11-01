import { Card, CardContent, Typography, Divider, Stack, IconButton, CardActions } from "@mui/material";
import {  Delete } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { DeleteBlock } from "../../../redux/Slices/RoomSlice";


function BlockPrint({ blockData,index }) {
    const dispatch=useDispatch()
  return (
    <Card 
      sx={{ 
        width: 250, 
        borderRadius: 3, 
        p: 1, 
        backgroundColor: "background.paper", 
        boxShadow: 3 
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight={700} color="primary">
          Block {blockData.block}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Stack spacing={1}>
          {blockData.floors.map((floor, i) => (
            <Typography key={i} variant="body2" color="text.secondary">
              Floor {floor.floor}: {floor.startRoom}-{floor.endRoom}
            </Typography>
          ))}
           
        </Stack>
      </CardContent>
      <CardActions>
        <IconButton color="error" onClick={()=>dispatch(DeleteBlock({index}))}>
                      <Delete />
            </IconButton>
      </CardActions>
    </Card>
  );
}

export default BlockPrint;
