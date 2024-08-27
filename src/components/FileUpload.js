import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import { Button, TextField, CircularProgress, Box, Typography, Grid } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';


const FileUpload = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
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
          title,
          tags: tags.split(',').map(tag => tag.trim()),
          category,
          text,
        });
        // Clear fields after successful upload
        setFile(null);
        setTitle('');
        setTags('');
        setCategory('');
      }).catch(() => {
        setLoading(false);
        alert('Error during OCR processing');
      });
    } else {
      alert('Please select a file first.');
    }
  };

  return (
    <Box p={3} sx={{ backgroundColor: 'white', borderRadius: 2, boxShadow: 3, mt: 3 }}>
      <Typography variant="h5" mb={2} sx={{ color: 'darkblue' }}>Upload Document</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            type="file"
            onChange={handleFileChange}
            InputProps={{
              startAdornment: <UploadIcon />,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleUpload}
            startIcon={<UploadIcon />}
            sx={{ backgroundColor: 'darkblue' }}
          >
            Upload
          </Button>
        </Grid>
      </Grid>
      {loading && (
        <Box mt={2} display="flex" flexDirection="column" alignItems="center">
          <CircularProgress variant="determinate" value={progress} />
          <Typography mt={2}>Processing... {progress}%</Typography>
        </Box>
      )}
    </Box>
  );
};

export default FileUpload;
