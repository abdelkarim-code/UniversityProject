import React, { useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";

// Custom components
import NOTFOUND from "../../NotFound";
import { SecondaryButton, StatusChip } from "../styled/registration_styled";

// Redux action
import { getStudentRegiteredCourses } from "../../redux/Slices/Student_Course_registration_Slice";


// Colors
const PRIMARY_YELLOW = '#fdd835';
const PRIMARY_BLUE = '#003C64';
const WHITE = '#ffffff';

const ClassesView = () => {
  const dispatch = useDispatch();
  
  // From parent route context
  const current_semester = useOutletContext();

  // From Redux
  const { active_user } = useSelector((state) => state.auth);
  const { reg_courses: registeredCourses } = useSelector((state) => state.cou_reg);

  /** Fetch student courses for this semester */
  useEffect(() => {
    if (!active_user || !current_semester) return;

    dispatch(
      getStudentRegiteredCourses({
        student_id: active_user.student_id,
        semester_id: current_semester.semester_id,
      })
    );
  }, []);
   const handleDropCourse = (course) => {
    // Drop course logic would go here
    console.log('Dropping course:', course);
  };
 
  /** Render Table Layout */
  const renderRegisteredCourses = () => (
    <Container
      component={Paper}
      sx={{
        maxHeight: 600,
        overflowY: "auto",
        borderRadius: 2,
        mt: 2,
        boxShadow: "0 2px 12px rgba(0,0,0,0.1)"
      }}
    >
      {registeredCourses && registeredCourses.length > 0 ? (
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor:WHITE  }}>
              <TableCell sx={{ color: PRIMARY_BLUE, fontWeight: "bold" }}>
                Course Name
              </TableCell>
              <TableCell sx={{ color: PRIMARY_BLUE, fontWeight: "bold" }}>
                Code
              </TableCell>
              <TableCell sx={{ color: PRIMARY_BLUE, fontWeight: "bold" }}>
                Doctor
              </TableCell>
              <TableCell
                align="center"
                sx={{ color: PRIMARY_BLUE, fontWeight: "bold" }}
              >
                Status
              </TableCell>
              <TableCell
                align="center"
                sx={{ color: PRIMARY_BLUE, fontWeight: "bold" }}
              >
                Credits
              </TableCell>
               <TableCell
                align="center"
                sx={{ color: PRIMARY_BLUE, fontWeight: "bold" }}
              >
                Schedule_time
              </TableCell>
               <TableCell
                align="center"
                sx={{ color: PRIMARY_BLUE, fontWeight: "bold" }}
              >
                
                Room_number
              </TableCell>
              <TableCell
                align="center"
                sx={{ color: PRIMARY_BLUE, fontWeight: "bold" }}
              >
                
                Section
              </TableCell>
              <TableCell
                align="center"
                sx={{ color: PRIMARY_BLUE, fontWeight: "bold" }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {registeredCourses.map((course) => (
              <TableRow key={course.registration_id} hover>
                <TableCell>{course.course_name}</TableCell>
                <TableCell>{course.course_code}</TableCell>
                <TableCell>{course.doctor_name}</TableCell>

                <TableCell align="center">
                  <StatusChip
                    label={course.status.toUpperCase()}
                    status={course.status}
                    size="small"
                  />
                </TableCell>

                <TableCell align="center">{course.credit}</TableCell>
                 <TableCell align="center">{course.schedule_time}</TableCell>
                 <TableCell align="center">{course.room_number}</TableCell>
                 <TableCell align="center">{course?.section}</TableCell>
                <TableCell align="center">
                  {course.status === "enrolled" && (
                    <SecondaryButton
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDropCourse(course)}
                    >
                      Drop
                    </SecondaryButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Box sx={{ py: 4 }}>
          <NOTFOUND message="You haven’t registered for any courses yet." />
        </Box>
      )}
    </Container>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, color: PRIMARY_BLUE, mb: 2,textAlign:"center" }}
      >
        Registered Courses in {current_semester?.name} {current_semester?.academic_year}
      </Typography>

      {renderRegisteredCourses()}
    </Box>
  );
};

export default ClassesView;
