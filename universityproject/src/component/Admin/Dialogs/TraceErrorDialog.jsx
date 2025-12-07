// ErrorDialog.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography
} from "@mui/material";

export default function TraceErrorDialog({ open, onClose, title = "Validation Errors", errors = [] }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography style={{ color: "#003C64", fontWeight: "bold" }}>{title}</Typography>
      </DialogTitle>
      <DialogContent dividers>
        {errors.length === 0 ? (
          <Typography>No errors found.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: "#003C64" }}>
                  <TableCell style={{ color: "white", fontWeight: "bold" }}>Row</TableCell>
                  <TableCell style={{ color: "white", fontWeight: "bold" }}>Field</TableCell>
                  <TableCell style={{ color: "white", fontWeight: "bold" }}>Message</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {errors.map((err, index) => (
                  <TableRow key={index}>
                    <TableCell>{err.row}</TableCell>
                    <TableCell>{err.field}</TableCell>
                    <TableCell>{err.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" style={{ backgroundColor: "#003C64", color: "white" }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
