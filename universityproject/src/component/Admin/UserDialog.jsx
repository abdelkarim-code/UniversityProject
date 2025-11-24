import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, InputLabel, Radio, RadioGroup } from '@mui/material';
import React,{ useEffect, useState} from 'react'
import { useAlert } from '../../context';
import { TextField, Autocomplete,Select,MenuItem } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { fetchDepartments, fetchProgramsByDepartment } from '../redux/Slices/DepartmentSlice';
import { addDoctor } from '../redux/Slices/DoctorSlice';
import { addstudent } from '../redux/Slices/StudentSlice';

function UserDialog({open,onClose}) {
 const [value, setValue] = useState("");
 const [identifier,setidentifier]= useState("");
 const department=useSelector((state)=>state.department)
  const student=useSelector((state)=>state.student)
 const {setopen}=useAlert()
 const dispatch=useDispatch()
 const {isloading,status}=useSelector(state=>state.doctor)
 useEffect(()=>{
  
      dispatch(fetchDepartments())
 },[open, department.departments])
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
  useEffect(()=>{
    if(status==201){
        setopen({state:true,message:"Doctor added successfully",color:"success"})
        onClose(false)
    }else if(status==409){
       setopen({state:true,message:"Please use a different name. Update either your first name or last name.",color:"error"})
    }else if(student.status==201){
        setopen({state:true,message:"student added successfully",color:"success"})
        onClose(false)
    }

  },[status,student.isloading])

   const handleSubmit = async(event,doctor) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
       const Data=Object.fromEntries(formData.entries())
     
         
       if(doctor){
        
         dispatch(addDoctor(Data))
       }else{
        console.log("student: ",Data)
        dispatch(addstudent(Data))
       }
    
      
    }

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
        {((identifier=='Doctors'||identifier=="Students")&&!department.isloading)&&(
               <form onSubmit={(e)=>{
                if(identifier=="Doctors"){
                 handleSubmit(e,true)
                }else{
                    handleSubmit(e,false)
                }
                
                }} id="subscription-form" key={identifier}>
                                           <TextField
                                                            label="First Name"
                                                            name="first_name"
                                                            id="first_name"
                                                            variant="standard"
                                                            margin="dense"
                                                            
                                                            fullWidth
                                                            autoFocus
                                                            key={identifier}
                                                            slotProps={
                                                               identifier=="Doctors"?{htmlInput: {
                                                                     pattern: "^[A-Za-z]{1,20}$",
                                                                     title: "Only letters allowed. No spaces. Max 20 characters."
                                                                    }}:{}
                                                                }
                                                        />
                                                      
                                                      
                                                        <TextField
                                                            label="Last Name"
                                                            name="last_name"
                                                            id="last_name"
                                                            variant="standard"
                                                            margin="dense"
                                                            required
                                                            key={identifier}
                                                            fullWidth
                                                             slotProps={{
                                                                    htmlInput: {
                                                                     pattern: "^[A-Za-z]{1,20}$",
                                                                     title: "Only letters allowed. No spaces. Max 20 characters."
                                                                    },
                                                                }}
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
                                                          {identifier=="Doctors"&&(
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

                                                          )} 
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
                                                                     onChange={(e)=>dispatch(fetchProgramsByDepartment(e.target.value))}
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
                                                   
                                                    {(department.programs.length>0&&identifier=="Students")&&(
                                              <FormControl fullWidth margin="dense">
                                                <InputLabel id="program-label">Choose a Program</InputLabel>
                                             <Select  
                                                      autoFocus
                                                      required
                                                      margin="dense"
                                                      id="program_id"
                                                      name="program_id"
                                                      labelId='program-label'
                                                      fullWidth
                                                      
                                                    
                                                      variant="standard"
                                                      
                                                      >
                                                    {
                                                    
                                                        department.programs.map((d)=>(
                                                    <MenuItem value={d.program_id} key={d.program_id}>{d.name}</MenuItem>

                                                    ))
                                                      
                                                  
                                                    
                                                    
                                                    }
                                                    
                                                            
                                            </Select>
                                            </FormControl>



                                            )}          




               </form>
        )}



       
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleOk} type={"submit"} form="subscription-form" loading={isloading||student.isloading}>Ok</Button>
      </DialogActions>
    </Dialog>
  )
}

export default UserDialog