import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/system";
import { fetchStudentsByAssignment } from "../redux/Slices/CourseSlice";


// Colors
const PRIMARY_BLUE = "#003C64";
const PRIMARY_YELLOW = "#fdd835";
const WHITE = "#ffffff";

// Styled components
const StyledTableContainer = styled(TableContainer)({
  maxHeight: 500,
  borderRadius: 8,
  boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
});

const StyledTableHead = styled(TableHead)({
  backgroundColor: "#ffffff",
});

const StyledHeaderCell = styled(TableCell)({
  color: PRIMARY_BLUE,
  fontWeight: "bold",
  fontSize: 14,
});

const StyledTableRow = styled(TableRow)(({ index }) => ({
  backgroundColor: index % 2 === 0 ? "#f8f9fa" : WHITE,
  "&:hover": {
    backgroundColor: "#f1f1f1",
  },
}));

const StyledTableCell = styled(TableCell)({
  padding: "12px 16px",
  borderBottom: "1px solid #e0e0e0",
});

export default function StudentRegistrationView({ ass_id }) {
  const dispatch = useDispatch();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ass_id) return;

    setLoading(true);
    dispatch(fetchStudentsByAssignment(ass_id))
      .unwrap()
      .then((data) => {
        setStudents(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [dispatch, ass_id]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  if (!students || students.length === 0)
    return (
      <Typography align="center" mt={5}>
        No students registered for this assignment.
      </Typography>
    );


  return (
    <Box mt={3}>
      <Typography
        variant="h6"
        sx={{ color: PRIMARY_BLUE, fontWeight: 700, mb: 2 }}
      >
        Students in Class
      </Typography>

      <StyledTableContainer component={Paper}>
        <Table stickyHeader>
          <StyledTableHead>
            <TableRow>
              <StyledHeaderCell>#</StyledHeaderCell>
              <StyledHeaderCell>Student Id</StyledHeaderCell>
              <StyledHeaderCell>First name</StyledHeaderCell>
              <StyledHeaderCell>Last name</StyledHeaderCell>
              <StyledHeaderCell>Major</StyledHeaderCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {students.map((stu, idx) => (
              <StyledTableRow key={stu.registration_id} index={idx}>
                <StyledTableCell>{idx + 1}</StyledTableCell>
                <StyledTableCell>{stu.student_code}</StyledTableCell>
                <StyledTableCell>
                  {stu.first_name}
                </StyledTableCell>
                <StyledTableCell>
                  {stu.last_name}
                </StyledTableCell>
                
               
               
                 <StyledTableCell>
                  <Tooltip title={stu?.department_name} arrow placement="top"> {stu?.department_code}</Tooltip>
                </StyledTableCell>


                
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </Box>
  );
}
