import * as React from "react";
import { createTheme, ThemeProvider, styled, useTheme } from "@mui/material/styles";
import {
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Container,
  Button,
  IconButton,
  InputBase,
  Badge,
  Avatar,
  Box,
  Typography,
  CssBaseline,
  Tooltip,
  Breadcrumbs,
  Link,
  Menu,
  MenuItem,
  Paper,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SearchIcon from "@mui/icons-material/Search";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { FolderIcon } from "lucide-react";
import { useMediaQuery } from "@mui/material";
import Page from "./page.js";
import Faq from "./faq.js";
import RootFolderManager from './RootFolderManager';
import axios from 'axios';

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#00adef" },
    background: { default: "#f9f9f9" },
    action: { hover: "#f0f0f0" },
  },
  typography: {
    fontSize: 12,
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#00adef" },
    background: { default: "#121212" },
    action: { hover: "#1e1e1e" },
  },
  typography: {
    fontSize: 12,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
  paddingLeft: theme.spacing(2),
}));

const NAVIGATION = [
  { segment: "root-folders", title: "Root Folders", icon: <FolderIcon /> },
  { segment: "folders", title: "Folders", icon: <FolderIcon /> },
  { segment: "faq", title: "FAQ", icon: <HelpOutlineIcon /> },
];

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
  },
}));

const API_BASE_URL = 'http://localhost:5000/api';

// Add notification service
const notificationService = {
  async fetchNotifications() {
    try {
      const response = await axios.get(`${API_BASE_URL}/activity-logs`);
      return response.data;
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      return [];
    }
  },

  async markAsRead(notificationId) {
    try {
      await axios.put(`${API_BASE_URL}/activity-logs/${notificationId}/read`);
    } catch (error) {
      console.error('Error marking activity as read:', error);
    }
  },

  async clearNotification(notificationId) {
    try {
      await axios.delete(`${API_BASE_URL}/activity-logs/${notificationId}`);
    } catch (error) {
      console.error('Error clearing activity:', error);
    }
  }
};

export default function DashboardLayoutBasic() {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [open, setOpen] = React.useState(!isMobile);
  const [selectedPage, setSelectedPage] = React.useState("folders");
  const [darkMode, setDarkMode] = React.useState(false);
  const theme = useTheme();
  
  // Search state
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState([]);
  const [searchAnchorEl, setSearchAnchorEl] = React.useState(null);
  const [isSearching, setIsSearching] = React.useState(false);

  // Add notification states
  const [notifications, setNotifications] = React.useState([]);
  const [notificationAnchorEl, setNotificationAnchorEl] = React.useState(null);
  const [unreadCount, setUnreadCount] = React.useState(0);

  // Fetch and search folders
  const searchFolders = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const response = await axios.get('http://localhost:5000/api/folders/folder-structure');
      const allFolders = [];
      
      // Recursive function to flatten folder structure
      const traverseFolders = (folders, path = '') => {
        folders.forEach(folder => {
          const currentPath = path ? `${path}/${folder.name}` : folder.name;
          allFolders.push({
            name: folder.name,
            path: currentPath,
            id: folder.id,
            type: folder.type
          });
          
          if (folder.children && folder.children.length > 0) {
            traverseFolders(folder.children, currentPath);
          }
        });
      };

      traverseFolders(response.data);
      
      // Filter folders based on search query
      const filteredFolders = allFolders.filter(folder => 
        folder.name.toLowerCase().includes(query.toLowerCase()) ||
        folder.path.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults(filteredFolders);
    } catch (error) {
      console.error('Error searching folders:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce search
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchFolders(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearchClick = (event) => {
    setSearchAnchorEl(event.currentTarget);
  };

  const handleSearchClose = () => {
    setSearchAnchorEl(null);
  };

  const handleSearchItemClick = (folder) => {
    setSelectedPage('folders');
    // You can add additional handling here if needed
    handleSearchClose();
    setSearchQuery('');
  };

  const handleDrawerToggle = () => setOpen(!open);

  const handleNavigation = (segment) => {
    setSelectedPage(segment);
    if (isMobile) setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Add notification polling effect
  React.useEffect(() => {
    const fetchActivities = async () => {
      const activities = await notificationService.fetchNotifications();
      setNotifications(activities);
      setUnreadCount(activities.filter(activity => !activity.read).length);
    };

    // Initial fetch
    fetchActivities();

    // Poll for new activities every 30 seconds
    const pollInterval = setInterval(fetchActivities, 30000);

    return () => clearInterval(pollInterval);
  }, []);

  // Add notification handlers
  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleNotificationRead = async (notificationId) => {
    await notificationService.markAsRead(notificationId);
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleNotificationClear = async (notificationId) => {
    await notificationService.clearNotification(notificationId);
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const getActivityIcon = (action) => {
    switch (action) {
      case 'CREATE': return '📝';
      case 'UPDATE': return '✏️';
      case 'DELETE': return '🗑️';
      case 'MOVE': return '📦';
      default: return '📋';
    }
  };

  const renderPageContent = () => {
    switch (selectedPage) {
      case "root-folders":
        return <RootFolderManager />;
      case "folders":
        return <Page />;
      case "faq":
        return <Faq />;
      default:
        return <Page />;
    }
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <div style={{ display: "flex" }}>
        <AppBar position="fixed" sx={{ bgcolor: "background.paper" }}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { xs: "block", sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Breadcrumbs aria-label="breadcrumb" sx={{ flexGrow: 1 }}>
              <Link color="inherit" href="/">
                Home
              </Link>
              <Typography color="textPrimary">{selectedPage}</Typography>
            </Breadcrumbs>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search folders…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={handleSearchClick}
                />
              </Search>
              <Menu
                anchorEl={searchAnchorEl}
                open={Boolean(searchAnchorEl) && searchResults.length > 0}
                onClose={handleSearchClose}
                PaperProps={{
                  sx: {
                    maxHeight: 400,
                    width: '300px',
                    mt: 1,
                  },
                }}
              >
                {isSearching ? (
                  <MenuItem disabled>
                    <Typography>Searching...</Typography>
                  </MenuItem>
                ) : searchResults.length === 0 ? (
                  <MenuItem disabled>
                    <Typography>No results found</Typography>
                  </MenuItem>
                ) : (
                  searchResults.map((folder, index) => (
                    <MenuItem 
                      key={index} 
                      onClick={() => handleSearchItemClick(folder)}
                      sx={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                      }}
                    >
                      <Typography variant="body1">{folder.name}</Typography>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ fontSize: '0.75rem' }}
                      >
                        Path: {folder.path}
                      </Typography>
                    </MenuItem>
                  ))
                )}
              </Menu>
              <Tooltip title="Toggle Dark Mode">
                <IconButton onClick={toggleDarkMode}>
                  {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Tooltip>
              <Button
                onClick={handleLogout}
                variant="contained"
                sx={{
                  textTransform: "none",
                  fontSize: "14px",
                  backgroundColor: "#00BFFF",
                  color: "#ffffff",
                  '&:hover': {
                    backgroundColor: "#00A6E6",
                  },
                  borderRadius: "8px",
                  padding: "8px 16px",
                  boxShadow: "0 2px 4px rgba(0,191,255,0.2)",
                  transition: "all 0.3s ease",
                }}
              >
                Logout
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        <Drawer
          sx={{
            width: open ? 240 : 72,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: open ? 240 : 72,
              boxSizing: "border-box",
              backgroundColor: "background.paper",
              transition: "width 0.3s ease",
            },
          }}
          variant={isMobile ? "temporary" : "persistent"}
          anchor="left"
          open={open}
          onClose={handleDrawerToggle}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              padding: 2,
              minHeight: 64,
            }}
          >
            <Avatar alt="Admin" src="/static/images/avatar/2.jpg" />
            {open && (
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Admin
              </Typography>
            )}
          </Box>
          <List>
            {NAVIGATION.map((item, index) => (
              <ListItem
                button
                key={index}
                onClick={() => handleNavigation(item.segment)}
                sx={{ pl: open ? 3 : 2 }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {item.icon}
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{ fontSize: 14 }}
                  />
                )}
              </ListItem>
            ))}
          </List>
        </Drawer>

        <main style={{ flexGrow: 1, padding: "24px", marginTop: 64 }}>
          <Container>{renderPageContent()}</Container>
        </main>
      </div>
    </ThemeProvider>
  );
}