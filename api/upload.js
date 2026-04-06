const { IncomingForm } = require('formidable');
const fs = require('fs');
const path = require('path');

const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

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

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new IncomingForm({
    uploadDir: '/tmp',
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'File upload failed: ' + err.message });
    }

    try {
      const file = files.file?.[0] || files.file;
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const filePath = file.filepath || file.path;
      const originalname = file.originalFilename || file.name;

      const text = await extractText(filePath, originalname);

      // Cleanup
      try { fs.unlinkSync(filePath); } catch(e) {}

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
};
