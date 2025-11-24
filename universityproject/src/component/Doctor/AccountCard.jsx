import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";

const AccountCard = ({ user }) => {
  if (!user) return null;

  const userFields = [
    { label: "Name", value: user.name },
    { label: "First Name", value: user.first_name },
    { label: "Last Name", value: user.last_name },
    { label: "Email", value: user.email },
    { label: "Phone", value: user.phone },
    { label: "Address", value: user.address },
    { label: "Code", value: user.code },
    { label: "Faculty ID", value: user.faculty_id },
    { label: "Employee Code", value: user.employee_code },
    { label: "Specialization", value: user.specialization },
  ];

  return (
    <Card sx={{ maxWidth: 400, margin: "20px auto", boxShadow: 3, borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Account Information
        </Typography>
        <Grid container spacing={1}>
          {userFields.map((field, idx) => (
            <Grid item xs={12} key={idx}>
              <Typography variant="body2" color="textSecondary">
                <strong>{field.label}:</strong> {field.value || "-"}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AccountCard;
