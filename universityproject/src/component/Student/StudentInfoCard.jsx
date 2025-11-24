import React from 'react';
import { Card, CardContent, Box, Grid, Typography } from '@mui/material';
import { Star, School, CalendarToday, Assignment } from '@mui/icons-material';

const StudentInfoCard = ({ studentData }) => {
  const reFormulateName=(name)=>{
    return name?name.includes("of")?name.split("of")[1]:name:""
  }
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 10,
        mb:0,
        mt:0.2
      }}
      key={new Date().getMilliseconds()}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 375,
           maxHeight: 175,
          borderRadius: 3,
          boxShadow:
            '0 12px 40px rgba(0,60,100,0.25), 0 6px 20px rgba(253,216,53,0.15)',
          border: '2px solid #fdd835',
          bgcolor: 'white',
          position: 'relative',
          overflow: 'visible'
        }}
      >
        {/* Gold accent header */}
        <Box
          sx={{
            bgcolor: '#fdd835',
            height: 6,
            borderTopLeftRadius: 3,
            borderTopRightRadius: 3
          }}
        />
        <CardContent sx={{ p: 3, position: 'relative' }}>
          {/* Gold star badge for GPA */}
          <Box
            sx={{
              position: 'absolute',
              top: -16,
              right: 16,
              bgcolor: '#fdd835',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 3px 10px rgba(253,216,53,0.4)'
            }}
          >
            <Star sx={{ color: '#003C64', fontSize: 18 }} />
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography
                variant="h6"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: '#003C64',
                  textAlign: 'center',
                  mb: 0.5,
                  fontSize: '0.8rem'
                }}
              >
                {studentData?.first_name+" "+studentData?.last_name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#fdd835',
                  textAlign: 'center',
                  mb: 2,
                  fontWeight: 600,
                  bgcolor: '#003C64',
                  display: 'inline-block',
                  px: 1.5,
                  py: 0.3,
                  borderRadius: 1.5,
                  fontSize: '0.75rem'
                }}
              >
                Student Dashboard
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <School sx={{ color: '#fdd835', mr: 0.5, fontSize: 16 }} />
                <Typography
                  variant="caption"
                  sx={{
                    color: '#003C64',
                    fontWeight: 700,
                    fontSize: '0.7rem'
                  }}
                >
                  Department of
                </Typography>
              </Box>
              <Typography
                variant="body2"
                
                sx={{
                  color: '#003C64',
                  fontWeight: 600,
                  pl: 2.5,
                  fontSize: '0.8rem'
                }}
              >
                {reFormulateName(studentData?.name)}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Star sx={{ color: '#fdd835', mr: 0.5, fontSize: 16 }} />
                <Typography
                  variant="caption"
                  sx={{
                    color: '#003C64',
                    fontWeight: 700,
                    fontSize: '0.7rem'
                  }}
                >
                  GPA
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: '#003C64',
                  fontWeight: 600,
                  pl: 2.5,
                  fontSize: '0.9rem'
                }}
              >
                {studentData?.gpa}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <CalendarToday
                  sx={{ color: '#fdd835', mr: 0.5, fontSize: 16 }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: '#003C64',
                    fontWeight: 700,
                    fontSize: '0.7rem'
                  }}
                >
                  Year of Study
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: '#003C64',
                  fontWeight: 600,
                  pl: 2.5,
                  fontSize: '0.9rem'
                }}
              >
                {studentData?.current_year +"st Year"}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Assignment
                  sx={{ color: '#fdd835', mr: 0.5, fontSize: 16 }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: '#003C64',
                    fontWeight: 700,
                    fontSize: '0.7rem'
                  }}
                >
                  Student ID
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: '#003C64',
                  fontWeight: 600,
                  pl: 2.5,
                  fontSize: '0.9rem'
                }}
              >
                {studentData?.student_code}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StudentInfoCard;
