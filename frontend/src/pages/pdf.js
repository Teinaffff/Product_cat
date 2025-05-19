import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { scrollModePlugin } from '@react-pdf-viewer/scroll-mode';
import { Box, Fab } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/zoom/lib/styles/index.css';

const PdfViewer = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const filePath = params.get('filePath');

  const [pdfFile, setPdfFile] = React.useState(null);
  const [showScrollTop, setShowScrollTop] = React.useState(false);

  // Initialize plugins
  const zoomPluginInstance = React.useMemo(() => zoomPlugin(), []);
  const scrollModePluginInstance = React.useMemo(() => scrollModePlugin(), []);
  const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance;

  React.useEffect(() => {
    if (filePath) {
      fetch(`http://localhost:5000/api/files/view?filePath=${encodeURIComponent(filePath)}`)
        .then(response => response.blob())
        .then(blob => setPdfFile(URL.createObjectURL(blob)))
        .catch(error => console.error('Error loading PDF:', error));
    }
  }, [filePath]);

  React.useEffect(() => {
    const handleScroll = (e) => {
      if (e.target) {
        setShowScrollTop(e.target.scrollTop > 300);
      }
    };

    const pdfContainer = document.querySelector('.rpv-core__viewer-content');
    if (pdfContainer) {
      pdfContainer.addEventListener('scroll', handleScroll);
      return () => pdfContainer.removeEventListener('scroll', handleScroll);
    }
  }, [pdfFile]); // Add pdfFile as dependency to ensure listener is added after PDF loads

  const scrollToTop = () => {
    const pdfContainer = document.querySelector('.rpv-core__viewer-content');
    if (pdfContainer) {
      pdfContainer.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Box sx={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      {/* Zoom controls */}
      <Box
        sx={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 1000,
          backgroundColor: '#fff',
          borderRadius: '4px',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          padding: '8px',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        <ZoomOutButton />
        <ZoomPopover />
        <ZoomInButton />
      </Box>

      {/* Back to top button */}
      {showScrollTop && (
        <Fab
          color="primary"
          size="small"
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1000
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      )}

      {/* PDF viewer */}
      <Box
        sx={{
          height: '100%',
          overflow: 'hidden',
          bgcolor: 'grey.100',
          '& .rpv-core__viewer': {
            width: '100%',
            height: '100%',
          },
          '& .rpv-core__viewer-content': {
            overflow: 'auto',
            height: '100%',
          },
        }}
      >
        {pdfFile ? (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <Viewer
              fileUrl={pdfFile}
              plugins={[
                zoomPluginInstance,
                scrollModePluginInstance,
              ]}
              defaultScale={1}
            />
          </Worker>
        ) : (
          <Box sx={{ p: 2 }}>Loading PDF...</Box>
        )}
      </Box>
    </Box>
  );
};

export default PdfViewer;
