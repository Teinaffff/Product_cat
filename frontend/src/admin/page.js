import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Box,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const FolderManager = ({ selectedRootFolder }) => {
  // State for Root Folder Selection
  const [rootFolders, setRootFolders] = useState([]);
  const [selectedRootFolderState, setSelectedRootFolderState] = useState('');

  // State for Create Folder
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedParentFolder, setSelectedParentFolder] = useState('');

  // State for Upload File
  const [file, setFile] = useState(null);
  const [selectedUploadFolder, setSelectedUploadFolder] = useState('');

  // State for Folder Structure
  const [folderStructure, setFolderStructure] = useState([]);

  // State for Snackbar (Success messages)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('');

  // State for Edit Dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentItemPath, setCurrentItemPath] = useState('');
  const [currentItemName, setCurrentItemName] = useState('');

  // State for Delete Confirmation
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    console.log('FolderManager mounted, fetching root folders...');
    fetchRootFolders();
  }, []);

  useEffect(() => {
    if (selectedRootFolder) {
      setSelectedRootFolderState(selectedRootFolder.id || selectedRootFolder.path);
      fetchFolderStructure(selectedRootFolder.id || selectedRootFolder.path);
    }
  }, [selectedRootFolder]);

  // Fetch Root Folders
  const fetchRootFolders = async () => {
    try {
      console.log('Fetching root folders in FolderManager...');
      const response = await axios.get('http://localhost:5000/api/folders/folder-structure');
      console.log('Folder structure response:', response.data);
      // Filter to get root level folders
      const rootLevelFolders = response.data.filter(folder => !folder.parentPath);
      console.log('Root level folders:', rootLevelFolders);
      setRootFolders(rootLevelFolders);
      
      // If we have root folders but none selected, select the first one
      if (rootLevelFolders.length > 0 && !selectedRootFolderState) {
        const firstRoot = rootLevelFolders[0];
        setSelectedRootFolderState(firstRoot.id || firstRoot.path);
        fetchFolderStructure(firstRoot.id || firstRoot.path);
      }
    } catch (error) {
      console.error('Error fetching root folders:', error);
      showSnackbar('Failed to fetch root folders', 'error');
    }
  };

  // Fetch Folder Structure for Selected Root
  const fetchFolderStructure = async (rootId) => {
    try {
      console.log('Fetching folder structure for root:', rootId);
      const response = await axios.get(`http://localhost:5000/api/folders/folder-structure`);
      // Get the full structure but only show folders under the selected root
      const allFolders = response.data;
      const selectedRootStructure = allFolders.find(folder => 
        (folder.id === rootId || folder.path === rootId)
      );
      console.log('Selected root structure:', selectedRootStructure);
      setFolderStructure(selectedRootStructure ? [selectedRootStructure] : []);
      setRootFolders(allFolders.filter(folder => !folder.parentPath));
    } catch (error) {
      console.error('Error fetching folder structure:', error);
      showSnackbar('Failed to fetch folder structure', 'error');
    }
  };

  // Handle Root Folder Change
  const handleRootFolderChange = (event) => {
    const rootId = event.target.value;
    console.log('Selected root folder:', rootId);
    setSelectedRootFolderState(rootId);
    fetchFolderStructure(rootId);
    setSelectedParentFolder('');
    setSelectedUploadFolder('');
  };

  // Modified create folder function
  const createFolder = async () => {
    if (!newFolderName || !selectedRootFolderState) {
      showSnackbar('Please select a root folder and enter a folder name', 'error');
      return;
    }

    try {
      // Clean up the folder name
      const cleanFolderName = newFolderName.trim();
      
      // Get the selected root folder
      const selectedRoot = rootFolders.find(root => 
        root.id === selectedRootFolderState || root.path === selectedRootFolderState
      );
      
      if (!selectedRoot) {
        showSnackbar('Please select a valid root folder', 'error');
        return;
      }

      // Determine the parent path
      // If no parent folder is selected, create directly under root
      const parentPath = selectedParentFolder || selectedRoot.path || selectedRoot.name;
      
      const payload = {
        folderName: cleanFolderName,
        parentFolderPath: parentPath,
        rootId: selectedRootFolderState
      };

      console.log('Creating folder with payload:', payload);
      
      const response = await axios.post('http://localhost:5000/api/folders/create-folder', payload);
      
      console.log('Server response:', response.data);
      
      showSnackbar('Folder created successfully', 'success');
      setNewFolderName('');
      setSelectedParentFolder('');
      await fetchFolderStructure(selectedRootFolderState);
    } catch (error) {
      console.error('Error creating folder:', error);
      let errorMessage = error.response?.data?.message || 'Failed to create folder';
      showSnackbar(errorMessage, 'error');
    }
  };

  // Modified showSnackbar function to show more details
  const showSnackbar = (message, color) => {
    console.log('Showing snackbar:', { message, color });
    setSnackbarMessage(message);
    setSnackbarColor(color);
    setSnackbarOpen(true);
  };

  // Modified upload file function
  const uploadFile = async () => {
    if (!file || !selectedRootFolderState) {
      showSnackbar('Please select a root folder and a file to upload', 'error');
      return;
    }

    try {
      // Get the selected root folder
      const selectedRoot = rootFolders.find(root => 
        root.id === selectedRootFolderState || root.path === selectedRootFolderState
      );
      
      if (!selectedRoot) {
        showSnackbar('Please select a valid root folder', 'error');
        return;
      }

      // Determine the upload path - remove any absolute path components
      let uploadPath = selectedUploadFolder || selectedRoot.path || selectedRoot.name;
      // Convert backslashes to forward slashes and remove any leading/trailing slashes
      uploadPath = uploadPath.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folderPath', uploadPath);

      console.log('Uploading file:', {
        fileName: file.name,
        folderPath: uploadPath
      });

      const response = await axios.post('http://localhost:5000/api/files/upload-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Upload response:', response.data);
      showSnackbar('File uploaded successfully', 'success');
      setFile(null);
      // Reset the file input
      const fileInput = document.getElementById('file-upload');
      if (fileInput) fileInput.value = '';
      fetchFolderStructure(selectedRootFolderState);
    } catch (error) {
      console.error('Error uploading file:', error);
      const errorMessage = error.response?.data?.message || 'Failed to upload file';
      showSnackbar(errorMessage, 'error');
    }
  };

  // Handle File Upload
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Rename Item Function (open edit dialog)
  const openEditDialog = (path, name) => {
    setCurrentItemPath(path);
    setCurrentItemName(name);
    setIsEditDialogOpen(true);
  };

  // Submit Rename Item Function
  const renameItem = async () => {
    if (!currentItemName) {
      alert('Please enter a new name');
      return;
    }

    try {
      const response = await axios.put('http://localhost:5000/api/folders/rename-item', {
        itemPath: currentItemPath,
        newName: currentItemName,
      });
      showSnackbar('Item renamed successfully', 'green');
      setIsEditDialogOpen(false);
      fetchFolderStructure(selectedRootFolderState);
    } catch (error) {
      console.error('Error renaming item:', error);
      alert('Failed to rename item');
    }
  };

  // Delete Item Function (open delete confirmation dialog)
  const openDeleteDialog = (path, name) => {
    setCurrentItemPath(path);
    setCurrentItemName(name);
    setIsDeleteDialogOpen(true);
  };

  // Confirm Deletion
  const confirmDeleteItem = async () => {
    try {
      const response = await axios.delete('http://localhost:5000/api/folders/delete-item', {
        data: { itemPath: currentItemPath },
      });
      showSnackbar('Item deleted successfully', 'red');
      setIsDeleteDialogOpen(false);
      fetchFolderStructure(selectedRootFolderState);
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item');
    }
  };

  // Modified renderFolderStructure function to show files as well
  const renderFolderStructure = (items) => {
    return items.map((item, index) => (
      <Box key={index} sx={{ marginLeft: '20px' }}>
        <Card
          variant="outlined"
          sx={{
            marginBottom: '8px',
            backgroundColor: '#f9f9f9',
            '&:hover': { backgroundColor: '#f0f0f0' },
          }}
        >
          <CardContent sx={{ padding: '8px !important' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {item.type === 'folder' ? (
                <FolderIcon sx={{ color: 'gold', marginRight: '8px' }} />
              ) : (
                <InsertDriveFileIcon sx={{ color: '#00adef', marginRight: '8px' }} />
              )}
              <Typography variant="body1">{item.name}</Typography>

              <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                {item.type === 'folder' && (
                  <>
                    <IconButton
                      onClick={() => openEditDialog(item.path, item.name)}
                      size="small"
                    >
                      <EditIcon fontSize="small" sx={{ color: '#0073e6' }} />
                    </IconButton>
                    <IconButton
                      onClick={() => openDeleteDialog(item.path, item.name)}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" sx={{ color: 'red' }} />
                    </IconButton>
                  </>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>

        {item.children && item.children.length > 0 && (
          <Box sx={{ marginLeft: '20px' }}>
            {renderFolderStructure(item.children)}
          </Box>
        )}
      </Box>
    ));
  };

  // Modified flattenFolders function to handle nested paths correctly
  const flattenFolders = (folders) => {
    let flatFolders = [];
    const traverse = (folder, parentPath = '') => {
      const currentPath = parentPath ? `${parentPath}/${folder.name}` : folder.name;
      
      if (folder.type === 'folder') {
        flatFolders.push({
          id: folder.id,
          name: folder.name,
          path: currentPath,
          displayPath: currentPath.split('/').join(' > ')
        });
      }
      if (folder.children && folder.children.length > 0) {
        folder.children.forEach(child => traverse(child, currentPath));
      }
    };

    folders.forEach(folder => traverse(folder));
    return flatFolders;
  };

  // Get flattened folders including all roots and their children
  const allFlattenedFolders = flattenFolders(folderStructure);

  return (
    <Grid container spacing={2} sx={{ marginTop: '20px', padding: '16px' }}>
      {/* Left Side - Folder Structure */}
      <Grid item xs={12} md={8}>
        <Box sx={{ marginBottom: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Select Root Folder</InputLabel>
            <Select
              value={selectedRootFolderState}
              onChange={handleRootFolderChange}
              label="Select Root Folder"
            >
              {rootFolders.map((folder) => (
                <MenuItem key={folder.id || folder.path} value={folder.id || folder.path}>
                  {folder.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        
        <Typography variant="h5" sx={{ fontSize: '18px', marginBottom: '16px' }}>
          Folder Structure
        </Typography>
        <Box sx={{ maxHeight: '600px', overflowY: 'auto', border: '1px solid #ddd', padding: '8px', borderRadius: '5px' }}>
          {renderFolderStructure(folderStructure)}
        </Box>
      </Grid>

      {/* Right Side - Actions */}
      <Grid item xs={12} md={4}>
        <Paper elevation={3} sx={{ padding: '24px', borderRadius: '10px', backgroundColor: '#fff' }}>
          {/* Create Folder Section */}
          <Typography variant="h6" sx={{ fontSize: '16px', marginBottom: '16px' }}>
            <FolderOpenIcon sx={{ color: '#00adef', marginRight: '8px', verticalAlign: 'middle' }} />
            Create New Folder
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="Folder Name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              fullWidth
              size="small"
              disabled={!selectedRootFolderState}
            />

            <FormControl fullWidth size="small">
              <InputLabel>Parent Folder (Optional)</InputLabel>
              <Select
                value={selectedParentFolder}
                onChange={(e) => setSelectedParentFolder(e.target.value)}
                label="Parent Folder (Optional)"
                disabled={!selectedRootFolderState}
              >
                <MenuItem value="">
                  <em>Create directly under root</em>
                </MenuItem>
                {flattenFolders(folderStructure).map((folder) => (
                  <MenuItem key={folder.path} value={folder.path}>
                    {folder.displayPath}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              onClick={createFolder}
              disabled={!selectedRootFolderState || !newFolderName}
              startIcon={<CreateNewFolderIcon />}
              fullWidth
            >
              Create Folder
            </Button>
          </Stack>

          {/* Upload File Section */}
          <Typography variant="h6" sx={{ fontSize: '16px', marginBottom: '16px', marginTop: '24px' }}>
            <UploadFileIcon sx={{ color: '#00adef', marginRight: '8px', verticalAlign: 'middle' }} />
            Upload File
          </Typography>

          <Stack spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Upload to Folder</InputLabel>
              <Select
                value={selectedUploadFolder}
                onChange={(e) => setSelectedUploadFolder(e.target.value)}
                label="Upload to Folder"
                disabled={!selectedRootFolderState}
              >
                <MenuItem value="">Root Level</MenuItem>
                {allFlattenedFolders.map((folder) => (
                  <MenuItem key={folder.path} value={folder.fullPath || folder.path}>
                    {folder.path}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <input
              type="file"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="file-upload"
              disabled={!selectedRootFolderState}
            />
            <label htmlFor="file-upload">
              <Button
                component="span"
                variant="outlined"
                fullWidth
                disabled={!selectedRootFolderState}
                startIcon={<UploadFileIcon />}
              >
                Choose File
              </Button>
            </label>

            {file && (
              <Typography variant="body2" sx={{ color: '#00adef' }}>
                Selected file: {file.name}
              </Typography>
            )}

            <Button
              variant="contained"
              onClick={uploadFile}
              disabled={!selectedRootFolderState || !file}
              startIcon={<CloudUploadIcon />}
              fullWidth
            >
              Upload File
            </Button>
          </Stack>
        </Paper>
      </Grid>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        sx={{
          backgroundColor: snackbarColor === 'green' ? 'green' : 'red',
        }}
      />

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
        <DialogTitle>Edit Folder</DialogTitle>
        <DialogContent>
          <Typography>Editing: {currentItemName}</Typography>
          <TextField
            label="New Name"
            value={currentItemName}
            onChange={(e) => setCurrentItemName(e.target.value)}
            fullWidth
            sx={{ marginTop: '16px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={renameItem} color="primary">
            Rename
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Delete Folder</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{currentItemName}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteItem} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default FolderManager;