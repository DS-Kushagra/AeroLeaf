import { Link } from "react-router-dom";
import { Button, Box, Typography, Container } from "@mui/material";
import { motion } from "framer-motion";

const HeroSection = () => {
  // Animation variants for text elements
  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.3,
        ease: "easeOut",
      },
    },
  };

  const descriptionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.6,
        ease: "easeOut",
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.9,
        ease: "easeOut",
      },
    },
  };

  return (
    <Box
      className="relative overflow-hidden text-white"
      sx={{
        background:
          "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)",
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Decorative background elements */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          right: "5%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "rgba(16, 185, 129, 0.1)",
          filter: "blur(100px)",
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "10%",
          left: "10%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "rgba(5, 150, 105, 0.15)",
          filter: "blur(80px)",
          zIndex: 1,
        }}
      />

      {/* Content Container */}
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 10, py: 8 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 4,
          }}
        >
          {/* Left side - Text content */}
          <Box
            sx={{
              maxWidth: { xs: "100%", md: "55%" },
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={titleVariants}
            >
              <Typography
                variant="h1"
                component="h1"
                fontWeight="bold"
                sx={{
                  fontSize: { xs: "3rem", sm: "3.75rem", md: "4.5rem" },
                  background:
                    "linear-gradient(90deg, #ecfccb 0%, #d9f99d 100%)",
                  backgroundClip: "text",
                  textFillColor: "transparent",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 2,
                }}
              >
                AeroLeaf
              </Typography>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={subtitleVariants}
            >
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  fontWeight: 300,
                  mb: 3,
                  fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                  color: "rgba(255, 255, 255, 0.95)",
                }}
              >
                Transforming Carbon Credits with Blockchain & Satellite
                Verification
              </Typography>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={descriptionVariants}
            >
              <Typography
                variant="h6"
                component="p"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  mb: 5,
                  fontWeight: 400,
                  maxWidth: "600px",
                  mx: { xs: "auto", md: 0 },
                  lineHeight: 1.6,
                }}
              >
                Our platform uses satellite imagery and AI to transparently
                verify reforestation projects, ensuring your carbon offsets have
                real environmental impact.
              </Typography>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={buttonVariants}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 3,
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                <Button
                  component={Link}
                  to="/dashboard"
                  variant="contained"
                  size="large"
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontSize: "1rem",
                    fontWeight: 500,
                    backgroundColor: "#10b981",
                    borderRadius: "8px",
                    textTransform: "none",
                    boxShadow: "0 4px 14px rgba(16, 185, 129, 0.4)",
                    "&:hover": {
                      backgroundColor: "#059669",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px rgba(16, 185, 129, 0.6)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Explore Dashboard
                </Button>

                <Button
                  component={Link}
                  to="/marketplace"
                  variant="outlined"
                  size="large"
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontSize: "1rem",
                    fontWeight: 500,
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    color: "white",
                    borderRadius: "8px",
                    textTransform: "none",
                    backdropFilter: "blur(10px)",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      borderColor: "rgba(255, 255, 255, 0.5)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px rgba(255, 255, 255, 0.1)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  View Marketplace
                </Button>
              </Box>
            </motion.div>
          </Box>

          {/* Right side - Visual elements */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              flex: "0 0 40%",
              position: "relative",
              height: "500px",
            }}
          >
            {/* Main forest circle */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  height: "350px",
                  width: "350px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
                  border: "4px solid rgba(16, 185, 129, 0.3)",
                }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
                  alt="Forest canopy view"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />

                {/* Overlay for better contrast */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.3) 100%)",
                    zIndex: 2,
                  }}
                />
              </Box>
            </motion.div>

            {/* Forest conservation badge */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 1 }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "15%",
                  right: "-40px",
                  backgroundColor: "#10b981",
                  borderRadius: "12px",
                  boxShadow: "0 8px 32px rgba(16, 185, 129, 0.4)",
                  padding: "12px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  zIndex: 10,
                  transform: "rotate(-5deg)",
                }}
              >
                <Box
                  sx={{
                    width: "24px",
                    height: "24px",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  🌲
                </Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, color: "white" }}
                >
                  Forest conservation
                </Typography>
              </Box>
            </motion.div>

            {/* Satellite verification badge */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 1.3 }}
            >
              <Box
                sx={{
                  position: "absolute",
                  bottom: "20%",
                  right: "5%",
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  maxWidth: "240px",
                  zIndex: 10,
                  transform: "rotate(3deg)",
                }}
              >
                <Box
                  sx={{
                    width: "32px",
                    height: "32px",
                    backgroundColor: "#10b981",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  🛰️
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    component="div"
                    sx={{
                      color: "#10b981",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Verified by
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "#065f46" }}
                  >
                    Satellite Imagery
                  </Typography>
                </Box>
              </Box>
            </motion.div>

            {/* Floating elements for decoration */}
            <Box
              sx={{
                position: "absolute",
                top: "-20px",
                right: "10px",
                width: "100px",
                height: "100px",
                borderRadius: "16px",
                background: "rgba(16, 185, 129, 0.15)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                animation: "float 6s ease-in-out infinite",
                "@keyframes float": {
                  "0%, 100%": {
                    transform: "translateY(0px) rotate(0deg)",
                  },
                  "50%": {
                    transform: "translateY(-15px) rotate(5deg)",
                  },
                },
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: "10px",
                left: "-20px",
                width: "80px",
                height: "80px",
                borderRadius: "12px",
                background: "rgba(5, 150, 105, 0.2)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                animation: "floatReverse 7s ease-in-out infinite",
                "@keyframes floatReverse": {
                  "0%, 100%": {
                    transform: "translateY(0px) rotate(0deg)",
                  },
                  "50%": {
                    transform: "translateY(15px) rotate(-3deg)",
                  },
                },
              }}
            />
          </Box>
        </Box>
      </Container>

      {/* Scroll indicator */}
      <Box
        sx={{
          position: "absolute",
          bottom: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          color: "rgba(255, 255, 255, 0.7)",
          animation: "bounce 2s infinite",
          cursor: "pointer",
          "@keyframes bounce": {
            "0%, 20%, 50%, 80%, 100%": {
              transform: "translate(-50%, 0)",
            },
            "40%": {
              transform: "translate(-50%, -10px)",
            },
            "60%": {
              transform: "translate(-50%, -5px)",
            },
          },
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 13l5 5 5-5M7 7l5 5 5-5" />
        </svg>
      </Box>
    </Box>
  );
};

export default HeroSection;
