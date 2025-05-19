import React, { useState } from 'react';
import { Card, Col, Row, Typography, Space, Pagination } from 'antd';
import img1 from "../assets/images/coffee.jpeg";
import img2 from "../assets/images/soyabean.jpeg";
import img3 from "../assets/images/cooperative sector.jpeg"

const { Title, Text } = Typography;

const sectors = [
  {
    title: 'Coffee Farming',
    description: 'The backbone of global coffee production, driving economies in various regions.',
    imageUrl: img1, // Using imported image
  },
  {
    title: 'Soybean Cultivation',
    description: 'A major agricultural crop used for oil, animal feed, and more.',
    imageUrl: img2, // Using imported image
  },
  {
    title: 'Cooperative Sector',
    description: 'Maize is a staple food in many countries and a key crop in agriculture.',
    imageUrl: img3, // Placeholder, replace with actual maize image if available
  },
  {
    title: 'Rice Cultivation',
    description: 'A fundamental crop for feeding the world’s population, grown in diverse climates.',
    imageUrl: img2, // Placeholder, replace with actual rice image if available
  },
];

const SectorKnowledge = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const sectorsPerPage = 3; // Number of sectors to display per page

  const startIndex = (currentPage - 1) * sectorsPerPage;
  const endIndex = startIndex + sectorsPerPage;
  const currentSectors = sectors.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div
      id="products"
      style={{
        padding: '60px 16px',
        minHeight: '70vh',
        backgroundColor: '#f5f5f5',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      {/* Header Section */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <Title
          level={3}
          style={{
            color: '#000',
            fontWeight: 600,
            letterSpacing: '0.5px',
            marginBottom: '12px',
            fontSize: '40px',
          }}
        >
       Products
        </Title>
        <Text style={{ fontSize: '16px', color: '#555' }}>
        Explore essential financial products that power everyday banking, wealth growth, and economic progress.
        </Text>
      </div>

      {/* Sector Grid */}
      <Row gutter={[32, 32]} justify="center">
        {currentSectors.map((sector, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <Card
              hoverable
              style={{
                borderRadius: '12px',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                background: '#fff',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                padding: '20px',
                margin: '10px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
              bodyStyle={{ padding: 0 }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Space
                direction="vertical"
                size="small"
                style={{
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                {/* Image with hover effect */}
                {sector.imageUrl && (
                  <img
                    src={sector.imageUrl}
                    alt={sector.title}
                    style={{
                      width: '160px',
                      height: '160px',
                      borderRadius: '12px',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                )}

                <Title
                  level={5}
                  style={{
                    marginTop: '16px',
                    color: '#333',
                    fontWeight: 600,
                    fontSize: '18px',
                    textTransform: 'uppercase',
                  }}
                >
                  {sector.title}
                </Title>
                <Text
                  style={{
                    color: '#777',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    maxWidth: '240px',
                    fontStyle: 'italic',
                    textAlign: 'center',
                    padding: '0 8px',
                  }}
                >
                  {sector.description}
                </Text>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Pagination
          current={currentPage}
          total={sectors.length}
          pageSize={sectorsPerPage}
          onChange={handlePageChange}
          showSizeChanger={false}
          style={{ display: 'inline-block', marginTop: '20px' }}
        />
      </div>
    </div>
  );
};

export default SectorKnowledge;
