import React, { useState } from 'react';
import { Avatar, Box, Typography, TextField, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Divider, Grid, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FileUpload from './FileUpload';

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleUpload = (document) => {
    setDocuments([...documents, document]);
  };

  const handleDelete = (index) => {
    const updatedDocuments = documents.filter((_, i) => i !== index);
    setDocuments(updatedDocuments);
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
    doc.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box p={3} sx={{ backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography variant="h4" sx={{ color: 'darkblue', fontWeight: 'bold' }}>Welcome to Your Dashboard</Typography>
        <Avatar sx={{ bgcolor: 'darkblue', width: 56, height: 56 }}>L</Avatar>
      </Grid>
      
      <Grid container spacing={3} mt={3}>
        <Grid item xs={12} md={6}>
          <FileUpload onUpload={handleUpload} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Search by title, tag, or text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            sx={{ mb: 3 }}
          />
          <Typography variant="h6" sx={{ color: 'darkblue' }}>Documents</Typography>
          <Paper sx={{ height: 300, overflowY: 'auto', padding: 2 }}>
            {filteredDocuments.length === 0 ? (
              <Typography>No documents yet.</Typography>
            ) : (
              <List>
                {filteredDocuments.map((doc, index) => (
                  <Box key={index} mb={2}>
                    <ListItem sx={{ backgroundColor: 'white', borderRadius: 2, boxShadow: 1, alignItems: 'flex-start' }}>
                      <ListItemText
                        primary={doc.title}
                        secondary={
                          <>
                            <Typography component="span" variant="body2"><strong>Category:</strong> {doc.category}</Typography><br />
                            <Typography component="span" variant="body2"><strong>Tags:</strong> {doc.tags.join(', ')}</Typography><br />
                            <Typography component="span" variant="body2"><strong>Text:</strong> {doc.text.substring(0, 100)}...</Typography>
                          </>
                        }
                      />
                      <img src={".\logo.svg"} alt={doc.title} style={{ width: 100, height: 100, marginLeft: 20, borderRadius: 8, objectFit: 'cover' }} />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(index)}>
                          <DeleteIcon sx={{ color: 'darkblue' }} />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                  </Box>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
