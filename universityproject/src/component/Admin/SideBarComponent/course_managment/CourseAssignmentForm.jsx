import { Card, CardContent, Box, Typography, Chip, TextField, Grid, AppBar, Toolbar, Button } from "@mui/material";
import { styled } from "@mui/material/styles";

const DashboardCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  border: `1px solid ${theme.palette.divider}`,
  width: "100%",
  maxWidth: "1200px",
  margin: "0 auto",
}));

const FormAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderRadius: "12px 12px 0 0",
  boxShadow: "none",
  padding: theme.spacing(0),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: "8px",
    backgroundColor: theme.palette.background.default,
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: "2px",
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: theme.palette.primary.main,
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: "8px",
  fontWeight: "bold",
  textTransform: "none",
  padding: theme.spacing(1, 3),
  fontSize: "0.875rem",
}));

export default function CourseAssignmentForm() {

 return(
  <h1>hello</h1>
 )
}