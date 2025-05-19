import React from "react";
import { Menu, Drawer, Spin, Input } from "antd";
import { FolderOpenOutlined, FileOutlined, SearchOutlined } from "@ant-design/icons";


import { Layout } from "antd";

const { Sider } = Layout;

const { Search } = Input;
const { SubMenu } = Menu;

const Sidebar = ({
  isMobile,
  drawerVisible,
  setDrawerVisible,
  theme,
  folderStructure,
  loading,
  searchQuery,
  handleSearchChange,
  filteredFiles,
  renderFolderItems,
  renderFilteredFiles,
  collapsed,
  setCollapsed,
}) => {
  return isMobile ? (
    <Drawer
      title="Product HUB"
      placement="left"
      onClose={() => setDrawerVisible(false)}
      open={drawerVisible}
      width={300}
      role="navigation"
      aria-label="File navigation"
    >
      <Search
        placeholder="Search files"
        value={searchQuery}
        onChange={(e) => handleSearchChange(e.target.value)}
        prefix={<SearchOutlined />}
        style={{ marginBottom: "10px" }}
        aria-label="Search files"
      />
      <Menu mode="inline" aria-label="File navigation menu" theme={theme}>
        {loading ? <Spin aria-live="polite" /> : searchQuery ? renderFilteredFiles(filteredFiles) : renderFolderItems(folderStructure)}
      </Menu>
    </Drawer>
  ) : (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      width={350}
      theme={theme}
      className="sidebar"
      aria-label="File navigation sidebar"
    >
      <div className="sidebar-header">
        <Search
          placeholder="Search Products"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          prefix={<SearchOutlined />}
          className="search-bar"
          aria-label="Search products"
        />
      </div>
      <Menu mode="inline" aria-label="File navigation menu" theme={theme}>
        {loading ? <Spin aria-live="polite" /> : searchQuery ? renderFilteredFiles(filteredFiles) : renderFolderItems(folderStructure)}
      </Menu>
    </Sider>
  );
};

export default Sidebar;