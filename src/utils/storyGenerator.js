/**
 * Utility for generating Storybook stories from AI-generated components
 */
import { extractComponentName } from './codeParser';

/**
 * Simple function to generate a random ID
 * @returns {string} - Random ID
 */
const generateRandomId = () => {
  return Math.random().toString(36).substring(2, 10);
};

/**
 * Generate a Storybook story file from a component
 * @param {Object} parsedCode - Parsed code object from codeParser
 * @returns {Object} - Story file content and metadata
 */
export const generateStory = (parsedCode) => {
  const { framework, code } = parsedCode;

  if (!code || code.trim() === '') {
    throw new Error('No code provided for story generation');
  }

  // Extract component name or generate a unique one
  let componentName = extractComponentName(code) || `Component${generateRandomId()}`;

  // Clean up component name
  componentName = componentName.replace(/[^a-zA-Z0-9]/g, '');

  // Generate a unique ID for this story
  const storyId = generateRandomId();

  // Create the story file content based on the framework
  const storyContent = createStoryContent(componentName, framework, code, storyId);

  return {
    componentName,
    storyId,
    framework,
    storyContent,
    fileName: `${componentName}.stories.jsx`
  };
};

/**
 * Create the content for a Storybook story file
 * @param {string} componentName - Name of the component
 * @param {string} framework - UI framework (shadcn, material, bootstrap, etc.)
 * @param {string} code - Component code
 * @param {string} storyId - Unique ID for the story
 * @returns {string} - Story file content
 */
const createStoryContent = (componentName, framework, code, storyId) => {
  // Clean up the code for use in a story
  const cleanedCode = cleanCodeForStory(code, framework);

  // Create framework-specific imports
  const frameworkImports = getFrameworkImports(framework);

  // Create the story template based on the framework
  switch (framework) {
    case 'shadcn':
      return `
import React from 'react';
${frameworkImports}

// Component code
${cleanedCode}

export default {
  title: 'Generated/${framework}/${componentName}',
  component: ${componentName},
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
  tags: ['autodocs', 'generated'],
  argTypes: {},
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
`;

    case 'material':
      return `
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
${frameworkImports}

// Component code
${cleanedCode}

// Create theme instances
const lightTheme = createTheme({ palette: { mode: 'light' } });
const darkTheme = createTheme({ palette: { mode: 'dark' } });

export default {
  title: 'Generated/${framework}/${componentName}',
  component: ${componentName},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs', 'generated'],
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
`;

    case 'bootstrap':
      return `
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
${frameworkImports}

// Component code
${cleanedCode}

export default {
  title: 'Generated/${framework}/${componentName}',
  component: ${componentName},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs', 'generated'],
};

export const Default = {
  args: {},
};
`;

    default:
      return `
import React from 'react';
${frameworkImports}

// Component code
${cleanedCode}

export default {
  title: 'Generated/${framework}/${componentName}',
  component: ${componentName},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs', 'generated'],
};

export const Default = {
  args: {},
};
`;
  }
};

/**
 * Clean component code for use in a Storybook story
 * @param {string} code - Component code
 * @param {string} framework - UI framework
 * @returns {string} - Cleaned code
 */
const cleanCodeForStory = (code, framework) => {
  let cleanedCode = code;

  // Remove import statements that would conflict with Storybook
  if (framework === 'shadcn') {
    cleanedCode = code.replace(/import\s+{([^}]+)}\s+from\s+["']@\/components\/ui\/[^"']+["']/g, '// shadcn imports provided by Storybook');
  } else if (framework === 'material') {
    // Keep Material UI imports as they're needed
    cleanedCode = code;
  }

  return cleanedCode;
};

/**
 * Get framework-specific imports for the story
 * @param {string} framework - UI framework
 * @returns {string} - Import statements
 */
const getFrameworkImports = (framework) => {
  switch (framework) {
    case 'shadcn':
      return `// shadcn UI components are provided globally`;
    case 'material':
      return `import { Button, TextField, Card, CardContent, Typography } from '@mui/material';`;
    case 'bootstrap':
      return `import { Button, Form, Card, Container, Row, Col } from 'react-bootstrap';`;
    default:
      return '';
  }
};
