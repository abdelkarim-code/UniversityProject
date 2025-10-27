import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import React,{useEffect, useState} from 'react'


function ChooseCompoent({open,onClose}) {
    const options = [
  'Faculities',
  'Courses',
  'programs',
  'Departments',
];

     useEffect(()=>{
        setValue("")
     },[open])
  const [value, setValue] = useState("");
const handleCancel = () => {
    onClose(undefined,"cancel_btn");
  };

  const handleOk = () => {
    onClose(value,"ok_btn");
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };
  return (
     <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      maxWidth="xs"
      
      open={open}
    
    >
      <DialogTitle>Select Record Type to Add</DialogTitle>
      <DialogContent dividers>
     
           <RadioGroup
          
         name="options"
          value={value}
          onChange={handleChange}
        >
          {options.map((option) => (
            <FormControlLabel
              value={option}
              key={option}
              control={<Radio />}
              label={option}
            />
          ))}
        </RadioGroup>


       
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleOk}>Ok</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ChooseCompoent