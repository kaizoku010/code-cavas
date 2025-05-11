import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Button, TextField, Card, CardContent, Typography, Box, Link } from '@mui/material';

// This is a sample Material UI login form component
const LoginForm = () => {
  return (
    <Card sx={{ maxWidth: 350, width: '100%' }}>
      <CardContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Login
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enter your credentials to sign in to your account
          </Typography>
        </Box>
        <Box component="form" sx={{ '& .MuiTextField-root': { mb: 2 } }}>
          <TextField
            fullWidth
            id="email"
            label="Email"
            type="email"
            variant="outlined"
            placeholder="name@example.com"
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2">Password</Typography>
            <Link href="#" variant="body2" underline="hover">
              Forgot?
            </Link>
          </Box>
          <TextField
            fullWidth
            id="password"
            type="password"
            variant="outlined"
          />
          <Button 
            fullWidth 
            variant="contained" 
            color="primary"
            sx={{ mt: 2 }}
          >
            Sign in
          </Button>
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2">
              Don't have an account?{' '}
              <Link href="#" underline="hover">
                Sign up
              </Link>
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// Create theme instances
const lightTheme = createTheme({ palette: { mode: 'light' } });
const darkTheme = createTheme({ palette: { mode: 'dark' } });

export default {
  title: 'Examples/material/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <div style={{ margin: '2rem' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export const Default = {
  args: {},
};

export const Dark = {
  decorators: [
    (Story) => (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <div style={{ margin: '2rem' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};
