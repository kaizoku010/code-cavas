import React, { useState, useEffect, useRef } from 'react';
import '../styles/Preview.css';
import { createPreviewDocument } from '../utils/previewRenderer';
import StorybookManager from './StorybookManager';

const Preview = ({ parsedCode }) => {
  const [previewHtml, setPreviewHtml] = useState('');
  const [showFallback, setShowFallback] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);

  // If no code is provided, show empty state
  if (!parsedCode || !parsedCode.code) {
    return (
      <div className="preview-container empty-preview">
        <h3>Preview</h3>
        <p>Generate a UI component to see the preview here.</p>
      </div>
    );
  }

  // Generate the preview HTML when parsedCode changes
  useEffect(() => {
    try {
      console.log('Generating preview for:', parsedCode.framework);

      // Create the preview HTML document
      const html = createPreviewDocument(parsedCode);
      console.log('Preview HTML generated, length:', html.length);

      setPreviewHtml(html);
      setShowFallback(false);
      setError(null);
      setIframeLoaded(false);
    } catch (error) {
      console.error('Error creating preview:', error);
      setError(error.message || 'Failed to create preview');
      setShowFallback(true);
    }
  }, [parsedCode]);

  // Handle iframe load event
  const handleIframeLoad = () => {
    console.log('Iframe loaded');
    setIframeLoaded(true);

    // Try to access iframe content to check for errors
    try {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentWindow) {
        console.log('Iframe content window available');

        // Add a message listener to receive errors from the iframe
        window.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'preview-error') {
            console.error('Error from iframe:', event.data.message);
            setError(event.data.message);
            setShowFallback(true);
          }
        });

        // Check if the iframe content is empty or has errors
        setTimeout(() => {
          try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            if (iframeDoc.body.innerHTML.trim() === '') {
              console.error('Iframe content is empty');
              setError('Preview content is empty');
              setShowFallback(true);
            }
          } catch (err) {
            console.error('Error checking iframe content:', err);
          }
        }, 1000);
      }
    } catch (err) {
      console.error('Error accessing iframe content:', err);
      setError('Cannot access preview content: ' + err.message);
      setShowFallback(true);
    }
  };

  // Handle iframe error
  const handleIframeError = (e) => {
    console.error('Iframe error:', e);
    setError('Failed to load preview');
    setShowFallback(true);
  };

  // Create a simple visual representation based on the framework (fallback)
  const getFallbackPreview = () => {
    const { framework } = parsedCode;

    // Common styles
    const containerStyle = {
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      maxWidth: '100%',
      margin: '0 auto',
      textAlign: 'center'
    };

    // Framework-specific colors
    const colors = {
      shadcn: '#4f46e5',
      material: '#1976d2',
      bootstrap: '#7952b3',
      android: '#3ddc84',
      html: '#e34c26'
    };

    const color = colors[framework] || '#4f46e5';

    // Framework-specific names
    const names = {
      shadcn: 'shadcn UI',
      material: 'Material UI',
      bootstrap: 'Bootstrap',
      android: 'Android XML',
      html: 'HTML/CSS/JS'
    };

    const name = names[framework] || framework;

    // Check if the code contains specific UI elements
    const hasLoginForm = /login|sign in|signin|authentication|credentials/i.test(parsedCode.code);
    const hasButton = /button|btn/i.test(parsedCode.code);
    const hasCard = /card/i.test(parsedCode.code);
    const hasForm = /form|input|textfield/i.test(parsedCode.code);

    // Determine what kind of component to show
    let componentType = 'Component';
    if (hasLoginForm) componentType = 'Login Form';
    else if (hasForm) componentType = 'Form';
    else if (hasCard) componentType = 'Card';

    return (
      <div style={containerStyle}>
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ color, marginBottom: '10px' }}>{name} {componentType} Preview</h4>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
            This is a visual representation of your component
          </p>
        </div>

        {/* Simple visual representation */}
        <div style={{
          border: `2px dashed ${color}`,
          borderRadius: '8px',
          padding: '30px',
          marginBottom: '20px',
          backgroundColor: '#f9fafb'
        }}>
          {hasLoginForm && (
            <div>
              <div style={{ marginBottom: '15px', textAlign: 'left' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Email</label>
                <div style={{
                  height: '36px',
                  backgroundColor: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px'
                }}></div>
              </div>
              <div style={{ marginBottom: '15px', textAlign: 'left' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Password</label>
                <div style={{
                  height: '36px',
                  backgroundColor: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px'
                }}></div>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '20px'
              }}>
                <div style={{
                  backgroundColor: color,
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  display: 'inline-block',
                  fontWeight: '500'
                }}>
                  Login
                </div>
              </div>
            </div>
          )}

          {!hasLoginForm && hasCard && (
            <div>
              <div style={{
                height: '24px',
                width: '70%',
                backgroundColor: '#e5e7eb',
                borderRadius: '4px',
                marginBottom: '10px'
              }}></div>
              <div style={{
                height: '16px',
                width: '90%',
                backgroundColor: '#e5e7eb',
                borderRadius: '4px',
                marginBottom: '20px'
              }}></div>
              <div style={{
                height: '16px',
                width: '80%',
                backgroundColor: '#e5e7eb',
                borderRadius: '4px',
                marginBottom: '10px'
              }}></div>
              <div style={{
                height: '16px',
                width: '60%',
                backgroundColor: '#e5e7eb',
                borderRadius: '4px',
                marginBottom: '20px'
              }}></div>
              {hasButton && (
                <div style={{
                  backgroundColor: color,
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  display: 'inline-block',
                  fontWeight: '500'
                }}>
                  Button
                </div>
              )}
            </div>
          )}

          {!hasLoginForm && !hasCard && (
            <div>
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="100" rx="8" fill="#F3F4F6"/>
                <path d="M35 40H65M35 50H65M35 60H55" stroke={color} strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p style={{ color: '#6b7280', marginTop: '10px' }}>Component Visualization</p>
            </div>
          )}
        </div>

        <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>
          For a fully functional preview, you would need to render this component in a proper {name} environment.
        </p>
      </div>
    );
  };

  return (
    <div className="preview-container">
      <h3>Preview</h3>
      <div className="preview-frame-container">
        {showFallback ? (
          <>
            {error && (
              <div className="preview-error-message">
                <p>Error: {error}</p>
              </div>
            )}
            {getFallbackPreview()}
          </>
        ) : (
          <>
            {!iframeLoaded && <div className="preview-loading">Loading preview...</div>}
            <iframe
              ref={iframeRef}
              className="preview-iframe"
              srcDoc={previewHtml}
              title="Component Preview"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              style={{ opacity: iframeLoaded ? 1 : 0 }}
            />
          </>
        )}
      </div>
      <div className="preview-note">
        <p>
          Note: This preview renders the component in a sandboxed environment. To use this component in your project, copy the code and integrate it with your {parsedCode.framework} environment.
        </p>
        {parsedCode.framework === 'shadcn' && (
          <p className="preview-tip">
            <strong>Tip:</strong> This preview uses a simplified shadcn UI environment. For full functionality, make sure you have the proper shadcn UI setup in your project.
          </p>
        )}
      </div>

      {/* Storybook integration */}
      <StorybookManager
        parsedCode={parsedCode}
        onStoryGenerated={(story) => {
          console.log('Story generated:', story);
          // In a real implementation, this would save the story to a file
        }}
      />
    </div>
  );
};

export default Preview;
