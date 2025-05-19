import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import AppAppBar from "./appbar";
import ProductCatalog2 from "./Product _catalog";
import Footer from "./footer";
import AppTheme from "../../src/shared-theme/apptheme";

export default function MarketingPage(props) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ProductCatalog2/>
    
       
     
    </AppTheme>
  );
}
