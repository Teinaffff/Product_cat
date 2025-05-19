import React, { useState, useEffect } from 'react';
import { Collapse, Typography } from 'antd';

const { Panel } = Collapse;

export default function FAQ() {
  const [faqData, setFaqData] = useState([]);

  // Fetch FAQ data from the backend
  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/faq'); // Adjust if necessary
        const data = await response.json();
        setFaqData(data);
      } catch (error) {
        console.error('Error fetching FAQ data:', error);
      }
    };

    fetchFaq();
  }, []);

  return (
    <div
      id="faq"
      style={{
        paddingTop: '40px',
        paddingBottom: '60px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <Typography.Title
        level={2}
        style={{
          color: '#00adef',
          textAlign: 'center',
          marginBottom: '30px', // Slightly more space for better balance
          fontSize: '24px', // Bigger title for better prominence
          fontWeight: 600,
        }}
      >
        Frequently Asked Questions
      </Typography.Title>

      <Collapse
        defaultActiveKey={['0']}
        style={{
          width: '100%',
          maxWidth: '100%',
        }}
      >
        {faqData.map((faq, index) => (
          <Panel
            key={index}
            header={
              <Typography.Text
                strong
                style={{
                  fontSize: '14px', // Slightly larger question text
                  color: '#333', // Darker color for the question text
                }}
              >
                {faq.question}
              </Typography.Text>
            }
            style={{
              borderRadius: '8px',
              marginBottom: '12px',
              border: '1px solid #ddd',
              background: '#f9f9f9', // Subtle background color for panels
            }}
            collapsible
            showArrow
          >
            <Typography.Text
              style={{
                display: 'block',
                padding: '12px 20px', // Added padding for better spacing
                lineHeight: '1.6',
                fontSize: '14px',
                color: '#555', // Slightly lighter text color for the answer
              }}
            >
              {faq.answer}
            </Typography.Text>
          </Panel>
        ))}
      </Collapse>
    </div>
  );
}
