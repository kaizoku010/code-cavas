import { sanitizeForPreview } from './codeParser';
import { createReactSandbox } from './reactSandbox';
import { createShadcnPreviewTemplate } from '../preview-env/shadcn-template';

/**
 * Create a safe HTML document for preview
 * @param {Object} parsedCode - Parsed code object from codeParser
 * @returns {string} - HTML document for preview
 */
export const createPreviewDocument = (parsedCode) => {
  const { framework, code, html, css, js } = parsedCode;

  console.log('Creating preview for framework:', framework);
  console.log('Code length:', code ? code.length : 0);

  // Add debugging info
  if (!code || code.trim() === '') {
    console.error('Empty code provided to preview renderer');
    return createErrorPreview('No code to preview');
  }

  // For HTML and Bootstrap, we can use the code directly with some sanitization
  if (framework === 'html' || framework === 'bootstrap') {
    // Make sure external resources load over HTTPS
    const secureCode = code.replace(/http:/g, 'https:');
    return sanitizeForPreview(secureCode);
  }

  // For shadcn UI components, use our dedicated shadcn UI template
  if (framework === 'shadcn') {
    try {
      console.log('Using shadcn UI preview template');
      return createShadcnPreviewTemplate(code);
    } catch (error) {
      console.error('Error creating shadcn UI preview:', error);
      return createErrorPreview(`Error creating shadcn UI preview: ${error.message}`);
    }
  }

  // For Material UI components, use our React sandbox
  if (framework === 'material') {
    try {
      console.log('Using React sandbox for Material UI');
      return createReactSandbox(code, framework);
    } catch (error) {
      console.error('Error creating React sandbox:', error);
      return createErrorPreview(`Error creating React preview: ${error.message}`);
    }
  }

  // For Android XML, create a simple HTML document with a placeholder
  if (framework === 'android') {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Android XML Preview</title>
        <style>
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f5f5f5;
          }
          .preview-container {
            max-width: 90%;
            width: 600px;
            padding: 0;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .preview-header {
            background-color: #3DDC84;
            color: white;
            padding: 16px;
            font-weight: 500;
          }
          .preview-content {
            padding: 20px;
          }
          .android-frame {
            width: 280px;
            height: 500px;
            border: 12px solid #222;
            border-radius: 24px;
            position: relative;
            overflow: hidden;
            margin: 20px auto;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
          }
          .android-screen {
            width: 100%;
            height: 100%;
            background-color: white;
            overflow: auto;
            padding: 16px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          .android-status-bar {
            height: 24px;
            width: 100%;
            background-color: #f8f9fa;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding: 0 8px;
          }
          .android-status-bar-icon {
            width: 16px;
            height: 16px;
            margin-left: 8px;
            background-color: #aaa;
            border-radius: 50%;
          }
          pre {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 4px;
            overflow-x: auto;
            font-size: 12px;
            max-height: 200px;
          }
        </style>
      </head>
      <body>
        <div class="preview-container">
          <div class="preview-header">
            Android XML Preview
          </div>
          <div class="preview-content">
            <p>This is an Android XML layout that requires an Android environment to render properly.</p>
            <div class="android-frame">
              <div class="android-status-bar">
                <div class="android-status-bar-icon"></div>
                <div class="android-status-bar-icon"></div>
                <div class="android-status-bar-icon"></div>
              </div>
              <div class="android-screen">
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100" height="100" rx="8" fill="#F3F4F6"/>
                  <path d="M35 40H65M35 50H65M35 60H55" stroke="#3DDC84" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <p style="color: #6b7280; margin-top: 10px;">Android UI Component</p>
              </div>
            </div>
            <details>
              <summary>View XML Code</summary>
              <pre>${code ? code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;') : ''}</pre>
            </details>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Default fallback
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Code Preview</title>
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          background-color: #f5f5f5;
        }
        .preview-container {
          max-width: 90%;
          width: 600px;
          padding: 0;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .preview-header {
          background-color: #4f46e5;
          color: white;
          padding: 16px;
          font-weight: 500;
        }
        .preview-content {
          padding: 20px;
        }
        pre {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 4px;
          overflow-x: auto;
          font-size: 12px;
          max-height: 300px;
        }
      </style>
    </head>
    <body>
      <div class="preview-container">
        <div class="preview-header">
          Code Preview
        </div>
        <div class="preview-content">
          <p>Here's the generated code:</p>
          <pre>${code ? code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;') : ''}</pre>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Create an error preview
 * @param {string} errorMessage - Error message to display
 * @returns {string} - HTML document with error message
 */
const createErrorPreview = (errorMessage) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Preview Error</title>
      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          background-color: #f5f5f5;
        }
        .error-container {
          max-width: 90%;
          width: 600px;
          padding: 0;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .error-header {
          background-color: #ef4444;
          color: white;
          padding: 16px;
          font-weight: 500;
        }
        .error-content {
          padding: 20px;
        }
      </style>
    </head>
    <body>
      <div class="error-container">
        <div class="error-header">
          Preview Error
        </div>
        <div class="error-content">
          <p>${errorMessage}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Escape HTML special characters
 * @param {string} html - HTML string to escape
 * @returns {string} - Escaped HTML string
 */
const escapeHtml = (html) => {
  if (!html) return '';
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};
