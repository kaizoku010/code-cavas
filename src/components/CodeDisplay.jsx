import React from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import html from 'react-syntax-highlighter/dist/esm/languages/hljs/xml';
import javascript from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import css from 'react-syntax-highlighter/dist/esm/languages/hljs/css';
import '../styles/CodeDisplay.css';

// Register languages for syntax highlighting
SyntaxHighlighter.registerLanguage('html', html);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('jsx', javascript);
SyntaxHighlighter.registerLanguage('xml', html);

const CodeDisplay = ({ parsedCode, onDownload }) => {
  const { code, language, framework, html: htmlCode, css: cssCode, js: jsCode } = parsedCode;

  const copyToClipboard = (textToCopy) => {
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        alert('Code copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy code: ', err);
      });
  };

  // For HTML/Bootstrap, we might want to show separate tabs for HTML, CSS, and JS
  const hasMultipleParts = framework === 'html' || framework === 'bootstrap';

  return (
    <div className="code-display-container">
      <div className="code-header">
        <h3>Generated Code</h3>
        <div className="code-actions">
          <button 
            className="action-button copy-button"
            onClick={() => copyToClipboard(code)}
          >
            Copy Code
          </button>
          <button 
            className="action-button download-button"
            onClick={onDownload}
          >
            Download
          </button>
        </div>
      </div>

      {hasMultipleParts ? (
        <div className="code-tabs">
          <div className="tab-container">
            <div className="tab-header">
              <h4>HTML</h4>
              <button 
                className="small-action-button"
                onClick={() => copyToClipboard(htmlCode)}
              >
                Copy
              </button>
            </div>
            <SyntaxHighlighter language="html" style={docco} showLineNumbers>
              {htmlCode}
            </SyntaxHighlighter>
          </div>

          {cssCode && (
            <div className="tab-container">
              <div className="tab-header">
                <h4>CSS</h4>
                <button 
                  className="small-action-button"
                  onClick={() => copyToClipboard(cssCode)}
                >
                  Copy
                </button>
              </div>
              <SyntaxHighlighter language="css" style={docco} showLineNumbers>
                {cssCode}
              </SyntaxHighlighter>
            </div>
          )}

          {jsCode && (
            <div className="tab-container">
              <div className="tab-header">
                <h4>JavaScript</h4>
                <button 
                  className="small-action-button"
                  onClick={() => copyToClipboard(jsCode)}
                >
                  Copy
                </button>
              </div>
              <SyntaxHighlighter language="javascript" style={docco} showLineNumbers>
                {jsCode}
              </SyntaxHighlighter>
            </div>
          )}
        </div>
      ) : (
        <SyntaxHighlighter language={language} style={docco} showLineNumbers>
          {code}
        </SyntaxHighlighter>
      )}
    </div>
  );
};

export default CodeDisplay;
