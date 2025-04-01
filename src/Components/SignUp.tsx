import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Button,
  TextField,
  Box,
  Typography,
  Link,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material';
import { AccountCircle, Lock, Visibility, VisibilityOff } from '@mui/icons-material';

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      // Registration API call
      const response = await axios.post('https://reqres.in/api/register', {
        email,
        password
      });

      // Create user object with form data and API response
      const user = {
        id: response.data.id,
        first_name: firstName,
        last_name: lastName,
        email: email,
        avatar: '' // Add default avatar or generate from initials
      };

      // Log user in with the received token and created user
      login(response.data.token, user);
      
      // Redirect to dashboard
      navigate('/');
    } catch (error) {
      let errorMessage = 'Registration failed';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: 400,
        mx: 'auto',
        mt: 8,
        p: 3,
        boxShadow: 3,
        borderRadius: 2
      }}
    >
      <AccountCircle sx={{ fontSize: 40, mb: 2, color: 'primary.main' }} />
      <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
        Create Account
      </Typography>

      {error && (
        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
        <TextField
          margin="normal"
          required
          fullWidth
          label="First Name"
          autoComplete="given-name"
          autoFocus
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          label="Last Name"
          autoComplete="family-name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          label="Email Address"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          label="Password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          label="Confirm Password"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock />
              </InputAdornment>
            )
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isLoading}
          sx={{ mt: 3, mb: 2 }}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Sign Up'}
        </Button>

        <Box sx={{ textAlign: 'center' }}>
          <Link href="/login" variant="body2">
            Already have an account? Sign In
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default SignUp;