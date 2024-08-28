import React, { useState } from 'react';
import { Box, Button, TextField, Typography, InputLabel, FormControl, Select, MenuItem, Paper, CircularProgress } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import Tesseract from 'tesseract.js';

const supportedFileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/bmp', 'image/pbm', 'image/tiff'];

const FileUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [warning, setWarning] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && supportedFileTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setWarning('');
    } else {
      setFile(null);
      setWarning('Unsupported file type. Please upload an image file (png, jpg, jpeg, bmp, pbm, tiff).');
    }
  };

  const handleUpload = () => {
    if (!title.trim()) {
      setWarning('Title is required.');
      return;
    }
  
    const tagsArray = tags.split(',').map(tag => tag.trim());
    if (tagsArray.length > 10) {
      setWarning('You can only add up to 10 tags.');
      return;
    }
  
    if (file) {
      setLoading(true);
      setProgress(0);
  
      Tesseract.recognize(
        file,
        'eng',
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setProgress(Math.round(m.progress * 100));
            }
          }
        }
      ).then(({ data: { text } }) => {
        setLoading(false);
        setProgress(100); // Set to 100% on completion
  
        onUpload({
          fileName: file.name,
          fileUrl: URL.createObjectURL(file),
          title,
          tags: tagsArray,
          category,
          text, // Pass the extracted text
        });
        setFile(null);
        setTitle('');
        setCategory('');
        setTags('');
        setWarning('');
      }).catch(() => {
        setLoading(false);
        alert('Error during OCR processing');
      });
    } else {
      alert('Please select a file first.');
    }
  };
  


  // const handleUpload = () => {
  //   if (!title.trim()) {
  //     setWarning('Title is required.');
  //     return;
  //   }
  
  //   const tagsArray = tags.split(',').map(tag => tag.trim());
  //   if (tagsArray.length > 10) {
  //     setWarning('You can only add up to 10 tags.');
  //     return;
  //   }
  
  //   if (file) {
  //     setLoading(true);
  //     setProgress(0);

  //     Tesseract.recognize(
  //       file,
  //       'eng',
  //       {
  //         logger: (m) => {
  //           if (m.status === 'recognizing text') {
  //             setProgress(Math.round(m.progress * 100));
  //           }
  //         }
  //       }
  //     ).then(({ data: { text } }) => {
  //       setLoading(false);
  //       setProgress(100); // Set to 100% on completion
      
  //       onUpload({
  //         fileName: file.name,
  //         title,
  //         tags: tags.split(',').map(tag => tag.trim()),
  //         category,
  //         text,
  //       });
  //       setFile(null);
  //       setTitle('');
  //       setCategory('');
  //       setTags('');
  //       setWarning('');
  //     }).catch(() => {
  //       setLoading(false);
  //       alert('Error during OCR processing');
  //     });
  //   } else {
  //     alert('Please select a file first.');
  //   }
  // };

  return (
    <Paper elevation={3} sx={{ justifyContent: 'center', padding: 3, borderRadius: 2, backgroundColor: '#f9f9f9' }}>
      <Typography variant="h6" sx={{ color: 'darkblue', marginBottom: 2 }}>Upload a Document</Typography>
      <Box mb={2}>

        {/* Inputs Title, Tags and Categories*/}
        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          variant="outlined"
          required
          sx={{ marginBottom: 2 }}
        />

        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Category"
          >
            <MenuItem value="School">School</MenuItem>
            <MenuItem value="Work">Work</MenuItem>
            <MenuItem value="Personal">Personal</MenuItem>
            <MenuItem value="Uncategorized">Uncategorized</MenuItem>
          </Select>
        </FormControl>
       
        <TextField
          fullWidth
          label="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          variant="outlined"
          sx={{ marginBottom: 2 }}
        />

        {/* File Picker */}
        {file && (
          <Typography variant="body2" sx={{ marginBottom: 2 }}>Selected file: {file.name}</Typography>
        )}
        {warning && (
          <Typography variant="body2" color="error" sx={{ marginBottom: 2 }}>{warning}</Typography>
        )}
        <Button
          variant="outlined"
          component="label"
          startIcon={<CloudUploadIcon />}
          sx={{ borderColor: 'darkblue', color: 'darkblue', marginBottom: 2, marginTop: 2, width: '40%' }}
        >
          Choose File
          <input
            type="file"
            hidden
            onChange={handleFileChange}
            accept=".png,.jpg,.jpeg,.bmp,.pbm,.tiff"
          />

        </Button>

        {/* Upload Button */}
        <Button
          variant="contained"
          onClick={handleUpload}
          sx={{ width: '40%', backgroundColor: 'darkblue', marginBottom: 2, marginTop: 2, marginLeft: 5, color: 'white' }}
        >
          Upload Document
        </Button>
      </Box>
      {loading && (
        <Box mt={2} display="flex" flexDirection="column" alignItems="center">
          <CircularProgress variant="determinate" value={progress} />
          <Typography mt={2}>Processing... {progress}%</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default FileUpload;
