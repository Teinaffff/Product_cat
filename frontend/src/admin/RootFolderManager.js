import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

const RootFolderManager = () => {
  const [rootFolders, setRootFolders] = useState([]);
  const [newRootName, setNewRootName] = useState('');
  const [editDialog, setEditDialog] = useState({ open: false, folder: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch root folders
  const fetchRootFolders = async () => {
    try {
      console.log('Fetching root folders in RootFolderManager...');
      const response = await api.get('/folders/folder-structure');
      console.log('Folder structure response:', response.data);
      // Filter to get root level folders
      const rootLevelFolders = response.data.filter(folder => !folder.parentPath);
      console.log('Root level folders:', rootLevelFolders);
      setRootFolders(rootLevelFolders.map(folder => ({
        id: folder.id || folder.path,
        name: folder.name,
        path: folder.path
      })));
    } catch (error) {
      console.error('Error fetching root folders:', {
        error: error,
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch root folders';
      showSnackbar(errorMessage, 'error');
    }
  };

  useEffect(() => {
    fetchRootFolders();
  }, []);

  // Create new root folder
  const createRootFolder = async () => {
    if (!newRootName.trim()) {
      showSnackbar('Please enter a root folder name', 'error');
      return;
    }

    try {
      console.log('Creating root folder:', newRootName);
      const response = await api.post('/folders/create-folder', {
        folderName: newRootName,
        parentFolderPath: '', // Empty string indicates root level
        isRoot: true
      });
      console.log('Root folder creation response:', response.data);
      showSnackbar('Root folder created successfully', 'success');
      setNewRootName('');
      await fetchRootFolders(); // Make sure to await the fetch
    } catch (error) {
      console.error('Error creating root folder:', {
        error: error,
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create root folder';
      showSnackbar(errorMessage, 'error');
    }
  };

  // Update root folder
  const updateRootFolder = async () => {
    if (!editDialog.folder || !editDialog.folder.newName.trim()) {
      showSnackbar('Please enter a valid name', 'error');
      return;
    }

    try {
      console.log('Updating root folder:', editDialog.folder);
      const response = await api.put('/folders/rename-item', {
        itemPath: editDialog.folder.path,
        newName: editDialog.folder.newName
      });
      console.log('Root folder update response:', response.data);
      showSnackbar('Root folder updated successfully', 'success');
      setEditDialog({ open: false, folder: null });
      await fetchRootFolders(); // Make sure to await the fetch
    } catch (error) {
      console.error('Error updating root folder:', {
        error: error,
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update root folder';
      showSnackbar(errorMessage, 'error');
    }
  };

  // Delete root folder
  const deleteRootFolder = async (folderId) => {
    try {
      console.log('Deleting root folder:', folderId);
      const response = await api.delete('/folders/delete-item', {
        data: { itemPath: folderId }
      });
      console.log('Root folder deletion response:', response.data);
      showSnackbar('Root folder deleted successfully', 'success');
      await fetchRootFolders(); // Make sure to await the fetch
    } catch (error) {
      console.error('Error deleting root folder:', {
        error: error,
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete root folder';
      showSnackbar(errorMessage, 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h6" gutterBottom>
          Root Folder Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, marginBottom: 3 }}>
          <TextField
            fullWidth
            label="New Root Folder Name"
            value={newRootName}
            onChange={(e) => setNewRootName(e.target.value)}
            size="small"
          />
          <Button
            variant="contained"
            onClick={createRootFolder}
            sx={{ minWidth: 120 }}
          >
            Create Root
          </Button>
        </Box>

        <List>
          {rootFolders.map((folder) => (
            <ListItem key={folder.id} divider>
              <ListItemText primary={folder.name} />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() =>
                    setEditDialog({
                      open: true,
                      folder: { ...folder, newName: folder.name },
                    })
                  }
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => deleteRootFolder(folder.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Edit Dialog */}
      <Dialog
        open={editDialog.open}
        onClose={() => setEditDialog({ open: false, folder: null })}
      >
        <DialogTitle>Edit Root Folder</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Folder Name"
            value={editDialog.folder?.newName || ''}
            onChange={(e) =>
              setEditDialog({
                ...editDialog,
                folder: { ...editDialog.folder, newName: e.target.value },
              })
            }
            sx={{ marginTop: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, folder: null })}>
            Cancel
          </Button>
          <Button onClick={updateRootFolder} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
};

export default RootFolderManager; 