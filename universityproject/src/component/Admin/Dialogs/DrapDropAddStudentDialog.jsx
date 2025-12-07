import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { FileUploader } from "react-drag-drop-files";
import { useEffect, useState } from 'react';
import { useAlert } from '../../../context';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import { Backdrop, CircularProgress, Fab, Tooltip } from '@mui/material';
import { useDispatch } from 'react-redux';
import { UploadStudentViaExcel } from '../../redux/Slices/StudentSlice';
import ReportIcon from '@mui/icons-material/Report';
import Badge from '@mui/material/Badge';
import TraceErrorDialog from './TraceErrorDialog';
export default function DrapDropAddStudentDialog({open,setOpen}) {
  const fileTypes = ["XLSX"];
  const [file, setFile] = useState(null);
  const { setopen } = useAlert();
  const [cancel_selected, setCancelSelected] = useState(false);
  const [showTrace_errorBtn, setShowTraceErrorBtn] = useState({status:false,data:[]});
  const [loading, setLoading] = useState(false);
  const dispatch=useDispatch()
useEffect(() => {
    if (cancel_selected) {
      setFile(null);
      setCancelSelected(false);
    }   }, [cancel_selected]);
  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (file) => {
    if(file.size<200){
        setopen({ state: true, message: "File size is too small to be valid.", color: "error" });
    }else{
      setFile(file);
    }
  
  };
  useEffect(() => {

    if (!open) {
      setFile(null);
      setCancelSelected(false) // Reset file when dialog is closed
    }           
}, [open]);
const handleUploadStudents=async ()=>{
    try{
        setLoading(true)
     setShowTraceErrorBtn(pre=>({...pre,status:false,data:[]}))
      const res=await dispatch(UploadStudentViaExcel(file)).unwrap()
      if(res?.status==200){
        setOpen(false)
        setopen({state:true,message:res.message,color:"success"})
      }else if(res&&res.status==400){

        setCancelSelected(true)
        setopen({state:true,message:res.message,color:"error"})
      }else if (res&&res.status==422){
       setopen({
            state: true,
            message: "Validation error occurred! Click the Report icon to see details.",
            color: "error"
            });

        setCancelSelected(true)
        setShowTraceErrorBtn(pre=>({...pre,data:res.message}))
      }else if (res&&res.status==500){
        setopen({state:true,message:"An error occurred while uploading the file.",color:"error"})
        setCancelSelected(true)
      }
    }catch(err){
      console.error(err.message)
    }finally{
        setLoading(false)
    }

}
const TraceErrorButtonClicked=()=>{
    setShowTraceErrorBtn(pre=>({...pre,status:true}))
}

  return (
    <Dialog 
      open={open}  
      onClose={handleClose} 
      fullScreen
    
      slotProps={{paper:{
        sx: {
          
          boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
          overflow: 'hidden'
        }
      }}}
    >
      <DialogTitle 
        sx={{ 
          pb: 2,
          background: 'linear-gradient(135deg, #0d47a1 0%, #003C64 100%)',
          color: 'white',
          fontWeight: 600,
          fontSize: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          
        }}
      >
        <CloudUploadIcon sx={{ fontSize: 28 }} />
        Upload Student Data
      </DialogTitle>
      
      <DialogContent sx={{ pt: 3, px: 4,height:"30vh" }}>
    <Paper 
  elevation={0}
  sx={{ 
    p: 1.5,
    mb: 2,
    mt: 1,
    borderRadius: 2,
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    maxWidth: '100%',
    
  }}
>
  <DialogContentText 
    sx={{ 
      mb: 1.5, 
      lineHeight: 1.5, 
      color: '#334155',
      fontSize: '0.78rem'
    }}
  >
    <Typography 
      component="span" 
      sx={{ 
        fontWeight: 600, 
        color: '#1e293b', 
        mb: 0.5, 
        display: 'block',
        fontSize: '0.85rem'
      }}
    >
      File Requirements
    </Typography>
    Upload an Excel (.xlsx) file containing exactly these columns in order:
  </DialogContentText>
  
  <Box 
    sx={{ 
      display: 'grid', 
      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
      gap: 0.5, 
      mb: 1,
    }}
  >
    {["first_name", "last_name", "phone", "address", "gender", "department_code", "program_name"]

      .map((field) => (
        <Paper 
          key={field}
          elevation={0}
          sx={{ 
            p: 1, 
            borderRadius: 1.5,
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            textAlign: 'center',
            fontWeight: 500,
            fontSize: '0.75rem',
            color: '#475569',
            minHeight: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {field}
        </Paper>
    ))}
  </Box>
  
  <DialogContentText 
    sx={{ 
      lineHeight: 1.5, 
      fontSize: '0.75rem', 
      color: '#64748b' 
    }}
  >
    <Typography component="span" sx={{ fontWeight: 600, color: '#dc2626' }}>
      Important:
    </Typography>
    {' '}All names must exactly match existing departments , programs and case is insensitive for all headers keys. 
    Invalid data will reject the entire upload .
  </DialogContentText>
</Paper>

 <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
        
      >
        <CircularProgress color="inherit" />
      </Backdrop>
        <Paper 
          elevation={0}
          sx={{ 
            border: '2px dashed',
            borderColor: file ? '#4caf50' : '#cbd5e1',
            borderRadius: 3,
            p: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: file ? '#f0fdf4' : '#ffffff',
            backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              backgroundColor: "#f1f5f9",
              borderColor: "#0d47a1",
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(25, 118, 210, 0.15)'
            }
          }}
        >
          <Stack spacing={3} alignItems="center" sx={{ width: '100%' }}>
            <Badge   badgeContent={
                (showTrace_errorBtn.data&&showTrace_errorBtn.data.length)>0?
                 <Tooltip title="Show detailed error"><Badge badgeContent={showTrace_errorBtn.data.length} color="warning">
                 <ReportIcon onClick={TraceErrorButtonClicked} sx={{color:"red"}}/>
                </Badge></Tooltip>
                
                :0
            }>

            
            <Box sx={{ 
              p: 2.5, 
              borderRadius: '50%', 
              backgroundColor: file ? '#dcfce7' : '#e0f2fe',
              color: file ? '#16a34a' : '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {file ? (
                <CheckCircleIcon sx={{ fontSize: 48 }} />
              ) : (
                <CloudUploadIcon sx={{ fontSize: 48 }} />
              )}
            </Box>
            </Badge>
            <Box  display={"flex"} gap={1} > 
                    <FileUploader
              handleChange={handleChange}
              types={fileTypes}
              label={file ? `File selected: ${file.name}` : "Drag & drop your XLSX file here or click to upload"}
              uploadedLabel={"File uploaded successfully!"}
              hoverTitle={"Drop here"}
              onTypeError={() => setopen({ state: true, message: "Invalid file type. Please upload an Excel file.", color: "error" })}
              maxSize={1}
              key={open||cancel_selected ? 1 : 0} // Reset uploader when dialog is reopened
              onSizeError={() => setopen({ state: true, message: "File size exceeds the 1MB limit(Arround 1000 student is allowed).", color: "error" })}
              dropMessageStyle={{
                width: "100%",
                height: "150px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                color: "#0d47a1",
                fontWeight: 500,
              }}
            />
               <Tooltip title={!file?"No file uploaded yet":"Cancel Selected File"} arrow>
               <Typography component={"div"} sx={{display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Fab size="small" onClick={()=>setCancelSelected(true)}  disabled={!file} sx={{bgcolor:"#ff4444","&:hover":{bgcolor:"#cc0000"},cursor:!file?"not-allowed":"pointer"}}>
                    <CloseIcon sx={{color:"white" ,"&:hover":{opacity:0.9}}}/>
                </Fab>
                  {/* {(showTrace_errorBtn.data&&showTrace_errorBtn.data.length)>0?
               <Tooltip title="Show detailed error"><Badge badgeContent={showTrace_errorBtn.data.length} color="warning">
                 <ReportIcon onClick={TraceErrorButtonClicked} sx={{color:"red"}}/>
                </Badge></Tooltip>:undefined
            }  */}
               </Typography>
                </Tooltip> 
             
                 <TraceErrorDialog 
                 open={showTrace_errorBtn.status} 
                 onClose={()=>setShowTraceErrorBtn(pre=>({...pre,status:false}))}
                errors={showTrace_errorBtn.data||[]}

                 />
                
            </Box>
         
            
            {file && (
              <Paper 
                elevation={0}
                sx={{ 
                  mt: 2,
                  p: 2.5,
                  borderRadius: 2,
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  width: '100%',
                  maxWidth: 400,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <DescriptionIcon sx={{ color: '#16a34a', fontSize: 32 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 600, color: '#166534', fontSize: '0.95rem' }}>
                    {file.name}
                  </Typography>
                  <Typography sx={{ color: '#4caf50', fontSize: '0.875rem', mt: 0.5 }}>
                    Ready for upload
                  </Typography>
                </Box>
                <CheckCircleIcon sx={{ color: '#16a34a' }} />
              </Paper>
            )}
            
            <Typography 
              sx={{ 
                mt: 1, 
                color: '#64748b', 
                fontSize: '0.875rem',
                textAlign: 'center'
              }}
            >
              Supports .XLSX files up to 1MB(Arround 1000 student is allowed)
            </Typography>
          </Stack>
        </Paper>
      </DialogContent>

      <DialogActions 
        sx={{ 
          px: 4, 
          py: 3, 
          borderTop: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc'
        }}
      >
        <Button 
          onClick={handleClose} 
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1,
            borderColor: '#cbd5e1',
            color: '#64748b',
            fontWeight: 500,
            '&:hover': {
              borderColor: '#94a3b8',
              backgroundColor: '#f1f5f9'
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          form="subscription-form" 
          variant="contained"
          disabled={!file}
          onClick={handleUploadStudents}
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1,
            background: 'linear-gradient(135deg, #0d47a1 0%, #003C64 100%)',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1565c0 0%, #0a3d91 100%)',
              boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)'
            },
            '&:disabled': {
              background: '#cbd5e1',
              color: '#94a3b8'
            }
          }}
        >
          Upload & Process
        </Button>
      </DialogActions>
    </Dialog>
  );
}