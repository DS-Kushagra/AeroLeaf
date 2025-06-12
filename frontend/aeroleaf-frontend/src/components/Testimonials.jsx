import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  IconButton,
  Grid,
} from "@mui/material";
import {
  FormatQuote as QuoteIcon,
  ArrowBack,
  ArrowForward,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Testimonials component displaying user feedback about AeroLeaf
 */
export default function Testimonials() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Testimonial auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Sustainability Director",
      company: "EcoTech Industries",
      text: "AeroLeaf has transformed how we approach carbon offsetting. The satellite verification gives us confidence that our investments are making a real impact.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Michael Chen",
      role: "Forest Owner",
      company: "Green Valley Estate",
      text: "As a landowner, the transparency of AeroLeaf's reporting has been invaluable. I can track the growth of my reforestation project in real-time.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Lisa Rodriguez",
      role: "Environmental Compliance Officer",
      company: "Global Logistics Corp",
      text: "The blockchain-backed credits give us immutable proof of our carbon offset initiatives, which has been crucial for our annual sustainability reports.",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
  ];

  const handlePrevious = () => {
    setActiveTestimonial((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <Box
      component="section"
      py={10}
      sx={{
        backgroundColor: "#f5f5f5",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <Typography
            variant="h4"
            component="h2"
            align="center"
            fontWeight="bold"
            mb={6}
            sx={{
              position: "relative",
              letterSpacing: 1.2,
              "&:after": {
                content: '""',
                position: "absolute",
                bottom: "-12px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "60px",
                height: "3px",
                backgroundColor: "primary.main",
                borderRadius: 2,
              },
            }}
          >
            What Our Users Say
          </Typography>
        </motion.div>

        <Box
          sx={{
            position: "relative",
            maxWidth: "800px",
            mx: "auto",
            minHeight: "300px",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              style={{ position: "absolute", width: "100%" }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 5,
                  borderRadius: 3,
                  position: "relative",
                  overflow: "visible",
                  background:
                    "linear-gradient(120deg, #e0fce7 0%, #f5f5f5 100%)",
                  boxShadow: "0 8px 32px rgba(34,197,94,0.10)",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: -20,
                    left: 40,
                    color: "primary.main",
                    transform: "rotate(180deg)",
                    opacity: 0.18,
                    fontSize: "4rem",
                  }}
                >
                  <QuoteIcon fontSize="inherit" />
                </Box>

                <Typography
                  variant="body1"
                  sx={{
                    fontStyle: "italic",
                    mb: 3,
                    mt: 2,
                    position: "relative",
                    zIndex: 1,
                    fontSize: { xs: "1.1rem", md: "1.2rem" },
                  }}
                >
                  {testimonials[activeTestimonial].text}
                </Typography>

                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Avatar
                      src={testimonials[activeTestimonial].avatar}
                      alt={testimonials[activeTestimonial].name}
                      sx={{
                        width: 56,
                        height: 56,
                        border: "2px solid",
                        borderColor: "primary.main",
                        boxShadow: "0 2px 8px rgba(34,197,94,0.10)",
                      }}
                    />
                  </Grid>
                  <Grid item xs>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {testimonials[activeTestimonial].name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {testimonials[activeTestimonial].role},{" "}
                      {testimonials[activeTestimonial].company}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </motion.div>
          </AnimatePresence>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              position: "absolute",
              width: "100%",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              px: 2,
            }}
          >
            <IconButton
              onClick={handlePrevious}
              sx={{
                backgroundColor: "background.paper",
                boxShadow: 1,
                "&:hover": { backgroundColor: "background.paper" },
              }}
            >
              <ArrowBack />
            </IconButton>
            <IconButton
              onClick={handleNext}
              sx={{
                backgroundColor: "background.paper",
                boxShadow: 1,
                "&:hover": { backgroundColor: "background.paper" },
              }}
            >
              <ArrowForward />
            </IconButton>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 4,
            gap: 1,
          }}
        >
          {testimonials.map((_, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{
                scale: index === activeTestimonial ? 1.2 : 1,
                opacity: index === activeTestimonial ? 1 : 0.5,
              }}
              transition={{ duration: 0.3 }}
              style={{ display: "inline-block" }}
            >
              <Box
                onClick={() => setActiveTestimonial(index)}
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  backgroundColor:
                    index === activeTestimonial ? "primary.main" : "grey.300",
                  cursor: "pointer",
                  border:
                    index === activeTestimonial ? "2px solid #22c55e" : "none",
                  boxShadow:
                    index === activeTestimonial
                      ? "0 2px 8px rgba(34,197,94,0.15)"
                      : "none",
                  transition: "all 0.2s ease",
                }}
              />
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
