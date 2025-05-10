import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import VideocamIcon from '@mui/icons-material/Videocam';
import AssessmentIcon from '@mui/icons-material/Assessment';
// No longer need to import initializeData
import { useAuth } from '../contexts/AuthContext';
import { useCourses } from '../contexts/CourseContext';
import { CourseCard } from '../components/CourseCard';

export const HomePage = () => {
  const { currentUser } = useAuth();
  const { courses, userProgress } = useCourses();
  const navigate = useNavigate();
  
  
  const getRecentCourses = () => {
    if (!userProgress || !userProgress.lastAccessed.courseId) {
      return [];
    }
    
    const recentCourse = courses.find(c => c.id === userProgress.lastAccessed.courseId);
    if (!recentCourse) {
      return [];
    }
    
    return [recentCourse];
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to EdLearn
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Unlock your potential with our interactive online courses
        </Typography>
        {!currentUser && (
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/signup')}
            sx={{ mt: 2 }}
          >
            Get Started
          </Button>
        )}
      </Box>

      {currentUser && userProgress?.lastAccessed?.courseId && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Continue Learning
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: 3 }}>
            {getRecentCourses().map(course => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                description={course.description}
                coverImage={course.coverImage}
              />
            ))}
          </Box>
        </Box>
      )}

      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Featured Courses
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: 3 }}>
          {courses.slice(0, 3).map(course => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              description={course.description}
              coverImage={course.coverImage}
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          Why Choose EdLearn?
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: 3 }}>
          <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <VideocamIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              HD Video Lessons
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Learn with high-quality video content created by industry experts
            </Typography>
          </Paper>
          <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <SchoolIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Interactive Quizzes
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Test your knowledge with quizzes after each module to reinforce learning
            </Typography>
          </Paper>
          <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <AssessmentIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Progress Tracking
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Monitor your progress and pick up right where you left off
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};
