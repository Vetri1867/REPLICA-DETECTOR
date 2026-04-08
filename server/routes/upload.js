const express = require('express');
const router = express.Router();
const { IncomingForm } = require('formidable');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Extract text content from uploaded file
 */
async function extractText(filePath, originalname) {
  const ext = path.extname(originalname).toLowerCase();

  if (ext === '.txt') {
    return fs.readFileSync(filePath, 'utf-8');
  }

  if (ext === '.pdf') {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  }

  if (ext === '.docx') {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  throw new Error('Unsupported file type');
}

router.post('/', (req, res) => {
  const form = new IncomingForm({
    uploadDir: path.join(__dirname, '..', 'uploads'),
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  });

  if (!fs.existsSync(form.uploadDir)) {
    fs.mkdirSync(form.uploadDir, { recursive: true });
  }

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'File upload failed: ' + err.message });
    }

    try {
      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const allowedExts = ['.txt', '.pdf', '.docx'];
      const ext = path.extname(file.originalFilename || file.name || '').toLowerCase();
      if (!allowedExts.includes(ext)) {
        try { fs.unlinkSync(file.filepath || file.path); } catch(e) {}
        return res.status(400).json({ error: 'Only .txt, .pdf, and .docx files are allowed' });
      }

      const filePath = file.filepath || file.path;
      const originalname = file.originalFilename || file.name;

      const text = await extractText(filePath, originalname);

      // Clean up uploaded file after extraction
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        // ignore cleanup errors
      }

      res.json({
        text,
        filename: originalname,
        size: file.size,
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'File processing failed: ' + error.message });
    }
  });
});

// Handle multiple files
router.post('/multiple', (req, res) => {
  const form = new IncomingForm({
    uploadDir: path.join(__dirname, '..', 'uploads'),
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024,
    multiples: true,
  });

  if (!fs.existsSync(form.uploadDir)) {
    fs.mkdirSync(form.uploadDir, { recursive: true });
  }

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'File upload failed: ' + err.message });
    }

    try {
      const fileArray = Array.isArray(files.files) ? files.files : (files.files ? [files.files] : []);
      if (fileArray.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      const allowedExts = ['.txt', '.pdf', '.docx'];
      const results = [];
      
      for (const file of fileArray) {
        const filePath = file.filepath || file.path;
        const originalname = file.originalFilename || file.name;
        const ext = path.extname(originalname || '').toLowerCase();
        
        if (!allowedExts.includes(ext)) {
          try { fs.unlinkSync(filePath); } catch(e) {}
          continue; // skip unsupported files in batch
        }

        const text = await extractText(filePath, originalname);
        results.push({
          text,
          filename: originalname,
          size: file.size,
        });

        try {
          fs.unlinkSync(filePath);
        } catch (e) {}
      }

      if (results.length === 0) {
        return res.status(400).json({ error: 'No valid files processed. Only .txt, .pdf, and .docx allowed.' });
      }

      res.json({ files: results });
    } catch (error) {
      console.error('Multiple upload error:', error);
      res.status(500).json({ error: 'File processing failed: ' + error.message });
    }
  });
});

module.exports = router;
