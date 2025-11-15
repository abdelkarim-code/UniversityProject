import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch } from 'react-redux';
import { editDepartment } from '../../../redux/Slices/DepartmentSlice';

export default function EditDepartmentDialog({ open, onClose,Data }) {
    const dispatch=useDispatch()
    const handleSubmit = async(event,data) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
             const Data=Object.fromEntries(formData.entries())
             const {department_id}=data
             dispatch(editDepartment({...Data,department_id}))
            
    }
             
  return (
    <Dialog open={open}  maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" spacing={1} alignItems="center">
          <EditIcon />
          Edit Department
        </Stack>
      </DialogTitle>

      <DialogContent>
        <form id="edit-department-form" onSubmit={(e)=>handleSubmit(e,Data)}>
          <TextField
            fullWidth
            margin="normal"
            defaultValue={Data?.code}
            label="Department Code"
            name="code"
         
            focused
          />
          <TextField
            fullWidth
            margin="normal"
            label="Department Name"
            name="name"
            focused
            defaultValue={Data?.name}
            
          />
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            name="description"
            defaultValue={Data?.description}
            multiline
            focused
            rows={3}
            
          />
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" form="edit-department-form" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
