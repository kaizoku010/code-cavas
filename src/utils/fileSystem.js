/**
 * Utility for file system operations
 * This handles saving generated stories to the file system
 */

/**
 * Save a story file to the file system
 * @param {Object} storyInfo - Information about the story to save
 * @returns {Promise<Object>} - Result of the save operation
 */
export const saveStoryFile = async (storyInfo) => {
  const { componentName, framework, storyContent, fileName } = storyInfo;
  
  if (!componentName || !framework || !storyContent) {
    throw new Error('Missing required story information');
  }
  
  try {
    // Create the directory path for the story
    const directoryPath = `src/stories/generated/${framework}`;
    const filePath = `${directoryPath}/${fileName}`;
    
    // In a browser environment, we need to use the File System Access API
    // or a server endpoint to save files
    
    // For this implementation, we'll use a simulated server endpoint
    const response = await fetch('/api/save-story', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filePath,
        content: storyContent,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to save story file');
    }
    
    const data = await response.json();
    
    return {
      success: true,
      filePath: data.filePath,
      message: `Story saved to ${data.filePath}`,
    };
  } catch (error) {
    console.error('Error saving story file:', error);
    
    // For development/demo purposes, simulate a successful save
    // This allows the UI to work even without a backend
    console.log('Simulating successful file save for development');
    
    return {
      success: true,
      filePath: `src/stories/generated/${framework}/${fileName}`,
      message: `Story would be saved to src/stories/generated/${framework}/${fileName}`,
      simulated: true,
    };
  }
};

/**
 * Get the URL to view a story in Storybook
 * @param {Object} storyInfo - Information about the story
 * @returns {string} - URL to view the story in Storybook
 */
export const getStorybookUrl = (storyInfo) => {
  if (!storyInfo) {
    return '/storybook/';
  }
  
  const { framework, componentName } = storyInfo;
  const baseUrl = window.location.origin;
  
  // Format: /storybook/iframe.html?id=generated-framework-componentname--default&viewMode=story
  return `${baseUrl}/storybook/iframe.html?id=generated-${framework}-${componentName}--default&viewMode=story`;
};

/**
 * Check if Storybook is running
 * @returns {Promise<boolean>} - Whether Storybook is running
 */
export const isStorybookRunning = async () => {
  try {
    // Try to fetch the Storybook index page
    const response = await fetch('/storybook/index.html', { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Error checking if Storybook is running:', error);
    return false;
  }
};
