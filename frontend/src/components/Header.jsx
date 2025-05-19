import React from "react";
import { Button, Tooltip, Space } from "antd";
import { MenuOutlined, MenuFoldOutlined, MenuUnfoldOutlined, ReloadOutlined, BulbOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Logoimage from "../assets/images/bb.png";

const Header = ({ isMobile, collapsed, setCollapsed, setDrawerVisible, handleRefresh, toggleTheme, theme }) => {
  return (
    <Header className="header">
      {isMobile ? (
        <Button type="text" icon={<MenuOutlined />} onClick={() => setDrawerVisible(true)} aria-label="Open navigation menu" />
      ) : (
        <Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} />
      )}
      <div className="logo-container">
        <Link to="/" aria-label="Go to Home">
          <img src={Logoimage} alt="Bank Logo" className="logo" />
        </Link>
      </div>
      <Space>
        <Tooltip title="Refresh Catalog">
          <Button type="text" icon={<ReloadOutlined />} onClick={handleRefresh} aria-label="Refresh folder structure" />
        </Tooltip>
        <Tooltip title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}>
          <Button type="text" icon={<BulbOutlined />} onClick={toggleTheme} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`} />
        </Tooltip>
      </Space>
    </Header>
  );
};

export default Header;