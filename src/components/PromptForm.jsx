import React, { useState } from 'react';
import '../styles/PromptForm.css';

const PromptForm = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [framework, setFramework] = useState('html');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt, framework);
    }
  };

  const frameworks = [
    { id: 'shadcn', name: 'shadcn UI', description: 'Modern, accessible React components' },
    { id: 'bootstrap', name: 'Bootstrap', description: 'Popular responsive CSS framework' },
    { id: 'material', name: 'Material Design', description: 'Google\'s Material Design components' },
    { id: 'android', name: 'Android XML', description: 'Native Android UI layouts' },
    { id: 'html', name: 'HTML/CSS/JS', description: 'Plain web technologies' }
  ];

  return (
    <div className="prompt-form-container">
      <h2>Generate UI Components</h2>
      <p className="description">
        Describe the UI component you want to create, and select a framework.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="prompt">Describe your UI component:</label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., Create a contact form with name, email, message fields and a submit button"
            rows={5}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Select a framework:</label>
          <div className="framework-options">
            {frameworks.map((fw) => (
              <div 
                key={fw.id} 
                className={`framework-option ${framework === fw.id ? 'selected' : ''}`}
                onClick={() => setFramework(fw.id)}
              >
                <div className="framework-header">
                  <span className="framework-name">{fw.name}</span>
                </div>
                <p className="framework-description">{fw.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <button 
          type="submit" 
          className="generate-button"
          disabled={isLoading || !prompt.trim()}
        >
          {isLoading ? 'Generating...' : 'Generate UI Component'}
        </button>
      </form>
    </div>
  );
};

export default PromptForm;
