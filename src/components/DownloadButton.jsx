import React from 'react';
import { saveAs } from 'file-saver';
import { generateFileName } from '../utils/codeParser';
import '../styles/DownloadButton.css';

const DownloadButton = ({ parsedCode }) => {
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
    <button 
      className="download-button"
      onClick={handleDownload}
      disabled={!parsedCode || !parsedCode.code}
    >
      Download Code
    </button>
  );
};

export default DownloadButton;
