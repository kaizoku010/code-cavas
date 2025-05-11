/**
 * Parse and sanitize the generated code
 * @param {string} code - Generated code from the API
 * @param {string} framework - Selected UI framework
 * @returns {Object} - Parsed code with metadata
 */
export const parseCode = (code, framework) => {
  console.log('Parsing code for framework:', framework);

  if (!code) {
    console.error('No code provided to parser');
    return {
      code: '',
      language: 'text',
      framework,
      error: 'No code generated'
    };
  }

  // Remove any markdown code block syntax if present
  let cleanedCode = code.replace(/```[\w]*\n|```/g, '');

  // Log the first few characters of the code for debugging
  console.log('Code preview:', cleanedCode.substring(0, 100) + '...');

  // Determine the language based on the framework
  const language = getLanguageFromFramework(framework);

  // For HTML frameworks, extract HTML, CSS, and JS parts
  if (framework === 'html' || framework === 'bootstrap') {
    const { html, css, js } = extractHtmlParts(cleanedCode);
    return {
      code: cleanedCode,
      language,
      html,
      css,
      js,
      framework
    };
  }

  return {
    code: cleanedCode,
    language,
    framework
  };
};

/**
 * Get the language for syntax highlighting based on the framework
 * @param {string} framework - Selected UI framework
 * @returns {string} - Language for syntax highlighting
 */
const getLanguageFromFramework = (framework) => {
  const languageMap = {
    shadcn: 'jsx',
    bootstrap: 'html',
    material: 'jsx',
    android: 'xml',
    html: 'html'
  };

  return languageMap[framework] || 'javascript';
};

/**
 * Extract HTML, CSS, and JS parts from HTML code
 * @param {string} code - HTML code
 * @returns {Object} - Extracted HTML, CSS, and JS parts
 */
const extractHtmlParts = (code) => {
  let html = code;
  let css = '';
  let js = '';

  // Extract CSS
  const cssMatch = code.match(/<style[^>]*>([\s\S]*?)<\/style>/);
  if (cssMatch && cssMatch[1]) {
    css = cssMatch[1].trim();
  }

  // Extract JS
  const jsMatch = code.match(/<script[^>]*>([\s\S]*?)<\/script>/);
  if (jsMatch && jsMatch[1]) {
    js = jsMatch[1].trim();
  }

  return { html, css, js };
};

/**
 * Generate file name based on the framework
 * @param {string} framework - Selected UI framework
 * @returns {string} - Generated file name
 */
export const generateFileName = (framework) => {
  const fileExtensions = {
    shadcn: 'jsx',
    bootstrap: 'html',
    material: 'jsx',
    android: 'xml',
    html: 'html'
  };

  const extension = fileExtensions[framework] || 'txt';
  const timestamp = new Date().getTime();

  return `ui-component-${framework}-${timestamp}.${extension}`;
};

/**
 * Sanitize code for safe execution in preview
 * @param {string} code - Code to sanitize
 * @returns {string} - Sanitized code
 */
export const sanitizeForPreview = (code) => {
  // Remove potentially harmful scripts
  let sanitized = code.replace(/<script[^>]*src=[^>]*>/g, '');

  // Add sandbox attributes to iframes
  sanitized = sanitized.replace(
    /<iframe/g,
    '<iframe sandbox="allow-scripts allow-same-origin" referrerpolicy="no-referrer"'
  );

  return sanitized;
};

/**
 * Extract component name from React component code
 * @param {string} code - React component code
 * @returns {string|null} - Extracted component name or null if not found
 */
export const extractComponentName = (code) => {
  if (!code) return null;

  // Try to match function component declaration
  const functionMatch = code.match(/function\s+([A-Z][A-Za-z0-9_]*)\s*\(/);
  if (functionMatch && functionMatch[1]) {
    return functionMatch[1];
  }

  // Try to match arrow function component declaration
  const arrowMatch = code.match(/const\s+([A-Z][A-Za-z0-9_]*)\s*=\s*\(.*\)\s*=>/);
  if (arrowMatch && arrowMatch[1]) {
    return arrowMatch[1];
  }

  // Try to match class component declaration
  const classMatch = code.match(/class\s+([A-Z][A-Za-z0-9_]*)\s+extends\s+React\.Component/);
  if (classMatch && classMatch[1]) {
    return classMatch[1];
  }

  return null;
};
