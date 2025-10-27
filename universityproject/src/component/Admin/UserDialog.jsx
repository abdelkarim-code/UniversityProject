import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, InputLabel, Radio, RadioGroup, useTheme } from '@mui/material';
import React,{ useEffect, useState} from 'react'
import { useAlert } from '../../context';
import { TextField, Autocomplete,Select,MenuItem } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartments } from '../redux/Slices/DepartmentSlice';
import useMediaQuery from '@mui/material/useMediaQuery';
function UserDialog({open,onClose}) {
 const [value, setValue] = useState("");
 const [identifier,setidentifier]= useState("");
 const department=useSelector((state)=>state.department)
 const {setopen}=useAlert()
 const theme =useTheme()
 const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
 const dispatch=useDispatch()
 useEffect(()=>{
 dispatch(fetchDepartments())
 },[])
  const Useroptions = [
  'Students',
  'Doctors',
 
];
const cities = [
  "Beirut",
  "Tripoli",
  "Sidon",
  "Tyre",
  "Zahle",
  "Byblos",
  "Baalbek",
  "Jounieh",
];
     useEffect(()=>{
        setValue("")
        setidentifier("")
     },[open])

const handleCancel = () => {
    onClose(false);
  };

  const handleOk = () => {
    if(value.trim()==""){
         setopen({state:true,message:"please choose a option to proceed",color:"error"})
    }else{
      setidentifier(value)
    }
    
  };
   const handleSubmit = async(event) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
       const DepartmentData=Object.fromEntries(formData.entries())
    console.log(DepartmentData)
      
    };

  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const WriteATitleBasedOnIdentifier=()=>{
    if(identifier==""){
        return "Select Record Type to Add"
    }else if(identifier=='Doctors'){
        return "Add new Doctor"
    }else if(identifier=='Students'){
        return "Add new Student"
    }
    
  }
  return (
     <Dialog
      sx={identifier==""?{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }:{}}
      maxWidth={identifier==""&&"xs"}
      fullScreen={fullScreen}
      open={open}
    
    >
      <DialogTitle>{WriteATitleBasedOnIdentifier()}</DialogTitle>
      <DialogContent dividers>
      
        {identifier==""&&(
        <RadioGroup
          
         name="options"
          value={value}
          onChange={handleChange}
        >
          {Useroptions.map((option) => (
            <FormControlLabel
              value={option}
              key={option}
              control={<Radio />}
              label={option}
            />
          ))}
        </RadioGroup>


        )}   
        {(identifier=='Doctors'&&!department.isloading)&&(
               <form onSubmit={handleSubmit} id="subscription-form">
                                           <TextField
                                                            label="First Name"
                                                            name="first_name"
                                                            id="first_name"
                                                            variant="standard"
                                                            margin="dense"
                                                            required
                                                            fullWidth
                                                            autoFocus
                                                        />
                                                      
                                                      
                                                        <TextField
                                                            label="Last Name"
                                                            name="last_name"
                                                            id="last_name"
                                                            variant="standard"
                                                            margin="dense"
                                                            required
                                                            fullWidth
                                                        />
                                                        <TextField
                                                            label="Phone"
                                                            name="phone"
                                                             id="phone"
                                                            type="tel"
                                                            variant="standard"
                                                            margin="dense"
                                                            required
                                                            defaultValue={"+961"}
                                                            fullWidth
                                                            slotProps={{htmlInput:{
                                                              pattern: "^\\+961(3\\d{6}|7\\d{7}|1\\d{6}|9\\d{6}|8\\d{6})$",
                                                              title: "Enter a valid Lebanese phone number starting with +961",
                                                            }}}
                                                        />
                                                        <Autocomplete
                                                            options={cities}
                                                            renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Address (City)"
                                                                name="address"
                                                                id='address'
                                                                variant="standard"
                                                                margin="dense"
                                                                required
                                                                fullWidth
                                                            />

                                                            )}
                                                        />
                                                          <Autocomplete
                                                            options={["Male","Female"]}
                                                            renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Gender"
                                                                name="gender"
                                                                 id="gender"
                                                                variant="standard"
                                                                margin="dense"
                                                                required
                                                                fullWidth
                                                            />
                                                        
                                                            )} />
                                                             <TextField
                                                            label="Specialization"
                                                            name="specialization"
                                                            id="specialization"
                                                            variant="standard"
                                                            margin="dense"
                                                            required
                                                            fullWidth
                                                            autoFocus
                                                        />
                                                          <FormControl fullWidth margin="dense">
                                                        <InputLabel id="department-label">Choose a department</InputLabel>
                                                           <Select  
                                                                    autoFocus
                                                                    required
                                                                    margin="dense"
                                                                    id="department_id"
                                                                    name="department_id"
                                                                    labelId='department-label'
                                                                    
                                                                    fullWidth
                                                                  
                                                                    variant="standard"
                                                                    
                                                                    >
                                                                    {
                                                                    department.departments.length>0&&(
                                                                        department.departments.map((d)=>(
                                                                    <MenuItem value={d.department_id} key={d.department_id}>{d.name}</MenuItem>
                
                                                                    ))
                                                                    )
                                                                
                                                                    
                                                                    
                                                                    }
                                                                    
                                                                            
                                                            </Select>

                                                        </FormControl>
                                                   
                                                            




               </form>
        )}



       
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleOk} type={"submit"} form="subscription-form">Ok</Button>
      </DialogActions>
    </Dialog>
  )
}

export default UserDialog