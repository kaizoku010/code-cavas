/**
 * Utility for creating a React sandbox environment to preview React components
 */

/**
 * Create a sandbox HTML document for rendering React components
 * @param {string} componentCode - The React component code to render
 * @param {string} framework - The UI framework (shadcn, material)
 * @returns {string} - HTML document with React environment
 */
export const createReactSandbox = (componentCode, framework) => {
  // Extract the component name from the code
  const componentName = extractComponentName(componentCode);

  console.log(`Creating React sandbox for ${framework} component: ${componentName}`);

  // Clean up the component code
  // Remove any import statements as they won't work in the sandbox
  let cleanedCode = componentCode.replace(/import\s+.*?from\s+['"].*?['"]/g, '// Import removed for sandbox');

  // Replace @/components/ui with direct references to our mock components
  cleanedCode = cleanedCode.replace(/@\/components\/ui\/button/g, '// Using mock Button component');
  cleanedCode = cleanedCode.replace(/@\/components\/ui\/input/g, '// Using mock Input component');
  cleanedCode = cleanedCode.replace(/@\/components\/ui\/label/g, '// Using mock Label component');
  cleanedCode = cleanedCode.replace(/@\/components\/ui\/card/g, '// Using mock Card components');

  // Log the cleaned code for debugging
  console.log('Cleaned component code for sandbox:', cleanedCode.substring(0, 100) + '...');

  // Create a sandbox HTML document with React and the necessary dependencies
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>React Component Preview</title>

      <!-- React and Babel -->
      <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
      <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
      <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

      <!-- Framework-specific dependencies -->
      ${getFrameworkCDN(framework)}

      <style>
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          margin: 0;
          padding: 20px;
          box-sizing: border-box;
          background-color: #f5f5f5;
        }
        #root {
          max-width: 100%;
          width: 100%;
          display: flex;
          justify-content: center;
        }
        .error-container {
          background-color: #fee2e2;
          border: 1px solid #ef4444;
          border-radius: 8px;
          padding: 16px;
          margin: 16px 0;
          color: #b91c1c;
          max-width: 600px;
        }
        .component-container {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 20px;
          max-width: 600px;
        }
      </style>
    </head>
    <body>
      <div id="root"></div>

      <script type="text/babel">
        // Function to report errors back to the parent window
        function reportError(message) {
          console.error("Preview error:", message);
          try {
            window.parent.postMessage({ type: 'preview-error', message: message }, '*');
          } catch (e) {
            console.error("Could not report error to parent:", e);
          }
        }

        // Wrap in an immediately invoked function to avoid global scope pollution
        (function() {
          // Log that the script is running
          console.log("React sandbox script is running");

          // Set up error handling
          window.onerror = function(message, source, lineno, colno, error) {
            reportError("JavaScript error: " + message);
            return true;
          };

          try {
            // The cleaned component code
            ${cleanedCode}

            // Function to render the component
            function renderComponent() {
              try {
                console.log("Starting component render process");

                // Get the component constructor - try different ways to access it
                let ComponentToRender;

                // First try: direct access to the named export
                if (typeof ${componentName} !== 'undefined') {
                  ComponentToRender = ${componentName};
                  console.log("Found component via direct reference:", "${componentName}");
                }
                // Second try: check if it's a default export
                else if (typeof exports !== 'undefined' && exports.default) {
                  ComponentToRender = exports.default;
                  console.log("Found component via default export");
                }
                // Third try: look for any function that might be a component
                else {
                  // Find any function in the global scope that might be a component
                  const globalFunctions = Object.keys(window).filter(key =>
                    typeof window[key] === 'function' &&
                    key !== 'renderComponent' &&
                    !key.startsWith('_') &&
                    key !== 'Button' &&
                    key !== 'Input' &&
                    key !== 'Label' &&
                    key !== 'Card' &&
                    key !== 'CardHeader' &&
                    key !== 'CardTitle' &&
                    key !== 'CardDescription' &&
                    key !== 'CardContent' &&
                    key !== 'CardFooter'
                  );

                  console.log("Potential component functions:", globalFunctions);

                  if (globalFunctions.length > 0) {
                    ComponentToRender = window[globalFunctions[0]];
                    console.log("Found potential component:", globalFunctions[0]);
                  } else {
                    // If we can't find a component, try to create a simple wrapper
                    console.log("No component found, creating wrapper");

                    // Create a wrapper component that just renders the code as text
                    ComponentToRender = () => (
                      <div className="component-wrapper">
                        <h3>Component Preview</h3>
                        <p>The component code was processed but no renderable component was found.</p>
                        <div className="code-preview">
                          <pre style={{textAlign: 'left', overflow: 'auto', maxHeight: '200px'}}>
                            {cleanedCode}
                          </pre>
                        </div>
                      </div>
                    );
                  }
                }

                // Check if it's a valid component
                if (!ComponentToRender) {
                  throw new Error("Component '${componentName}' not found in the code");
                }

                // Log success
                console.log("Component found, attempting to render");

                // Render the component
                const rootElement = document.getElementById('root');
                const root = ReactDOM.createRoot(rootElement);

                // Create an error boundary component
                class ErrorBoundary extends React.Component {
                  constructor(props) {
                    super(props);
                    this.state = { hasError: false, error: null };
                  }

                  static getDerivedStateFromError(error) {
                    return { hasError: true, error };
                  }

                  componentDidCatch(error, errorInfo) {
                    console.error("Error in component:", error, errorInfo);
                    reportError("Component error: " + error.message);
                  }

                  render() {
                    if (this.state.hasError) {
                      return (
                        <div style={{padding: '20px', textAlign: 'center', color: '#b91c1c', backgroundColor: '#fee2e2', borderRadius: '8px', border: '1px solid #ef4444'}}>
                          <h3>Component Error</h3>
                          <p>There was an error rendering this component:</p>
                          <p style={{fontWeight: 'bold'}}>{this.state.error && this.state.error.message}</p>
                        </div>
                      );
                    }
                    return this.props.children;
                  }
                }

                // Wrap in error boundary
                try {
                  root.render(
                    <ErrorBoundary>
                      <div className="component-container">
                        <ComponentToRender />
                      </div>
                    </ErrorBoundary>
                  );
                  console.log("Component rendered successfully");
                } catch (renderError) {
                  console.error("Error during render:", renderError);
                  reportError("Render error: " + renderError.message);

                  // Try a simpler approach
                  root.render(
                    <div className="component-container">
                      <div style={{padding: '20px', textAlign: 'center', color: '#b91c1c', backgroundColor: '#fee2e2', borderRadius: '8px', border: '1px solid #ef4444'}}>
                        <h3>Component Preview Error</h3>
                        <p>This component could not be rendered:</p>
                        <p style={{fontWeight: 'bold'}}>{renderError.message}</p>
                      </div>
                    </div>
                  );
                }
              } catch (error) {
                console.error("Error finding component:", error);

                // Display a fallback UI
                const rootElement = document.getElementById('root');
                rootElement.innerHTML = \`
                  <div class="component-container">
                    <div style="padding: 20px; text-align: center;">
                      <h3>Component Preview</h3>
                      <p>Could not render the component: \${error.message}</p>
                    </div>
                  </div>
                \`;
              }
            }

            // Render after a short delay to ensure everything is loaded
            setTimeout(renderComponent, 300);

          } catch (error) {
            // Display any errors
            console.error("Error in React sandbox:", error);
            reportError("Sandbox error: " + error.message);

            const rootElement = document.getElementById('root');
            rootElement.innerHTML = \`
              <div class="error-container" style="background-color: #fee2e2; border: 1px solid #ef4444; border-radius: 8px; padding: 20px; margin: 20px; color: #b91c1c;">
                <h3>Error Rendering Component</h3>
                <p><strong>\${error.message}</strong></p>
                <p>This could be due to syntax errors or unsupported features in the component code.</p>
                <details>
                  <summary>Component Code</summary>
                  <pre style="background: #f8f9fa; padding: 15px; border-radius: 4px; overflow-x: auto; max-height: 300px; color: #333;">\${cleanedCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
                </details>
              </div>
            \`;

            // Also try to render a simple message using React if possible
            try {
              if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
                const root = ReactDOM.createRoot(rootElement);
                root.render(
                  <div style={{padding: '20px', color: '#b91c1c', backgroundColor: '#fee2e2', borderRadius: '8px', border: '1px solid #ef4444'}}>
                    <h3>Error Rendering Component</h3>
                    <p><strong>{error.message}</strong></p>
                    <p>This could be due to syntax errors or unsupported features in the component code.</p>
                  </div>
                );
              }
            } catch (reactError) {
              console.error("Could not render error with React:", reactError);
            }
          }
        })();
      </script>
    </body>
    </html>
  `;
};

/**
 * Extract the component name from the code
 * @param {string} code - The React component code
 * @returns {string} - The component name
 */
const extractComponentName = (code) => {
  // Try to find export default function Name() or export function Name()
  const exportMatch = code.match(/export\s+(default\s+)?function\s+([A-Za-z0-9_]+)/);
  if (exportMatch && exportMatch[2]) {
    return exportMatch[2];
  }

  // Try to find const Name = () => or function Name()
  const functionMatch = code.match(/(?:const|let|var|function)\s+([A-Za-z0-9_]+)\s*(?:=|=>|\()/);
  if (functionMatch && functionMatch[1]) {
    return functionMatch[1];
  }

  // Default to a generic name if we can't find the component name
  return 'Component';
};

/**
 * Get the CDN links for the selected framework
 * @param {string} framework - The UI framework (shadcn, material)
 * @returns {string} - HTML with CDN links
 */
const getFrameworkCDN = (framework) => {
  switch (framework) {
    case 'shadcn':
      // shadcn doesn't have a CDN, but we can include Tailwind CSS and create mock components
      return `
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
          tailwind.config = {
            darkMode: "class",
            theme: {
              container: {
                center: true,
                padding: "2rem",
                screens: {
                  "2xl": "1400px",
                },
              },
              extend: {
                colors: {
                  border: "hsl(var(--border))",
                  input: "hsl(var(--input))",
                  ring: "hsl(var(--ring))",
                  background: "hsl(var(--background))",
                  foreground: "hsl(var(--foreground))",
                  primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                  },
                  secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                  },
                  destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                  },
                  muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                  },
                  accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                  },
                  popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                  },
                  card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                  },
                },
                borderRadius: {
                  lg: "var(--radius)",
                  md: "calc(var(--radius) - 2px)",
                  sm: "calc(var(--radius) - 4px)",
                },
                keyframes: {
                  "accordion-down": {
                    from: { height: 0 },
                    to: { height: "var(--radix-accordion-content-height)" },
                  },
                  "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: 0 },
                  },
                },
                animation: {
                  "accordion-down": "accordion-down 0.2s ease-out",
                  "accordion-up": "accordion-up 0.2s ease-out",
                },
              },
            },
          }
        </script>
        <style>
          /* Basic shadcn-like styles */
          :root {
            --background: 0 0% 100%;
            --foreground: 222.2 84% 4.9%;
            --card: 0 0% 100%;
            --card-foreground: 222.2 84% 4.9%;
            --popover: 0 0% 100%;
            --popover-foreground: 222.2 84% 4.9%;
            --primary: 222.2 47.4% 11.2%;
            --primary-foreground: 210 40% 98%;
            --secondary: 210 40% 96.1%;
            --secondary-foreground: 222.2 47.4% 11.2%;
            --muted: 210 40% 96.1%;
            --muted-foreground: 215.4 16.3% 46.9%;
            --accent: 210 40% 96.1%;
            --accent-foreground: 222.2 47.4% 11.2%;
            --destructive: 0 84.2% 60.2%;
            --destructive-foreground: 210 40% 98%;
            --border: 214.3 31.8% 91.4%;
            --input: 214.3 31.8% 91.4%;
            --ring: 222.2 84% 4.9%;
            --radius: 0.5rem;
          }

          .dark {
            --background: 222.2 84% 4.9%;
            --foreground: 210 40% 98%;
            --card: 222.2 84% 4.9%;
            --card-foreground: 210 40% 98%;
            --popover: 222.2 84% 4.9%;
            --popover-foreground: 210 40% 98%;
            --primary: 210 40% 98%;
            --primary-foreground: 222.2 47.4% 11.2%;
            --secondary: 217.2 32.6% 17.5%;
            --secondary-foreground: 210 40% 98%;
            --muted: 217.2 32.6% 17.5%;
            --muted-foreground: 215 20.2% 65.1%;
            --accent: 217.2 32.6% 17.5%;
            --accent-foreground: 210 40% 98%;
            --destructive: 0 62.8% 30.6%;
            --destructive-foreground: 210 40% 98%;
            --border: 217.2 32.6% 17.5%;
            --input: 217.2 32.6% 17.5%;
            --ring: 212.7 26.8% 83.9%;
          }
        </style>

        <script type="text/babel">
          // Create mock shadcn UI components

          // Button component
          const Button = React.forwardRef(({ className, variant, size, asChild, ...props }, ref) => {
            const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

            const variants = {
              default: "bg-primary text-primary-foreground hover:bg-primary/90",
              destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
              outline: "border border-input hover:bg-accent hover:text-accent-foreground",
              secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
              ghost: "hover:bg-accent hover:text-accent-foreground",
              link: "text-primary underline-offset-4 hover:underline"
            };

            const sizes = {
              default: "h-10 py-2 px-4",
              sm: "h-9 px-3 rounded-md",
              lg: "h-11 px-8 rounded-md",
              icon: "h-10 w-10"
            };

            const variantStyle = variants[variant] || variants.default;
            const sizeStyle = sizes[size] || sizes.default;

            return (
              <button
                className={\`\${baseStyles} \${variantStyle} \${sizeStyle} \${className || ''}\`}
                ref={ref}
                {...props}
              />
            );
          });
          Button.displayName = "Button";

          // Input component
          const Input = React.forwardRef(({ className, type, ...props }, ref) => {
            return (
              <input
                type={type || "text"}
                className={\`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 \${className || ''}\`}
                ref={ref}
                {...props}
              />
            );
          });
          Input.displayName = "Input";

          // Label component
          const Label = React.forwardRef(({ className, ...props }, ref) => {
            return (
              <label
                className={\`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 \${className || ''}\`}
                ref={ref}
                {...props}
              />
            );
          });
          Label.displayName = "Label";

          // Card components
          const Card = React.forwardRef(({ className, ...props }, ref) => {
            return (
              <div
                ref={ref}
                className={\`rounded-lg border bg-card text-card-foreground shadow-sm \${className || ''}\`}
                {...props}
              />
            );
          });
          Card.displayName = "Card";

          const CardHeader = React.forwardRef(({ className, ...props }, ref) => {
            return (
              <div
                ref={ref}
                className={\`flex flex-col space-y-1.5 p-6 \${className || ''}\`}
                {...props}
              />
            );
          });
          CardHeader.displayName = "CardHeader";

          const CardTitle = React.forwardRef(({ className, ...props }, ref) => {
            return (
              <h3
                ref={ref}
                className={\`text-2xl font-semibold leading-none tracking-tight \${className || ''}\`}
                {...props}
              />
            );
          });
          CardTitle.displayName = "CardTitle";

          const CardDescription = React.forwardRef(({ className, ...props }, ref) => {
            return (
              <p
                ref={ref}
                className={\`text-sm text-muted-foreground \${className || ''}\`}
                {...props}
              />
            );
          });
          CardDescription.displayName = "CardDescription";

          const CardContent = React.forwardRef(({ className, ...props }, ref) => {
            return (
              <div
                ref={ref}
                className={\`p-6 pt-0 \${className || ''}\`}
                {...props}
              />
            );
          });
          CardContent.displayName = "CardContent";

          const CardFooter = React.forwardRef(({ className, ...props }, ref) => {
            return (
              <div
                ref={ref}
                className={\`flex items-center p-6 pt-0 \${className || ''}\`}
                {...props}
              />
            );
          });
          CardFooter.displayName = "CardFooter";

          // Make components available globally
          window.Button = Button;
          window.Input = Input;
          window.Label = Label;
          window.Card = Card;
          window.CardHeader = CardHeader;
          window.CardTitle = CardTitle;
          window.CardDescription = CardDescription;
          window.CardContent = CardContent;
          window.CardFooter = CardFooter;
        </script>
      `;
    case 'material':
      return `
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <script src="https://unpkg.com/@emotion/react@latest/dist/emotion-react.umd.min.js" crossorigin></script>
        <script src="https://unpkg.com/@emotion/styled@latest/dist/emotion-styled.umd.min.js" crossorigin></script>
        <script src="https://unpkg.com/@mui/material@latest/umd/material-ui.production.min.js" crossorigin></script>
        <script>
          // Create global variables for Material UI components
          window.MaterialUI = MaterialUI;
          // Create aliases for commonly used components
          const {
            Button, TextField, Card, CardContent, CardActions, Typography,
            AppBar, Toolbar, IconButton, Box, Container, Grid, Paper,
            FormControl, InputLabel, Input, FormHelperText, Checkbox,
            FormControlLabel, Select, MenuItem, Avatar, Link
          } = MaterialUI;
        </script>
      `;
    default:
      return '';
  }
};
