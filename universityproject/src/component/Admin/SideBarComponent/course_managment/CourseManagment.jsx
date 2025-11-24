import {Paper,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Select,MenuItem,Button,Stack,Box,Typography} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { deleteAssignment, fetchAssignmentsByDeptAndSemester } from '../../../redux/Slices/CourseSlice';
import { fetchDepartments } from '../../../redux/Slices/DepartmentSlice';
import { getsemesters } from '../../../redux/Slices/SemesterSlice';

const CourseAssignmentsTable = () => {
   const dispatch = useDispatch();
   const [deleteTarget, setDeleteTarget] = useState(null);
  // filter state
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [assignments, setFilteredAssignments] = useState([]);
const departments = useSelector(state => state.department.departments);
const semesters = useSelector(state => state.semester.semesters);

// fetch departments & semesters on mount
useEffect(() => {
  dispatch(fetchDepartments());
  dispatch(getsemesters());
}, [dispatch]);


  const handleFilterChange = async (type, value) => {
    if (type === "department") setDepartment(value);
    if (type === "semester") setSemester(value);

    // only fetch if both filters are selected
    const dept = type === "department" ? value : department;
    const sem = type === "semester" ? value : semester;

    if (dept && sem) {
      dispatch(fetchAssignmentsByDeptAndSemester({ department_id: dept, semester_id: sem }))
        .unwrap()
        .then((data) => setFilteredAssignments(data))
        .catch(() => setFilteredAssignments([]));
    } else {
      setFilteredAssignments([]); // clear table if one is missing
    }
  }
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        borderRadius: 2, 
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      {/* Filters Section */}
              <Box 
                sx={{ 
                  p: 3, 
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  backgroundColor: 'white'
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 2,
                    color: '#003C64',
                    fontWeight: 600
                  }}
                >
                  Course Assignments
                </Typography>
                
              <Stack direction="row" spacing={2}>
          {/* Department Filter */}
          <Box sx={{ minWidth: 200 }}>
            <Typography variant="body2" sx={{ mb: 1, color: '#003C64', fontWeight: 500 }}>
              Department
            </Typography>
            <Select
              fullWidth
              size="small"
              displayEmpty
              value={department}
              onChange={(e) => handleFilterChange("department", e.target.value)}
              sx={{
                borderRadius: 1,
                backgroundColor: 'white',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#003C64' }
              }}
            >
              <MenuItem value="">Select Department</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept.department_id} value={dept.department_id}>
                  {dept.name}
                </MenuItem>
              ))}
            </Select>
          </Box>

          {/* Semester Filter */}
          <Box sx={{ minWidth: 200 }}>
            <Typography variant="body2" sx={{ mb: 1, color: '#003C64', fontWeight: 500 }}>
              Semester
            </Typography>
            <Select
              fullWidth
              size="small"
              displayEmpty
              value={semester}
              onChange={(e) => handleFilterChange("semester", e.target.value)}
              sx={{
                borderRadius: 1,
                backgroundColor: 'white',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#003C64' }
              }}
            >
              <MenuItem value="">Select Semester</MenuItem>
              {semesters.map((sem) => (
                <MenuItem key={sem.semester_id} value={sem.semester_id}>
                  {`${sem.name} (${sem.academic_year})`}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Stack>
      </Box>

      {/* Table Section */}
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          {/* Table Header */}
          <TableHead>
            <TableRow>
              <TableCell 
                sx={{ 
                  backgroundColor: '#003C64',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  py: 2
                }}
              >
                Course Name
              </TableCell>
              <TableCell 
                sx={{ 
                  backgroundColor: '#003C64',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  py: 2
                }}
              >
                Doctor Name
              </TableCell>
            
              <TableCell 
                sx={{ 
                  backgroundColor: '#003C64',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  py: 2
                }}
              >
                Section
              </TableCell>
              <TableCell 
                sx={{ 
                  backgroundColor: '#003C64',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  py: 2
                }}
              >
                Schedule Time
              </TableCell>
              <TableCell 
                sx={{ 
                  backgroundColor: '#003C64',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  py: 2
                }}
              >
                Room
              </TableCell>
              <TableCell 
                sx={{ 
                  backgroundColor: '#003C64',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  py: 2
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {assignments.map((assignment, index) => (
              <TableRow 
                key={assignment.assignment_id}
                sx={{ 
                  '&:hover': {
                    backgroundColor: '#fdd83510'
                  },
                  backgroundColor: index % 2 === 0 ? 'white' : 'grey.50'
                }}
              >
                <TableCell sx={{ py: 2 }}>
                  <Typography variant="body2" fontWeight={500}>
                    {assignment.course_name}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 2 }}>
                  <Typography variant="body2">
                    {assignment.doctor_name}
                  </Typography>
                </TableCell>
                
                <TableCell sx={{ py: 2 }}>
                  <Typography variant="body2">
                    {assignment.section}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 2 }}>
                  <Typography variant="body2">
                    {assignment.schedule_time}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 2 }}>
                  <Typography variant="body2">
                    {assignment.room_number}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 2 }}>
                  <Stack direction="row" spacing={1}>
                   
                    
                    {/* Delete Button */}
                  {deleteTarget === assignment.assignment_id ? (
                            <Stack direction="row" spacing={1}>
                              <Button 
                                variant="contained" 
                                color="error" 
                                size="small"
                                onClick={async() => {
                                  if(department&&semester){
                                      
                                      
                                      const req = await dispatch(deleteAssignment({assignment_id:assignment.assignment_id,
                                        
                                       })).unwrap()
                                      if(req==200){
                                           dispatch(fetchAssignmentsByDeptAndSemester({ department_id: department, semester_id: semester }))
                                                    .unwrap()
                                                    .then((data) => setFilteredAssignments(data))
                                      }
                                       
                                  
                                       
                                  }
                                }}
                                sx={{ borderRadius: 1, px: 2, py: 0.5 }}
                              >
                                Confirm
                              </Button>
                              <Button 
                                variant="outlined" 
                                size="small" 
                                onClick={() => setDeleteTarget(null)}
                                sx={{ borderRadius: 1, px: 2, py: 0.5 }}
                              >
                                Cancel
                              </Button>
                            </Stack>
                          ) : (
                            <Button
                              variant="outlined"
                              startIcon={<Delete />}
                              size="small"
                              onClick={() => setDeleteTarget(assignment.assignment_id)}
                              sx={{
                                borderRadius: 1,
                                borderColor: 'error.main',
                                color: 'error.main',
                                textTransform: 'none',
                                px: 2,
                                py: 0.5,
                                '&:hover': {
                                  borderColor: 'error.main',
                                  backgroundColor: 'error.08'
                                }
                              }}
                            >
                              Delete
                            </Button>
                          )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Empty State */}
      {assignments.length === 0 && (
        <Box 
          sx={{ 
            py: 8, 
            textAlign: 'center',
            color: 'text.secondary'
          }}
        >
          <Typography variant="body1">
            No course assignments found
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default CourseAssignmentsTable;