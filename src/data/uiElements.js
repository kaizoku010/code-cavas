// Collection of UI elements with their HTML and CSS code
export const uiElements = [
  {
    id: 'button-primary',
    category: 'Buttons',
    name: 'Primary Button',
    html: `<button class="button-primary">Click Me</button>`,
    css: `.button-primary {
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.button-primary:hover {
  background-color: #4338ca;
}`
  },
  {
    id: 'button-secondary',
    category: 'Buttons',
    name: 'Secondary Button',
    html: `<button class="button-secondary">Click Me</button>`,
    css: `.button-secondary {
  background-color: white;
  color: #4f46e5;
  border: 1px solid #4f46e5;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.button-secondary:hover {
  background-color: #f5f5ff;
}`
  },
  {
    id: 'card-basic',
    category: 'Cards',
    name: 'Basic Card',
    html: `<div class="card">
  <div class="card-header">
    <h3>Card Title</h3>
  </div>
  <div class="card-body">
    <p>This is a basic card component with a header and body content.</p>
  </div>
  <div class="card-footer">
    <button class="card-button">Action</button>
  </div>
</div>`,
    css: `.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-width: 300px;
}

.card-header {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.card-header h3 {
  margin: 0;
  color: #111827;
  font-size: 1.25rem;
}

.card-body {
  padding: 1rem;
}

.card-body p {
  margin: 0;
  color: #6b7280;
}

.card-footer {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
}

.card-button {
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.card-button:hover {
  background-color: #4338ca;
}`
  },
  {
    id: 'form-input',
    category: 'Forms',
    name: 'Form Input',
    html: `<div class="form-group">
  <label for="username" class="form-label">Username</label>
  <input type="text" id="username" class="form-input" placeholder="Enter your username">
</div>`,
    css: `.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.form-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}`
  },
  {
    id: 'alert-success',
    category: 'Alerts',
    name: 'Success Alert',
    html: `<div class="alert alert-success">
  <div class="alert-icon">✓</div>
  <div class="alert-content">
    <h4 class="alert-title">Success!</h4>
    <p class="alert-message">Your action was completed successfully.</p>
  </div>
</div>`,
    css: `.alert {
  display: flex;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.alert-success {
  background-color: #ecfdf5;
  border: 1px solid #10b981;
}

.alert-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #10b981;
  color: white;
  margin-right: 0.75rem;
  font-weight: bold;
}

.alert-content {
  flex: 1;
}

.alert-title {
  margin: 0 0 0.25rem;
  font-size: 1rem;
  color: #065f46;
}

.alert-message {
  margin: 0;
  color: #047857;
  font-size: 0.875rem;
}`
  }
];

// Function to get elements by category
export const getElementsByCategory = () => {
  const categories = {};
  
  uiElements.forEach(element => {
    if (!categories[element.category]) {
      categories[element.category] = [];
    }
    categories[element.category].push(element);
  });
  
  return categories;
};

// Function to get element by ID
export const getElementById = (id) => {
  return uiElements.find(element => element.id === id);
};
