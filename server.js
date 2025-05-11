import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createServer() {
  const app = express();
  
  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  
  // Use vite's connect instance as middleware
  app.use(vite.middlewares);
  
  // Parse JSON request body
  app.use(express.json());
  
  // API endpoint to save story files
  app.post('/api/save-story', async (req, res) => {
    try {
      const { filePath, content } = req.body;
      
      if (!filePath || !content) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required fields: filePath and content' 
        });
      }
      
      // Ensure the file path is within the project directory
      const normalizedPath = path.normalize(filePath);
      const absolutePath = path.resolve(__dirname, normalizedPath);
      
      // Security check: Make sure the path is within the project directory
      if (!absolutePath.startsWith(path.resolve(__dirname))) {
        return res.status(403).json({ 
          success: false, 
          message: 'Invalid file path' 
        });
      }
      
      // Create directory if it doesn't exist
      const directory = path.dirname(absolutePath);
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }
      
      // Write the file
      fs.writeFileSync(absolutePath, content, 'utf8');
      
      return res.json({ 
        success: true, 
        filePath: normalizedPath,
        message: `File saved to ${normalizedPath}` 
      });
    } catch (error) {
      console.error('Error saving story file:', error);
      return res.status(500).json({ 
        success: false, 
        message: `Error saving file: ${error.message}` 
      });
    }
  });
  
  // Start the server
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

createServer();
