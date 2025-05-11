import React from 'react';

// This is a sample shadcn UI login form component
const LoginForm = () => {
  return (
    <div className="w-[350px]">
      <div className="card">
        <div className="p-6">
          <div className="space-y-2 mb-4">
            <h3 className="text-lg font-semibold">Login</h3>
            <p className="text-sm text-muted-foreground">Enter your credentials to sign in to your account</p>
          </div>
          <form className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <input 
                id="email" 
                type="email" 
                className="input w-full" 
                placeholder="name@example.com" 
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <a href="#" className="text-sm text-primary hover:underline">Forgot?</a>
              </div>
              <input 
                id="password" 
                type="password" 
                className="input w-full" 
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary w-full"
            >
              Sign in
            </button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don't have an account? <a href="#" className="text-primary hover:underline">Sign up</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default {
  title: 'Examples/shadcn/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1a1a1a' },
      ],
    },
  },
  tags: ['autodocs'],
};

export const Default = {
  args: {},
};

export const Dark = {
  parameters: {
    backgrounds: { default: 'dark' },
    theme: 'dark',
  },
};
