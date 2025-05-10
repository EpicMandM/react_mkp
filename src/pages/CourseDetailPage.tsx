import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardMedia,
  List, 
  ListItem,
  ListItemText, 
  ListItemIcon,
  ListItemButton,
  Button, 
  Divider, 
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Breadcrumbs
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useCourses } from '../contexts/CourseContext';
import { ProgressTracker } from '../components/ProgressTracker';

export const CourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { courses, userProgress, loading, updateLastAccessed } = useCourses();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);

  useEffect(() => {
    if (courseId && courses.length > 0) {
      const foundCourse = courses.find(c => c.id === courseId);
      if (foundCourse) {
        setCourse(foundCourse);
      }
    }
  }, [courseId, courses]);

  const handleLessonClick = (moduleId: string, lessonId: string) => {
    if (courseId) {
      updateLastAccessed(courseId, moduleId, lessonId);
      navigate(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`);
    }
  };

  const handleQuizClick = (moduleId: string) => {
    if (courseId) {
      navigate(`/courses/${courseId}/modules/${moduleId}/quiz`);
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return userProgress?.completedLessons[lessonId] || false;
  };

  const isQuizCompleted = (quizId: string) => {
    return userProgress?.quizScores[quizId] !== undefined;
  };

  if (loading || !course) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
        <Link to="/courses" style={{ textDecoration: 'none', color: 'inherit' }}>Courses</Link>
        <Typography color="text.primary">{course.title}</Typography>
      </Breadcrumbs>
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, mb: 4 }}>
        <Card sx={{ width: { xs: '100%', md: '40%' }, flexShrink: 0 }}>
          <CardMedia
            component="img"
            image={course.coverImage}
            alt={course.title}
            sx={{ height: { xs: 200, md: 300 } }}
          />
        </Card>
        
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {course.title}
          </Typography>
          
          <Typography variant="body1" paragraph>
            {course.description}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button 
              variant="contained"
              onClick={() => {
                if (course.modules.length > 0 && course.modules[0].lessons.length > 0) {
                  const moduleId = course.modules[0].id;
                  const lessonId = course.modules[0].lessons[0].id;
                  handleLessonClick(moduleId, lessonId);
                }
              }}
            >
              Start Course
            </Button>
            
            {userProgress?.lastAccessed && userProgress.lastAccessed.courseId === courseId && (
              <Button 
                variant="outlined"
                onClick={() => {
                  handleLessonClick(
                    userProgress.lastAccessed.moduleId,
                    userProgress.lastAccessed.lessonId
                  );
                }}
              >
                Continue Learning
              </Button>
            )}
          </Box>
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        <Box sx={{ width: { xs: '100%', md: '70%' } }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Course Content
          </Typography>
          
          {course.modules.map((module: any) => (
            <Accordion key={module.id} defaultExpanded={true}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{module.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List disablePadding>
                  {module.lessons.map((lesson: any) => (
                    <ListItem key={lesson.id} disablePadding>
                      <ListItemButton
                        onClick={() => handleLessonClick(module.id, lesson.id)}
                        sx={{
                          borderLeft: isLessonCompleted(lesson.id) ? '4px solid #4caf50' : 'none',
                          pl: isLessonCompleted(lesson.id) ? 1.5 : 2
                        }}
                      >
                        <ListItemIcon>
                          {isLessonCompleted(lesson.id) ? (
                            <CheckCircleIcon color="success" />
                          ) : (
                            <PlayCircleOutlineIcon />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={lesson.title}
                          secondary={`${lesson.duration} min`}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                  
                  <Divider />
                  
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleQuizClick(module.id)}
                      sx={{
                        borderLeft: isQuizCompleted(module.quiz.id) ? '4px solid #4caf50' : 'none',
                        pl: isQuizCompleted(module.quiz.id) ? 1.5 : 2
                      }}
                    >
                      <ListItemIcon>
                        {isQuizCompleted(module.quiz.id) ? (
                          <CheckCircleIcon color="success" />
                        ) : (
                          <AssignmentIcon />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={`Quiz: ${module.quiz.title}`}
                        secondary={
                          isQuizCompleted(module.quiz.id)
                            ? `Score: ${userProgress?.quizScores[module.quiz.id]}%`
                            : 'Not taken'
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
        
        <Box sx={{ width: { xs: '100%', md: '30%' } }}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Your Progress
            </Typography>
            
            <ProgressTracker courseId={courseId || ''} />
          </Card>
        </Box>
      </Box>
    </Container>
  );
};
