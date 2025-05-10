import { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, InputAdornment, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useCourses } from '../contexts/CourseContext';
import { CourseCard } from '../components/CourseCard';

export const CoursesPage = () => {
  const { courses, loading } = useCourses();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourses, setFilteredCourses] = useState(courses);

  useEffect(() => {
    if (searchTerm) {
      const filtered = courses.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses(courses);
    }
  }, [searchTerm, courses]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        All Courses
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {filteredCourses.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
          No courses found matching your search criteria.
        </Typography>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 3 }}>
          {filteredCourses.map(course => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              description={course.description}
              coverImage={course.coverImage}
            />
          ))}
        </Box>
      )}
    </Container>
  );
};
