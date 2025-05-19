const express = require('express');
const path = require('path');
const fs = require('fs');
const fileController = require('../controller/filecontroller');

const router = express.Router();

// Helper function to ensure directory exists
const ensureDirectoryExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// POST route for file upload
router.post('/upload-file', async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const uploadedFile = req.files.file;
    const folderPath = req.body.folderPath || '';
    
    // Create the full path for the file
    const uploadDir = path.join(__dirname, '../uploads', folderPath);
    const filePath = path.join(uploadDir, uploadedFile.name);

    // Ensure the upload directory exists
    ensureDirectoryExists(uploadDir);

    // Move the file to the specified location
    await uploadedFile.mv(filePath);

    res.status(200).json({
      message: 'File uploaded successfully',
      path: filePath
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({
      message: 'Error uploading file',
      error: error.message
    });
  }
});

router.get('/list-all-files', (req, res) => {
  const rootDirectory = path.join(__dirname, '../uploads');
  const { search } = req.query; // Capture search query

  if (!fs.existsSync(rootDirectory)) {
    return res.status(404).json({ message: 'Root folder not found' });
  }

  try {
    let allFiles = getAllFiles(rootDirectory);

    // If search query is provided, filter files by filename
    if (search) {
      allFiles = allFiles.filter(file => 
        file.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json(allFiles); // Return all files or filtered files based on search
  } catch (error) {
    console.error('Error listing all files:', error);
    res.status(500).json({ message: 'Error retrieving file list' });
  }
});

// Helper function to recursively get all files
const getAllFiles = (dirPath, arrayOfFiles = []) => {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      const relativePath = path.relative(path.join(__dirname, '../uploads'), filePath).replace(/\\/g, '/');
      const [folderPath, fileName] = relativePath.split('/').reduce((acc, part, index, arr) => {
        if (index === arr.length - 1) {
          acc[1] = part; // fileName (last part)
        } else {
          acc[0] = acc[0] ? acc[0] + '/' + part : part; // folderPath (all parts except the last one)
        }
        return acc;
      }, []);
      arrayOfFiles.push({
        name: file,
        path: relativePath,  // Relative path from uploads folder
        viewUrl: `http://localhost:5000/api/files/view-pdf?folderPath=${encodeURIComponent(folderPath)}&fileName=${encodeURIComponent(fileName)}`
      });
    }
  });

  return arrayOfFiles;
};

// Route to view a specific PDF file by its path
router.get('/view-pdf', (req, res) => {
  const { folderPath, fileName } = req.query;

  if (!folderPath || !fileName) {
    return res.status(400).json({ message: 'Folder and file parameters are required' });
  }

  // Construct the file path properly
  const filePath = path.join(__dirname, '../uploads', folderPath, fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found' });
  }

  // Set headers for secure PDF streaming
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
  res.setHeader('X-Content-Type-Options', 'nosniff'); // Prevent MIME sniffing

  // Stream file efficiently
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
});

const getPdfViewer = (req, res) => {
  try {
      const { folder, subfolder, file } = req.query;

      if (!folder || !file) {
          return res.status(400).json({ error: "Folder and file parameters are required" });
      }

      const safeFolder = path.basename(folder); // Prevent directory traversal
      const safeSubfolder = subfolder ? path.basename(subfolder) : null;
      const safeFile = path.basename(file); // Prevent path injection

      const filePath = safeSubfolder
          ? path.join(__dirname, "../uploads", safeFolder, safeSubfolder, safeFile)
          : path.join(__dirname, "../uploads", safeFolder, safeFile);

      console.log("File path:", filePath); // Log the constructed path

      // Check if the file exists asynchronously
      fs.access(filePath, fs.constants.F_OK, (err) => {
          if (err) {
              return res.status(404).json({ error: "File not found" });
          }

          // Set headers for secure PDF streaming
          res.setHeader("Content-Type", "application/pdf");
          res.setHeader("Content-Disposition", `inline; filename="${safeFile}"`);
          res.setHeader("X-Content-Type-Options", "nosniff"); // Prevent MIME sniffing

          // Stream file efficiently
          const fileStream = fs.createReadStream(filePath);
          fileStream.pipe(res);
      });
  } catch (error) {
      console.error("Error serving PDF:", error);
      res.status(500).json({ error: "Internal server error" });
  }
};

// Export the function to be used elsewhere
module.exports = { getPdfViewer };
module.exports = router;
