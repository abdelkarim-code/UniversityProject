import React from 'react';
import { Card, CardContent, Box, Grid, Typography } from '@mui/material';
import { CalendarToday } from '@mui/icons-material';

const CurrentSemesterCard = ({ semesterData }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 10,
        mt: 0.2,
        mb: 0,
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 375,
          maxHeight: 145,
          borderRadius: 3,
          boxShadow:
            '0 12px 40px rgba(0,60,100,0.25), 0 6px 20px rgba(253,216,53,0.15)',
          border: '2px solid #fdd835',
          bgcolor: 'white',
          position: 'relative',
          overflow: 'visible',
        }}
      >
        {/* Gold top bar */}
        <Box
          sx={{
            bgcolor: '#fdd835',
            height: 6,
            borderTopLeftRadius: 3,
            borderTopRightRadius: 3,
          }}
        />

        <CardContent sx={{ p: 2.5, pb: 2 }}>
          <Grid container spacing={1.5}>
            {/* Title */}
            <Grid item xs={12}>
              <Typography
                variant="h6"
                sx={{
                  color: '#003C64',
                  fontWeight: 700,
                  textAlign: 'center',
                  fontSize: '0.85rem',
                }}
              >
                Current Semester
              </Typography>

              <Typography
                sx={{
                  color: '#003C64',
                  textAlign: 'center',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  bgcolor: '#fdd835',
                  display: 'inline-block',
                  px: 1.4,
                  py: 0.2,
                  borderRadius: 1.3,
                  mt: 0.6,
                }}
              >
                {semesterData?.name}
              </Typography>
            </Grid>

            {/* Academic Year */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mt: 1,
                }}
              >
                <CalendarToday
                  sx={{ color: '#fdd835', mr: 0.8, fontSize: 18 }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: '#003C64',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                  }}
                >
                  Academic Year
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: '#003C64',
                  fontWeight: 600,
                  textAlign: 'center',
                  mt: 0.5,
                  fontSize: '0.9rem',
                }}
              >
                {semesterData?.academic_year}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CurrentSemesterCard;
