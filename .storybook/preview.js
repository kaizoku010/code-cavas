/** @type { import('@storybook/react').Preview } */
import React from 'react';
import { withThemeByClassName } from '@storybook/addon-themes';
import '../src/index.css';

// Import framework-specific styles
import './styles/shadcn.css';
import '@mui/material/styles';
import 'bootstrap/dist/css/bootstrap.min.css';

const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    // Theme decorator for shadcn UI
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
    // Global decorator to apply consistent styling
    (Story) => (
      <div style={{ margin: '2rem' }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
