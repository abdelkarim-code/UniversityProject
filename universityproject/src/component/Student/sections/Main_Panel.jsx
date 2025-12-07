import { Box, Grid, Card, CardContent, Typography, LinearProgress, styled, Chip } from '@mui/material';
import {  useSelector } from 'react-redux';
import { yellow } from '@mui/material/colors';
import { useOutletContext } from 'react-router-dom';

// Demo data
const student = {
 remainingCredits: 18,
  totalCredits: 120,
  gpa: 3.8,
  attendance: "92%"
};
// const WelcomeHeader = styled(Typography)(({ theme }) => ({
//   color: '#003C64',
//   fontWeight: 700,
//   marginBottom: theme.spacing(1),
//   background: 'linear-gradient(45deg, #003C64 30%, #005b9a 90%)',
//   WebkitBackgroundClip: 'text',
//   WebkitTextFillColor: 'transparent',
// }));

// Container for the page, padding to account for AppBar
const PageContainer = styled(Box)(() => ({
  paddingTop: 20,
  minHeight: "100vh",
  background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
  paddingLeft: 24,
  paddingRight: 24,
  minWidth: 1000,
  borderRadius:10
}));

// Dark card with hover effect
const StyledCard = styled(Card)(() => ({
  background: "#003C64",
  color: "#ffffff",
  borderRadius: 16,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  height: "100%",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
  },
}));

// Accent card with border highlight
const AccentCard = styled(Card)(() => ({
  background: "#ffffff",
  color: "#003C64",
  borderRadius: 16,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  transition: "all 0.3s ease",
  height: "100%",
  border: "2px solid transparent",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 25px rgba(0, 0, 0, 0.12)",
    borderColor: "#fdd835",
  },
}));

// Gold accent text
const GoldText = styled("span")(() => ({
  color: "#fdd835",
  fontWeight: 600,
}));

// Container for progress bar
const ProgressContainer = styled(Box)(() => ({
  background: "rgba(255, 255, 255, 0.1)",
  borderRadius: 12,
  padding: 16,
  marginTop: 16,
}));

// Styled linear progress bar
const StyledLinearProgress = styled(LinearProgress)(() => ({
  height: 12,
  borderRadius: 6,
  background: "rgba(255, 255, 255, 0.3)",
  "& .MuiLinearProgress-bar": {
    background: "linear-gradient(45deg, #fdd835, #ffeb3b)",
    borderRadius: 6,
  },
}));

// Metric value typography
const MetricValue = styled(Typography)(() => ({
  color: "#fdd835",
  fontWeight: 700,
  fontSize: "2rem",
}));

function Main_Panel() {
  const creditsProgress = ((student.totalCredits - student.remainingCredits) / student.totalCredits) * 100;
  const {active_user}=useSelector(state=>state.auth) 
 const current_semester=useOutletContext()
 
  return (
    <PageContainer>
      <Box maxWidth="1200px" margin="0 auto">
        <Grid container spacing={4}>


          {/* Credits Progress Card */}
          
          <Grid item xs={12} md={6} m={7}>
            <StyledCard>
              <CardContent sx={{ padding: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ opacity: 0.9 }}>
                  Credit Progress
                </Typography>
                <ProgressContainer>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Completed Credits
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#fdd835' }}>
                      {student.totalCredits - student.remainingCredits} / {student.totalCredits}
                    </Typography>
                  </Box>
                  <StyledLinearProgress 
                    variant="determinate" 
                    value={creditsProgress} 
                  />
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Progress
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#fdd835' }}>
                      {creditsProgress.toFixed(1)}%
                    </Typography>
                  </Box>
                </ProgressContainer>
                <Typography variant="body2" sx={{ opacity: 0.8, marginTop: 2 }}>
                  {student.remainingCredits} credits remaining to graduate
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
            {/* Semester Info Card */}
          <Grid item xs={12} sm={6} md={3} m={7}>
            <StyledCard>
              <CardContent sx={{ padding: "20px 30px" }}>
                <Typography variant="h6" gutterBottom sx={{ opacity: 0.9 }}>
                  Active Semester
                </Typography>
                <MetricValue variant="h3">
                  {current_semester?.name}
                </MetricValue>
                <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
                  Academic Year: <Typography component="span" sx={{ fontWeight: 600, color: '#fdd835'}}>
                        {current_semester?.academic_year}
                    </Typography>
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Start: <Typography component="span" sx={{ fontWeight: 600, color: '#fdd835'}}>
                        {current_semester?.start_date}
                    </Typography>
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  End: <Typography component="span" sx={{ fontWeight: 600, color: '#fdd835'}}>
                        {current_semester?.end_date}
                    </Typography>
                </Typography>
                 <Chip label={current_semester?.status} sx={{background:yellow[600],mt:2,ml:0.1,
                    color:"black",textTransform:"uppercase",fontWeight:500}} />
              </CardContent>
            </StyledCard>
          </Grid>

          {/* GPA Card */}
          <Grid item xs={12} sm={6} md={3} m={7}>
            <AccentCard>
              <CardContent sx={{ padding: 3, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom color="#003C64">
                  Current GPA
                </Typography>
                <MetricValue sx={{ color: '#003C64' }}>
                  {active_user?.gpa}
                </MetricValue>
                <Typography variant="body2" color="#003C64" sx={{ opacity: 0.8, mt: 1 }}>
                  Cumulative Grade Point
                </Typography>
              </CardContent>
            </AccentCard>
          </Grid>
        </Grid>
        


         {/* Department Card */}
          <Grid item xs={12} sm={6} md={2}>
            <StyledCard>
              <CardContent sx={{ padding: 3 }}>
              <Typography
                                variant="h6"
                                gutterBottom
                                sx={{
                                    opacity: 0.9,
                                    position: "relative", // needed for pseudo-element
                                    display: "inline-block", // shrink width to text
                                    "&::after": {
                                    content: '""',
                                    position: "absolute",
                                    left: 0,
                                    bottom: -2, // distance from text
                                    width: "100%", // start with zero
                                    height: "2px", // thickness of underline
                                    bgcolor: "#fdd835", // underline color (gold)
                                    transition: "width 0.5s ease",
                                    },
                                    "&:hover::after": {
                                    width: "0%", // expand on hover
                                    },
                                }}
                                >
                                Enrollment Department Info
                                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fdd835', mt: 1 }}>
                  Name:
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, mb: 1 }}>
                  {active_user?.name}
                </Typography>

                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fdd835', mt: 1 }}>
                  Code:
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, mb: 1 }}>
                  {active_user?.code}
                </Typography>

                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#fdd835', mt: 1 }}>
                  Description:
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {active_user?.description}
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>

      </Box>
    </PageContainer>
  );
};

export default Main_Panel;
