import React, { useState, useEffect } from 'react';
import { generateStory } from '../utils/storyGenerator';
import { saveStoryFile, getStorybookUrl, isStorybookRunning } from '../utils/fileSystem';
import '../styles/StorybookManager.css';

/**
 * Component for managing Storybook integration
 * Handles generating stories from AI-generated components
 */
const StorybookManager = ({ parsedCode, onStoryGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [storyInfo, setStoryInfo] = useState(null);
  const [error, setError] = useState(null);
  const [storybookAvailable, setStorybookAvailable] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // Check if Storybook is running
  useEffect(() => {
    const checkStorybook = async () => {
      const available = await isStorybookRunning();
      setStorybookAvailable(available);
    };

    checkStorybook();
  }, []);

  // If no code is provided, show empty state
  if (!parsedCode || !parsedCode.code) {
    return null;
  }

  const handleGenerateStory = async () => {
    setIsGenerating(true);
    setError(null);
    setSaveStatus(null);

    try {
      // Generate a Storybook story from the parsed code
      const story = generateStory(parsedCode);

      // Save the story to a file
      const saveResult = await saveStoryFile(story);

      if (saveResult.success) {
        setSaveStatus({
          success: true,
          message: saveResult.message,
          simulated: saveResult.simulated
        });

        setStoryInfo(story);

        // Notify parent component
        if (onStoryGenerated) {
          onStoryGenerated(story);
        }
      } else {
        throw new Error(saveResult.message || 'Failed to save story file');
      }
    } catch (error) {
      console.error('Error generating story:', error);
      setError(error.message || 'Failed to generate Storybook story');
      setSaveStatus({
        success: false,
        message: error.message
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Use the utility function to get the Storybook URL
  const getStoryUrl = () => {
    return getStorybookUrl(storyInfo);
  };

  return (
    <div className="storybook-manager">
      <div className="storybook-header">
        <h4>Storybook Integration</h4>
        {!storybookAvailable && (
          <span className="storybook-status storybook-status-offline">
            Storybook is not running
          </span>
        )}
        {storybookAvailable && (
          <span className="storybook-status storybook-status-online">
            Storybook is running
          </span>
        )}
      </div>

      <div className="storybook-actions">
        <button
          className="storybook-button"
          onClick={handleGenerateStory}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate Storybook Story'}
        </button>

        {storyInfo && (
          <a
            href={getStoryUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="storybook-link"
          >
            Open in Storybook
          </a>
        )}
      </div>

      {error && (
        <div className="storybook-error">
          <p>Error: {error}</p>
        </div>
      )}

      {saveStatus && (
        <div className={`storybook-save-status ${saveStatus.success ? 'success' : 'error'}`}>
          <p>{saveStatus.message}</p>
          {saveStatus.simulated && (
            <p className="storybook-simulated">
              <strong>Note:</strong> This is a simulated save. To enable actual file saving,
              run the server with <code>node server.js</code>
            </p>
          )}
        </div>
      )}

      {storyInfo && (
        <div className="storybook-info">
          <h4>Story Generated</h4>
          <p>
            <strong>Component:</strong> {storyInfo.componentName}
          </p>
          <p>
            <strong>Framework:</strong> {storyInfo.framework}
          </p>
          <p>
            <strong>File:</strong> {storyInfo.fileName}
          </p>

          <div className="storybook-instructions">
            <h5>Next Steps:</h5>
            <ol>
              <li>
                {storybookAvailable ? (
                  <>Click "Open in Storybook" to view your component</>
                ) : (
                  <>Start Storybook with <code>npm run storybook</code></>
                )}
              </li>
              <li>Customize your story in the generated file</li>
              <li>Use the component in your project</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorybookManager;
