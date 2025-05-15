import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Breadcrumbs,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  IconButton,
  Drawer
} from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MenuIcon from '@mui/icons-material/Menu';
import { useCourses } from '../contexts/CourseContext';
import { VideoPlayer } from '../components/VideoPlayer';
import { forceMarkLessonComplete } from '../utils/debugFirebase';
import { useAuth } from '../contexts/AuthContext';

export const LessonPage = () => {
  const { courseId, moduleId, lessonId } = useParams<{ 
    courseId: string;
    moduleId: string;
    lessonId: string;
  }>();
  const { courses, userProgress, loading, markLessonCompleted, updateLastAccessed } = useCourses();
  const { currentUser } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [module, setModule] = useState<any>(null);
  const [lesson, setLesson] = useState<any>(null);
  const [videoCompleted, setVideoCompleted] = useState(false);
  // Local set of completed lessons for UI persistence
  const [completedSet, setCompletedSet] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Load lesson data and reset completion when the IDs change
  useEffect(() => {
    if (courses.length > 0 && courseId && moduleId && lessonId) {
      const foundCourse = courses.find(c => c.id === courseId);
      if (!foundCourse) return;
      setCourse(foundCourse);
      const foundModule = foundCourse.modules.find((m: any) => m.id === moduleId);
      if (!foundModule) return;
      setModule(foundModule);
      const foundLesson = foundModule.lessons.find((l: any) => l.id === lessonId);
      if (!foundLesson) return;
      setLesson(foundLesson);
      updateLastAccessed(courseId, moduleId, lessonId);
      // Reset video completion state on lesson change
      setVideoCompleted(false);
    }
  }, [courses, courseId, moduleId, lessonId, updateLastAccessed]);
  
  // Sync persisted completions into local completedSet (merge without losing recent ones)
  useEffect(() => {
    if (userProgress?.completedLessons) {
      setCompletedSet(prev => {
        const unionSet = new Set(prev);
        Object.entries(userProgress.completedLessons).forEach(([id, done]) => {
          if (done) unionSet.add(id);
        });
        return unionSet;
      });
      // Show bottom indicator for current lesson if persisted as done
      if (lessonId && userProgress.completedLessons[lessonId]) {
        setVideoCompleted(true);
      }
    }
  }, [userProgress, lessonId]);

  const handleLessonComplete = () => {
    if (courseId && lessonId) {
      console.log(`Marking lesson ${lessonId} as completed...`);
      setVideoCompleted(true); // Track completion state locally immediately
      // Add to local completed set so checkbox persists
      if (lessonId) setCompletedSet(prev => new Set(prev).add(lessonId));
      
      markLessonCompleted(courseId, lessonId)
        .then(() => {
          console.log(`Lesson ${lessonId} marked as completed successfully`);
          // We already set videoCompleted to true, so no need to do it again
        })
        .catch(error => {
          console.error("Failed to mark lesson as completed:", error);
          // Even if the Firebase update fails, we keep the completion state locally
          // to prevent the UI from blinking
          // Fallback mechanism if the regular method fails
          if (currentUser && courseId && lessonId) {
            console.log("Attempting fallback method to mark lesson as completed...");
            forceMarkLessonComplete(currentUser.uid, courseId, lessonId)
              .then(result => {
                if (result.success) {
                  console.log("Lesson marked as completed via fallback method");
                } else {
                  console.error("Fallback method also failed");
                }
              });
          }
        });
    }
  };

  const findNextLesson = () => {
    if (!course || !module || !lesson) return null;
    
    const currentLessonIndex = module.lessons.findIndex((l: any) => l.id === lessonId);
    
    if (currentLessonIndex < module.lessons.length - 1) {
      return {
        moduleId: module.id,
        lessonId: module.lessons[currentLessonIndex + 1].id
      };
    }
    
    const currentModuleIndex = course.modules.findIndex((m: any) => m.id === moduleId);
    
    if (currentModuleIndex < course.modules.length - 1) {
      const nextModule = course.modules[currentModuleIndex + 1];
      if (nextModule.lessons.length > 0) {
        return {
          moduleId: nextModule.id,
          lessonId: nextModule.lessons[0].id
        };
      }
    }
    
    return null;
  };

  const findPreviousLesson = () => {
    if (!course || !module || !lesson) return null;
    
    const currentLessonIndex = module.lessons.findIndex((l: any) => l.id === lessonId);
    
    if (currentLessonIndex > 0) {
      return {
        moduleId: module.id,
        lessonId: module.lessons[currentLessonIndex - 1].id
      };
    }
    
    const currentModuleIndex = course.modules.findIndex((m: any) => m.id === moduleId);
    
    if (currentModuleIndex > 0) {
      const prevModule = course.modules[currentModuleIndex - 1];
      if (prevModule.lessons.length > 0) {
        return {
          moduleId: prevModule.id,
          lessonId: prevModule.lessons[prevModule.lessons.length - 1].id
        };
      }
    }
    
    return null;
  };

  const handleNextLesson = () => {
    const nextLesson = findNextLesson();
    if (nextLesson && courseId) {
      navigate(`/courses/${courseId}/modules/${nextLesson.moduleId}/lessons/${nextLesson.lessonId}`);
    } else if (courseId && moduleId) {
      navigate(`/courses/${courseId}/modules/${moduleId}/quiz`);
    }
  };

  const handlePreviousLesson = () => {
    const prevLesson = findPreviousLesson();
    if (prevLesson && courseId) {
      navigate(`/courses/${courseId}/modules/${prevLesson.moduleId}/lessons/${prevLesson.lessonId}`);
    }
  };

  const handleLessonClick = (clickModuleId: string, clickLessonId: string) => {
    if (courseId) {
      navigate(`/courses/${courseId}/modules/${clickModuleId}/lessons/${clickLessonId}`);
    }
    setSidebarOpen(false);
  };

  const handleQuizClick = (clickModuleId: string) => {
    if (courseId) {
      navigate(`/courses/${courseId}/modules/${clickModuleId}/quiz`);
    }
    setSidebarOpen(false);
  };

  // Determines if a lesson is completed: completedSet or just completed video
  const isLessonCompleted = (checkLessonId: string) => {
    if (checkLessonId === lessonId) {
      return videoCompleted || completedSet.has(checkLessonId);
    }
    return completedSet.has(checkLessonId);
  };

  if (loading || !course || !module || !lesson) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <IconButton 
            edge="start" 
            sx={{ display: { sm: 'none' } }}
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          
          <Breadcrumbs sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
            <Link to="/courses" style={{ textDecoration: 'none', color: 'inherit' }}>Courses</Link>
            <Link to={`/courses/${courseId}`} style={{ textDecoration: 'none', color: 'inherit' }}>{course.title}</Link>
            <Typography color="text.primary">{lesson.title}</Typography>
          </Breadcrumbs>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 4 }}>
          <Box sx={{ width: { xs: '100%', md: '70%' } }}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <VideoPlayer 
                videoUrl={lesson.videoUrl} 
                onComplete={handleLessonComplete}
                title={lesson.title}
              />
              
              {(videoCompleted || completedSet.has(lessonId!)) && (
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', color: 'success.main', transition: 'none' }}>
                  <CheckCircleIcon sx={{ mr: 1, animation: 'none', transition: 'none' }} />
                  <Typography variant="body2" sx={{ transition: 'none' }}>
                    Lesson complete! Your progress has been saved.
                  </Typography>
                </Box>
              )}
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h5" gutterBottom>
                {lesson.title}
              </Typography>
              
              <Typography variant="body1" paragraph>
                {lesson.description}
              </Typography>
            </Paper>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button 
                startIcon={<ArrowBackIcon />}
                onClick={handlePreviousLesson}
                disabled={!findPreviousLesson()}
              >
                Previous Lesson
              </Button>
              
              <Button 
                endIcon={<ArrowForwardIcon />}
                variant="contained"
                onClick={handleNextLesson}
              >
                {findNextLesson() ? 'Next Lesson' : 'Go to Quiz'}
              </Button>
            </Box>
          </Box>
          
          <Paper sx={{ 
            width: '30%', 
            p: 2, 
            display: { xs: 'none', md: 'block' },
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <Typography variant="h6" gutterBottom>
              {module.title}
            </Typography>
            
            <List disablePadding>
                {module.lessons.map((moduleLesson: any) => (
                <ListItem key={moduleLesson.id} disablePadding>                    <ListItemButton
                      onClick={() => handleLessonClick(module.id, moduleLesson.id)}
                      selected={moduleLesson.id === lessonId}
                      sx={{
                        borderLeft: isLessonCompleted(moduleLesson.id) ? '4px solid #4caf50' : 'none',
                        pl: isLessonCompleted(moduleLesson.id) ? 1.5 : 2,
                        transition: 'none', // Disable any transition effects that might cause blinking
                      }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {isLessonCompleted(moduleLesson.id) ? (
                        <CheckCircleIcon 
                          color="success" 
                          fontSize="small" 
                          sx={{ animation: 'none' }} // Prevent any animation/blinking
                        />
                      ) : (
                        <PlayCircleOutlineIcon fontSize="small" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={moduleLesson.title}
                      primaryTypographyProps={{
                        variant: 'body2',
                        fontWeight: moduleLesson.id === lessonId ? 'bold' : 'normal'
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
              
              <Divider sx={{ my: 1 }} />
              
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleQuizClick(module.id)}
                  sx={{ pl: 2 }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <AssignmentIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Quiz: ${module.quiz.title}`}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </Paper>
        </Box>
      </Container>
      
      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      >
        <Box sx={{ width: 280, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            {module.title}
          </Typography>
          
          <List disablePadding>
            {module.lessons.map((moduleLesson: any) => (
              <ListItem key={moduleLesson.id} disablePadding>
                <ListItemButton
                  onClick={() => handleLessonClick(module.id, moduleLesson.id)}
                  selected={moduleLesson.id === lessonId}
                >
                  <ListItemIcon>
                    {isLessonCompleted(moduleLesson.id) ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <PlayCircleOutlineIcon />
                    )}
                  </ListItemIcon>
                  <ListItemText primary={moduleLesson.title} />
                </ListItemButton>
              </ListItem>
            ))}
            
            <Divider sx={{ my: 1 }} />
            
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleQuizClick(module.id)}>
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary={`Quiz: ${module.quiz.title}`} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};
