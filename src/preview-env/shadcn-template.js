/**
 * HTML template for shadcn UI preview
 */

export const createShadcnPreviewTemplate = (componentCode) => {
  // Clean up the component code
  // Remove any import statements for shadcn components as we'll provide our own
  let cleanedCode = componentCode.replace(/import\s+{([^}]+)}\s+from\s+["']@\/components\/ui\/[^"']+["']/g, '// Shadcn imports provided by preview environment');
  
  // Replace specific imports with our components
  cleanedCode = cleanedCode.replace(/import\s+{\s*Button\s*}\s+from\s+["']@\/components\/ui\/button["']/g, '// Button imported from preview environment');
  cleanedCode = cleanedCode.replace(/import\s+{\s*Input\s*}\s+from\s+["']@\/components\/ui\/input["']/g, '// Input imported from preview environment');
  cleanedCode = cleanedCode.replace(/import\s+{\s*Label\s*}\s+from\s+["']@\/components\/ui\/label["']/g, '// Label imported from preview environment');
  cleanedCode = cleanedCode.replace(/import\s+{\s*Card[^}]*}\s+from\s+["']@\/components\/ui\/card["']/g, '// Card components imported from preview environment');
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>shadcn UI Preview</title>
      
      <!-- Tailwind CSS -->
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
        /* shadcn UI variables */
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
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          background-color: white;
          margin: 0;
          padding: 20px;
        }
        
        #root {
          display: flex;
          justify-content: center;
          width: 100%;
        }
        
        .shadcn-preview {
          max-width: 100%;
          width: 100%;
          display: flex;
          justify-content: center;
        }
        
        .error-container {
          background-color: #fee2e2;
          border: 1px solid #ef4444;
          border-radius: 8px;
          padding: 20px;
          margin: 20px;
          color: #b91c1c;
        }
      </style>
    </head>
    <body>
      <div id="root"></div>
      
      <!-- React and ReactDOM -->
      <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
      <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
      <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
      
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
        
        // Import shadcn UI components
        const {
          Button,
          Input,
          Label,
          Card,
          CardHeader,
          CardTitle,
          CardDescription,
          CardContent,
          CardFooter
        } = (() => {
          // Button component
          const Button = React.forwardRef(({ className, variant = "default", size = "default", asChild, children, ...props }, ref) => {
            const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
            
            const variants = {
              default: "bg-primary text-primary-foreground hover:bg-primary/90",
              destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
              outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
              secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
              ghost: "hover:bg-accent hover:text-accent-foreground",
              link: "text-primary underline-offset-4 hover:underline"
            };
            
            const sizes = {
              default: "h-10 px-4 py-2",
              sm: "h-9 rounded-md px-3",
              lg: "h-11 rounded-md px-8",
              icon: "h-10 w-10"
            };
            
            const variantStyle = variants[variant] || variants.default;
            const sizeStyle = sizes[size] || sizes.default;
            
            return (
              <button
                className={\`\${baseStyles} \${variantStyle} \${sizeStyle} \${className || ''}\`}
                ref={ref}
                {...props}
              >
                {children}
              </button>
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
          
          return {
            Button,
            Input,
            Label,
            Card,
            CardHeader,
            CardTitle,
            CardDescription,
            CardContent,
            CardFooter
          };
        })();
        
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
                <div className="error-container">
                  <h3>Component Error</h3>
                  <p>There was an error rendering this component:</p>
                  <p style={{fontWeight: 'bold'}}>{this.state.error && this.state.error.message}</p>
                </div>
              );
            }
            return this.props.children;
          }
        }
        
        // The component code
        ${cleanedCode}
        
        // Function to render the component
        function renderComponent() {
          try {
            console.log("Starting component render process");
            
            // Get the component constructor - try different ways to access it
            let ComponentToRender;
            
            // Try to find the component by looking for functions
            const componentFunctions = Object.keys(window).filter(key =>
              typeof window[key] === 'function' &&
              key !== 'renderComponent' &&
              key !== 'reportError' &&
              !key.startsWith('_') &&
              key !== 'Button' &&
              key !== 'Input' &&
              key !== 'Label' &&
              key !== 'Card' &&
              key !== 'CardHeader' &&
              key !== 'CardTitle' &&
              key !== 'CardDescription' &&
              key !== 'CardContent' &&
              key !== 'CardFooter' &&
              key !== 'ErrorBoundary'
            );
            
            console.log("Potential component functions:", componentFunctions);
            
            if (componentFunctions.length > 0) {
              ComponentToRender = window[componentFunctions[0]];
              console.log("Found component:", componentFunctions[0]);
            } else {
              reportError("No component found in the code");
              return;
            }
            
            // Render the component
            const rootElement = document.getElementById('root');
            const root = ReactDOM.createRoot(rootElement);
            
            root.render(
              <ErrorBoundary>
                <div className="shadcn-preview">
                  <ComponentToRender />
                </div>
              </ErrorBoundary>
            );
            
            console.log("Component rendered successfully");
          } catch (error) {
            console.error("Error rendering component:", error);
            reportError("Render error: " + error.message);
            
            const rootElement = document.getElementById('root');
            rootElement.innerHTML = \`
              <div class="error-container">
                <h3>Error Rendering Component</h3>
                <p><strong>\${error.message}</strong></p>
                <p>This could be due to syntax errors or unsupported features in the component code.</p>
              </div>
            \`;
          }
        }
        
        // Render after a short delay to ensure everything is loaded
        setTimeout(renderComponent, 300);
      </script>
    </body>
    </html>
  `;
};
