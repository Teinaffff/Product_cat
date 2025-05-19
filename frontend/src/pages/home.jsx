import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import AppAppBar from '../components/appbar';
import Hero from '../components/hero';
import Footer from '../components/footer';
import AppTheme from '../shared-theme/apptheme';

import FAQ from '../components/faq';

import Highlights from '../components/Digitalproducts';




export default function HomePage(props) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Hero/>
    
      <Divider />
     <Highlights />
       
       <Divider />
        <FAQ />
        <Divider />
       
      
    
      <div>
       
        <Divider />
        <Footer />
      </div>
    </AppTheme>
  );
}