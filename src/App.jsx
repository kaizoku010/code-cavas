import { useState } from 'react';
import PromptForm from './components/PromptForm';
import CodeDisplay from './components/CodeDisplay';
import Preview from './components/Preview';
import HomeScreen from './components/HomeScreen';
import { generateUICode } from './services/deepseekService';
import { parseCode, generateFileName } from './utils/codeParser';
import { saveAs } from 'file-saver';
import './App.css';

// Generator component that uses AI to generate UI components
const Generator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [parsedCode, setParsedCode] = useState(null);
  const [generationInfo, setGenerationInfo] = useState(null);
  const [usedMockData, setUsedMockData] = useState(false);

  const handleGenerate = async (prompt, framework) => {
    setIsLoading(true);
    setParsedCode(null); // Clear any previous code
    setGenerationInfo(null);
    setUsedMockData(false);

    try {
      console.log(`Generating UI code for framework: ${framework}`);
      console.log(`Prompt: ${prompt.substring(0, 50)}...`);

      // Start timer to measure response time
      const startTime = Date.now();

      // Call the DeepSeek API to generate code
      const { code: generatedCode, usedMock } = await generateUICode(prompt, framework);

      // Calculate response time
      const responseTime = ((Date.now() - startTime) / 1000).toFixed(2);

      if (!generatedCode) {
        throw new Error('No code was generated');
      }

      // Set whether mock data was used
      setUsedMockData(usedMock);

      // Set generation info
      setGenerationInfo({
        framework,
        prompt,
        responseTime,
        timestamp: new Date().toLocaleTimeString(),
        source: usedMock ? 'Mock Data (API Error)' : 'DeepSeek AI API'
      });

      // Parse the generated code
      const parsed = parseCode(generatedCode, framework);
      console.log('Parsed code:', parsed);

      setParsedCode(parsed);
    } catch (error) {
      console.error('Error generating UI component:', error);
      alert(`Failed to generate UI component: ${error.message || 'Unknown error'}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!parsedCode || !parsedCode.code) {
      return;
    }

    const { code, framework } = parsedCode;
    const fileName = generateFileName(framework);

    // Create a Blob with the code
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });

    // Save the file using file-saver
    saveAs(blob, fileName);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>UI Component Generator</h1>
        <p>Generate beautiful UI components using AI</p>
      </header>

      <main className="app-main">
        <div className="app-container">
          <div className="left-panel">
            <PromptForm onGenerate={handleGenerate} isLoading={isLoading} />
          </div>

          <div className="right-panel">
            {parsedCode && (
              <>
                {generationInfo && (
                  <div className="generation-info">
                    <h3>Generation Details</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">Framework:</span>
                        <span className="info-value">{generationInfo.framework}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Response Time:</span>
                        <span className="info-value">{generationInfo.responseTime} seconds</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Generated At:</span>
                        <span className="info-value">{generationInfo.timestamp}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Source:</span>
                        <span className={`info-value ${usedMockData ? 'mock-data' : 'api-data'}`}>
                          {generationInfo.source}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <CodeDisplay parsedCode={parsedCode} onDownload={handleDownload} />
                <Preview parsedCode={parsedCode} />
              </>
            )}

            {!parsedCode && (
              <div className="empty-state">
                <h2>Enter a prompt to generate UI components</h2>
                <p>
                  Describe the UI component you want to create, select a framework,
                  and click "Generate" to see the magic happen!
                </p>
                <p>
                  Example prompts:
                </p>
                <ul>
                  <li>Create a login form with email and password fields</li>
                  <li>Design a product card with image, title, price, and add to cart button</li>
                  <li>Build a navigation bar with logo, links, and a search box</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Powered by DeepSeek AI | UI Component Generator
        </p>
      </footer>
    </div>
  );
};

// Main App component with simple state-based navigation
function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home' or 'generator'

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="app-container">
      {currentPage === 'home' ? (
        <HomeScreen />
      ) : (
        <Generator />
      )}

      <div className="floating-nav">
        <button
          className={`floating-nav-button ${currentPage === 'home' ? 'active' : ''}`}
          onClick={() => navigateTo('home')}
          title="HTML/CSS Playground"
        >
          <span className="button-icon">🏠</span>
        </button>
        <button
          className={`floating-nav-button ${currentPage === 'generator' ? 'active' : ''}`}
          onClick={() => navigateTo('generator')}
          title="AI Generator"
        >
          <span className="button-icon">🤖</span>
        </button>
      </div>
    </div>
  );
}

export default App;
