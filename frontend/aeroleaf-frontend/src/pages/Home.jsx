import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import { motion } from "framer-motion";
import Testimonials from "../components/Testimonials";
import Statistics from "../components/Statistics";
import WelcomeDialog from "../components/WelcomeDialog";
import { useHelp } from "../contexts/HelpContext";
import InfoCard from "../components/InfoCard";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Paper,
  useTheme,
} from "@mui/material";
import {
  School as SchoolIcon,
  ForestOutlined,
  SatelliteAltOutlined,
  AccountTreeOutlined,
  VerifiedOutlined,
} from "@mui/icons-material";

export default function Home() {
  const { isFirstTimeUser, setFirstTimeUserSeen, startGuidedTour } = useHelp();
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const theme = useTheme();
  const featuresRef = useRef(null);
  const [featuresVisible, setFeaturesVisible] = useState(false);

  useEffect(() => {
    // Show welcome dialog for first-time users after a short delay
    if (isFirstTimeUser) {
      const timer = setTimeout(() => {
        setWelcomeOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isFirstTimeUser]);

  // Observer for features animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFeaturesVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    return () => {
      if (featuresRef.current) {
        observer.unobserve(featuresRef.current);
      }
    };
  }, []);

  const handleWelcomeClose = () => {
    setWelcomeOpen(false);
    setFirstTimeUserSeen();
  };

  const features = [
    {
      title: "Satellite Verification",
      description:
        "Advanced satellite imagery analysis confirms the health and growth of reforestation projects in real-time.",
      icon: (
        <SatelliteAltOutlined
          sx={{ fontSize: 40, color: theme.palette.primary.main }}
        />
      ),
    },
    {
      title: "Blockchain Transparency",
      description:
        "Every carbon credit is tokenized on the blockchain, ensuring immutable verification and transparent trading.",
      icon: (
        <AccountTreeOutlined
          sx={{ fontSize: 40, color: theme.palette.primary.main }}
        />
      ),
    },
    {
      title: "AI-Powered Analysis",
      description:
        "Our machine learning algorithms analyze NDVI data to accurately measure carbon sequestration.",
      icon: (
        <VerifiedOutlined
          sx={{ fontSize: 40, color: theme.palette.primary.main }}
        />
      ),
    },
    {
      title: "Global Impact",
      description:
        "Support verified reforestation projects worldwide and track your environmental impact with precision.",
      icon: (
        <ForestOutlined
          sx={{ fontSize: 40, color: theme.palette.primary.main }}
        />
      ),
    },
  ];

  return (
    <div>
      <HeroSection />

      {/* Key Features Section */}
      <Box
        py={10}
        sx={{
          backgroundColor: "#f8f9fa",
          position: "relative",
          overflow: "hidden",
        }}
        ref={featuresRef}
      >
        {/* Decorative background elements */}
        <Box
          sx={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${theme.palette.primary.light} 0%, rgba(255,255,255,0) 70%)`,
            opacity: 0.4,
            zIndex: 1,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -50,
            left: -50,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${theme.palette.primary.light} 0%, rgba(255,255,255,0) 70%)`,
            opacity: 0.3,
            zIndex: 1,
          }}
        />

        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography
              variant="overline"
              component="div"
              color="primary"
              fontWeight="bold"
              letterSpacing={1.5}
            >
              OUR TECHNOLOGY
            </Typography>
            <Typography
              variant="h3"
              component="h2"
              fontWeight="bold"
              gutterBottom
            >
              How AeroLeaf Works
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ maxWidth: 700, mx: "auto" }}
            >
              Our platform combines cutting-edge technologies to bring
              unprecedented transparency to carbon credit verification
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    featuresVisible
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      height: "100%",
                      transition:
                        "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                      ":hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      textAlign="center"
                    >
                      <Box mb={2}>{feature.icon}</Box>
                      <Typography
                        variant="h5"
                        component="h3"
                        fontWeight="medium"
                        gutterBottom
                      >
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box py={10}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box>
                <Typography
                  variant="overline"
                  component="div"
                  color="primary"
                  fontWeight="bold"
                  letterSpacing={1.5}
                >
                  PLATFORM OVERVIEW
                </Typography>
                <Typography
                  variant="h3"
                  component="h2"
                  fontWeight="bold"
                  gutterBottom
                >
                  Transparent Carbon Credits
                </Typography>
                <Typography variant="body1" paragraph color="text.secondary">
                  AeroLeaf leverages satellite imagery, AI analysis, and
                  blockchain technology to verify and tokenize carbon credits
                  from reforestation projects worldwide.
                </Typography>

                <Box my={3}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Box
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        borderRadius: "50%",
                        width: 36,
                        height: 36,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold",
                        mr: 2,
                      }}
                    >
                      1
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        component="div"
                        fontWeight="medium"
                      >
                        Project Registration
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Land owners register their reforestation projects on our
                        platform
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center" mb={2}>
                    <Box
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        borderRadius: "50%",
                        width: 36,
                        height: 36,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold",
                        mr: 2,
                      }}
                    >
                      2
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        component="div"
                        fontWeight="medium"
                      >
                        Satellite Monitoring
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Satellite imagery tracks progress and verifies forest
                        growth using NDVI
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center" mb={2}>
                    <Box
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        borderRadius: "50%",
                        width: 36,
                        height: 36,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold",
                        mr: 2,
                      }}
                    >
                      3
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        component="div"
                        fontWeight="medium"
                      >
                        Carbon Credit Issuance
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Verified carbon sequestration is converted to blockchain
                        tokens
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center">
                    <Box
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        borderRadius: "50%",
                        width: 36,
                        height: 36,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold",
                        mr: 2,
                      }}
                    >
                      4
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        component="div"
                        fontWeight="medium"
                      >
                        Marketplace Trading
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Businesses purchase verified credits to offset their
                        carbon footprint
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  component={Link}
                  to="/marketplace"
                  sx={{ mt: 2 }}
                >
                  Explore Marketplace
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: 450,
                  width: "100%",
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: 4,
                  boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(21, 128, 61, 0.2)", // primary.dark with opacity
                    zIndex: 1,
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Statistics />

      {/* Welcome Card Section */}
      <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
        <Paper
          elevation={0}
          sx={{
            p: 5,
            background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, #ffffff 100%)`,
            borderRadius: 4,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "30%",
              height: "100%",
              opacity: 0.99,
              background: `url('https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80')`,
              backgroundSize: "cover",
            }}
          />

          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography
                variant="h3"
                component="h2"
                fontWeight="bold"
                gutterBottom
              >
                Ready to Make a Difference?
              </Typography>
              <Typography variant="body1" paragraph sx={{ maxWidth: 600 }}>
                Join AeroLeaf and be part of the solution to climate change. Our
                platform makes it easy to invest in verified carbon credits that
                truly impact our planet.
              </Typography>
              <Box display="flex" gap={2} mt={3}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  component={Link}
                  to="/dashboard"
                >
                  Explore Dashboard
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  startIcon={<SchoolIcon />}
                  onClick={startGuidedTour}
                >
                  Take a Tour
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <Testimonials />

      {/* Welcome Dialog for first-time users */}
      <WelcomeDialog open={welcomeOpen} onClose={handleWelcomeClose} />
    </div>
  );
}
