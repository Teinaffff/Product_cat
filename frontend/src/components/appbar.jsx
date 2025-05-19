import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { Document, Page } from "react-pdf";
import Sitemark from "./logo1";
import ColorModeIconDropdown from "../shared-theme/ColorModeIconDropdown";
import Container from "@mui/material/Container";
import { Link } from "react-router-dom";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: "8px 12px",
}));

export default function AppAppBar() {
  const [pdfOpen, setPdfOpen] = React.useState(false);
  const [currentPdf, setCurrentPdf] = React.useState(null);

  const handleFileClick = (viewUrl) => {
    setCurrentPdf(viewUrl);
    setPdfOpen(true);
  };

  const handleCloseDialog = () => {
    setPdfOpen(false);
    setCurrentPdf(null);
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: "calc(var(--template-frame-height, 0px) + 28px)",
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box
            sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}
          >
            <Sitemark />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <Link to="/start">
                <Button variant="text" color="info" size="small">
                  Product HUB
                </Button>
              </Link>
              <Button
                variant="text"
                color="info"
                size="small"
                onClick={() =>
                  document
                    .getElementById("products")
                    .scrollIntoView({ behavior: "smooth" })
                }
              >
                Our Products
              </Button>

              {/* <Button variant="text" color="info" size="small" onClick={() =>
                  document
                    .getElementById("digital-products")
                    .scrollIntoView({ behavior: "smooth" })
                }>
                Digital Products
              </Button> */}

              <Button
                variant="text"
                color="info"
                size="small"
                sx={{ minWidth: 0 }}
                onClick={() =>
                  document
                    .getElementById("faq")
                    .scrollIntoView({ behavior: "smooth" })
                }
              >
                FAQ
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
            }}
          >
            <ColorModeIconDropdown />
          </Box>
        </StyledToolbar>
      </Container>

      <Dialog
        open={pdfOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            color: "#fff", // White text color
          },
        }}
      >
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {currentPdf && (
              <Document file={currentPdf}>
                <Page pageNumber={1} />
              </Document>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
}
