import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
} from "@mui/material";
import { Facebook, Twitter, LinkedIn, YouTube } from "@mui/icons-material";

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "grey.900",
        color: "white",
        mt: 8,
        pt: 6,
        pb: 3,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* Left - Brand */}
          <Grid size={{ xs: 12, sm: 6, md: 3, xl: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              NDMA
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              CAP Integrated Alert System for disaster management across India.
              Stay alert, stay safe.
            </Typography>
          </Grid>

          {/* Middle - Quick Links */}
          <Grid size={{ xs: 12, sm: 6, md: 3, xl: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link href="#aboutSachet" color="inherit" underline="hover">
                About
              </Link>
              <Link href="#features" color="inherit" underline="hover">
                Features
              </Link>
              <Link href="#services" color="inherit" underline="hover">
                Services
              </Link>
              <Link href="#contact" color="inherit" underline="hover">
                Contact
              </Link>
            </Box>
          </Grid>

          {/* Middle - Resources */}
          <Grid size={{ xs: 12, sm: 6, md: 3, xl: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Resources
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link href="/privacy" color="inherit" underline="hover">
                Privacy Policy
              </Link>
              <Link href="/terms" color="inherit" underline="hover">
                Terms of Service
              </Link>
              <Link href="/faq" color="inherit" underline="hover">
                FAQs
              </Link>
            </Box>
          </Grid>

          {/* Right - Social Media */}
          <Grid size={{ xs: 12, sm: 6, md: 3, xl: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Follow Us
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                href="https://facebook.com"
                target="_blank"
                rel="noopener"
                sx={{ color: "white" }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                href="https://twitter.com"
                target="_blank"
                rel="noopener"
                sx={{ color: "white" }}
              >
                <Twitter />
              </IconButton>
              <IconButton
                href="https://linkedin.com"
                target="_blank"
                rel="noopener"
                sx={{ color: "white" }}
              >
                <LinkedIn />
              </IconButton>
              <IconButton
                href="https://youtube.com"
                target="_blank"
                rel="noopener"
                sx={{ color: "white" }}
              >
                <YouTube />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Bar */}
        <Box
          sx={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            textAlign: "center",
            mt: 5,
            pt: 3,
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            © {new Date().getFullYear()} NDMA. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
