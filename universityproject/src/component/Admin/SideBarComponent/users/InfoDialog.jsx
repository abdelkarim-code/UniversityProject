import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
} from "@mui/material";

const InfoDialog = ({ open, handleClose, data }) => {
  if (!data) return null;

  const isStudent = data?.student_id !== undefined;
  const isDoctor = data?.doctor_id !== undefined;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isStudent ? "Student Information: " : "Doctor Information: "}
        <Typography
          component="span"
          variant="h6"
          fontWeight="bold"
        >
          {data.first_name?.toUpperCase()} {data.last_name?.toUpperCase()}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>

          {/* === COMMON USER FIELDS === */}
          <Grid item xs={6}>
            <Typography sx={{ fontWeight: "bold", color: "#003C64" }}>Email:</Typography>
            <Typography>{data.email}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography sx={{ fontWeight: "bold", color: "#003C64" }}>Phone:</Typography>
            <Typography>{data.phone}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography sx={{ fontWeight: "bold", color: "#003C64" }}>Address:</Typography>
            <Typography>{data.address}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography sx={{ fontWeight: "bold", color: "#003C64" }}>Gender:</Typography>
            <Typography>{data.gender}</Typography>
          </Grid>

          {/* === STUDENT FIELDS === */}
          {isStudent && (
            <>
              <Grid item xs={6}>
                <Typography sx={{ fontWeight: "bold", color: "#003C64" }}>Student Code:</Typography>
                <Typography>{data.student_code}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography sx={{ fontWeight: "bold", color: "#003C64" }}>Program:</Typography>
                <Typography>{data.program_name}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography sx={{ fontWeight: "bold", color: "#003C64" }}>Department:</Typography>
                <Typography>{data.department_name}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography sx={{ fontWeight: "bold", color: "#003C64" }}>Current Year:</Typography>
                <Typography>{data.current_year}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography sx={{ fontWeight: "bold", color: "#003C64" }}>GPA:</Typography>
                <Typography>{data.gpa}</Typography>
              </Grid>
            </>
          )}

          {/* === DOCTOR FIELDS === */}
          {isDoctor && (
            <>
              <Grid item xs={6}>
                <Typography sx={{ fontWeight: "bold", color: "#003C64" }}>Doctor Code:</Typography>
                <Typography>{data.employee_code}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography sx={{ fontWeight: "bold", color: "#003C64" }}>Specialization:</Typography>
                <Typography>{data.specialization}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography sx={{ fontWeight: "bold", color: "#003C64" }}>Department:</Typography>
                <Typography>{data.department_name}</Typography>
              </Grid>
            </>
          )}

          {/* === COMMON DATE CREATED === */}
          <Grid item xs={12}>
            <Typography sx={{ fontWeight: "bold", color: "#003C64" }}>
              Date Created:
            </Typography>
            <Typography>{new Date(data.date_created).toLocaleString()}</Typography>
          </Grid>

        </Grid>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{ backgroundColor: "#fdd835", color: "#003C64", fontWeight: "bold" }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InfoDialog;
