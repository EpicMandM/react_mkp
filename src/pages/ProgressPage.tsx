import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  ListItemButton
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import { useCourses } from '../contexts/CourseContext';
import { useAuth } from '../contexts/AuthContext';

export const ProgressPage = () => {
  const { courses, userProgress, loading } = useCourses();
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          You need to be logged in to view your progress.
        </Typography>
        <Button component={Link} to="/login" variant="contained" sx={{ mt: 2 }}>
          Log In
        </Button>
      </Container>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const calculateCourseProgress = (courseId: string) => {
    if (!userProgress) return 0;
    
    const course = courses.find(c => c.id === courseId);
    if (!course) return 0;
    
    // Count lessons and quizzes as units
    const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);
    const totalQuizzes = course.modules.length;
    const totalUnits = totalLessons + totalQuizzes;
    
    if (totalUnits === 0) return 0;
    
    const completedLessons = Object.keys(userProgress.completedLessons)
      .filter(lessonId => course.modules.some(module => 
        module.lessons.some(lesson => lesson.id === lessonId && userProgress.completedLessons[lessonId])
      )).length;
    
    // Count passed quizzes (score >= 70)
    const passedQuizzes = course.modules.filter(module => {
      const score = userProgress.quizScores[module.quiz.id] || 0;
      return score >= 70;
    }).length;
    
    const completedUnits = completedLessons + passedQuizzes;
    return (completedUnits / totalUnits) * 100;
  };

  const getInProgressCourses = () => {
    return courses.filter(course => {
      const progress = calculateCourseProgress(course.id);
      return progress > 0 && progress < 100;
    });
  };

  const getCompletedCourses = () => {
    return courses.filter(course => {
      const progress = calculateCourseProgress(course.id);
      return progress === 100;
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        My Progress
      </Typography>
      
      {!userProgress || (getInProgressCourses().length === 0 && getCompletedCourses().length === 0) ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <SchoolIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            You haven't started any courses yet
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Browse our catalog and start learning today!
          </Typography>
          <Button component={Link} to="/courses" variant="contained">
            Explore Courses
          </Button>
        </Paper>
      ) : (
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 4
        }}>
          <Box>
            <Typography variant="h5" gutterBottom>
              In Progress
            </Typography>
            
            {getInProgressCourses().length === 0 ? (
              <Typography variant="body1" color="text.secondary">
                No courses in progress
              </Typography>
            ) : (
              <List>
                {getInProgressCourses().map(course => {
                  const progress = calculateCourseProgress(course.id);
                  const lastAccessedModule = course.modules.find(
                    (m: any) => m.id === userProgress?.lastAccessed?.moduleId
                  );
                  const lastAccessedLesson = lastAccessedModule?.lessons.find(
                    (l: any) => l.id === userProgress?.lastAccessed?.lessonId
                  );
                  
                  return (
                    <Paper key={course.id} sx={{ mb: 2 }}>
                      <Box sx={{ p: 2 }}>
                        <Typography variant="h6" component={Link} to={`/courses/${course.id}`} sx={{ 
                          textDecoration: 'none',
                          color: 'inherit',
                          display: 'block',
                          mb: 1
                        }}>
                          {course.title}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                            <CircularProgress
                              variant="determinate"
                              value={progress}
                              size={40}
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
                              <Typography variant="caption" component="div" color="text.secondary">
                                {`${Math.round(progress)}%`}
                              </Typography>
                            </Box>
                          </Box>
                          
                          {lastAccessedModule && lastAccessedLesson && (
                            <Typography variant="body2" color="text.secondary">
                              Last activity: {lastAccessedModule.title} - {lastAccessedLesson.title}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      
                      <Divider />
                      
                      <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          component={Link}
                          to={userProgress?.lastAccessed?.courseId === course.id && userProgress?.lastAccessed?.moduleId && userProgress?.lastAccessed?.lessonId
                            ? `/courses/${course.id}/modules/${userProgress.lastAccessed.moduleId}/lessons/${userProgress.lastAccessed.lessonId}`
                            : `/courses/${course.id}`
                          }
                          size="small"
                        >
                          Continue Learning
                        </Button>
                      </Box>
                    </Paper>
                  );
                })}
              </List>
            )}
          </Box>
          
          <Box>
            <Typography variant="h5" gutterBottom>
              Completed
            </Typography>
            
            {getCompletedCourses().length === 0 ? (
              <Typography variant="body1" color="text.secondary">
                No completed courses yet
              </Typography>
            ) : (
              <List>
                {getCompletedCourses().map(course => (
                  <Paper key={course.id} sx={{ mb: 2 }}>
                    <ListItem 
                      component={Link} 
                      to={`/courses/${course.id}`}
                      sx={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <ListItemText 
                        primary={course.title} 
                        secondary="100% Complete" 
                      />
                      <Button size="small">Review</Button>
                    </ListItem>
                  </Paper>
                ))}
              </List>
            )}
          </Box>
        </Box>
      )}
    </Container>
  );
};
