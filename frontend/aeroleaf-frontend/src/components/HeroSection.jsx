import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  useTheme,
  useMediaQuery,
  Grid,
} from "@mui/material";
import { motion } from "framer-motion";
import { Button, Typography as AntTypography, Space } from "antd";
import {
  ArrowRightOutlined,
  SafetyCertificateFilled,
  GlobalOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { ArrowForward, EmojiNature } from "@mui/icons-material";

const HeroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: custom * 0.15,
        ease: "easeOut",
      },
    }),
  };

  const stats = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (custom) => ({
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: custom * 0.2 + 0.8,
        ease: "easeOut",
      },
    }),
  };

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background:
          "linear-gradient(140deg, #033D30 0%, #044E3B 50%, #065F46 100%)",
        color: "#fff",
        pt: { xs: 8, md: 0 },
      }}
    >
      {/* Premium background pattern */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          opacity: 0.07,
          backgroundSize: "40px 40px",
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)`,
        }}
      />

      {/* Premium gradient overlays */}
      <Box
        sx={{
          position: "absolute",
          top: "-20%",
          right: "-5%",
          width: "70%",
          height: "70%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(20,216,151,0.12) 0%, rgba(20,216,151,0) 75%)",
          filter: "blur(80px)",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          bottom: "-15%",
          left: "-5%",
          width: "70%",
          height: "70%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(20,216,151,0.08) 0%, rgba(20,216,151,0) 75%)",
          filter: "blur(100px)",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: "30%",
          left: "50%",
          width: "50%",
          height: "50%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 70%)",
          filter: "blur(60px)",
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        <Grid
          container
          spacing={4}
          alignItems="center"
          justifyContent="space-between"
        >
          {/* Left side - Main content */}
          <Grid item xs={12} md={6} lg={5} sx={{ mb: { xs: 6, md: 0 } }}>
            <motion.div initial="hidden" animate="visible" variants={container}>
              {/* Premium Header Subtitle */}
              <Box
                component={motion.div}
                variants={fadeInUp}
                custom={0}
                sx={{ mb: 3 }}
              >
                <AntTypography.Text
                  style={{
                    color: "#14D897",
                    fontWeight: 600,
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    fontSize: "1rem",
                    display: "block",
                    position: "relative",
                    paddingLeft: "28px",
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      position: "absolute",
                      left: 0,
                      top: "50%",
                      transform: "translateY(-40%)",
                      width: "18px",
                      height: "2px",
                      background: "#14D897",
                      display: "inline-block",
                      marginRight: "10px",
                    }}
                  />
                  
                </AntTypography.Text>
              </Box>

              {/* Main Heading with enhanced typography */}
              <Box
                component={motion.div}
                variants={fadeInUp}
                custom={1}
                sx={{ mb: 4 }}
              >
                <AntTypography.Title
                  level={1}
                  style={{
                    fontSize: "clamp(3.25rem, 8vw, 5.25rem)",
                    fontWeight: 800,
                    lineHeight: 1.05,
                    maxWidth: "700px",
                    letterSpacing: "-0.025em",
                    margin: 0,
                    padding: 0,
                    background:
                      "linear-gradient(90deg, #FFFFFF 20%, #A5F3D8 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "0 20px 60px rgba(0,0,0,0.1)",
                  }}
                >
                  Transform Carbon Credits with AeroLeaf
                </AntTypography.Title>
              </Box>

              {/* Description with enhanced typography */}
              <Box
                component={motion.div}
                variants={fadeInUp}
                custom={2}
                sx={{ mb: 6 }}
              >
                <AntTypography.Paragraph
                  style={{
                    fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                    lineHeight: 1.75,
                    color: "rgba(255,255,255,0.95)",
                    maxWidth: "640px",
                    fontWeight: 400,
                    margin: 0,
                    letterSpacing: "0.015em",
                  }}
                >
                  Our platform leverages satellite imagery and AI to
                  transparently verify reforestation projects, ensuring your
                  carbon offsets create real environmental impact with
                  blockchain-backed verification.
                </AntTypography.Paragraph>
              </Box>

              {/* Action Buttons */}
              <Box
                component={motion.div}
                variants={fadeInUp}
                custom={3}
                sx={{
                  mb: 8,
                }}
              >
                <Space
                  size={28}
                  direction={{ xs: "vertical", sm: "horizontal" }}
                  style={{ display: "flex", flexWrap: "wrap" }}
                >
                  <Link to="/dashboard" style={{ display: "inline-block" }}>
                    <Button
                      type="primary"
                      size="large"
                      icon={<ArrowRightOutlined />}
                      style={{
                        backgroundColor: "#14D897",
                        height: 56,
                        paddingLeft: 28,
                        paddingRight: 28,
                        borderRadius: 12,
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        boxShadow: "0 12px 28px rgba(20, 216, 151, 0.35)",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ marginRight: 8 }}>Explore Dashboard</span>
                    </Button>
                  </Link>

                  <Link to="/marketplace" style={{ display: "inline-block" }}>
                    <Button
                      ghost
                      size="large"
                      style={{
                        height: 56,
                        paddingLeft: 28,
                        paddingRight: 28,
                        borderRadius: 12,
                        fontSize: "1.1rem",
                        fontWeight: 500,
                        borderColor: "rgba(255,255,255,0.3)",
                        borderWidth: 1.5,
                        background: "rgba(255,255,255,0.05)",
                        backdropFilter: "blur(12px)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                      }}
                      className="marketplace-btn"
                    >
                      View Marketplace
                    </Button>
                  </Link>
                </Space>

                {/* Add custom CSS for button hover effects */}
                <Box
                  component="style"
                  dangerouslySetInnerHTML={{
                    __html: `
                      .ant-btn-primary:hover {
                        background-color: #0DBF84 !important;
                        transform: translateY(-3px);
                        box-shadow: 0 18px 36px rgba(20, 216, 151, 0.45) !important;
                        transition: all 0.3s ease;
                      }
                      .marketplace-btn:hover {
                        border-color: #14D897 !important;
                        background: rgba(20, 216, 151, 0.08) !important;
                        transform: translateY(-3px);
                        transition: all 0.3s ease;
                      }
                    `,
                  }}
                />
              </Box>

              {/* Enhanced Stats Section */}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: { xs: 5, md: 7 },
                  position: "relative",
                  pl: { xs: 0, md: 1 },
                }}
              >
                {/* Stats background decoration */}
                <Box
                  sx={{
                    position: "absolute",
                    top: "-30px",
                    left: "-15px",
                    width: "90%",
                    height: "160%",
                    background:
                      "linear-gradient(90deg, rgba(20,216,151,0.08) 0%, rgba(255,255,255,0.03) 100%)",
                    borderRadius: "20px",
                    filter: "blur(20px)",
                    opacity: 0.4,
                    zIndex: -1,
                  }}
                />

                {[
                  {
                    icon: (
                      <SafetyCertificateFilled
                        style={{ fontSize: 22, color: "#14D897" }}
                      />
                    ),
                    number: "1.2M+",
                    label: "Tons of CO₂ Offset",
                    bgColor: "rgba(20, 216, 151, 0.15)",
                  },
                  {
                    icon: (
                      <EnvironmentOutlined
                        style={{ fontSize: 22, color: "#14D897" }}
                      />
                    ),
                    number: "320+",
                    label: "Verified Projects",
                    bgColor: "rgba(255, 255, 255, 0.1)",
                  },
                  {
                    icon: (
                      <GlobalOutlined
                        style={{ fontSize: 22, color: "#14D897" }}
                      />
                    ),
                    number: "54K+",
                    label: "Credits Traded",
                    bgColor: "rgba(20, 216, 151, 0.12)",
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={stats}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 2,
                        padding: "16px 0",
                      }}
                    >
                      {/* Icon circle */}
                      <Box
                        sx={{
                          width: 46,
                          height: 46,
                          borderRadius: "50%",
                          backgroundColor: stat.bgColor,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                        }}
                      >
                        {stat.icon}
                      </Box>

                      {/* Stat content */}
                      <Box>
                        <AntTypography.Title
                          level={3}
                          style={{
                            fontSize: { xs: "2.2rem", md: "2.5rem" },
                            fontWeight: 800,
                            background:
                              "linear-gradient(90deg, #FFFFFF 0%, #14D897 100%)",
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            margin: 0,
                            lineHeight: 1.1,
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {stat.number}
                        </AntTypography.Title>
                        <AntTypography.Text
                          style={{
                            color: "rgba(255,255,255,0.85)",
                            fontSize: "1.05rem",
                            fontWeight: 500,
                            letterSpacing: "0.3px",
                            display: "block",
                            marginTop: "4px",
                          }}
                        >
                          {stat.label}
                        </AntTypography.Text>
                      </Box>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          </Grid>

          {/* Right side - Visual elements */}
          <Grid item xs={12} md={6} lg={6}>
            <Box
              sx={{
                position: "relative",
                height: { xs: "400px", md: "500px", lg: "600px" },
                display: { xs: "none", md: "block" },
              }}
            >
              {/* 3D Earth/Forest Visualization */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                {/* Enhanced Earth visualization container */}
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: { md: "420px", lg: "520px" },
                    height: { md: "420px", lg: "520px" },
                    borderRadius: "50%",
                    overflow: "hidden",
                    boxShadow:
                      "0 20px 100px rgba(0,0,0,0.45), 0 0 80px rgba(20,216,151,0.2) inset",
                    zIndex: 2,
                  }}
                >
                  {/* Premium outer glow ring */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: -2,
                      borderRadius: "50%",
                      padding: "2px",
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(20,216,151,0.4) 50%, rgba(255,255,255,0.1))",
                      WebkitMask:
                        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                      opacity: 0.8,
                      animation: "rotateSlow 20s linear infinite",
                      "@keyframes rotateSlow": {
                        "0%": { transform: "rotate(0deg)" },
                        "100%": { transform: "rotate(360deg)" },
                      },
                    }}
                  />

                  {/* Earth/Forest Image with enhanced effects */}
                  <Box
                    component="img"
                    src="https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80"
                    alt="Earth view from space"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transform: "scale(1.05)",
                      transition: "all 15s ease-in-out",
                      filter: "saturate(1.15) brightness(1.05) contrast(1.05)",
                      "&:hover": {
                        transform: "scale(1.15) rotate(3deg)",
                      },
                    }}
                  />

                  {/* Premium overlay for earth image */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(135deg, rgba(4,78,59,0) 0%, rgba(4,78,59,0.15) 50%, rgba(4,78,59,0.35) 100%)",
                      mixBlendMode: "soft-light",
                      zIndex: 2,
                    }}
                  />

                  {/* Animated highlight effect */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "200%",
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%)",
                      transform: "translateY(-150%)",
                      animation: "shine 8s ease-in-out infinite",
                      "@keyframes shine": {
                        "0%, 100%": { transform: "translateY(-150%)" },
                        "30%, 70%": { transform: "translateY(100%)" },
                      },
                      zIndex: 3,
                      mixBlendMode: "overlay",
                    }}
                  />
                </Box>

                {/* Enhanced premium orbit ring 1 */}
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: { md: "560px", lg: "620px" },
                    height: { md: "560px", lg: "620px" },
                    borderRadius: "50%",
                    zIndex: 1,
                    animation: "rotate 70s linear infinite",
                    "@keyframes rotate": {
                      "0%": { transform: "translate(-50%, -50%) rotate(0deg)" },
                      "100%": {
                        transform: "translate(-50%, -50%) rotate(360deg)",
                      },
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      inset: -1,
                      borderRadius: "50%",
                      padding: 1,
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.3), rgba(20,216,151,0.4) 50%, rgba(255,255,255,0.1))",
                      WebkitMask:
                        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                      opacity: 0.5,
                    },
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      boxShadow: "0 0 60px 5px rgba(20, 216, 151, 0.2)",
                    },
                  }}
                />

                {/* Enhanced premium orbit ring 2 */}
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%) rotate(45deg)",
                    width: { md: "600px", lg: "680px" },
                    height: { md: "600px", lg: "680px" },
                    borderRadius: "50%",
                    zIndex: 1,
                    animation: "rotateReverse 90s linear infinite",
                    "@keyframes rotateReverse": {
                      "0%": {
                        transform: "translate(-50%, -50%) rotate(45deg)",
                      },
                      "100%": {
                        transform: "translate(-50%, -50%) rotate(405deg)",
                      },
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      inset: -1,
                      borderRadius: "50%",
                      padding: 1,
                      background:
                        "linear-gradient(135deg, rgba(20,216,151,0.2), rgba(255,255,255,0.15) 50%, rgba(20,216,151,0.1))",
                      WebkitMask:
                        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                      opacity: 0.4,
                    },
                  }}
                />

                {/* Additional decorative orbit ring */}
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%) rotate(20deg)",
                    width: { md: "700px", lg: "740px" },
                    height: { md: "500px", lg: "540px" },
                    borderRadius: "50%",
                    border: "1px dashed rgba(20,216,151,0.15)",
                    zIndex: 1,
                    opacity: 0.6,
                    animation: "rotateReverseSlow 120s linear infinite",
                    "@keyframes rotateReverseSlow": {
                      "0%": {
                        transform: "translate(-50%, -50%) rotate(20deg)",
                      },
                      "100%": {
                        transform: "translate(-50%, -50%) rotate(-340deg)",
                      },
                    },
                  }}
                />
              </motion.div>

              {/* Enhanced premium decorative elements */}
              {[
                {
                  position: { top: "10%", right: "8%" },
                  delay: 0.6,
                  size: "150px",
                  opacity: 0.15,
                  blur: "70px",
                  background:
                    "radial-gradient(circle, rgba(20, 216, 151, 0.9) 0%, rgba(20, 216, 151, 0) 70%)",
                  animation: "pulse-glow 8s infinite alternate ease-in-out",
                },
                {
                  position: { bottom: "15%", right: "12%" },
                  delay: 0.9,
                  size: "120px",
                  opacity: 0.12,
                  blur: "60px",
                  background:
                    "radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 70%)",
                  animation:
                    "pulse-glow 12s infinite alternate-reverse ease-in-out",
                },
                {
                  position: { top: "40%", left: "5%" },
                  delay: 1.2,
                  size: "180px",
                  opacity: 0.1,
                  blur: "80px",
                  background:
                    "radial-gradient(circle, rgba(20, 216, 151, 0.7) 0%, rgba(20, 216, 151, 0) 70%)",
                  animation: "pulse-glow 10s infinite alternate ease-in-out",
                },
              ].map((element, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.5, delay: element.delay }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      ...element.position,
                      width: element.size,
                      height: element.size,
                      borderRadius: "50%",
                      background: element.background,
                      filter: `blur(${element.blur})`,
                      opacity: element.opacity,
                      zIndex: 2,
                      animation: element.animation,
                      "@keyframes pulse-glow": {
                        "0%": {
                          opacity: element.opacity,
                          transform: "scale(1)",
                        },
                        "100%": {
                          opacity: element.opacity * 1.5,
                          transform: "scale(1.15)",
                        },
                      },
                    }}
                  />
                </motion.div>
              ))}

              {/* Enhanced floating particles with better positioning and movement */}
              <Box>
                {/* Define all particle animations */}
                <Box
                  sx={{
                    "@keyframes float-particle-1": {
                      "0%, 100%": { transform: "translate(0, 0) scale(1)" },
                      "25%": { transform: "translate(25px, -20px) scale(1.1)" },
                      "50%": { transform: "translate(50px, 5px) scale(0.9)" },
                      "75%": { transform: "translate(25px, 20px) scale(1.05)" },
                    },
                    "@keyframes float-particle-2": {
                      "0%, 100%": { transform: "translate(0, 0) scale(0.9)" },
                      "25%": { transform: "translate(-20px, 15px) scale(1.1)" },
                      "50%": { transform: "translate(-35px, 0) scale(1)" },
                      "75%": {
                        transform: "translate(-15px, -20px) scale(0.95)",
                      },
                    },
                    "@keyframes float-particle-3": {
                      "0%, 100%": { transform: "translate(0, 0) scale(1)" },
                      "25%": { transform: "translate(15px, -25px) scale(0.9)" },
                      "50%": { transform: "translate(30px, -10px) scale(1.1)" },
                      "75%": { transform: "translate(15px, 15px) scale(1)" },
                    },
                    "@keyframes float-particle-4": {
                      "0%, 100%": { transform: "translate(0, 0) scale(1.05)" },
                      "20%": {
                        transform: "translate(-25px, -10px) scale(0.95)",
                      },
                      "40%": { transform: "translate(-40px, 15px) scale(1)" },
                      "60%": { transform: "translate(-30px, 30px) scale(1.1)" },
                      "80%": { transform: "translate(-10px, 15px) scale(0.9)" },
                    },
                    "@keyframes float-particle-5": {
                      "0%, 100%": { transform: "translate(0, 0) scale(0.9)" },
                      "20%": { transform: "translate(10px, 20px) scale(1)" },
                      "40%": { transform: "translate(30px, 35px) scale(1.1)" },
                      "60%": { transform: "translate(40px, 20px) scale(0.95)" },
                      "80%": { transform: "translate(25px, 5px) scale(1.05)" },
                    },
                    "@keyframes float-particle-6": {
                      "0%, 100%": { transform: "translate(0, 0) scale(1)" },
                      "20%": {
                        transform: "translate(-15px, -30px) scale(0.95)",
                      },
                      "40%": {
                        transform: "translate(-25px, -15px) scale(1.05)",
                      },
                      "60%": { transform: "translate(-15px, 15px) scale(0.9)" },
                      "80%": { transform: "translate(-5px, 0px) scale(1)" },
                    },
                    "@keyframes pulse-opacity": {
                      "0%, 100%": { opacity: 0.4 },
                      "50%": { opacity: 0.8 },
                    },
                  }}
                />

                {/* Strategically positioned particles */}
                {[
                  {
                    top: "25%",
                    left: "25%",
                    size: 5,
                    delay: 0.2,
                    color: "white",
                    animation:
                      "float-particle-1 18s infinite ease-in-out 0.5s, pulse-opacity 6s infinite ease-in-out",
                  },
                  {
                    top: "35%",
                    left: "70%",
                    size: 4,
                    delay: 0.5,
                    color: "green",
                    animation:
                      "float-particle-2 20s infinite ease-in-out 1s, pulse-opacity 8s infinite ease-in-out",
                  },
                  {
                    top: "65%",
                    left: "30%",
                    size: 6,
                    delay: 0.8,
                    color: "green",
                    animation:
                      "float-particle-3 22s infinite ease-in-out 1.5s, pulse-opacity 7s infinite ease-in-out",
                  },
                  {
                    top: "75%",
                    left: "65%",
                    size: 3,
                    delay: 1.1,
                    color: "white",
                    animation:
                      "float-particle-4 19s infinite ease-in-out 2s, pulse-opacity 5s infinite ease-in-out",
                  },
                  {
                    top: "18%",
                    left: "58%",
                    size: 5,
                    delay: 1.4,
                    color: "green",
                    animation:
                      "float-particle-5 21s infinite ease-in-out 2.5s, pulse-opacity 9s infinite ease-in-out",
                  },
                  {
                    top: "58%",
                    left: "18%",
                    size: 4,
                    delay: 1.7,
                    color: "white",
                    animation:
                      "float-particle-6 23s infinite ease-in-out 3s, pulse-opacity 7s infinite ease-in-out",
                  },
                  {
                    top: "42%",
                    left: "78%",
                    size: 5,
                    delay: 2.0,
                    color: "green",
                    animation:
                      "float-particle-3 24s infinite ease-in-out 0s, pulse-opacity 8s infinite ease-in-out",
                  },
                  {
                    top: "82%",
                    left: "42%",
                    size: 3,
                    delay: 2.3,
                    color: "white",
                    animation:
                      "float-particle-1 17s infinite ease-in-out 1.5s, pulse-opacity 6s infinite ease-in-out",
                  },
                ].map((particle, index) => (
                  <motion.div
                    key={`particle-${index}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, delay: particle.delay }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: particle.top,
                        left: particle.left,
                        width: particle.size,
                        height: particle.size,
                        borderRadius: "50%",
                        backgroundColor:
                          particle.color === "white"
                            ? "rgba(255,255,255,0.85)"
                            : "rgba(20,216,151,0.85)",
                        boxShadow:
                          particle.color === "white"
                            ? "0 0 15px 3px rgba(255,255,255,0.4)"
                            : "0 0 15px 3px rgba(20,216,151,0.4)",
                        zIndex: 3,
                        animation: particle.animation,
                      }}
                    />
                  </motion.div>
                ))}

                {/* Larger focal point particles near the Earth */}
                {[
                  { top: "40%", left: "55%", size: 8, delay: 0.2, glow: 15 },
                  { top: "60%", left: "45%", size: 7, delay: 0.8, glow: 12 },
                ].map((particle, index) => (
                  <motion.div
                    key={`focal-particle-${index}`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 0.9, scale: 1 }}
                    transition={{ duration: 2, delay: particle.delay + 2 }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: particle.top,
                        left: particle.left,
                        width: particle.size,
                        height: particle.size,
                        borderRadius: "50%",
                        backgroundColor: "#14D897",
                        boxShadow: `0 0 ${particle.glow}px 4px rgba(20,216,151,0.7)`,
                        zIndex: 4,
                        animation: "pulse-opacity 4s infinite ease-in-out",
                      }}
                    />
                  </motion.div>
                ))}
              </Box>

              {/* Enhanced premium geometric decorative elements */}
              <motion.div
                initial={{ opacity: 0, rotate: -10, y: 20 }}
                animate={{ opacity: 1, rotate: 0, y: 0 }}
                transition={{ delay: 1.3, duration: 1.8, type: "spring" }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: "5%",
                    left: "12%",
                    width: "220px",
                    height: "220px",
                    borderRadius: "30%",
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(20,216,151,0.12) 100%)",
                    backdropFilter: "blur(15px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    zIndex: 1,
                    opacity: 0.7,
                    transform: "rotate(-20deg)",
                    animation: "floatElement 15s ease-in-out infinite",
                    "@keyframes floatElement": {
                      "0%, 100%": { transform: "rotate(-20deg) scale(1)" },
                      "50%": { transform: "rotate(-15deg) scale(1.05)" },
                    },
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      inset: "15px",
                      borderRadius: "30%",
                      border: "1px solid rgba(20,216,151,0.25)",
                      opacity: 0.7,
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      inset: -1,
                      borderRadius: "30%",
                      padding: 1,
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(20,216,151,0.25) 50%, rgba(255,255,255,0.1))",
                      WebkitMask:
                        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                      opacity: 0.6,
                    },
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, rotate: 15, y: -20 }}
                animate={{ opacity: 1, rotate: 0, y: 0 }}
                transition={{ delay: 1.5, duration: 1.8, type: "spring" }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    bottom: "8%",
                    right: "12%",
                    width: "240px",
                    height: "240px",
                    borderRadius: "25%",
                    background:
                      "linear-gradient(135deg, rgba(20,216,151,0.1) 0%, rgba(255,255,255,0.04) 100%)",
                    backdropFilter: "blur(18px)",
                    border: "1px solid rgba(20,216,151,0.12)",
                    zIndex: 1,
                    opacity: 0.7,
                    transform: "rotate(15deg)",
                    animation: "floatElement2 18s ease-in-out infinite 2s",
                    "@keyframes floatElement2": {
                      "0%, 100%": { transform: "rotate(15deg) scale(1)" },
                      "50%": { transform: "rotate(10deg) scale(1.08)" },
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      inset: "-5px",
                      borderRadius: "25%",
                      padding: "5px",
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(20,216,151,0.2) 50%, transparent)",
                      WebkitMask:
                        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                      opacity: 0.7,
                    },
                  }}
                />
              </motion.div>

              {/* Additional geometric element for more dimension */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 1.8,
                  duration: 2,
                  type: "spring",
                  stiffness: 80,
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: "45%",
                    left: "5%",
                    width: "120px",
                    height: "120px",
                    borderRadius: "16px",
                    background:
                      "linear-gradient(135deg, rgba(20,216,151,0.12) 0%, rgba(255,255,255,0.05) 100%)",
                    backdropFilter: "blur(15px)",
                    border: "1px solid rgba(20,216,151,0.15)",
                    zIndex: 1,
                    opacity: 0.6,
                    transform: "rotate(45deg)",
                    animation: "floatElement3 20s ease-in-out infinite 1s",
                    "@keyframes floatElement3": {
                      "0%, 100%": { transform: "rotate(45deg) translateY(0)" },
                      "50%": { transform: "rotate(40deg) translateY(-15px)" },
                    },
                    boxShadow:
                      "0 10px 40px rgba(0,0,0,0.1), 0 0 20px rgba(20,216,151,0.1)",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      inset: "10px",
                      borderRadius: "10px",
                      border: "1px dashed rgba(20,216,151,0.3)",
                      opacity: 0.5,
                    },
                  }}
                />
              </motion.div>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Enhanced Premium Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 2.5,
          duration: 1.2,
          type: "spring",
          stiffness: 100,
        }}
      >
        <Box
          onClick={() =>
            window.scrollTo({
              top: window.innerHeight,
              behavior: "smooth",
            })
          }
          sx={{
            position: "absolute",
            bottom: { xs: "30px", md: "40px" },
            left: "50%",
            transform: "translateX(-50%)",
            color: "rgba(255,255,255,0.9)",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 10,
            transition: "all 0.4s ease",
          }}
        >
          <Box
            sx={{
              position: "relative",
              padding: "18px 30px",
              background: "rgba(20,216,151,0.07)",
              backdropFilter: "blur(15px)",
              borderRadius: "16px",
              border: "1px solid rgba(20,216,151,0.15)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.15), 0 0 20px rgba(20,216,151,0.1)",
              "&:hover": {
                background: "rgba(20,216,151,0.12)",
                borderColor: "rgba(20,216,151,0.3)",
                boxShadow:
                  "0 15px 30px rgba(0,0,0,0.2), 0 0 30px rgba(20,216,151,0.15)",
                transform: "translateY(-5px)",
                color: "#14D897",
              },
              transition: "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              "&::before": {
                content: '""',
                position: "absolute",
                inset: -1,
                borderRadius: "16px",
                padding: 1,
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.4), rgba(20,216,151,0.2) 50%, rgba(255,255,255,0.1))",
                WebkitMask:
                  "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
                opacity: 0.5,
              },
            }}
          >
            <AntTypography.Text
              style={{
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: "10px",
                fontSize: "0.8rem",
                background: "linear-gradient(90deg, #FFFFFF, #14D897)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Discover More
            </AntTypography.Text>

            {/* Animated arrow with glow effect */}
            <Box
              sx={{
                position: "relative",
                animation:
                  "gentleBounce 2s infinite cubic-bezier(0.6, 0.05, 0.15, 0.95)",
                "@keyframes gentleBounce": {
                  "0%, 100%": { transform: "translateY(0)" },
                  "50%": { transform: "translateY(8px)" },
                },
              }}
            >
              {/* Arrow glow effect */}
              <Box
                sx={{
                  position: "absolute",
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "rgba(20,216,151,0.3)",
                  filter: "blur(8px)",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  animation: "pulse 2s infinite ease-in-out",
                  "@keyframes pulse": {
                    "0%, 100%": {
                      opacity: 0.3,
                      transform: "translate(-50%, -50%) scale(0.8)",
                    },
                    "50%": {
                      opacity: 0.6,
                      transform: "translate(-50%, -50%) scale(1.2)",
                    },
                  },
                }}
              />

              {/* Double arrow for more emphasis */}
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
                <path d="M7 13l5 5 5-5" />
              </svg>
            </Box>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
};

export default HeroSection;
