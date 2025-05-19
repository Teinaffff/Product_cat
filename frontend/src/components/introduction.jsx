import React from 'react';
import { Box, Typography } from '@mui/material';

const Introduction = () => {
  return (
    <Box
      sx={{
        textAlign: 'left',
        padding: '40px 20px 20px 16px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        maxWidth: '1000px', // Limit width for better readability
        margin: 'auto', // Center the box
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: '#00adef',
          fontSize: '1.5rem',
          mb: 2,
          fontWeight: 'medium', // Matches previous typography styles
        }}
      >
        Introduction
      </Typography>

      <Typography
        variant="h4"
        sx={{
          fontSize: '1rem',
          my: 2,
          color: '#333',
          fontWeight: 'bold', // Consistent font weight
        }}
      >
        Background
      </Typography>
      <Typography
        sx={{
          lineHeight: 1.6,
          fontSize: '1rem',
          mb: 3,
          color: '#555',
        }}
      >
        Coopbank possesses a diverse range of products within its portfolio. These products are
        dispersed among different banking organs, which makes it challenging for employees of the
        bank to find them in one place for clear understanding to serve clients effectively.
        Therefore, this Product HUB is destined to streamline sales efforts while simultaneously
        serving as an informative resource for employees.
      </Typography>

      <Typography
        variant="h4"
        sx={{
          fontSize: '1rem',
          my: 2,
          color: '#333',
          fontWeight: 'bold', // Consistent font weight
        }}
      >
        Objective
      </Typography>
      <Typography
        sx={{
          lineHeight: 1.6,
          fontSize: '1rem',
          mb: 3,
          color: '#555',
        }}
      >
        The objective of this document is to develop an organized Product HUB that the
        bank's employees can use as a reference when they need information about the products
        and services of the bank.
      </Typography>

      <Typography
        variant="h4"
        sx={{
          fontSize: '1rem',
          my: 2,
          color: '#333',
          fontWeight: 'bold', // Consistent font weight
        }}
      >
        Methodology
      </Typography>
      <Typography
        sx={{
          lineHeight: 1.6,
          fontSize: '1rem',
          mb: 3,
          color: '#555',
        }}
      >
        Secondary data collection methods were used to prepare the document. The majority of
        the information for crafting this content were collected from the procedures related to
        customer account opening and credit operations. Furthermore, the bank's website was
        also utilized for gathering relevant data.
      </Typography>
    </Box>
  );
};

export default Introduction;
