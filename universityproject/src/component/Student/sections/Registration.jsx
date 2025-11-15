import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Chip,
   Grid,
  
  useTheme,
  useMediaQuery,
  Stack,
  Avatar,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { yellow } from '@mui/material/colors';

// Styled components using Material-UI styled API
const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(4),
  minHeight: 'calc(100vh - 64px)',
}));

const SectionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: 'fit-content',
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 12px rgba(0, 60, 100, 0.1)',
}));

const SectionHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  paddingBottom: theme.spacing(2),
  borderBottom: `2px solid #fdd835`,
}));

const SectionTitle = styled(Typography)(() => ({
  color: '#003C64',
  fontWeight: 700,
  fontSize: '1.5rem',
}));

const CourseAccordion = styled(Accordion)(({ theme, hasConflict }) => ({
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(1),
  border: hasConflict ? `2px solid ${theme.palette.error.main}` : 'none',
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    marginBottom: theme.spacing(1),
  },
}));

const CourseHeader = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: 'rgba(0, 60, 100, 0.02)',
  borderRadius: theme.spacing(1),
  '&.Mui-expanded': {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
}));

const CourseChip = styled(Chip)(() => ({
  backgroundColor: '#003C64',
  color: '#FFFFFF',
  fontWeight: 600,
  fontSize: '0.7rem',
}));

const StatusChip = styled(Chip)(({  status }) => {
  const statusConfig = {
    enrollment: { background: '#4caf50', color: '#ffffff' },
    drop: { background: '#f44336', color: '#ffffff' },
    completed: { background: '#2196f3', color: '#ffffff' },
  };
  const config = statusConfig[status] || statusConfig.enrollment;
  
  return {
    backgroundColor: config.background,
    color: config.color,
    fontWeight: 700,
    fontSize: '0.7rem',
  };
});

const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#fdd835',
  color: '#003C64',
  fontWeight: 700,
  padding: theme.spacing(1, 3),
  borderRadius: theme.spacing(1),
  '&:hover': {
    backgroundColor: '#fbc02d',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 8px rgba(253, 216, 53, 0.3)',
  },
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  borderColor: '#003C64',
  color: '#003C64',
  fontWeight: 600,
  padding: theme.spacing(0.75, 2),
  borderRadius: theme.spacing(1),
}));

const ConflictAlert = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  backgroundColor: theme.palette.error.light,
  color: theme.palette.error.contrastText,
  padding: theme.spacing(1, 2),
  borderRadius: theme.spacing(1),
  marginTop: theme.spacing(1),
  fontSize: '0.875rem',
  fontWeight: 600,
}));

const InfoRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

const CompactCourseCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    borderColor: '#003C64',
    boxShadow: '0 4px 12px rgba(0, 60, 100, 0.15)',
  },
}));

// Demo data
const availableCourses = [
  {
    id: 1,
    course_name: 'Introduction to Computer Science',
    doctor_name: 'Dr. Sarah Johnson',
    section: 'CS-101-A',
    schedule_time: 'Mon, Wed 10:00 AM - 11:30 AM',
    room_number: 'SCI-201',
    department: 'Computer Science',
    faculty: 'Faculty of Engineering',
    credits: 3,
    available_seats: 15,
    hasConflict: false,
    course_code: 'CS101',
  },
  {
    id: 2,
    course_name: 'Advanced Mathematics',
    doctor_name: 'Dr. Michael Chen',
    section: 'MATH-202-B',
    schedule_time: 'Tue, Thu 2:00 PM - 3:30 PM',
    room_number: 'MATH-105',
    department: 'Mathematics',
    faculty: 'Faculty of Science',
    credits: 4,
    available_seats: 8,
    hasConflict: true,
    course_code: 'MATH202',
  },
];

const registeredCourses = [
  {
    id: 101,
    course_name: 'Data Structures and Algorithms',
    semester: 'Fall 2024',
    grade: 'A-',
    status: 'enrollment',
    credits: 4,
    instructor: 'Dr. James Wilson',
    course_code: 'CS201',
  },
  {
    id: 102,
    course_name: 'Introduction to Psychology',
    semester: 'Spring 2024',
    grade: 'A',
    status: 'completed',
    credits: 3,
    instructor: 'Dr. Robert Kim',
    course_code: 'PSY101',
  },
];

const Registration = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [viewMode, setViewMode] = useState('accordion'); // 'accordion' or 'table'
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState(null);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : null);
  };

  const handleViewCourseDetails = (course) => {
    setSelectedCourse(course);
    setDetailDialogOpen(true);
  };

  const handleRegisterCourse = (course) => {
    // Registration logic would go here
    console.log('Registering course:', course);
  };

  const handleDropCourse = (course) => {
    // Drop course logic would go here
    console.log('Dropping course:', course);
  };

  const renderAvailableCoursesAccordion = () => (
    <Box>
      {availableCourses.map((course) => (
        <CourseAccordion
          key={course.id}
          expanded={expandedAccordion === `course-${course.id}`}
          onChange={handleAccordionChange(`course-${course.id}`)}
          hasConflict={course.hasConflict}
        >
          <CourseHeader expandIcon={<ExpandMoreIcon />}>
            <Stack width="100%" spacing={1}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box flex={1}>
                  <Typography variant="h6" sx={{ color: '#003C64', fontWeight: 600 }}>
                    {course.course_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {course.course_code} • {course.doctor_name}
                  </Typography>
                </Box>
                <CourseChip label={course.section} size="small" />
              </Box>
              
              <Box display="flex" gap={2} flexWrap="wrap">
                <InfoRow>
                  <ScheduleIcon fontSize="small" />
                  <Typography variant="body2">{course.schedule_time}</Typography>
                </InfoRow>
                <InfoRow>
                  <LocationIcon fontSize="small" />
                  <Typography variant="body2">{course.room_number}</Typography>
                </InfoRow>
              </Box>

              {course.hasConflict && (
                <ConflictAlert>
                  <WarningIcon fontSize="small" />
                  <Typography variant="body2">Time conflict with registered course</Typography>
                </ConflictAlert>
              )}
            </Stack>
          </CourseHeader>
          
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ color: '#003C64', fontWeight: 600 }}>
                  Course Information
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2"><strong>Department:</strong> {course.department}</Typography>
                  <Typography variant="body2"><strong>Faculty:</strong> {course.faculty}</Typography>
                  <Typography variant="body2"><strong>Credits:</strong> {course.credits}</Typography>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ color: '#003C64', fontWeight: 600 }}>
                  Availability
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2"><strong>Available Seats:</strong> {course.available_seats}</Typography>
                  <Typography variant="body2"><strong>Section:</strong> {course.section}</Typography>
                  <PrimaryButton
                    startIcon={<AddIcon />}
                    onClick={() => handleRegisterCourse(course)}
                    disabled={course.hasConflict}
                    fullWidth={isMobile}
                  >
                    Register Course
                  </PrimaryButton>
                </Stack>
              </Grid>
            </Grid>
          </AccordionDetails>
        </CourseAccordion>
      ))}
    </Box>
  );

  const renderAvailableCoursesTable = () => (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead sx={{ backgroundColor: 'rgba(0, 60, 100, 0.04)' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 600, color: '#003C64' }}>Course</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#003C64' }}>Instructor</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#003C64' }}>Schedule</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#003C64' }}>Section</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#003C64' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {availableCourses.map((course) => (
            <TableRow key={course.id} hover>
              <TableCell>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#003C64', fontWeight: 600 }}>
                    {course.course_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {course.course_code}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{course.doctor_name}</Typography>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="body2">{course.schedule_time}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {course.room_number}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <CourseChip label={course.section} size="small" />
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="View Details">
                    <IconButton size="small" onClick={() => handleViewCourseDetails(course)}>
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <PrimaryButton
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => handleRegisterCourse(course)}
                    disabled={course.hasConflict}
                  >
                    Register
                  </PrimaryButton>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderRegisteredCourses = () => (
    <Stack spacing={2} >
      {registeredCourses.map((course) => (
        <CompactCourseCard key={course.id} variant="outlined">
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
              <Box flex={1}>
                <Typography variant="h6" sx={{ color: '#003C64', fontWeight: 600, mb: 0.5 }}>
                  {course.course_name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {course.course_code} • {course.instructor}
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  <StatusChip label={course.status.toUpperCase()} status={course.status} size="small" />
                  <Chip label={course.semester} variant="outlined" size="small" />
                  {course.status === 'completed' && (
                    <Chip label={`Grade: ${course.grade}`} color="primary" variant="outlined" size="small" />
                  )}
                </Box>
              </Box>
              <Tooltip title="View Details">
                <IconButton size="small" onClick={() => handleViewCourseDetails(course)}>
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Credits: {course.credits}
              </Typography>
              {course.status === 'enrollment' && (
                <SecondaryButton
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDropCourse(course)}
                  size="small"
                >
                  Drop Course
                </SecondaryButton>
              )}
            </Box>
          </CardContent>
        </CompactCourseCard>
      ))}
    </Stack>
  );

  return (
    <PageContainer sx={{paddingTop:10}} maxWidth={"xl"} >
      {/* View Mode Tabs */}
      <Box mb={4} mt={2}>
        <Tabs
          value={viewMode}
          onChange={(e, newValue) => setViewMode(newValue)}
          
          sx={{
            '& .MuiTab-root': {
              fontWeight: 600,
              color: '#003C64',
            },
            '& .Mui-selected': {
              color: '#fdd835',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#fdd835',
            },
            color:yellow[800],
           
          }}
        >
          <Tab label="Accordion View" value="accordion" />
          <Tab label="Table View" value="table" />
        </Tabs>
      </Box>

      <Grid container spacing={2}>
        {/* Available Courses Section */}
        <Grid size={6}>
          <SectionPaper>
            <SectionHeader>
              <SectionTitle variant="h4">
                Available Courses
              </SectionTitle>
              <Typography variant="body1" color="text.secondary">
                Browse and register for available courses
              </Typography>
            </SectionHeader>

            {viewMode === 'accordion' 
              ? renderAvailableCoursesAccordion()
              : renderAvailableCoursesTable()
            }
          </SectionPaper>
        </Grid>

        {/* Registered Courses Section */}
        <Grid size={6}>
          <SectionPaper>
            <SectionHeader>
              <SectionTitle variant="h4">
                My Courses
              </SectionTitle>
              <Typography variant="body1" color="text.secondary">
                Currently enrolled and completed courses
              </Typography>
            </SectionHeader>

            {renderRegisteredCourses()}
          </SectionPaper>
        </Grid>
      </Grid>

      {/* Course Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: '#003C64', color: '#FFFFFF' }}>
          <Typography variant="h6" fontWeight={600}>
            Course Details
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedCourse && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#003C64' }}>
                  {selectedCourse.course_name}
                </Typography>
                <Stack spacing={2}>
                  <InfoRow>
                    <PersonIcon color="primary" />
                    <Typography variant="body1">{selectedCourse.doctor_name || selectedCourse.instructor}</Typography>
                  </InfoRow>
                  <InfoRow>
                    <SchoolIcon color="primary" />
                    <Typography variant="body1">{selectedCourse.department}</Typography>
                  </InfoRow>
                  <InfoRow>
                    <ScheduleIcon color="primary" />
                    <Typography variant="body1">{selectedCourse.schedule_time}</Typography>
                  </InfoRow>
                  <InfoRow>
                    <LocationIcon color="primary" />
                    <Typography variant="body1">{selectedCourse.room_number}</Typography>
                  </InfoRow>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#003C64' }}>
                  Additional Information
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body1"><strong>Credits:</strong> {selectedCourse.credits}</Typography>
                  <Typography variant="body1"><strong>Section:</strong> {selectedCourse.section}</Typography>
                  <Typography variant="body1"><strong>Faculty:</strong> {selectedCourse.faculty}</Typography>
                  {selectedCourse.available_seats !== undefined && (
                    <Typography variant="body1">
                      <strong>Available Seats:</strong> {selectedCourse.available_seats}
                    </Typography>
                  )}
                </Stack>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <SecondaryButton onClick={() => setDetailDialogOpen(false)}>
            Close
          </SecondaryButton>
          {selectedCourse && !selectedCourse.status && (
            <PrimaryButton
              startIcon={<AddIcon />}
              onClick={() => handleRegisterCourse(selectedCourse)}
              disabled={selectedCourse.hasConflict}
            >
              Register Course
            </PrimaryButton>
          )}
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default Registration;