import React, { useRef, useState, useEffect } from "react";
import { Box, Container, Typography, Grid, Paper } from "@mui/material";
import { motion } from "framer-motion";

/**
 * Statistics component displaying key metrics about AeroLeaf's impact
 */
export default function Statistics() {
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

  // Observer for animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  const stats = [
    { value: "1M+", label: "Trees planted" },
    { value: "50K", label: "Tons of CO₂ offset" },
    { value: "100+", label: "Active projects" },
    { value: "250+", label: "Satisfied clients" },
  ];

  return (
    <Box
      component="section"
      py={10}
      sx={{
        background: "linear-gradient(90deg, #22c55e 0%, #15803d 100%)",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
      ref={statsRef}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          component="h2"
          align="center"
          fontWeight="bold"
          mb={6}
          sx={{ letterSpacing: 1.2 }}
        >
          Our Impact
        </Typography>
        <Grid container spacing={5} justifyContent="center">
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={
                  statsVisible
                    ? { opacity: 1, y: 0, scale: 1 }
                    : { opacity: 0, y: 30, scale: 0.95 }
                }
                transition={{ duration: 0.6, delay: index * 0.12 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 8px 32px rgba(34,197,94,0.15)",
                }}
                style={{ borderRadius: 16 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    textAlign: "center",
                    py: 4,
                    background: "rgba(255,255,255,0.05)",
                    color: "white",
                    borderRadius: 4,
                    boxShadow: "0 2px 12px rgba(34,197,94,0.08)",
                    transition: "box-shadow 0.3s",
                  }}
                >
                  <Typography
                    variant="h3"
                    component="p"
                    fontWeight="bold"
                    mb={1}
                    sx={{ fontSize: { xs: "2.2rem", md: "2.8rem" } }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="rgba(255,255,255,0.85)"
                  >
                    {stat.label}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
