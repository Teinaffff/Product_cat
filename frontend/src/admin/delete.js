import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { deleteItem } from './api';

const FolderDeleter = ({ open, onClose, itemPath }) => {
  const handleDelete = async () => {
    try {
      await deleteItem({ itemPath });
      onClose(); // Close the dialog after success
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Folder/File</DialogTitle>
      <DialogContent>
        Are you sure you want to delete this folder/file?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancel</Button>
        <Button onClick={handleDelete} color="primary">Delete</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FolderDeleter;
