import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  MenuItem,
  Paper,
} from "@mui/material";
import { omit } from "lodash";
import { useDispatch } from "react-redux";
import { updateCourse } from "../../redux/Slices/CourseSlice";
import { useAlert } from "../../../context";

export default function CourseEditDialog({ open, onClose, initialData }) {
  const [form, setForm] = React.useState({
    code: "",
    name: "",
    description: "",
    credit_hours: "",
    level: "",
    semester: "",
    category: "",
  });
  const {setopen}=useAlert()
 const dispatch=useDispatch()
  // When dialog opens, pre-fill form with initialData
  React.useEffect(() => {
    if (initialData) {
      setForm({
        code: initialData.code || "",
        name: initialData.name || "",
        description: initialData.description || "",
        credit_hours: initialData.credit_hours || "",
        level: initialData.level || "",
        semester: initialData.semester || "",
        
      });
    }
  }, [initialData, open]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const allFilled = Object.values(form).every((v) => v !== "");

  const handleSave = async() => {
    if (!allFilled) return;
      // { courseid, data }
      const data=omit(initialData,["code","name","description","credit_hours","level","semester"])
      
     const res=await dispatch(updateCourse({courseid:data?.course_id,data:{...data,...form}})).unwrap()
     if(res==204){
      onClose();
      setopen({state:true,message:"Course edited successfully",color:"success"})
     }else if (res&&res.status==409){
       setopen({state:true,message:res.message,color:"error"})
     }else{
      setopen({state:true,message:"Something went wrong please try again",color:"error"})
     }
    
  };

  return (
    <Dialog
       open={open}
  onClose={onClose}
  maxWidth={false}   // disable MUI maxWidth limit
  fullWidth
  slots={{ paper: Paper }}
  slotProps={{
    paper: {
      sx: {
        borderRadius: 3,
        p: 3,
        backgroundColor: "#fff",
        width: "60%",       // large width
        maxWidth: "1200px", // optional limit
      },
    },
  }}
    >
      <DialogTitle sx={{ fontWeight: 700, color: "#003C64", borderBottom: "1px solid #eee" }}>
        Edit Course
      </DialogTitle>

      <DialogContent sx={{ mt: 5 }}>
        <Stack spacing={2} p={1}>
          <TextField
            label="Course Code"
            fullWidth
            variant="outlined"
            value={form.code}
            onChange={(e) => handleChange("code", e.target.value)}
          />

          <TextField
            label="Course Name"
            fullWidth
            variant="outlined"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            minRows={3}
            variant="outlined"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />

          <TextField
            label="Credit Hours"
            type="number"
            fullWidth
            variant="outlined"
            value={form.credit_hours}
            onChange={(e) => handleChange("credit_hours", e.target.value)}
          />

          <Stack direction="row" spacing={2}>
            <TextField
              label="Level (Year)"
              select
              fullWidth
              value={form.level}
              onChange={(e) => handleChange("level", e.target.value)}
            >
              {[1, 2, 3, 4].map((level) => (
                <MenuItem key={level} value={level}>
                  Year {level}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Semester"
              select
              fullWidth
              value={form.semester}
              onChange={(e) => handleChange("semester", e.target.value)}
            >
              <MenuItem value="Fall">Fall</MenuItem>
              <MenuItem value="Spring">Spring</MenuItem>
              
            </TextField>
          </Stack>

         
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: "#003C64", fontWeight: 600 }}>
          Cancel
        </Button>

        <Button
          variant="contained"
          disabled={!allFilled}
          onClick={handleSave}
          sx={{
            backgroundColor: allFilled ? "#003C64" : "#8aa3b3",
            "&:hover": {
              backgroundColor: allFilled ? "#002a47" : "#8aa3b3",
            },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
