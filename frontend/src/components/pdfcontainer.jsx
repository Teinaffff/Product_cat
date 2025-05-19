import React from "react";
import { Link } from "react-router-dom";
import { Breadcrumb, Spin } from "antd";
import PdfViewer from "./pdfviewer";
import { Content } from "antd/es/layout/layout"; // Ensure correct import for Content

const Pdfdisplay = ({ theme, breadcrumbs, selectedPdf, fileMetadata, pdfLoading }) => {
  return (
    <Content
      role="main"
      style={{
        margin: "10px",
        padding: "20px",
        marginLeft: "60px",
        background: theme === "light" ? "#fff" : "#141414",
        flexGrow: 1,
        maxWidth: "90%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        transition: "background-color 0.3s ease, color 0.3s ease",
        color: theme === "light" ? "#000" : "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <Breadcrumb
          style={{
            marginBottom: "2px",
            marginTop: "5px",
            fontSize: "14px",
            color: theme === "light" ? "#00adef" : "#40a9ff",
          }}
          aria-label="breadcrumb"
        >
          {["Home", ...breadcrumbs].slice(-3).map((breadcrumb, index) => (
            <Breadcrumb.Item key={index}>
              <Link
                to={breadcrumb.path || "#"}
                title={`Go to ${breadcrumb.name || breadcrumb}`}
                style={{
                  color: theme === "light" ? "#00adef" : "#40a9ff",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                  fontWeight: "500",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.color = theme === "light" ? "#40a9ff" : "#00adef")
                }
                onMouseLeave={(e) =>
                  (e.target.style.color = theme === "light" ? "#00adef" : "#40a9ff")
                }
                aria-label={`Navigate to ${breadcrumb.name || breadcrumb}`}
              >
                {breadcrumb.name || breadcrumb}
              </Link>
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      )}

      {/* File Details */}
      {selectedPdf && fileMetadata && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 16px",
            marginBottom: "2px",
          }}
        >
          <strong style={{ fontSize: "16px" }}>
            {fileMetadata.name
              ?.split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </strong>
        </div>
      )}

      {/* PDF Viewer or Loading State */}
      {pdfLoading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spin size="large" aria-live="polite" />
        </div>
      ) : selectedPdf ? (
        <div
          style={{
            animation: "fadeIn 0.3s ease",
            flex: 1,
            background: theme === "light" ? "#f5f5f5" : "#2a2a2a",
            borderRadius: "8px",
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PdfViewer file={selectedPdf} />
          </div>
        </div>
      ) : (
        <p style={{ textAlign: "center", fontSize: "18px", color: "#aaa" }}>
          Select a file to view.
        </p>
      )}
    </Content>
  );
};

export default Pdfdisplay;
