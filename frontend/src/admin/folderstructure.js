import React, { useState, useEffect } from 'react';
import { getFolderStructure } from './api';
import { List, ListItem, ListItemText, ListItemIcon, Collapse, IconButton } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FileIcon from '@mui/icons-material/InsertDriveFile';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const FolderStructure = () => {
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFolderStructure();
        setFolders(response.data);
      } catch (error) {
        console.error('Error fetching folder structure:', error);
      }
    };
    fetchData();
  }, []);

  const renderFolders = (items) => {
    return items.map((item) => (
      <div key={item.path}>
        <ListItem button>
          <ListItemIcon>
            {item.type === 'folder' ? (
              item.children.length ? <FolderOpenIcon /> : <FolderIcon />
            ) : (
              <FileIcon />
            )}
          </ListItemIcon>
          <ListItemText primary={item.name} />
          {item.type === 'folder' && item.children.length > 0 && (
            <IconButton edge="end">
              <ExpandMoreIcon />
            </IconButton>
          )}
        </ListItem>
        {item.type === 'folder' && item.children.length > 0 && (
          <Collapse in={true} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {renderFolders(item.children)}
            </List>
          </Collapse>
        )}
      </div>
    ));
  };

  return (
    <List>
      {renderFolders(folders)}
    </List>
  );
};

export default FolderStructure;
