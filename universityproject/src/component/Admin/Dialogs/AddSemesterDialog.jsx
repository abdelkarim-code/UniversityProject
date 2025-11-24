import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Autocomplete
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addsemester } from '../../redux/Slices/SemesterSlice';
import { useAlert } from '../../../context';

export default function AddSemesterDialog({ open, onClose }) {
  const dispatch=useDispatch()
  const {status,message}=useSelector(state=>state.semester)
  const alert=useAlert()
  const handleSubmit = async(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
         const Data=Object.fromEntries(formData.entries())
          dispatch(addsemester(Data))
      }
      useEffect(()=>{
          if(status==201){
            onClose(false)
           alert.setopen({state:true,message:"A new semester is added successfully",color:"success"})
          }else if(status==409){
            alert.setopen({state:true,message:message,color:"error"})
          }
      },[status])
  return (
    <Dialog open={open} >
      <DialogTitle>Add Semester</DialogTitle>
      <DialogContent>
        <form id="add-semester-form" onSubmit={handleSubmit}>
          <Autocomplete
            options={["Fall","Spring","Summer"]}
            renderInput={(pa)=>(
               <TextField
               {...pa}
            fullWidth
            margin="normal"
            label="Semester Name"
            name="name"
            required
          />
            )}
          />
         
          <TextField
            fullWidth
            margin="normal"
            label="Academic Year"
            name="academic_year"
            type="text"
              required
               slotProps={{
                      htmlInput: {
                        pattern: "^[0-9]{4}-[0-9]{4}$",
                        title: "Enter academic year in YYYY-YYYY format, e.g., 2025-2026"
                      }
                    }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Start Date"
            name="start_date"
            type="date"
              required
            slotProps={{
                inputLabel:{ shrink: true }
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="End Date"
            name="end_date"
            type="date"
             required
            slotProps={{
                inputLabel:{ shrink: true }
            }}
          />
         
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={()=>onClose(false)}>Cancel</Button>
        <Button type="submit" form="add-semester-form" variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
