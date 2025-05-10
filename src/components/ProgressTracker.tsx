import { 
  Box, 
  Typography, 
  CircularProgress, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Paper
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import { useCourses } from '../contexts/CourseContext';

interface ProgressTrackerProps {
  courseId: string;
}

export const ProgressTracker = ({ courseId }: ProgressTrackerProps) => {
  const { courses, userProgress, loading } = useCourses();
  
  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
  }
  
  const course = courses.find(c => c.id === courseId);
  
  if (!course) {
    return <Typography>Course not found.</Typography>;
  }
  
  const calculateProgress = () => {
    if (!userProgress) return 0;
    
    const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);
    
    if (totalLessons === 0) return 0;
    
    const completedLessons = Object.keys(userProgress.completedLessons)
      .filter(lessonId => course.modules.some(module => 
        module.lessons.some(lesson => lesson.id === lessonId && userProgress.completedLessons[lessonId])
      )).length;
    
    return (completedLessons / totalLessons) * 100;
  };
  
  const calculateModuleProgress = (moduleId: string) => {
    if (!userProgress) return 0;
    
    const module = course.modules.find(m => m.id === moduleId);
    
    if (!module) return 0;
    
    const totalLessons = module.lessons.length;
    
    if (totalLessons === 0) return 0;
    
    const completedLessons = module.lessons.filter(
      lesson => userProgress.completedLessons[lesson.id]
    ).length;
    
    return (completedLessons / totalLessons) * 100;
  };
  
  const getQuizScore = (quizId: string) => {
    if (!userProgress) return null;
    
    return userProgress.quizScores[quizId] || null;
  };
  
  return (
    <Box sx={{ mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ position: 'relative', display: 'inline-flex', mr: 3 }}>
            <CircularProgress
              variant="determinate"
              value={calculateProgress()}
              size={80}
              thickness={4}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h6" component="div" color="text.secondary">
                {`${Math.round(calculateProgress())}%`}
              </Typography>
            </Box>
          </Box>
          
          <Box>
            <Typography variant="h6">{course.title} Progress</Typography>
            <Typography variant="body2" color="text.secondary">
              {Object.values(userProgress?.completedLessons || {}).filter(Boolean).length} 
              {' '}of{' '}
              {course.modules.reduce((total, module) => total + module.lessons.length, 0)} 
              {' '}lessons completed
            </Typography>
          </Box>
        </Box>
      </Paper>
      
      {course.modules.map(module => (
        <Paper key={module.id} sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">{module.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.round(calculateModuleProgress(module.id))}% complete
            </Typography>
          </Box>
          
          <List>
            {module.lessons.map(lesson => (
              <ListItem key={lesson.id} sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {userProgress?.completedLessons[lesson.id] ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <PendingIcon color="disabled" />
                  )}
                </ListItemIcon>
                <ListItemText primary={lesson.title} />
              </ListItem>
            ))}
            
            <ListItem sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                {getQuizScore(module.quiz.id) !== null ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <PendingIcon color="disabled" />
                )}
              </ListItemIcon>
              <ListItemText 
                primary={`Quiz: ${module.quiz.title}`} 
                secondary={
                  getQuizScore(module.quiz.id) !== null 
                    ? `Score: ${getQuizScore(module.quiz.id)}%` 
                    : 'Not taken'
                }
              />
            </ListItem>
          </List>
        </Paper>
      ))}
    </Box>
  );
};
