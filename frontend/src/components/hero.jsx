import * as React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { keyframes } from '@emotion/react';
import { Link } from 'react-router-dom';
import img1 from '../assets/images/file.png'; // Adjust the path to your image

// Define keyframes for animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export default function Hero() {
  return (
    <Box
      sx={{
        position: 'relative',
        marginTop: 10,
        overflow: 'hidden',
        minHeight: { xs: '450px', sm: '650px' },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'text.primary',
        animation: `${fadeIn} 1s ease-in-out`, // Fade-in animation for the whole box
      }}
    >
      {/* Background overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: '-50%',
          right: 0,
          width: '700px',
          height: '700px',
          backgroundColor: '#00adef',
          opacity: 0.4,
          borderRadius: '1.5rem',
          transform: 'rotate(45deg)',
          zIndex: -1,
        }}
      />

      {/* Hero section */}
      <Box
        sx={{
          paddingBottom: { xs: '2rem', sm: '0' },
          paddingX: { xs: '1rem', sm: '2rem' },
          maxWidth: '100%',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: '2rem' }}>
          {/* Text content */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '1.5rem',
              textAlign: { xs: 'left', sm: 'left' },
              order: { xs: 2, sm: 1 },
              zIndex: 10,
              padding: { xs: '0 1rem', sm: '0' },
              animation: `${fadeIn} 1s ease-in-out`,
            }}
          >
            <Typography variant="h3" fontWeight="bold" sx={{ color: '#E38524', lineHeight: 1.2 }}>
           Discover Financial Products
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: '500px', color: '#555', fontSize: '1.1rem', lineHeight: 1.6 }}>
            Uncover a curated range of financial and innovative products tailored to your needs.
            From everyday banking to strategic investments, our hub empowers you to explore, compare, and choose with confidence all in one place.
            </Typography>

            {/* Buttons */}
            <Box sx={{ display: 'flex', gap: '1rem' }}>
              {/* <Link to="/start">
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#000',
                    color: 'white',
                    textTransform: 'none',
                    ':hover': {
                      backgroundColor: '#0089c7',
                    },
                    paddingX: '1.5rem',
                    paddingY: '0.75rem',
                    fontSize: '1rem',
                  }}
                >
                  Get Started
                </Button>
              </Link> */}
              <Link to="/start">
                <Button
                  variant="outlined"
                  sx={{
                    backgroundColor: '#00adef',
                    borderColor: '#00adef',
                    color: 'white',
                    textTransform: 'none',
                    ':hover': {
                      backgroundColor: '#0086ba',
                      borderColor: '#0086ba',
                      color: '#000',
                    },
                    paddingX: '1.5rem',
                    paddingY: '0.75rem',
                    fontSize: '1rem',
                  }}
                >
                  Get Started
                </Button>
              </Link>
            </Box>
          </Box>

          {/* Image content */}
          <Box
            sx={{
              order: { xs: 1, sm: 2 },
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: { xs: '2rem', sm: '0' },
              zIndex: 10,
              animation: `${fadeIn} 1.2s ease-in-out`,
            }}
          >
            <img
              src={img1}
              alt="Sector Insights"
              style={{
                width: '100%',
                maxWidth: '500px',
                height: 'auto',
                objectFit: 'contain',
                borderRadius: '10px',
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}