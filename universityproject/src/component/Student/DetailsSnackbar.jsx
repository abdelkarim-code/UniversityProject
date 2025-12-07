import Snackbar from "@mui/material/Snackbar";
import Alert from '@mui/material/Alert';
import Typography from "@mui/material/Typography";
import { Tooltip } from "@mui/material";

// type: "course" | "department"
export default function DetailsSnackbar(props) {
  
  const {onClose}=props
  const {open,type,name,code,description}=props?.openDetails??{}
 
  const title = type === "course" ? "Course Details" : "Department Details";
   
  return (
    <Tooltip title={"Tap anywhere outside this box to close."} placement="bottom" arrow ><Snackbar
      open={open}
      
      onClose={onClose}
      
    >
      <Alert
        severity={"info"}
        variant="filled"
        
        sx={{ width: "100%", display: "flex", flexDirection: "column" }}
      >
        {/* Title */}
        <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 0.5 }}>
          {title}
        </Typography>

        {/* Name */}
        <Typography variant="body2">
          <strong>Name:</strong> {name}
        </Typography>

        {/* Code */}
        <Typography variant="body2">
          <strong>Code:</strong> {code}
        </Typography>

        {/* Description */}
        {description && (
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            <strong>Description:</strong> {description}
          </Typography>
        )}
      </Alert>
    </Snackbar></Tooltip>
  );
}
