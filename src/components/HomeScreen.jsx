import React, { useState, useEffect, useRef } from 'react';
import { uiElements, getElementsByCategory } from '../data/uiElements';
import '../styles/HomeScreen.css';

const HomeScreen = () => {
  // Default starter HTML and CSS
  const defaultHtml = `<div class="container">
  <div class="hero">
    <div class="logo">
      <div class="logo-icon">CC</div>
    </div>
    <h1>Welcome to <span class="highlight">CodeCanvas</span></h1>
    <p class="tagline">Your playground for creating beautiful UI components</p>

    <div class="features">
      <div class="feature">
        <div class="feature-icon">🎨</div>
        <h3>Design</h3>
        <p>Create stunning designs with HTML & CSS</p>
      </div>
      <div class="feature">
        <div class="feature-icon">⚡</div>
        <h3>Preview</h3>
        <p>See changes in real-time as you code</p>
      </div>
      <div class="feature">
        <div class="feature-icon">📱</div>
        <h3>Responsive</h3>
        <p>Build components that work everywhere</p>
      </div>
    </div>

    <div class="cta">
      <button class="btn primary" id="getStartedBtn">Get Started</button>
      <button class="btn secondary" id="browseElementsBtn">Browse Elements</button>
    </div>
  </div>
</div>`;

  const defaultCss = `body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  background-color: #09090b;
  color: #fafafa;
}

.container {
  max-width: 900px;
  width: 100%;
  padding: 2rem;
  background-color: #18181b;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  text-align: center;
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.logo {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.logo-icon {
  width: 80px;
  height: 80px;
  background-color: #8b5cf6;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: white;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.5);
  transition: transform 0.3s, box-shadow 0.3s;
}

.logo-icon:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.6);
}

h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: #fafafa;
  letter-spacing: -0.5px;
}

.highlight {
  color: #8b5cf6;
  position: relative;
}

.highlight::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 6px;
  background-color: rgba(139, 92, 246, 0.3);
  border-radius: 3px;
  z-index: -1;
}

.tagline {
  font-size: 1.25rem;
  color: #a1a1aa;
  margin-bottom: 3rem;
}

.features {
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.feature {
  flex: 1;
  padding: 1.5rem;
  background-color: #27272a;
  border-radius: 8px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.feature-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.feature h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #fafafa;
}

.feature p {
  font-size: 0.9rem;
  color: #a1a1aa;
  line-height: 1.5;
}

.cta {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn.primary {
  background-color: #8b5cf6;
  color: white;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.4);
}

.btn.primary:hover {
  background-color: #7c3aed;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.5);
}

.btn.secondary {
  background-color: transparent;
  color: #8b5cf6;
  border: 2px solid #8b5cf6;
}

.btn.secondary:hover {
  background-color: rgba(139, 92, 246, 0.1);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .features {
    flex-direction: column;
  }

  .container {
    padding: 1.5rem;
  }

  h1 {
    font-size: 2rem;
  }
}`;

  // State for HTML and CSS content
  const [htmlContent, setHtmlContent] = useState(defaultHtml);
  const [cssContent, setCssContent] = useState(defaultCss);
  const [previewHtml, setPreviewHtml] = useState('');
  const [autoPreview, setAutoPreview] = useState(true); // Auto-update preview
  const [errors, setErrors] = useState([]); // Store validation errors
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const previewIframeRef = useRef(null);

  // Initialize preview on component mount
  useEffect(() => {
    console.log("Component mounted, initializing preview...");
    // Force an initial preview update
    updatePreview();

    // Add window resize listener for responsive design
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    console.log("Updating preview...");
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
      console.log("Auto-preview updating...");
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

  // State variables for UI
  const [activeView, setActiveView] = useState('editor'); // 'editor' or 'elements'
  const [activeCategory, setActiveCategory] = useState(''); // Current category in elements view
  const [selectedElement, setSelectedElement] = useState(null); // Currently selected element for code display
  const [activeCodeTab, setActiveCodeTab] = useState('html'); // 'html' or 'css' for code display tabs

  // Set initial active category when elements are loaded
  useEffect(() => {
    if (Object.keys(elementsByCategory).length > 0 && !activeCategory) {
      setActiveCategory(Object.keys(elementsByCategory)[0]);
    }
  }, [elementsByCategory, activeCategory]);

  // Handle element selection for use in playground
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

  // Handle element showcase (expand/collapse code display)
  const handleElementShowcase = (elementId) => {
    if (selectedElement === elementId) {
      // If already selected, deselect it (collapse)
      setSelectedElement(null);
    } else {
      // Otherwise, select it (expand)
      setSelectedElement(elementId);
      // Default to HTML tab when expanding
      setActiveCodeTab('html');
    }
  };



  return (
    <div className="home-screen">
      <header className="home-header">
        <h1>CodeCanvas</h1>
        <p>Design, build, and preview stunning UI components with HTML & CSS</p>
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
          {/* Show welcome screen or editor based on a flag */}
          {htmlContent === defaultHtml && cssContent === defaultCss ? (
            <div className="welcome-screen" style={{
              gridColumn: '1 / -1',
              background: '#18181b',
              borderRadius: '12px',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: '#fafafa',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              animation: 'fadeIn 0.8s ease-out'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#8b5cf6',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 700,
                color: 'white',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.5)',
                marginBottom: '1.5rem'
              }}>CC</div>

              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 800,
                marginBottom: '1rem',
                color: '#fafafa',
                letterSpacing: '-0.5px'
              }}>Welcome to <span style={{color: '#8b5cf6'}}>CodeCanvas</span></h1>

              <p style={{
                fontSize: '1.25rem',
                color: '#a1a1aa',
                marginBottom: '3rem'
              }}>Your playground for creating beautiful UI components</p>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '1.5rem',
                marginBottom: '3rem',
                width: '100%',
                maxWidth: '900px',
                flexDirection: isMobile ? 'column' : 'row'
              }}>
                <div style={{
                  flex: 1,
                  padding: '1.5rem',
                  backgroundColor: '#27272a',
                  borderRadius: '8px',
                  transition: 'transform 0.3s, box-shadow 0.3s'
                }}>
                  <div style={{fontSize: '2rem', marginBottom: '1rem'}}>🎨</div>
                  <h3 style={{fontSize: '1.25rem', marginBottom: '0.5rem', color: '#fafafa'}}>Design</h3>
                  <p style={{fontSize: '0.9rem', color: '#a1a1aa', lineHeight: 1.5}}>Create stunning designs with HTML & CSS</p>
                </div>

                <div style={{
                  flex: 1,
                  padding: '1.5rem',
                  backgroundColor: '#27272a',
                  borderRadius: '8px',
                  transition: 'transform 0.3s, box-shadow 0.3s'
                }}>
                  <div style={{fontSize: '2rem', marginBottom: '1rem'}}>⚡</div>
                  <h3 style={{fontSize: '1.25rem', marginBottom: '0.5rem', color: '#fafafa'}}>Preview</h3>
                  <p style={{fontSize: '0.9rem', color: '#a1a1aa', lineHeight: 1.5}}>See changes in real-time as you code</p>
                </div>

                <div style={{
                  flex: 1,
                  padding: '1.5rem',
                  backgroundColor: '#27272a',
                  borderRadius: '8px',
                  transition: 'transform 0.3s, box-shadow 0.3s'
                }}>
                  <div style={{fontSize: '2rem', marginBottom: '1rem'}}>📱</div>
                  <h3 style={{fontSize: '1.25rem', marginBottom: '0.5rem', color: '#fafafa'}}>Responsive</h3>
                  <p style={{fontSize: '0.9rem', color: '#a1a1aa', lineHeight: 1.5}}>Build components that work everywhere</p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1rem',
                marginTop: '2rem',
                flexDirection: isMobile ? 'column' : 'row',
                width: isMobile ? '100%' : 'auto'
              }}>
                <button
                  style={{
                    backgroundColor: '#8b5cf6',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(139, 92, 246, 0.4)',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => {
                    // Keep the user in the editor view but clear the content for a fresh start
                    setHtmlContent('<div class="my-component">\n  <!-- Start coding here -->\n  <h1>My Component</h1>\n</div>');
                    setCssContent('.my-component {\n  /* Add your styles here */\n  padding: 2rem;\n  background-color: #f3f4f6;\n  border-radius: 8px;\n}');
                    updatePreview();
                  }}
                >
                  Get Started
                </button>

                <button
                  style={{
                    backgroundColor: 'transparent',
                    color: '#8b5cf6',
                    border: '2px solid #8b5cf6',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => {
                    // Switch to elements view
                    setActiveView('elements');
                  }}
                >
                  Browse Elements
                </button>
              </div>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      ) : (
        <div className="elements-gallery">
          {/* Add category tabs at the top */}
          <div className="category-tabs">
            {Object.keys(elementsByCategory).map(category => (
              <button
                key={category}
                className={`category-tab ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Display elements for the active category */}
          <div className="elements-container">
            {activeCategory && elementsByCategory[activeCategory] && elementsByCategory[activeCategory].map(element => (
              <div
                key={element.id}
                className={`element-showcase ${selectedElement === element.id ? 'expanded' : ''}`}
              >
                <div
                  className="element-header"
                  onClick={() => handleElementShowcase(element.id)}
                >
                  <h3 className="element-name">{element.name}</h3>
                  <div className="element-actions">
                    <button
                      className="element-action-btn view-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleElementShowcase(element.id);
                      }}
                    >
                      {selectedElement === element.id ? 'Hide Code' : 'View Code'}
                    </button>
                  </div>
                </div>

                <div className="element-content">
                  <div className="element-preview-container">
                    <iframe
                      srcDoc={`
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                          <meta charset="UTF-8">
                          <meta name="viewport" content="width=device-width, initial-scale=1.0">
                          <style>
                            body {
                              display: flex;
                              justify-content: center;
                              align-items: center;
                              height: 100%;
                              margin: 0;
                              padding: 16px;
                              box-sizing: border-box;
                              background-color: #09090b;
                              color: #fafafa;
                              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                            }
                            ${element.css}
                          </style>
                        </head>
                        <body>
                          ${element.html}
                        </body>
                        </html>
                      `}
                      title={element.name}
                      className="element-iframe"
                      sandbox="allow-scripts"
                    />
                  </div>

                  {/* Code display section - only visible when element is selected */}
                  {selectedElement === element.id && (
                    <div className="element-code-display">
                      <div className="code-tabs">
                        <button
                          className={`code-tab ${activeCodeTab === 'html' ? 'active' : ''}`}
                          onClick={() => setActiveCodeTab('html')}
                        >
                          HTML
                        </button>
                        <button
                          className={`code-tab ${activeCodeTab === 'css' ? 'active' : ''}`}
                          onClick={() => setActiveCodeTab('css')}
                        >
                          CSS
                        </button>
                      </div>

                      <div className="code-content">
                        {activeCodeTab === 'html' ? (
                          <div className="code-block html-code">
                            <div className="code-header">
                              <span>HTML</span>
                              <button
                                className="copy-code-btn"
                                onClick={() => copyToClipboard(element.html, 'HTML')}
                              >
                                Copy HTML
                              </button>
                            </div>
                            <pre className="code-display">{element.html}</pre>
                          </div>
                        ) : (
                          <div className="code-block css-code">
                            <div className="code-header">
                              <span>CSS</span>
                              <button
                                className="copy-code-btn"
                                onClick={() => copyToClipboard(element.css, 'CSS')}
                              >
                                Copy CSS
                              </button>
                            </div>
                            <pre className="code-display">{element.css}</pre>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


    </div>
  );
};

export default HomeScreen;