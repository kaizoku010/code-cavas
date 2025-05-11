# UI Component Generator with Storybook Integration

Generate beautiful UI components using AI with proper framework support and Storybook integration.

## Features

- Generate UI components using DeepSeek AI
- Support for multiple UI frameworks:
  - shadcn UI
  - Material UI
  - Bootstrap
  - Android XML
  - HTML/CSS/JS
- Storybook integration for proper component previews
- Download generated components
- Live preview

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ui-generator.git
cd ui-generator
```

2. Install dependencies:
```bash
npm install
```

### Running the Application

For the full experience with Storybook integration and file saving:

```bash
npm run dev:full
```

This will start:
- The Vite development server on port 5173
- The Express server for file saving on port 3000
- Storybook on port 6006

Or run each service separately:

```bash
# Just the UI Generator
npm run dev

# Just Storybook
npm run storybook

# Just the file saving server
npm run server
```

## Using the UI Generator

1. Enter a description of the UI component you want to create
2. Select a framework (shadcn UI, Material UI, Bootstrap, etc.)
3. Click "Generate UI Component"
4. View the generated code and preview
5. Generate a Storybook story for the component
6. Open the component in Storybook for a proper preview
7. Download the component code

## Storybook Integration

The Storybook integration provides:

- Proper framework support for all UI components
- Theme switching (light/dark mode)
- Interactive controls
- Documentation
- Responsive testing

See [STORYBOOK.md](./STORYBOOK.md) for detailed information on using the Storybook integration.
