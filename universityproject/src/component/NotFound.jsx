import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

function NOTFOUND({message}) {
  return (
    <Card sx={{ maxWidth: 400, margin: 'auto', marginTop: 4, padding: 2 }}>
      <CardContent>
        <Typography variant="h6" color='warning' gutterBottom align="center">
          Warning!
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" paragraph>
         
          {message||""}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default NOTFOUND;
