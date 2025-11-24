import React, { useEffect} from 'react';
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { fetchBlocks, fetchCampuses, fetchRooms, setSelectedBlock, setSelectedCampus } from '../../../redux/Slices/RoomSlice';

// Color constants
const PRIMARY_BLUE = '#003C64';

const WHITE = '#ffffff';

// Styled Components
const StyledTableHeader = styled(TableHead)`
  background-color: ${WHITE};
  
  .MuiTableCell-head {
    color: ${PRIMARY_BLUE};
    font-weight: bold;
    font-size: 14px;
  }
`;
const DeleteButton = styled(Button)`
  background-color: #f44336;
  color: ${WHITE};
  font-weight: bold;
  padding: 6px 12px;
  font-size: 12px;
  
  &:hover {
    background-color: #d32f2f;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const StyledTableContainer = styled(TableContainer)`
  background-color: ${WHITE};
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin-top: 16px;

  display: block;          /* Important: enable scroll */
  max-height: 600px;       /* or 70vh */
  overflow-y: auto;        /* Scroll only inside */
  overflow-x: hidden;

  .MuiTableCell-root {
    border-bottom: 1px solid #e0e0e0;
    padding: 12px 16px;
  }
`;

const SectionContainer = styled(Box)`
  padding: 24px;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const CampusSelectorContainer = styled(Box)`
  margin-bottom: 24px;
  
  .MuiFormControl-root {
    min-width: 200px;
    
    .MuiInputLabel-root {
      color: ${PRIMARY_BLUE};
      font-weight: bold;
    }
    
    .MuiOutlinedInput-root {
      background-color: ${WHITE};
      
      fieldset {
        border-color: ${PRIMARY_BLUE};
      }
      
      &:hover fieldset {
        border-color: ${PRIMARY_BLUE};
      }
    }
  }
`;


const RoomsViewComponent = () => {
const rooms = useSelector(state => state.room.rooms,shallowEqual)
const blocks = useSelector(state => state.room.blocks,shallowEqual)
const campuses = useSelector(state => state.room.campuses,shallowEqual)
const selectedBlock = useSelector(state => state.room.selectedBlock)
const selectedCampus = useSelector(state => state.room.selectedCampus)
const dis=useDispatch()


   useEffect(()=>{
    if(campuses.length>0)
      dis(setSelectedCampus(campuses[0]?.campus))
    if(campuses.length==0)
       dis(fetchCampuses())
   },[campuses])
  
  const handleCampusChange = (event) => {
    if(selectedCampus==event.target.value) return;
    if(event.target.value!=""){
         dis(setSelectedCampus(event.target.value))
    dis(fetchBlocks(event.target.value))
    }
  
  };

  const handleBlockSelect = (block) => {
    if(selectedBlock==block) return;
    dis(setSelectedBlock(block))
    dis(fetchRooms({block,campus:selectedCampus}))
  };

  // const handleRemoveBlock = (blockId, event) => {
  //   event.stopPropagation();
    
  //   // Remove block from local state 
  //   setBlocks(blocks.filter(block => block.id !== blockId));
    
  //   // If the removed block was selected, clear selection
  //   if (selectedBlock && selectedBlock.id === blockId) {
  //     setSelectedBlock(null);
  //     setRooms([]);
  //   }
  // };


  return (
    <SectionContainer >
      {/* Campus Selector */}
      <CampusSelectorContainer>
        <FormControl fullWidth>
          <InputLabel id="campus-selector-label">Select Campus</InputLabel>
          <Select
            labelId="campus-selector-label"
            value={selectedCampus}
            label="Select Campus"
            onChange={handleCampusChange}
          >
            
            {campuses.map(({campus},index) => (
              <MenuItem key={index} value={campus}>
                {campus}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </CampusSelectorContainer>

      {/* Two Column Layout */}
      <Grid container spacing={3}>
        {/* Left Column - Blocks Table */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h6" sx={{ color: PRIMARY_BLUE, mb: 2 }}>
            Campus Blocks
          </Typography>
          <StyledTableContainer>
            <Table stickyHeader>
              <StyledTableHeader>
                <TableRow>
                  <TableCell>Block Name</TableCell>
                  <TableCell align="center">Total Floor</TableCell>
                  <TableCell align="center">Total Rooms</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </StyledTableHeader>
              <TableBody>
                {blocks.length>0&&blocks.map(({total_rooms,floor_count,block},index) => (
                  <TableRow 
                    key={index}
                    onClick={() => handleBlockSelect(block)}
                    sx={{ 
                      cursor: 'pointer',
                      backgroundColor: selectedBlock === block ? '#e3f2fd' : 'inherit',
                      '&:hover': selectedBlock === block ?{
                        backgroundColor: '#e3f2fd'
                      }:{
                        backgroundColor: '#f5f5f5'
                      }
                    }}
                  >
                    <TableCell>{block}</TableCell>
                    <TableCell>{floor_count}</TableCell>
                    <TableCell align="center">{total_rooms}</TableCell>
                    <TableCell align="center">
                      <DeleteButton 
                        variant="contained"
                        // onClick={(e) => handleRemoveBlock(block.id, e)}
                      >
                        Remove
                      </DeleteButton>
                    </TableCell>
                  </TableRow>
                ))}
                {blocks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                      {selectedCampus ? 'No blocks available for selected campus' : 'Please select a campus'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </Grid>

        {/* Right Column - Rooms Table */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h6" sx={{ color: PRIMARY_BLUE, mb: 2 }}>
            {selectedBlock ? `Rooms in Block ${selectedBlock}` : 'Rooms'}
          </Typography>
          <StyledTableContainer>
            <Table stickyHeader >
              <StyledTableHeader>
                <TableRow>
                  <TableCell>Room Number</TableCell>
                  <TableCell align="center">Floor</TableCell>
                  <TableCell align="center">Available</TableCell>
                  <TableCell align="center">Capacity</TableCell>
                </TableRow>
              </StyledTableHeader>
              <TableBody>
                {rooms.length>0&&rooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell>{room.room_number}</TableCell>
                    <TableCell align="center">{room.floor}</TableCell>
                    <TableCell align="center">
                      <span style={{ 
                        color: room.available ? '#4caf50' : '#f44336',
                        fontWeight: 'bold'
                      }}>
                        {room.available ? 'Yes' : 'No'}
                      </span>
                    </TableCell>
                    <TableCell align="center">{room.capacity}</TableCell>
                  </TableRow>
                ))}
                {rooms.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      {selectedBlock ? 'No rooms available in this block' : 'Select a block to view rooms'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </Grid>
      </Grid>
    </SectionContainer>
  );
};

export default RoomsViewComponent;