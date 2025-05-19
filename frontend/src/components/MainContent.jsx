import React from "react";
import { Layout, Breadcrumb, Spin, Typography } from "antd";
import { Link } from "react-router-dom";
import PDFViewer from "./pdfviewer";

const { Content } = Layout;
const { Text } = Typography;

const MainContent = ({ breadcrumbs, selectedPdf, pdfLoading, fileMetadata }) => {
  return (
    <Content className="content" role="main">
      {breadcrumbs.length > 0 && (
        <Breadcrumb className="breadcrumb" aria-label="breadcrumb">
          {["Home", ...breadcrumbs].slice(-3).map((breadcrumb) => (
            <Breadcrumb.Item key={breadcrumb.path}>
              <Link to={breadcrumb.path} aria-label={`Navigate to ${breadcrumb.name}`}>
                {breadcrumb.name}
              </Link>
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      )}

      {selectedPdf && fileMetadata && (
        <div className="file-metadata">
          <Text strong>{fileMetadata.name}</Text>
        </div>
      )}

      {pdfLoading ? (
        <div className="loading-spinner">
          <Spin size="large" aria-live="polite" />
        </div>
      ) : selectedPdf ? (
        <div className="pdf-viewer-container">
          <PDFViewer file={selectedPdf} />
        </div>
      ) : (
        <Text className="placeholder-text">Select a file to view.</Text>
      )}
    </Content>
  );
};

export default MainContent;