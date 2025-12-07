import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch, useSelector } from 'react-redux';
import { deleteFaculty, fetchFaculties } from '../redux/Slices/FacultySlice';
import { useEffect, useState } from 'react';
import { useAlert } from '../../context';

export default function AlertDialog({open,setOpen,Data,id}) {
  const {status}=useSelector(state=>state.faculty)
  const [deletedName, setDeletedName] = useState("");
  const alert=useAlert()
  const dispatch=useDispatch()
 const handleClose = () => {
  setOpen({status:false,faculty_id:0,name:""})
  };
  const handleClick = (id,Data) => {
    
   dispatch(deleteFaculty(id||0))
  setOpen({status:false,faculty_id:0,name:""})
  setDeletedName(Data)
  };
  useEffect(()=>{
    
   if(status==200){
    alert.setopen({state:true,message:`${deletedName} is removed successfully`,color:"warning"})
    dispatch(fetchFaculties())
   }else if(status==500){
     alert.setopen({state:true,message:`An error occurs`,color:"error"})
   }
  },[status])

  return (
    <>
   <Dialog
        open={open}
        onClose={handleClose}
         slotProps={{
   backdrop: {
      sx: { backgroundColor: "rgba(239, 229, 229, 0.00000000003)" },
    },
  }}
    
      >
        <DialogTitle >
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText >
           This action cannot be undone. Are you sure you want to delete this {Data}.
           Once deleted, all related data will be lost. Please confirm your decision.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={()=>handleClick(id,Data)} autoFocus>
           Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
