import { useState } from 'react';
import { 
  Box, 
  Typography, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  Button, 
  Paper, 
  Divider,
  Alert
} from '@mui/material';
import { useCourses } from '../contexts/CourseContext';

interface QuizProps {
  courseId: string;
  quizId: string;
  questions: {
    id: string;
    text: string;
    options: { id: string; text: string }[];
    correctOptionId: string;
  }[];
  title: string;
}

export const Quiz = ({ courseId, quizId, questions, title }: QuizProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const { saveQuizScore } = useCourses();

  const handleAnswerChange = (questionId: string, optionId: string) => {
    if (submitted) return;
    
    setAnswers({
      ...answers,
      [questionId]: optionId
    });
  };

  const handleSubmit = () => {
    if (submitted) return;
    
    let correctAnswers = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correctOptionId) {
        correctAnswers++;
      }
    });
    
    const calculatedScore = Math.round((correctAnswers / questions.length) * 100);
    setScore(calculatedScore);
    setSubmitted(true);
    console.log(`Saving quiz score: ${calculatedScore}% for quiz ${quizId}`);
    
    saveQuizScore(courseId, quizId, calculatedScore);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      
      {submitted && (
        <Alert severity={score >= 70 ? "success" : "warning"} sx={{ mb: 3 }}>
          Your score: {score}%. {score >= 70 ? 'Congratulations!' : 'Try again to improve your score.'}
        </Alert>
      )}
      
      {questions.map((question, index) => (
        <Paper key={question.id} sx={{ mb: 3, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            {index + 1}. {question.text}
          </Typography>
          
          <RadioGroup 
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
          >
            {question.options.map(option => (
              <FormControlLabel
                key={option.id}
                value={option.id}
                control={<Radio />}
                label={option.text}
                disabled={submitted}
                sx={{
                  ...(submitted && answers[question.id] === option.id && option.id !== question.correctOptionId && {
                    color: 'error.main',
                  }),
                  ...(submitted && option.id === question.correctOptionId && {
                    color: 'success.main',
                  })
                }}
              />
            ))}
          </RadioGroup>
          
          {submitted && answers[question.id] !== question.correctOptionId && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              Incorrect. The correct answer is: {question.options.find(o => o.id === question.correctOptionId)?.text}
            </Typography>
          )}
        </Paper>
      ))}
      
      <Divider sx={{ mb: 2 }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body2">
          {Object.keys(answers).length} of {questions.length} questions answered
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < questions.length || submitted}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};
