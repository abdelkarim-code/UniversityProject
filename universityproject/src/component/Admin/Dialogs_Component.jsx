import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {  useAlert } from '../../context';
import { useSelector,useDispatch } from 'react-redux';
import {createFaculty} from "../redux/Slices/FacultySlice"
import { useEffect, useState } from 'react';
import { MenuItem, Select,Box, FormControl, InputLabel } from '@mui/material';
import { createDepartment,fetchDepartments,createProgram,fetchProgramsByDepartment } from '../redux/Slices/DepartmentSlice';
import { addCourse } from '../redux/Slices/CourseSlice';
const courseCategories = [
  'major',
  'major_elective',
  'remedial',
  'lab',
  'graduation_project'
];
function Dialogs_Component({open,Close,identifier=""}) {
  
    const {setopen}=useAlert()
    const {isloading,status,faculties}=useSelector((state)=>state.faculty)
    const department=useSelector((state)=>state.department)
    const course=useSelector((state)=>state.course)
    const [category, setCategory] = useState('');
    
   const [facultyId,setfacultyId]=useState(0)
   const [departmentname,setdepartmentname]=useState("")
   const dispatch=useDispatch()
   const  computeValueBasedOnCategory=()=>{
     if(category!=""){
         if(category=='remedial'){
          return 4
         }else if(category=='lab'){
          return 1
         }
         return 3
     }
     return 0
   }
useEffect(()=>{
    //faculty
  if(Number(status)==201&&identifier=="Faculities"){
    Close({status:false,identifier:""})
    setopen({state:true,message:"Faculty added successfully!",color:"success"})
    }else if(Number(status)==409&&identifier=="Faculities"){
    setopen({state:true,message:"Duplicate entry detected — please use a different faculty name",color:"error"})
    //Department
  }else if(Number(department.status)==201&&identifier=="Departments"){
    Close({status:false,identifier:""})
    setopen({state:true,message:"Department added successfully!",color:"success"})
  }else if(Number(department.status)==409&&identifier=="Departments"){
    setopen({state:true,message:"Duplicate entry detected — please use a different department name or code",color:"error"})
    //program
  }else if(Number(department.status)==201&&identifier=="programs"){
    Close({status:false,identifier:""})
    setopen({state:true,message:"Program added successfully!",color:"success"})
  }else if(Number(department.status)==409&&identifier=="programs"){
    setopen({state:true,message:"Duplicate entry detected — please use a different program name",color:"error"})
//Course
}else if(Number(course.status)==201&&identifier=="Courses"){
    Close({status:false,identifier:""})
    setopen({state:true,message:"Course added successfully!",color:"success"})
  }else if(Number(course.status)==409&&identifier=="Courses"){
    setopen({state:true,message:"Duplicate entry detected — please use a different course name or code",color:"error"})
  }
},[status,department.status,course.status])

useEffect(()=>{
  
if(identifier=="programs"||identifier=="Courses"){
     dispatch(fetchDepartments())
    }
   
},[open,identifier])

 const handleSubmit = async(event,identifier) => {
    event.preventDefault();
    
    const formData = new FormData(event.currentTarget);
    
    if(identifier=="Faculities"){
    const {name,description} = Object.fromEntries(formData.entries());
      dispatch(createFaculty({name,description}))
    }else if(identifier=="Departments"){
        const DepartmentData=Object.fromEntries(formData.entries())
       if(DepartmentData?.faculty_id!=0){
          if(DepartmentData.name.split("Department of")[1]!=" "){
                setdepartmentname("")
         dispatch(createDepartment(DepartmentData))
          }else{
            setopen({state:true,message:"Ensure to Write a department name",color:"error"})
          }
      
        }else{
          setopen({state:true,message:"Select a faculty name to proceed",color:"error"})
        }
        
        
    }else if(identifier=="programs"){
        const ProgramData=Object.fromEntries(formData.entries())
        dispatch(createProgram(ProgramData))
    }else if(identifier=="Courses"){
         
        const CourseData=Object.fromEntries(formData.entries())
         
       
        if(CourseData?.program_id){
            dispatch(addCourse(CourseData))
        }else{
         setopen({state:true,message:"No program added under this department",color:"warning"})
        }
      
    }
    
  };
  const WriteATitleBasedOnIdentifier=(identifier)=>{
    if(identifier=="Faculities"){
        return "Add new Faculty"
    }else if(identifier=="Departments"){
        return "Add new Department"
    }else if(identifier=="programs"){
        return "Add new Program"
    }else if(identifier=="Courses"){
        return "Add new Course"
    }
  }
  

  return (
    <>
      <Dialog open={open} >
        <DialogTitle >{WriteATitleBasedOnIdentifier(identifier)}</DialogTitle>
        <DialogContent>
            {identifier=="Faculities"&&(
               <form onSubmit={(event)=>handleSubmit(event,identifier)} id="subscription-form">
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="name"
              label="Faculty Name"
              type="text"
              fullWidth
              variant="standard"
            />
              <TextField
              autoFocus
              required
              margin="dense"
              id="description"
              name="description"
              label="Faculty Description"
              type="text"
              fullWidth
              variant="standard"
              multiline
              rows={4}
              
            />
          </form>
            )}
             {identifier=="Departments"&&(
               <form onSubmit={(event)=>handleSubmit(event,identifier)} id="subscription-form">
                <Select  
                 autoFocus
              required
              margin="dense"
              id="faculty_id"
              name="faculty_id"
              label="Choose a faculty"
                fullWidth
               value={facultyId}
               onChange={(e)=>setfacultyId(e.target.value)}
              variant="standard"
              
                >
                    {faculties.length>0&&
                    faculties.map((faculty)=>(
                     <MenuItem value={faculty.faculty_id} key={faculty.faculty_id}>{faculty.name}</MenuItem>

                    ))
                    
                    
                    }
                    
                </Select>
            <TextField
             
              required
              margin="dense"
              id="name"
              name="name"
              value={departmentname}
              onFocus={()=>{
                if(departmentname=="")
                  setdepartmentname("Department of ")

              }}
              onChange={(e)=>{
                if(e.target.value.startsWith("Department of ")){
                  setdepartmentname(e.target.value)
                }
              }}
               helperText={departmentname!=""&&"The 'Department of' part is fixed and cannot be edited."}
              label="Department Name"
              type="text"
              fullWidth
              variant="standard"
              autoComplete='off'
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="code"
              name="code"
              label="Department Code"
              type="text"
              fullWidth
              variant="standard"
              slotProps={{
                    htmlInput: { maxLength: 6,pattern: "[A-Z]*",  
                              title: "Only UpperCase letters are allowed",},
                }}
              
            />
              <TextField
              autoFocus
              required
              margin="dense"
              id="description"
              name="description"
              label="Department Description"
              type="text"
              fullWidth
              variant="standard"
              multiline
              rows={4}
              
            />
            
          </form>
            )}
            


        {identifier=="programs"&&(
               <form onSubmit={(event)=>handleSubmit(event,identifier)} id="subscription-form">
             <Select  
                 autoFocus
              required
              margin="dense"
              id="degree_type"
              name="degree_type"
              label="Choose the Degree_type"
                fullWidth
                
               value={facultyId}
               onChange={(e)=>setfacultyId(e.target.value)}
              variant="standard"
              
                >
                    {
                    ["BSc","MSc","PhD"].map((p,index)=>(
                     <MenuItem value={p} key={index}>{p}</MenuItem>

                    ))
                    
                    
                    }
                    
                </Select>
                 <Select  
                 autoFocus
              required
              margin="dense"
              id="department_id"
              name="department_id"
              label="Choose a department"
                fullWidth
               value={departmentname}
               onChange={(e)=>setdepartmentname(e.target.value)}
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
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="name"
              label="Program Name"
              type="text"
              fullWidth
              variant="standard"
            />
              <TextField
              autoFocus
              required
              margin="dense"
              id="duration_years"
              name="duration_years"
              label="Duration_years"
              type="number"
              fullWidth
              variant="standard" 
              slotProps={{htmlInput:{ min: facultyId=="MSc"?2:3 }}}
            />
           

                <TextField
                  autoFocus
                   required
                   variant="standard"
                     margin="dense"
                       fullWidth
                      label="Credit Price"
                      type="number"
                      name="credit_price"
                      slotProps={{htmlInput:{step: "0.01", min: 1}}}
                     
                    />

                    <TextField
                          label="Total Credits"
                          type="number"
                          name="total_credits"
                          slotProps={{htmlInput:{ min: 1 }}}
                          autoFocus
                          required
                          variant="standard"
                          margin="dense"
                         fullWidth
                           
                          />
          </form>
            )}
            {identifier=="Courses"&&(
              <form onSubmit={(event)=>handleSubmit(event,identifier)} id="subscription-form">
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
                                                      value={departmentname}
                                                      onChange={(e)=>{
                                                        setdepartmentname(e.target.value)
                                                        dispatch(fetchProgramsByDepartment(e.target.value))

                                                      }}
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
                                            {department.programs.length>0&&(
                                              <FormControl fullWidth margin="dense">
                                                <InputLabel id="department-label">Choose a Program</InputLabel>
                                             <Select  
                                                      autoFocus
                                                      required
                                                      margin="dense"
                                                      id="program_id"
                                                      name="program_id"
                                                      labelId='department-label'
                                                      
                                                     fullWidth
                                                      value={facultyId}
                                                      onChange={(e)=>{
                                                        setfacultyId(e.target.value)
                                                        

                                                      }}
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
                                          
                                            <TextField
                                              name="name"
                                              label="Name"
                                              margin="dense"
                                              fullWidth
                                              required
                                              variant="standard"
                                            />

                                            <TextField
                                              name="code"
                                              label="Code"
                                              margin="dense"
                                              fullWidth
                                              required
                                              variant="standard"
                                              slotProps={{
                                                htmlInput: { pattern: "[A-Z0-9]+",maxLength:10, title: "Only UpperCase letters and numbers are allowed" }
                                              }}
                                            />
             
                                            <TextField
                                              name="semester"
                                              label="Semester"
                                              margin="dense"
                                              fullWidth
                                              autoFocus
                                              required
                                              variant="standard"
                                              slotProps={{
                                                htmlInput: { pattern: "[12]", title: "Semester must be 1 (Fall) or 2 (Spring)" }
                                              }}
                                            />

                                            <TextField
                                              name="level"
                                              label="Year"
                                              margin="dense"
                                              fullWidth
                                              required
                                              variant="standard"
                                              slotProps={{
                                                htmlInput: { pattern: "\\d+", title: "Level must be a number" }
                                              }}
                                            />
                                             <TextField
                                              name="course_category"
                                              label="Course Category"
                                              margin="dense"
                                              fullWidth
                                              variant="standard"
                                              required
                                              select
                                              onChange={(e)=>setCategory(e.target.value)}
                                              key={departmentname}
                                            >
                                              {departmentname!=8?courseCategories.map((c,index)=>(
                                                <MenuItem key={index} value={c}>{c}</MenuItem>
                                              )):["elective"].map((c,index)=>(
                                                <MenuItem key={index} value={c}>{c}</MenuItem>
                                              ))}
                                              
                                            </TextField>
                                            <TextField
                                              name="credit_hours"
                                              label="Credit Hours"
                                              margin="dense"
                                              fullWidth
                                              variant="standard"
                                              value={computeValueBasedOnCategory()}
                                                 slotProps={{
                                                htmlInput: { readOnly:true }
                                              }}
                                              required
                                              helperText="This value is computed and cannot be edited"
                                            />

                                            <TextField
                                              name="description"
                                              label="Description"
                                              margin="dense"
                                              fullWidth
                                              variant="standard"
                                              required
                                              multiline
                                              rows={3}
                                            />

                                           
                                          
                  </form>



            )}

        </DialogContent>
        <DialogActions>
          <Button onClick={()=>{Close({status:false,identifier:"return"})
        setdepartmentname("")
        }}>Cancel</Button>
          <Button type="submit" form="subscription-form" loading={isloading||department.isloading}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      
    </>
    
    
  )
}

export default Dialogs_Component