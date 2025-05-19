// App.js
import React, { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "../components/sidebar";
import MainContent from "../components/filereader";

const App = () => {
  const [folderStructure, setFolderStructure] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const [pdfScale, setPdfScale] = useState(1.5);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [selectedSubfolder, setSelectedSubfolder] = useState("");
  const [selectedFile, setSelectedFile] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/folders/structure")
      .then((res) => res.json())
      .then((data) => setFolderStructure(data))
      .catch((err) => console.error("Error fetching folder structure:", err));
  }, []);

  const handleFileClick = (path) => {
    const parts = path.split("\\");
    const folderName = parts[parts.length - 3];
    const subfolderName = parts[parts.length - 2];
    const pdfFileName = parts[parts.length - 1];
    const pdfUrl = `http://localhost:5000/api/files/pdf-viewer?folder=${encodeURIComponent(folderName)}&subfolder=${encodeURIComponent(subfolderName)}&file=${encodeURIComponent(pdfFileName)}`;

    setSelectedPdf(pdfUrl);
    setSelectedFolder(folderName);
    setSelectedSubfolder(subfolderName);
    setSelectedFile(pdfFileName.replace(/\.pdf$/, ""));
    setDrawerOpen(false);
  };

  const filterFolders = (folders) => {
    return folders.filter((item) => {
      if (item.type === "folder") {
        return (
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          filterFolders(item.children).length > 0
        );
      } else if (item.type === "file") {
        return item.name.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return false;
    });
  };

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 900;
      setIsMobile(isMobileView);
      setPdfScale(isMobileView ? 0.7 : 1.5);
      if (!isMobileView) {
        setDrawerOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        folderStructure={folderStructure}
        filterFolders={filterFolders}
        handleFileClick={handleFileClick}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        isMobile={isMobile}
      />
      <MainContent
        selectedPdf={selectedPdf}
        numPages={numPages}
        pdfScale={pdfScale}
        selectedFolder={selectedFolder}
        selectedSubfolder={selectedSubfolder}
        selectedFile={selectedFile}
        onDocumentLoadSuccess={onDocumentLoadSuccess}
      />
      {isMobile && (
        <IconButton onClick={() => setDrawerOpen(true)} sx={{ position: "fixed", top: 10, left: 10 }}>
          <MenuIcon />
        </IconButton>
      )}
    </div>
  );
};

export default App;
