import React from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { searchPlugin } from "@react-pdf-viewer/search";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/search/lib/styles/index.css";


const PdfViewer = ({ file }) => {
  const searchPluginInstance = searchPlugin();

  return (
    <div className="pdf-container">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
        <Viewer fileUrl={file} plugins={[searchPluginInstance]} />
      </Worker>
    </div>
  );
};

export default PdfViewer;
