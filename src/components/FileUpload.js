import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      setLoading(true);
      Tesseract.recognize(
        file,
        'eng',
        {
          logger: (m) => console.log(m), // To track the progress
        }
      ).then(({ data: { text } }) => {
        setText(text);
        setLoading(false);
      });
    } else {
      alert('Please select a file first.');
    }
  };

  return (
    <div>
      <h2>Upload Document</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {loading && <p>Processing...</p>}
      {text && (
        <div>
          <h3>Extracted Text:</h3>
          <p>{text}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
