import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Container,
  Typography,
  Box,
  Button, 
  Breadcrumbs,
  CircularProgress,
  Paper
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useCourses } from '../contexts/CourseContext';
import { Quiz } from '../components/Quiz';

export const QuizPage = () => {
  const { courseId, moduleId } = useParams<{ 
    courseId: string;
    moduleId: string;
  }>();
  const { courses, loading } = useCourses();
  const [course, setCourse] = useState<any>(null);
  const [module, setModule] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (courses.length > 0 && courseId && moduleId) {
      const foundCourse = courses.find(c => c.id === courseId);
      if (foundCourse) {
        setCourse(foundCourse);
        
        const foundModule = foundCourse.modules.find((m: any) => m.id === moduleId);
        if (foundModule) {
          setModule(foundModule);
        }
      }
    }
  }, [courses, courseId, moduleId]);

  const handleBack = () => {
    if (courseId) {
      navigate(`/courses/${courseId}`);
    }
  };

  const findNextModule = () => {
    if (!course || !module) return null;
    
    const currentModuleIndex = course.modules.findIndex((m: any) => m.id === moduleId);
    
    if (currentModuleIndex < course.modules.length - 1) {
      const nextModule = course.modules[currentModuleIndex + 1];
      return nextModule;
    }
    
    return null;
  };

  const handleNextModule = () => {
    const nextModule = findNextModule();
    if (nextModule && courseId) {
      navigate(`/courses/${courseId}/modules/${nextModule.id}/lessons/${nextModule.lessons[0].id}`);
    } else if (courseId) {
      // At the end of the course, redirect to course page
      navigate(`/courses/${courseId}`);
    }
  };

  if (loading || !course || !module) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
        <Link to="/courses" style={{ textDecoration: 'none', color: 'inherit' }}>Courses</Link>
        <Link to={`/courses/${courseId}`} style={{ textDecoration: 'none', color: 'inherit' }}>{course.title}</Link>
        <Typography color="text.primary">{module.title} - Quiz</Typography>
      </Breadcrumbs>
      
      <Paper sx={{ p: 4 }}>
        <Quiz
          courseId={courseId || ''}
          quizId={module.quiz.id}
          questions={module.quiz.questions}
          title={module.quiz.title}
        />
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button 
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Back to Course
        </Button>
        
        {findNextModule() && (
          <Button 
            variant="contained"
            onClick={handleNextModule}
          >
            Next Module
          </Button>
        )}
      </Box>
    </Container>
  );
};
