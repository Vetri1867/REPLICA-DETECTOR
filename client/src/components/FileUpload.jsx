import { useState, useRef } from 'react';

export default function FileUpload({ onFileLoaded, label = 'Upload Document', accept = '.txt,.pdf,.docx' }) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef();

  const handleFile = async (file) => {
    if (!file) return;
    setFileName(file.name);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      onFileLoaded(data.text, data.filename);
    } catch (err) {
      console.error('Upload failed:', err);
      // fallback for txt files
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (e) => onFileLoaded(e.target.result, file.name);
        reader.readAsText(file);
      } else {
        alert('Upload failed: ' + err.message);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  return (
    <div
      style={{
        ...styles.zone,
        ...(isDragging ? styles.zoneDrag : {}),
        ...(fileName ? styles.zoneLoaded : {}),
      }}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      onClick={() => fileRef.current?.click()}
    >
      <input
        ref={fileRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={(e) => handleFile(e.target.files[0])}
      />
      <div style={styles.icon}>
        {isUploading ? '⏳' : fileName ? '✅' : '📁'}
      </div>
      <p style={styles.label}>{label}</p>
      <p style={styles.hint}>
        {fileName
          ? fileName
          : 'Drag & drop or click to browse (.txt, .pdf, .docx)'}
      </p>
      {isDragging && <div style={styles.dragOverlay}>Drop file here</div>}
    </div>
  );
}

const styles = {
  zone: {
    position: 'relative',
    border: '2px dashed rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: '30px 20px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: 'rgba(0,0,0,0.15)',
  },
  zoneDrag: {
    borderColor: '#00D4FF',
    background: 'rgba(0, 212, 255, 0.08)',
    boxShadow: '0 0 20px rgba(0,212,255,0.15)',
  },
  zoneLoaded: {
    borderColor: '#2ecc71',
    borderStyle: 'solid',
  },
  icon: {
    fontSize: '2rem',
    marginBottom: 8,
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.8)',
  },
  hint: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.4)',
    marginTop: 4,
  },
  dragOverlay: {
    position: 'absolute',
    inset: 0,
    borderRadius: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0, 212, 255, 0.15)',
    color: '#00D4FF',
    fontWeight: 700,
    fontSize: '1.1rem',
  },
};
