import { Link } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Box, LinearProgress } from '@mui/material';
import { useCourses } from '../contexts/CourseContext';

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  coverImage: string;
}

export const CourseCard = ({ id, title, description, coverImage }: CourseCardProps) => {
  const { userProgress, courses } = useCourses();
  
  const calculateProgress = () => {
    if (!userProgress) return 0;
    
    const course = courses.find(c => c.id === id);
    if (!course) return 0;
    
    // count lessons and quizzes as units
    const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);
    const totalQuizzes = course.modules.length;
    const totalUnits = totalLessons + totalQuizzes;
    if (totalUnits === 0) return 0;
    // completed lessons
    const completedLessons = Object.keys(userProgress.completedLessons)
      .filter(lessonId => course.modules.some(module => 
        module.lessons.some(lesson => lesson.id === lessonId && userProgress.completedLessons[lessonId])
      )).length;
    // passed quizzes (score >= 70)
    const passedQuizzes = course.modules.filter(module => {
      const score = userProgress.quizScores[module.quiz.id] || 0;
      return score >= 70;
    }).length;
    const completedUnits = completedLessons + passedQuizzes;
    return (completedUnits / totalUnits) * 100;
  };
  
  return (
    <Card component={Link} to={`/courses/${id}`} sx={{ textDecoration: 'none', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="140"
        image={coverImage}
        alt={title}
      />
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description.length > 100 ? description.substring(0, 100) + '...' : description}
        </Typography>
        
        {userProgress && (
          <Box sx={{ mt: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.round(calculateProgress())}%
              </Typography>
            </Box>
            <LinearProgress variant="determinate" value={calculateProgress()} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
