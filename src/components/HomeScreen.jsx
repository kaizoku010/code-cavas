import React, { useState, useEffect, useRef } from 'react';
import { uiElements, getElementsByCategory } from '../data/uiElements';
import '../styles/HomeScreen.css';

const HomeScreen = ({ onNavigate }) => {
  // Default starter HTML and CSS
  const defaultHtml = `<div class="container">
  <h1>Welcome to UI Generator</h1>
  <p>Edit HTML and CSS to see real-time changes</p>
  <button class="btn">Click Me</button>
</div>`;

  const defaultCss = `body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  background-color: #f5f5f5;
}

.container {
  max-width: 600px;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  color: #4f46e5;
  margin-bottom: 1rem;
}

p {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.btn {
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn:hover {
  background-color: #4338ca;
}`;

  // State for HTML and CSS content
  const [htmlContent, setHtmlContent] = useState(defaultHtml);
  const [cssContent, setCssContent] = useState(defaultCss);
  const [previewHtml, setPreviewHtml] = useState('');
  const [activeTab, setActiveTab] = useState('html'); // 'html' or 'css'
  const [autoPreview, setAutoPreview] = useState(true); // Auto-update preview
  const [errors, setErrors] = useState([]); // Store validation errors
  const previewIframeRef = useRef(null);

  // Function to validate HTML
  const validateHtml = (html) => {
    const errors = [];

    // Check for unclosed tags (simple check)
    const openTags = html.match(/<[a-z][a-z0-9]*(?=\s|>)/gi) || [];
    const closeTags = html.match(/<\/[a-z][a-z0-9]*(?=\s|>)/gi) || [];

    if (openTags.length > closeTags.length) {
      errors.push({ type: 'html', message: 'You may have unclosed HTML tags' });
    }

    // Check for invalid nesting (simple check)
    if (html.includes('<div><p></div></p>')) {
      errors.push({ type: 'html', message: 'Invalid nesting of HTML tags' });
    }

    return errors;
  };

  // Function to validate CSS
  const validateCss = (css) => {
    const errors = [];

    // Check for unclosed braces
    const openBraces = (css.match(/\{/g) || []).length;
    const closeBraces = (css.match(/\}/g) || []).length;

    if (openBraces > closeBraces) {
      errors.push({ type: 'css', message: 'You have unclosed braces in your CSS' });
    } else if (closeBraces > openBraces) {
      errors.push({ type: 'css', message: 'You have too many closing braces in your CSS' });
    }

    // Check for missing semicolons (simple check)
    if (css.match(/[a-z-]+:[^;{}]+(?=\})/g)) {
      errors.push({ type: 'css', message: 'You may be missing semicolons in your CSS' });
    }

    return errors;
  };

  // Function to manually update the preview
  const updatePreview = () => {
    // Temporarily disable auto-preview to prevent double updates
    setAutoPreview(false);

    // Validate HTML and CSS
    const htmlErrors = validateHtml(htmlContent);
    const cssErrors = validateCss(cssContent);
    setErrors([...htmlErrors, ...cssErrors]);

    // Create error reporting script
    const errorScript = `
      <script>
        window.onerror = function(message, source, lineno, colno, error) {
          window.parent.postMessage({
            type: 'error',
            message: message,
            source: source,
            lineno: lineno,
            colno: colno
          }, '*');
          return true;
        };
      </script>
    `;

    const combinedHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Live Preview</title>
        ${errorScript}
        <style>
          ${cssContent}
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `;
    setPreviewHtml(combinedHtml);

    // Re-enable auto-preview after a short delay
    setTimeout(() => {
      setAutoPreview(true);
    }, 100);
  };

  // Listen for error messages from the iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'error') {
        setErrors(prev => [...prev, {
          type: 'runtime',
          message: `JavaScript error: ${event.data.message}`
        }]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);



  // Generate preview HTML when content changes (if auto-preview is enabled)
  useEffect(() => {
    if (autoPreview) {
      // Don't call updatePreview directly to avoid infinite loop
      // Instead, replicate its functionality

      // Validate HTML and CSS
      const htmlErrors = validateHtml(htmlContent);
      const cssErrors = validateCss(cssContent);
      setErrors([...htmlErrors, ...cssErrors]);

      // Create error reporting script
      const errorScript = `
        <script>
          window.onerror = function(message, source, lineno, colno, error) {
            window.parent.postMessage({
              type: 'error',
              message: message,
              source: source,
              lineno: lineno,
              colno: colno
            }, '*');
            return true;
          };
        </script>
      `;

      const combinedHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Live Preview</title>
          ${errorScript}
          <style>
            ${cssContent}
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>
      `;
      setPreviewHtml(combinedHtml);
    }
  }, [htmlContent, cssContent, autoPreview]);

  // Handle HTML content change
  const handleHtmlChange = (e) => {
    setHtmlContent(e.target.value);
  };

  // Handle CSS content change
  const handleCssChange = (e) => {
    setCssContent(e.target.value);
  };

  // Copy code to clipboard
  const copyToClipboard = (content, type) => {
    navigator.clipboard.writeText(content)
      .then(() => {
        alert(`${type} copied to clipboard!`);
      })
      .catch((err) => {
        console.error('Failed to copy code: ', err);
      });
  };

  // Reset to default code
  const resetCode = () => {
    if (window.confirm('Reset to default code? This will erase your current changes.')) {
      setHtmlContent(defaultHtml);
      setCssContent(defaultCss);
    }
  };

  // Get elements organized by category
  const elementsByCategory = getElementsByCategory();

  // State to track active view (editor or elements)
  const [activeView, setActiveView] = useState('editor'); // 'editor' or 'elements'

  // Handle element selection
  const handleElementSelect = (elementId) => {
    const element = uiElements.find(el => el.id === elementId);
    if (element) {
      setHtmlContent(element.html);
      setCssContent(element.css);
      // Force update preview
      updatePreview();
      // Switch back to editor view
      setActiveView('editor');
    }
  };

  return (
    <div className="home-screen">
      <header className="home-header">
        <h1>CodeCanvas</h1>
        <p>Create and preview HTML/CSS components in real-time</p>
      </header>

      <div className="menu-bar">
        <div
          className={`menu-item ${activeView === 'editor' ? 'active' : ''}`}
          onClick={() => setActiveView('editor')}
        >
          Playground
        </div>
        <div
          className={`menu-item ${activeView === 'elements' ? 'active' : ''}`}
          onClick={() => setActiveView('elements')}
        >
          Elements
        </div>
      </div>

      {activeView === 'editor' ? (
        <div className="editor-container">
          <div className="editor-panel html-panel">
            <div className="editor-header">
              <h3>HTML</h3>
              <div className="editor-actions">
                <button
                  className="action-button"
                  onClick={() => copyToClipboard(htmlContent, 'HTML')}
                >
                  Copy HTML
                </button>
              </div>
            </div>
            <div className="editor-content">
              <textarea
                className="code-editor html-editor"
                value={htmlContent}
                onChange={handleHtmlChange}
                placeholder="Enter HTML here..."
                spellCheck="false"
                style={{
                  color: '#ff79c6', /* HTML tag color - pink */
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>

          <div className="editor-panel css-panel">
            <div className="editor-header">
              <h3>CSS</h3>
              <div className="editor-actions">
                <button
                  className="action-button"
                  onClick={() => copyToClipboard(cssContent, 'CSS')}
                >
                  Copy CSS
                </button>
              </div>
            </div>
            <div className="editor-content">
              <textarea
                className="code-editor css-editor"
                value={cssContent}
                onChange={handleCssChange}
                placeholder="Enter CSS here..."
                spellCheck="false"
                style={{
                  color: '#50fa7b', /* CSS property color - green */
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>

          <div className="preview-panel">
            <div className="preview-header">
              <h3>Live Preview</h3>
              <div className="editor-actions">
                <button
                  className="action-button run-button"
                  onClick={updatePreview}
                  title="Run Code"
                >
                  Run
                </button>
                <button
                  className="action-button reset-button-small"
                  onClick={resetCode}
                  title="Reset Code"
                >
                  Reset
                </button>
              </div>
            </div>
            <div className="preview-content">
              <iframe
                ref={previewIframeRef}
                className="preview-iframe"
                srcDoc={previewHtml}
                title="Live Preview"
                sandbox="allow-scripts"
              />
              {errors.length > 0 && (
                <div className="error-container">
                  <div className="error-header">
                    <h4>Errors:</h4>
                    <button
                      className="clear-errors-btn"
                      onClick={() => setErrors([])}
                      title="Clear errors"
                    >
                      Clear
                    </button>
                  </div>
                  <ul className="error-list">
                    {errors.map((error, index) => (
                      <li key={index} className={`error-item error-${error.type}`}>
                        {error.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Floating actions hidden as requested */}
          <div className="floating-actions" style={{ display: 'none' }}>
            <button
              className="floating-button reset-button"
              onClick={resetCode}
              title="Reset Code"
            >
              Reset
            </button>
          </div>
        </div>
      ) : (
        <div className="elements-gallery">
          {Object.keys(elementsByCategory).map(category => (
            <div key={category} className="element-category">
              <h2 className="category-heading">{category}</h2>
              <div className="element-grid">
                {elementsByCategory[category].map(element => (
                  <div
                    key={element.id}
                    className="element-card"
                    onClick={() => handleElementSelect(element.id)}
                  >
                    <div className="element-preview">
                      <iframe
                        srcDoc={`
                          <!DOCTYPE html>
                          <html lang="en">
                          <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <style>${element.css}</style>
                          </head>
                          <body style="display: flex; justify-content: center; align-items: center; height: 100%; margin: 0; padding: 16px; box-sizing: border-box;">
                            ${element.html}
                          </body>
                          </html>
                        `}
                        title={element.name}
                        sandbox="allow-scripts"
                      />
                    </div>
                    <div className="element-info">
                      <h3 className="element-name">{element.name}</h3>
                      <button className="use-element-btn">Use Element</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}


    </div>
  );
};

export default HomeScreen;
