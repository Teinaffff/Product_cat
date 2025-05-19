// import React, { useState, useEffect } from "react";
// import {
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Drawer,
//   IconButton,
//   List,
//   TextField,
//   Typography,
//   InputAdornment,
// } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import SearchIcon from "@mui/icons-material/Search";
// import { Document, Page } from "react-pdf";
// import Introduction from "../components/introduction";
// import { ListItem, ListItemText } from "@mui/material";


// const App = () => {
//   const [folderStructure, setFolderStructure] = useState([]);
//   const [selectedPdf, setSelectedPdf] = useState("");
//   const [numPages, setNumPages] = useState(null);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
//   const [pdfScale, setPdfScale] = useState(1.5);
//   const [selectedFolder, setSelectedFolder] = useState("");
//   const [selectedSubfolder, setSelectedSubfolder] = useState("");
//   const [selectedFile, setSelectedFile] = useState("");

//   // Fetch folder structure from API
//   useEffect(() => {
//     fetch("http://localhost:5000/api/folders/folder-structure")
//       .then((res) => res.json())
//       .then((data) => setFolderStructure(data))
//       .catch((err) => console.error("Error fetching folder structure:", err));
//   }, []);

//   // Handle PDF file selection
//   const handleFileClick = (path) => {
//     const [folderName, subfolderName, fileName] = path.split("\\").slice(-3);

//     const pdfUrl = `http://localhost:5000/api/files/pdf-viewer?folder=${encodeURIComponent(folderName)}&subfolder=${encodeURIComponent(subfolderName)}&file=${encodeURIComponent(fileName)}`;
//     setSelectedPdf(pdfUrl);
//     setSelectedFolder(folderName);
//     setSelectedSubfolder(subfolderName);
//     setSelectedFile(fileName.replace(/\.pdf$/, ""));
//     setDrawerOpen(false);
//   };

//   // Filter folders based on search term
//   const filterFolders = (folders) => {
//     return folders.filter((item) => {
//       if (item.type === "folder") {
//         return (
//           item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           filterFolders(item.children).length > 0
//         );
//       } else if (item.type === "file") {
//         return item.name.toLowerCase().includes(searchTerm.toLowerCase());
//       }
//       return false;
//     });
//   };

//   // Responsive design: Update mobile/desktop state on resize
//   useEffect(() => {
//     const handleResize = () => {
//       const isMobileView = window.innerWidth < 900;
//       setIsMobile(isMobileView);
//       setPdfScale(isMobileView ? 0.7 : 1.5);
//       if (!isMobileView) {
//         setDrawerOpen(false);
//       }
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Load all pages when the PDF document is loaded
//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages);
//   };

//   // Render folder structure
//   const renderFolderStructure = (folders, depth = 0) => {
//     return folders.map((item, index) => {
//       const paddingLeft = depth * 20;

//       if (item.type === "folder") {
//         return (
//           <div key={item.name}>
//             <Accordion sx={{ boxShadow: "none", paddingLeft: `${paddingLeft + 10}px` }}>
//               <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                 <Typography sx={{ fontWeight: "bold" }}>{item.name}</Typography>
//               </AccordionSummary>
//               <AccordionDetails sx={{ paddingLeft: 0 }}>
//                 {renderFolderStructure(item.children, depth + 1)}
//               </AccordionDetails>
//             </Accordion>
//           </div>
//         );
//       } else if (item.type === "file") {
//         return (
//           <ListItem button key={item.name} onClick={() => handleFileClick(item.path)} sx={{ paddingLeft: `${paddingLeft + 30}px` }}>
//             <ListItemText primary={item.name.replace(/\.pdf$/, "")} />
//           </ListItem>
//         );
//       }
//       return null;
//     });
//   };

//   return (
//     <div style={{ display: "flex", height: "100vh" }}>
//       {/* Drawer for mobile sidebar */}
//       <Drawer
//         anchor="left"
//         open={drawerOpen}
//         onClose={() => setDrawerOpen(false)}
//         sx={{ width: 240 }}
//       >
//         <TextField
//           variant="outlined"
//           size="small"
//           placeholder="Search..."
//           onChange={(e) => setSearchTerm(e.target.value)}
//           sx={{ marginBottom: 2 }}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchIcon sx={{ fontSize: "1rem", color: "#00adef" }} />
//               </InputAdornment>
//             ),
//           }}
//         />
//         <List>{renderFolderStructure(filterFolders(folderStructure))}</List>
//       </Drawer>

//       {/* Persistent Sidebar for desktop */}
//       <List sx={{ width: 300, display: { xs: "none", md: "block" }, paddingTop: 5, overflowY: "auto" }}>
//         <TextField
//           variant="outlined"
//           size="small"
//           placeholder="Search..."
//           onChange={(e) => setSearchTerm(e.target.value)}
//           sx={{ marginBottom: 2 }}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchIcon sx={{ fontSize: "1.2rem", color: "#00adef" }} />
//               </InputAdornment>
//             ),
//           }}
//         />
//         {renderFolderStructure(filterFolders(folderStructure))}
//       </List>

//       {/* Main content area for displaying PDFs */}
//       <div style={{ flexGrow: 1, padding: 16, overflow: "auto" }}>
//         {selectedPdf ? (
//           <>
//          <ListItem sx={{ fontSize: '0.875rem', fontWeight: '400' }}>
//   <ListItemText
//     primary={`${selectedFolder} > ${selectedSubfolder} > ${selectedFile}`}
//     sx={{
//       fontSize: '0.875rem', // Same font size as Typography's body2
//       fontWeight: '400', // Default font weight
//       marginBottom: 1, // Adjust margin like Typography's marginBottom
//       textTransform: 'lowercase', // Forces all text to be lowercase
//     }}
//   />
// </ListItem>



//             <Document file={selectedPdf} onLoadSuccess={onDocumentLoadSuccess}>
//               {Array.from(new Array(numPages), (el, index) => (
//                 <Page key={`page_${index + 1}`} pageNumber={index + 1} scale={pdfScale} />
//               ))}
//             </Document>
//           </>
//         ) : (
//           <Introduction />
//         )}
//       </div>

//       {/* Mobile hamburger icon */}
//       {isMobile && (
//         <IconButton
//           onClick={() => setDrawerOpen(true)}
//           sx={{ position: "fixed", top: 10, left: 10, zIndex: 1500 }}
//         >
//           <MenuIcon />
//         </IconButton>
//       )}
//     </div>
//   );
// };

// export default App;
