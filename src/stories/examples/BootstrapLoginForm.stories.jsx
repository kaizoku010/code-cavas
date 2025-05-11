import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, Card, Container } from 'react-bootstrap';

// This is a sample Bootstrap login form component
const LoginForm = () => {
  return (
    <Container className="d-flex justify-content-center">
      <Card style={{ width: '350px' }}>
        <Card.Body>
          <div className="mb-4">
            <h3>Login</h3>
            <p className="text-muted small">Enter your credentials to sign in to your account</p>
          </div>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="name@example.com" />
            </Form.Group>

            <div className="d-flex justify-content-between align-items-center mb-2">
              <Form.Label htmlFor="formBasicPassword" className="mb-0">Password</Form.Label>
              <a href="#" className="small text-decoration-none">Forgot?</a>
            </div>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control type="password" />
            </Form.Group>
            
            <Button variant="primary" type="submit" className="w-100">
              Sign in
            </Button>
          </Form>
          <div className="mt-3 text-center small">
            Don't have an account? <a href="#" className="text-decoration-none">Sign up</a>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default {
  title: 'Examples/bootstrap/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export const Default = {
  args: {},
};
