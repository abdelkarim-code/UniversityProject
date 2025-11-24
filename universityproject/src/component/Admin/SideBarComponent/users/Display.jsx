import { useState, useMemo, useEffect } from 'react';
import {
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
 Box,
  Typography,
  Button,

} from '@mui/material';
import { styled } from '@mui/material/styles';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { fetchStudentsByYear } from '../../../redux/Slices/StudentSlice';
import YearPicker from './DatePicker';
import InfoDialog from "./InfoDialog";
import { fetchDoctorsByYear } from '../../../redux/Slices/DoctorSlice';
const StyledHeaderCell = styled(TableCell)({
  color: "#003C64", // dark blue text
  fontWeight: "bold",
});
// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)',
  overflow: 'hidden',
  margin: theme.spacing(2),
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: 'white',
  '& th': {
    color: '#003C64',
    fontWeight: 'bold',
    fontSize: '14px',
    padding: theme.spacing(2),
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
    transition: 'background-color 0.2s ease',
  },
}));

const ActionButton = styled(Button)(({ theme, varianttype }) => ({
  minWidth: '60px',
  margin: theme.spacing(0.5),
  borderRadius: '6px',
  textTransform: 'none',
  fontWeight: 'bold',
  fontSize: '12px',
  ...(varianttype === 'edit' && {
    backgroundColor: '#fdd835',
    color: '#003C64',
    '&:hover': {
      backgroundColor: '#fbc02d',
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 8px rgba(253, 216, 53, 0.3)',
    },
  }),
  ...(varianttype === 'delete' && {
    backgroundColor: '#ff4444',
    color: 'white',
    '&:hover': {
      backgroundColor: '#cc0000',
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 8px rgba(255, 68, 68, 0.3)',
    },
  }),
  ...(varianttype === 'view' && {
    backgroundColor: '#003C64',
    color: 'white',
    '&:hover': {
      backgroundColor: '#00294d',
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 8px rgba(0, 60, 100, 0.3)',
    },
  }),
}));

const FilterContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  backgroundColor: '#f8f9fa',
  borderBottom: `1px solid ${theme.palette.divider}`,
  flexWrap: 'wrap',
  gap: theme.spacing(2),
}));
const UserManagementTable = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedYear, setSelectedYear] = useState("2025");
  const dispatch=useDispatch()
// Filter data based on selected year
const [studentData, setStudentData] = useState([]);
const [doctorData, setDoctorData] = useState([]);
const [selectedUser, setSelectedUser] = useState(null);
const [dialogOpen, setDialogOpen] = useState(false);
useEffect(() => {
  const fetchData = async () => {
    if (!selectedYear) return;

    if (activeTab === 0) {
      // Students
      const students = await dispatch(fetchStudentsByYear(selectedYear)).unwrap();
      setStudentData(students);
    } else {
      // Doctors
      const doctors = await dispatch(fetchDoctorsByYear(selectedYear)).unwrap();
      setDoctorData(doctors);
    }
  };

  fetchData();
}, [activeTab, selectedYear, dispatch]);

// Now useMemo to flip between data on tab change
const filteredData = useMemo(() => {
  return activeTab === 0 ? studentData : doctorData;
}, [activeTab, studentData, doctorData]);



  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    
  };

  const handleYearChange = (year) => {
    
    setSelectedYear(year);
  };


  const handleEdit = (id) => {
    console.log(`Edit ${activeTab === 0 ? 'Student' : 'Doctor'} with ID: ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete ${activeTab === 0 ? 'Student' : 'Doctor'} with ID: ${id}`);
  };

  const handleView = (user) => {
    console.log(user)
  setSelectedUser(user);
  setDialogOpen(true);
};
console.log(dialogOpen)
  return (
    <StyledPaper>
      {/* Tabs */}
      <InfoDialog
  open={dialogOpen}
  handleClose={() => setDialogOpen(false)}
  data={selectedUser||{}}
/>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        sx={{
          backgroundColor: '#f5f5f5',
          '& .MuiTab-root': {
            fontWeight: 'bold',
            fontSize: '16px',
            minWidth: '120px',
          },
        }}
      >
        <Tab label="Students" />
        <Tab label="Doctors" />
      </Tabs>

      {/* Filter Section */}
      <FilterContainer>
        <Typography variant="h6" sx={{ color: '#003C64', fontWeight: 'bold' }}>
          {activeTab === 0 ? 'Student Management' : 'Doctor Management'}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Showing {filteredData.length} {filteredData.length === 1 ? 'item' : 'items'}
          </Typography>
          
        <YearPicker
  label="Filter by Year"
  onChange={(year) => {
    handleYearChange(year)
    
  }}
/>
        </Box>
      </FilterContainer>

      {/* Table */}
      <TableContainer sx={{ maxHeight: 400 }}>
        <Table stickyHeader>
          
        <StyledTableHead>
            <TableRow>
               {activeTab === 0 ? (
                <StyledHeaderCell>Student ID</StyledHeaderCell>
                ) : (
                <StyledHeaderCell>Doctor Code</StyledHeaderCell>
                )}
                
                <StyledHeaderCell>First name</StyledHeaderCell>
                <StyledHeaderCell>Last name</StyledHeaderCell>
                <StyledHeaderCell>Email</StyledHeaderCell>
                {activeTab === 0 ? (
                <StyledHeaderCell>Year</StyledHeaderCell>
                ) : (
                <StyledHeaderCell>Created Year</StyledHeaderCell>
                )}
                <StyledHeaderCell align="center">Actions</StyledHeaderCell>
            </TableRow>
            </StyledTableHead>
          
          
          <TableBody>
            {filteredData.length>0&&filteredData.map((item) => (
              <StyledTableRow key={item.id}>
                 {activeTab === 0 ? (
                 <TableCell sx={{ fontWeight: 'bold' }}>#{item.student_code}</TableCell>
                ) : (
                 <TableCell sx={{ fontWeight: 'bold' }}>#{item.employee_code}</TableCell>
                )}
                
                <TableCell sx={{ fontWeight: 'medium' }}>{item.first_name}</TableCell>
                <TableCell sx={{ fontWeight: 'medium' }}>{item.last_name}</TableCell>
                <TableCell sx={{ color: '#666' }}>{item.email}</TableCell>
                <TableCell>
                  {activeTab === 0 ? (
                    <Box
                      sx={{
                        backgroundColor: '#003C64',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '16px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        display: 'inline-block',
                      }}
                    >
                      {item.current_year}st Year
                    </Box>
                  ) : (
                    moment(item.date_created).format('YYYY')
                  )}
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <ActionButton
                      varianttype="edit"
                      size="small"
                      onClick={() => handleEdit(item.id)}
                    >
                      Edit
                    </ActionButton>
                    <ActionButton
                      varianttype="view"
                      size="small"
                      onClick={() => handleView(item)}
                    >
                      View
                    </ActionButton>
                    <ActionButton
                      varianttype="delete"
                      size="small"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </ActionButton>
                  </Box>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Empty State */}
      {filteredData.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="textSecondary">
            No {activeTab === 0 ? 'students' : 'doctors'} found for the selected year
          </Typography>
        </Box>
      )}
    </StyledPaper>
  );
};

export default UserManagementTable;