import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
//# id, room_number, block, floor, campus, available

const columns = [
  { field: 'room_number', headerName: 'Room number', width: 130 },
  { field: 'block', headerName: 'Block', width: 130 },
  { field: 'floor', headerName: 'Floor', width: 130 },
  {
    field: 'campus',
    headerName: 'Campus',
    width: 130,
  },
  {
    field: 'Available',
    headerName: 'Available',
   width: 160,
    valueGetter: (_, row) => `${row?.available?"✅":"🚫"}`,
  },
];

const rows = [
  { id: 1, lastNam: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastNam: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastNam: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastNam: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastNam: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastNam: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastNam: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastNam: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastNam: 'Roxie', firstName: 'Harvey', age: 65 },
];

const paginationModel = { page: 0, pageSize: 5 };

 function RoomsViewComponent() {
   
  return (
    <Paper sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5,10,20]}
        checkboxSelection
        sx={{ border: 0 }}
        disableColumnResize
        filterDebounceMs
        keepNonExistentRowsSelected
        onCellClick={(p)=>console.log(p)}
        paginationMode={"server"}
        
      />
    </Paper>
  );
}
export default RoomsViewComponent
