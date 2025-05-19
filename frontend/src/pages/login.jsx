import React, { useState } from "react";
import { Button, Input, Typography, Form, Card, message, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/Authcontext"; // Adjust the path as necessary

const { Title, Text } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const { login } = useAuth(); // Get the login function from AuthContext
  const navigate = useNavigate(); // Initialize useNavigate

  const onFinish = async (values) => {
    const { username, password } = values;

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });
      const { token } = response.data;
      localStorage.setItem("token", token);
      login(); // Update the authentication state
      message.success("Login successful!");
      navigate("/admin"); // Redirect to admin page
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      message.error("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  const showForgotPasswordModal = () => {
    setIsModalVisible(true); // Show the forgot password modal
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Hide the modal
  };

  const handlePasswordReset = async (email) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/reset-password", { email });
      message.success("Password reset link sent to your email!");
      setIsModalVisible(false);
    } catch (err) {
      message.error("Failed to send reset link");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundImage:
          "url(https://images.pexels.com/photos/434337/pexels-photo-434337.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 0,
        }}
      ></div>

      <Card
        style={{
          width: 400,
          padding: "20px 30px",
          borderRadius: 12,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          zIndex: 1,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Title level={3} style={{ textAlign: "center", marginBottom: "10px" }}>
          Login
        </Title>
        <Text type="secondary" style={{ textAlign: "center", display: "block" }}>
          Please log in to your account
        </Text>

        <Form
          layout="vertical"
          onFinish={onFinish}
          style={{ marginTop: "20px" }}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              placeholder="Enter your username"
              size="large"
              style={{ borderRadius: 10 }}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              placeholder="Enter your password"
              size="large"
              style={{ borderRadius: 10 }}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            block
            style={{
              borderRadius: 10,
              marginTop: "10px",
              backgroundColor: "#00adef",
              border: "none",
            }}
          >
            Log In
          </Button>
        </Form>

        {/* Forgot Password Link */}
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <Text
            style={{ cursor: "pointer", color: "#00adef" }}
            onClick={showForgotPasswordModal}
          >
            Forgot Password?
          </Text>
        </div>
      </Card>

      {/* Forgot Password Modal */}
      <Modal
        title="Reset Password"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={({ email }) => handlePasswordReset(email)}
        >
          <Form.Item
            label="Enter your email address"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input
              placeholder="Enter your email"
              size="large"
              style={{ borderRadius: 10 }}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            style={{
              borderRadius: 10,
              backgroundColor: "#00adef",
              border: "none",
            }}
          >
            Send Reset Link
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default LoginPage;
