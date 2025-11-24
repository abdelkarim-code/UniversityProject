import  { useEffect, useState } from 'react';
import {Box,Typography,AccordionDetails,Chip, Grid,useTheme,useMediaQuery,Stack,Tooltip,IconButton,Dialog,DialogTitle,DialogContent,
DialogActions,
 CardContent,
 Select,
 MenuItem,
 Paper,
 ListItem,
 List,

 
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
  Description,
} from '@mui/icons-material';
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useDispatch, useSelector } from 'react-redux';
import { getAvailableCourses, getSections } from '../../redux/Slices/Student_Course_registration_Slice';
import { useLocation, useOutletContext } from 'react-router-dom';
import { yellow } from '@mui/material/colors';
import DetailsSnackbar from '../DetailsSnackbar';
import {
  PageContainer,
  SectionPaper,
  SectionHeader,
  SectionTitle,
  CourseAccordion,
  CourseHeader,
  CourseChip,
  StatusChip,
  PrimaryButton,
  SecondaryButton,
  ConflictAlert,
  InfoRow,
  CompactCourseCard,
 
} from '../styled/registration_styled';
import PageviewIcon from '@mui/icons-material/Pageview';
import NOTFOUND from '../../NotFound';
import moment from 'moment';
import { fetchCampuses } from '../../redux/Slices/RoomSlice';
import { registerCourseBystudent } from '../../redux/Slices/StudentSlice';
import { getStudentRegiteredCourses } from '../../redux/Slices/Student_Course_registration_Slice';


const Registration = () => {
  const theme = useTheme();
  const location=useLocation()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [openDetails,setOpenDetails]=useState({type:"",name:"",code:"",description:"",open:false})
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [sectionDialogOpen, setDetailDialogOpen] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState(null);
  const dispatch=useDispatch()
  const {active_user}=useSelector(state=>state.auth)
  const {available_courses,sections,reg_courses:registeredCourses}=useSelector(state=>state.cou_reg)
  const current_semester=useOutletContext()
  const {campuses}=useSelector(state=>state.room)
     
  const getAvailableCoursesToDisplay=()=>{
     const {department_id,program_id,student_id,current_year}=active_user
       const {semester_id}=current_semester
      dispatch(getAvailableCourses({
        department_id,program_id,student_id,
        level:current_year,
        semester_id
      }))
      dispatch(getStudentRegiteredCourses({student_id,semester_id}))
  }
  useEffect(()=>{
   if(active_user&&Object.keys(active_user).length>0&&current_semester){
      getAvailableCoursesToDisplay()
     
    }
     
  },[location,active_user,current_semester])
  
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : null);
  };

  const handleViewSections = async(course) => {
    const {semester_id}=current_semester
    setSelectedCourse(course);
    setDetailDialogOpen(true);
     const campuses=await dispatch(fetchCampuses()).unwrap()
     if(campuses.length>0)
       dispatch(getSections({course_id:course?.course_id,campus:campuses[0].campus||"",semester_id}))
  };
  const handleRefetchSection=(campus)=>{
    console.log(campus)
    if(selectedCourse){
          const {semester_id}=current_semester
  dispatch(getSections({course_id:selectedCourse?.course_id,campus:campus,semester_id}))
    }
 
  }
  function addTime(time, h, m) {
  return moment(time, "HH:mm")
    .add(h, "hours")
    .add(m, "minutes")
    .format("HH:mm");
}

  const handleRegisterCourse = async(course) => {
    try{
       if(active_user&&current_semester){
          const {student_id}=active_user
          const {semester_id:semester}=current_semester
         const request=await dispatch(registerCourseBystudent({student_id,semester,assignment_id:course?.assignment_id,
            course_id:selectedCourse?.course_id})).unwrap()
            console.log(request)
            if(request==201){
               setDetailDialogOpen(false);
               getAvailableCoursesToDisplay()
            }
        }
    }catch(err){
      console.log(err)
    }
  }
         
    

 
  const renderAvailableCoursesAccordion = () => (
    <Box>
      {available_courses?.length>0?available_courses.map((course,index) => (
        <CourseAccordion
          key={index}
          
          expanded={expandedAccordion === `course-${course.assignment_id}`}
          onChange={handleAccordionChange(`course-${course.assignment_id}`)}
          // hasConflict={course.hasConflict}
        >
          <CourseHeader expandIcon={<ExpandMoreIcon  />}>
            <Stack width="100%" spacing={1}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box flex={1}>
                  <Typography variant="h6" sx={{ color: '#003C64', fontWeight: 600 }}>
                    {course?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {course?.code}
                  </Typography>
                  <Tooltip title="View Details">
                
                  
             
              </Tooltip>
                </Box>
                  
              </Box>
              
              {/* <Box display="flex" gap={2} flexWrap="wrap">
                <InfoRow>
                  <ScheduleIcon fontSize="small" />
                  <Typography variant="body2">{course.schedule_time}</Typography>
                </InfoRow>
                <InfoRow>
                  <LocationIcon fontSize="small" />
                  <Typography variant="body2">{course.room_number}</Typography>
                </InfoRow>
              </Box> */}

              {/* {course.hasConflict && (
                <ConflictAlert>
                  <WarningIcon fontSize="small" />
                  <Typography variant="body2">Time conflict with registered course</Typography>
                </ConflictAlert>
              )} */}
            </Stack>
          </CourseHeader>
          
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ color: '#003C64', fontWeight: 600 }}>
                  Course Information
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2"><strong>Department:</strong> <Typography component={"span"} sx={{cursor:"pointer",textDecoration:"underline",fontWeight:100,fontSize:14,color:yellow[900]}} 
                   onClick={()=>setOpenDetails({type:"det",name:course?.department_name,code:course?.department_code,
                  description:course.department_des,open:true})}
                  
                  
                  >{course?.department_name}</Typography></Typography>
                  <Typography variant="body2"><strong>Faculty:</strong> {course?.faculty_name}</Typography>
                  <Typography variant="body2"><strong>Credits:</strong> {course?.credit_hours}</Typography>
                 <Tooltip title={"Course details"}>
                   <InfoOutlinedIcon sx={{mt:1,color:yellow[900],ml:0,cursor:"pointer"}}
                  onClick={()=>setOpenDetails({type:"course",name:course?.name,code:course?.code,
                  description:course.description,open:true})}/>
                  
                  </Tooltip> 
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ color: '#003C64', fontWeight: 600 }}>
                  Availability
                </Typography>
                <Stack spacing={1}>
                  <Typography variant="body2"><strong>Available Seats:</strong> {course.available_seats}</Typography>
                
                  <PrimaryButton
                    startIcon={<PageviewIcon />}
                    onClick={() => handleViewSections(course)}
                    fullWidth={isMobile}
                  >
                    View available sections
                  </PrimaryButton>
                </Stack>
              </Grid>
            </Grid>
          </AccordionDetails>
        </CourseAccordion>
      )):<NOTFOUND message={"It looks like there are no courses being offered currently."}/>}
    </Box>
  );

  

  const renderRegisteredCourses = () => (
    <Stack spacing={2} >
      {(registeredCourses&&registeredCourses.length>0)?registeredCourses.map((course) => (
        <CompactCourseCard key={course?.registration_id} variant="outlined">
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
              <Box flex={1}>
                <Typography variant="h6" sx={{ color: '#003C64', fontWeight: 600, mb: 0.5 }}>
                  {course?.course_name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {course?.course_code} • {course?.doctor_name}
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  <StatusChip label={course?.status.toUpperCase()} status={course.status} size="small" />
                  
                </Box>
              </Box>
              {/* <Tooltip title="View Details">
                <IconButton size="small" onClick={() => handleViewSections(course)}>
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip> */}
            </Box>
            
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Credits: {course.credit}
              </Typography>
              {/* {course.status === 'enrolled' && (
                <SecondaryButton
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDropCourse(course)}
                  size="small"
                >
                  Drop Course
                </SecondaryButton>
              )} */}
            </Box>
          </CardContent>
        </CompactCourseCard>
      )):<NOTFOUND message={"You haven’t registered for any courses yet."}/>}
    </Stack>
  );
const detailsProps = {
  openDetails,
  onClose: () => setOpenDetails({type:"",name:"",code:"",description:"",open:false})
};

  return (
    <PageContainer sx={{paddingTop:10}} maxWidth={"xl"} >
     

      <Grid container spacing={2}>
        {/* Available Courses Section */}
        <Grid size={!isMobile?6:12}>
          <SectionPaper>
            <SectionHeader>
              <SectionTitle variant="h4">
                Available Courses
              </SectionTitle>
              <Typography variant="body1" color="text.secondary">
                Browse and register for available courses
              </Typography>
            </SectionHeader>

           {renderAvailableCoursesAccordion()}
            
            
          </SectionPaper>
        </Grid>

        {/* Registered Courses Section */}
        <Grid size={!isMobile?6:12}>
          <SectionPaper>
            <SectionHeader>
              <SectionTitle variant="h4">
                My Courses
              </SectionTitle>
              <Typography variant="body1" color="text.secondary">
                Currently enrolled courses
              </Typography>
            </SectionHeader>

            {renderRegisteredCourses()}
          </SectionPaper>
        </Grid>
      </Grid>
      {/* {snakbar} */}
        <DetailsSnackbar {...detailsProps}/>


      {/* Course Section Dialog */}
<Dialog
  open={sectionDialogOpen}
  onClose={() => setDetailDialogOpen(false)}
  maxWidth="lg"
  fullWidth
>
  <DialogTitle sx={{ backgroundColor: '#003C64', color: '#FFFFFF' }}>
    <Typography variant="h6" fontWeight={600}>
      {selectedCourse?.name ||'Course Sections'}
    </Typography>
  </DialogTitle>

  <DialogContent sx={{ pt: 3 }}>
    {selectedCourse && (
      <Stack spacing={3}>
        {/* Campus Selection */}
        <Stack direction="row" spacing={2} alignItems="center" >
          <Typography variant="subtitle1" fontWeight={500}>
            Select Campus:
          </Typography>
          <Select
            value={campuses.length>0?campuses[0]?.campus:"Saida"}
            onChange={(e) => handleRefetchSection(e.target.value)}
            size="small"
            sx={{position:"absolute",left:5,top:93,width:100}}
            key={new Date().getMilliseconds()}
            
          >
            {campuses.length>0?campuses.map((campus,index) => (
              <MenuItem key={index} value={campus?.campus}>
                {campus?.campus}
              </MenuItem>
            )):undefined}
          </Select>
        </Stack>

        {/* Sections List */}
       <Box sx={{ pt: 5, maxHeight: '60vh', overflowY: 'auto' }}>
  {selectedCourse && sections.length > 0 ? (
    <List>
      {sections.map((section,index) => (
        <ListItem key={index} sx={{ p: 0, mb: 2, display: 'block' }}>
          <Paper sx={{ p: 2, border: '1px solid #ccc' }}>
            <Typography variant="h6" sx={{ color: '#003C64' }}>
              Section {section.section}
            </Typography>

            <Stack spacing={1} mt={1}>
              <InfoRow>
                <PersonIcon color="primary" />
                <Typography variant="body1">{section?.employee_code.split(".")[0]+" "+section?.employee_code.split(".")[1]}</Typography>
              </InfoRow>
              <InfoRow>
                <ScheduleIcon color="primary" />
                <Typography variant="body1">{`${section?.schedule_time} To ${addTime(section?.schedule_time.split("-")[1],1,15)}`}</Typography>
              </InfoRow>
              <InfoRow>
                <LocationIcon color="primary" />
                <Typography variant="body1">{section.room_number}</Typography>
              </InfoRow>
              {section.available_seats !== undefined && (
                <Typography variant="body1">
                  <strong>Available Seats:</strong> 30
                </Typography>
              )}

              {/* Conflict Alert */}
              {/* {section?.hasConflict && (
                <ConflictAlert>
                  <WarningIcon fontSize="small" /> Conflict with another registered course
                </ConflictAlert>
              )} */}
            </Stack>

            <Stack mt={2} direction="row" spacing={1}>
              <PrimaryButton
                onClick={() => handleRegisterCourse(section)}
                disabled={section.hasConflict || section.status || section.available_seats === 0}
              >
                Register in this Section
              </PrimaryButton>
            </Stack>
          </Paper>
        </ListItem>
      ))}
    </List>
  ) : (
    <Typography>No sections available for this campus.</Typography>
  )}
</Box>

      </Stack>
    )}
  </DialogContent>

  <DialogActions sx={{ p: 3 }}>
    <SecondaryButton onClick={() => setDetailDialogOpen(false)}>
      Close
    </SecondaryButton>
  </DialogActions>
</Dialog>
    </PageContainer>
  );
};

export default Registration;