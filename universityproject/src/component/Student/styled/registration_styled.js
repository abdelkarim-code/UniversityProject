import { styled } from "@mui/material/styles";
import { Container, Paper, Box, Typography, Accordion, AccordionSummary, Chip, Button, Card } from "@mui/material";

// ==================== Styled Components ====================

export const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(4),
  minHeight: 'calc(100vh - 64px)',
}));

export const SectionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: 'fit-content',
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 12px rgba(0, 60, 100, 0.1)',
}));

export const SectionHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  paddingBottom: theme.spacing(2),
  borderBottom: `2px solid #fdd835`,
}));

export const SectionTitle = styled(Typography)(() => ({
  color: '#003C64',
  fontWeight: 700,
  fontSize: '1.5rem',
}));

export const CourseAccordion = styled(Accordion)(({ theme, hasConflict }) => ({
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

export const CourseHeader = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: 'rgba(0, 60, 100, 0.02)',
  borderRadius: theme.spacing(1),
  '&.Mui-expanded': {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
}));

export const CourseChip = styled(Chip)(() => ({
  backgroundColor: '#003C64',
  color: '#FFFFFF',
  fontWeight: 600,
  fontSize: '0.7rem',
}));

export const StatusChip = styled(Chip)(({ status }) => {
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

export const PrimaryButton = styled(Button)(({ theme }) => ({
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

export const SecondaryButton = styled(Button)(({ theme }) => ({
  borderColor: '#003C64',
  color: '#003C64',
  fontWeight: 600,
  padding: theme.spacing(0.75, 2),
  borderRadius: theme.spacing(1),
}));

export const ConflictAlert = styled(Box)(({ theme }) => ({
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

export const InfoRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

export const CompactCourseCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    borderColor: '#003C64',
    boxShadow: '0 4px 12px rgba(0, 60, 100, 0.15)',
  },
}));