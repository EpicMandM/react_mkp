import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Paper,
  Divider,
  Alert,
  Avatar
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../contexts/AuthContext';

export const ProfilePage = () => {
  const { currentUser, logout } = useAuth();
  const [name, setName] = useState(currentUser?.displayName || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      setError('Failed to log out');
    }
  };

  const handleNameUpdate = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      // In a real app, you'd update the user's profile here
      setMessage('Profile updated successfully');
    } catch (error) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        My Profile
      </Typography>
      
      <Paper sx={{ p: 4, mb: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {message && <Alert severity="success" sx={{ mb: 3 }}>{message}</Alert>}
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar sx={{ width: 80, height: 80, mr: 3 }}>
            {currentUser.displayName?.charAt(0) || <PersonIcon />}
          </Avatar>
          
          <Box>
            <Typography variant="h5">
              {currentUser.displayName}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {currentUser.email}
            </Typography>
          </Box>
        </Box>
        
        <Typography variant="h6" gutterBottom>
          Account Information
        </Typography>
        
        <Box component="form" sx={{ mt: 2 }}>
          <TextField
            label="Full Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={currentUser.email}
            disabled
          />
          
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={handleNameUpdate}
            disabled={loading}
          >
            Update Profile
          </Button>
        </Box>
        
        <Divider sx={{ my: 4 }} />
        
        <Typography variant="h6" gutterBottom>
          Account Actions
        </Typography>
        
        <Button
          variant="outlined"
          color="error"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Paper>
    </Container>
  );
};
