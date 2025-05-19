import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Layout,
  Menu,
  Drawer,
  Button,
  Spin,
  Input,
  message,
  Breadcrumb,
  Tooltip,
  Space,
  Typography,
  Skeleton,
  Card,
} from "antd";
import {
  MenuOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FolderOpenOutlined,
  FileOutlined,
  SearchOutlined,
  ReloadOutlined,
  CloseCircleOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  ExpandOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";
import { debounce } from "lodash";
import PDFViewer from "./pdfviewer";
import { Link } from "react-router-dom";
import Logoimage from "../assets/images/bb.png";
import "antd/dist/reset.css";
import Fuse from "fuse.js";
import "./ProductCatalog.css";
import apiService from "./api";

const { Header, Sider, Content, Footer } = Layout;
const { Search } = Input;
const { SubMenu } = Menu;
const { Text, Title } = Typography;

const useFolderStructure = () => {
  const [folderStructure, setFolderStructure] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFolderStructure = async () => {
    setLoading(true);
    try {
      const data = await apiService.fetchFolderStructure();
      setFolderStructure(data);
    } catch (error) {
      message.error("Failed to load folder structure. Please try again later.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolderStructure();
  }, []);

  return { folderStructure, loading, fetchFolderStructure };
};

const PDFViewerControls = ({ onZoomIn, onZoomOut, onFitToWidth, onScrollToTop }) => (
  <div className="pdf-controls" style={{ marginTop: '8px', textAlign: 'center' }}>
    <Tooltip title="Zoom In">
      <Button icon={<ZoomInOutlined style={{ fontSize: '12px', color: '#00adef' }} />} onClick={onZoomIn} aria-label="Zoom in" />
    </Tooltip>
    <Tooltip title="Zoom Out">
      <Button icon={<ZoomOutOutlined style={{ fontSize: '12px', color: '#00adef' }} />} onClick={onZoomOut} aria-label="Zoom out" />
    </Tooltip>
    <Tooltip title="Fit to Width">
      <Button icon={<ExpandOutlined style={{ fontSize: '12px', color: '#00adef' }} />} onClick={onFitToWidth} aria-label="Fit to width" />
    </Tooltip>
    <Tooltip title="Back to Top">
      <Button icon={<UpOutlined style={{ fontSize: '12px', color: '#00adef' }} />} onClick={onScrollToTop} aria-label="Back to top" />
    </Tooltip>
  </div>
);

const FileMetadata = ({ name, size, lastModified }) => (
  <div className="file-metadata" style={{ marginBottom: '8px' }}>
    <Text strong style={{ fontSize: '16px' }}>{name}</Text>
    <Text type="secondary" style={{ fontSize: '12px', marginLeft: '8px' }}>
      {size} KB · Last modified: {lastModified}
    </Text>
  </div>
);

const WelcomeCard = () => (
  <Card
    style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', textAlign: 'center', padding: '24px' }}
    bordered={false}
  >
    <Title level={3} style={{ color: '#00adef' }}>Welcome to Product HUB!</Title>
    <Text type="secondary" style={{ fontSize: '14px' }}>
      Explore and manage your product catalog with ease. Here’s how to get started:
    </Text>
    <ul style={{ textAlign: 'left', margin: '16px 0' }}>
      <li>Use the sidebar to navigate through folders and files.</li>
      <li>Search for specific files using the search bar.</li>
      <li>Click on a file to view its details and content.</li>
    </ul>
  </Card>
);

const ProductCatalog2 = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [fileMetadata, setFileMetadata] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const pdfViewerRef = useRef(null);

  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { folderStructure, loading, fetchFolderStructure } = useFolderStructure();

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchFolderStructure, 60000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, fetchFolderStructure]);

  useEffect(() => {
    const savedScrollPosition = localStorage.getItem("pdfScrollPosition");
    if (savedScrollPosition) {
      setScrollPosition(parseInt(savedScrollPosition, 10));
    }
  }, []);

  const handleScroll = () => {
    if (pdfViewerRef.current) {
      const position = pdfViewerRef.current.getScrollPosition();
      localStorage.setItem("pdfScrollPosition", position);
      setScrollPosition(position);
    }
  };

  const handleFileClick = async (filePath) => {
    const normalizedPath = filePath.replace(/\\/g, "/");
    const pathParts = normalizedPath.split("/");
    const fileName = pathParts.pop().toLowerCase();
    const folderPath = pathParts.join("/");

    if (folderPath && fileName) {
      const relativeFolderPath = folderPath.replace(/^.*\/uploads\//, "");
      setPdfLoading(true);

      try {
        const pdfBlob = await apiService.fetchPdf(relativeFolderPath, fileName);
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setSelectedPdf(pdfUrl);
        setFileMetadata({
          name: fileName,
          size: (pdfBlob.size / 1024).toFixed(2),
          lastModified: new Date().toLocaleDateString(),
        });

        const breadcrumbPath = relativeFolderPath
          .split("/")
          .map((folder, index, arr) => ({
            path: "/" + arr.slice(0, index + 1).join("/"),
            name: folder,
          }));
        setBreadcrumbs(breadcrumbPath);
      } catch (error) {
        message.error("Failed to load PDF. Please try again later.");
        console.error(error);
      } finally {
        setPdfLoading(false);
      }
    }
  };

  const getAllFiles = (items) => {
    let files = [];
    items.forEach((item) => {
      if (item.type === "file" && typeof item.name === "string") {
        const capitalizedName = item.name
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(" ");
        files.push({ ...item, name: capitalizedName });
      }
      if (item.children && Array.isArray(item.children)) {
        files = [...files, ...getAllFiles(item.children)];
      }
    });
    return files;
  };

  const debouncedSearch = debounce((query) => {
    setSearchQuery(query);
  }, 300);

  const searchFiles = (query) => {
    if (!query) return [];
    const allFiles = getAllFiles(folderStructure);
    const options = { keys: ["name"], threshold: 0.3 };
    const fuse = new Fuse(allFiles, options);
    const results = fuse.search(query);
    return results.map((result) => result.item);
  };

  const filteredFiles = useMemo(() => searchFiles(searchQuery), [searchQuery, folderStructure]);

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const renderFolderItems = (items) => {
    return items.map((item) => {
      if (item.type === "folder") {
        return (
          <SubMenu
            key={item.name.toLowerCase()}
            title={
              <span>
                <FolderOpenOutlined style={{ marginRight: 8, fontSize: '12px' }} />
                {item.name}
              </span>
            }
          >
            {item.children && renderFolderItems(item.children)}
          </SubMenu>
        );
      } else if (item.type === "file") {
        return (
          <Menu.Item
            key={item.name.toLowerCase()}
            onClick={() => handleFileClick(item.path)}
            aria-label={`File: ${item.name}`}
          >
            <FileOutlined style={{ marginRight: 8, fontSize: '12px' }} />
            {item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase()}
          </Menu.Item>
        );
      }
      return null;
    });
  };

  const renderFilteredFiles = (files) => {
    return files.map((file) => (
      <Menu.Item
        key={file.name}
        onClick={() => handleFileClick(file.path)}
        aria-label={`File: ${file.name}`}
      >
        <FileOutlined style={{ marginRight: 8, fontSize: '12px' }} />
        {file.name}
      </Menu.Item>
    ));
  };

  const handleRefresh = () => {
    fetchFolderStructure();
  };

  const scrollToTop = () => {
    if (pdfViewerRef.current) {
      pdfViewerRef.current.scrollTo(0);
    }
  };

  return (
    <Layout className="product-catalog" style={{ minHeight: "100vh" }}>
      {isMobile ? (
        <Drawer
          title="Product HUB"
          placement="left"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          width={300}
          role="navigation"
          aria-label="File navigation"
          className="custom-drawer"
        >
          <Search
            placeholder="Search files"
            onChange={handleSearchChange}
            prefix={<SearchOutlined style={{ fontSize: '12px' }} />}
            style={{ marginBottom: "8px" }}
            aria-label="Search files"
          />
          <Menu mode="inline" aria-label="File navigation menu" theme="light" className="custom-menu">
            {loading ? <Skeleton active paragraph={{ rows: 10 }} /> : searchQuery ? renderFilteredFiles(filteredFiles) : renderFolderItems(folderStructure)}
          </Menu>
        </Drawer>
      ) : (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          width={300}
          theme="light"
          className="sidebar custom-sidebar"
          aria-label="File navigation sidebar"
        >
          <div className="sidebar-header">
            <Search
              placeholder="Search Products"
              onChange={handleSearchChange}
              prefix={<SearchOutlined style={{ fontSize: '12px' }} />}
              suffix={
                searchQuery && (
                  <Button
                    type="text"
                    icon={<CloseCircleOutlined style={{ fontSize: '12px' }} />}
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                  />
                )
              }
              className="search-bar"
              aria-label="Search products"
            />
          </div>
          <Menu mode="inline" aria-label="File navigation menu" theme="light" className="custom-menu">
            {loading ? <Skeleton active paragraph={{ rows: 10 }} /> : searchQuery ? renderFilteredFiles(filteredFiles) : renderFolderItems(folderStructure)}
          </Menu>
        </Sider>
      )}

      <Layout className="main-content" style={{ marginLeft: isMobile ? 0 : collapsed ? 80 : 300 }}>
        <Header className="header" style={{ padding: '0 16px', height: '48px', lineHeight: '48px' }}>
          {isMobile ? (
            <Button type="text" icon={<MenuOutlined style={{ fontSize: '14px' }} />} onClick={() => setDrawerVisible(true)} aria-label="Open navigation menu" />
          ) : (
            <Button type="text" icon={collapsed ? <MenuUnfoldOutlined style={{ fontSize: '14px' }} /> : <MenuFoldOutlined style={{ fontSize: '14px' }} />} onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} />
          )}
          <div className="logo-container">
            <Link to="/" aria-label="Go to Home">
              <img src={Logoimage} alt="Bank Logo" className="logo" style={{ height: '60px' }} />
            </Link>
          </div>
          <Space>
            <Tooltip title={autoRefresh ? "Disable Auto-Refresh" : "Enable Auto-Refresh"}>
              <Button
                type="text"
                icon={<ReloadOutlined style={{ fontSize: '14px' }} />}
                onClick={() => setAutoRefresh(!autoRefresh)}
                aria-label={autoRefresh ? "Disable auto-refresh" : "Enable auto-refresh"}
              />
            </Tooltip>
          </Space>
        </Header>

        <Content className="content" role="main" style={{ padding: '16px' }}>
          {breadcrumbs.length > 0 && (
            <Breadcrumb className="breadcrumb" aria-label="breadcrumb" style={{ marginBottom: '8px' }}>
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
            <FileMetadata name={fileMetadata.name} size={fileMetadata.size} lastModified={fileMetadata.lastModified} />
          )}

          {pdfLoading ? (
            <div className="loading-spinner">
              <Spin size="large" tip="Loading PDF..." aria-live="polite" />
            </div>
          ) : selectedPdf ? (
            <div className="pdf-viewer-container" style={{ height: 'calc(100vh - 200px)', maxWidth: '100%', width: '90%', margin: '0 auto' }}>
              <PDFViewer
                ref={pdfViewerRef}
                key={isMobile ? "mobile" : "desktop"}
                file={selectedPdf}
                onScroll={handleScroll}
                initialScrollPosition={scrollPosition}
              />
              <PDFViewerControls
                onZoomIn={() => pdfViewerRef.current.zoomIn()}
                onZoomOut={() => pdfViewerRef.current.zoomOut()}
                onFitToWidth={() => pdfViewerRef.current.fitToWidth()}
                onScrollToTop={scrollToTop}
              />
            </div>
          ) : (
            <WelcomeCard />
          )}
        </Content>

        <Footer className="footer" style={{ padding: '8px 16px', textAlign: 'center' }}>
          <Text style={{ fontSize: '12px' }}>© 2024 <strong>Product HUB</strong></Text>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default ProductCatalog2;