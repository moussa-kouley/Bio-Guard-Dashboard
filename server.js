import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
const upload = multer({ dest: 'public/ai-model/' });

// File upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const tempPath = req.file.path;
  const targetPath = path.join('public/ai-model', req.file.originalname);

  // Move file from temp location to target location
  fs.rename(tempPath, targetPath, (err) => {
    if (err) {
      fs.unlink(tempPath, () => {
        res.status(500).send('Error processing file');
      });
      return;
    }
    res.status(200).send('File uploaded successfully');
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
