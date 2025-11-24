import React, { useState } from "react";
import { TextField, Box } from "@mui/material";
import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";

const YearPicker = ({ label = "Select Year", onChange }) => {
  const [selectedDate, setSelectedDate] = useState(moment());

  const handleChange = (newDate) => {
    setSelectedDate(newDate);
    if (onChange) onChange(moment(newDate).year());
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Box sx={{ minWidth: 150 }}>
        <DesktopDatePicker
          views={["year"]}
          label={label}
          value={selectedDate}
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} />}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default YearPicker;
