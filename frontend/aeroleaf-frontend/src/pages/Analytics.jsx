import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Chip,
  IconButton,
  Tooltip as MuiTooltip,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import { Link } from "react-router-dom";
// Icons
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import VerifiedIcon from '@mui/icons-material/Verified';
import PendingIcon from '@mui/icons-material/Pending';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
} from "recharts";

// Custom components
import NDVIChart from "../components/NDVIChart";
import NDVIVisualization from "../components/NDVIVisualization";

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // "overview", "projects", "market", "impact"
  const [stats, setStats] = useState({
    totalCredits: 0,
    totalCarbon: 0,
    carbonByProject: [],
    creditVolume: [],
    priceHistory: [],
    environmentalImpact: {},
    projectDetails: [],
    marketTrends: {},
    regionData: [],
  });
  // Menu state for actions dropdown
  const [anchorEl, setAnchorEl] = useState(null);
  // Last updated timestamp
  const [lastUpdated] = useState(new Date());

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);

        // In a real app, this would fetch analytics data from the API
        // const data = await analyticsApi.getStats();
        // setStats(data);

        // Mock data for demonstration
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Enhanced mock data with more detailed information
        setStats({
          totalCredits: 58,
          totalCarbon: 742.5,
          carbonByProject: [
            { name: "Nandurbar Forest", value: 320.2 },
            { name: "Taita Hills", value: 215.8 },
            { name: "Rio Doce", value: 168.5 },
            { name: "Other", value: 38.0 },
          ],
          creditVolume: [
            { month: "Jan", credits: 12 },
            { month: "Feb", credits: 15 },
            { month: "Mar", credits: 22 },
            { month: "Apr", credits: 30 },
            { month: "May", credits: 58 },
          ],
          priceHistory: [
            { month: "Jan", price: 14.2 },
            { month: "Feb", price: 15.8 },
            { month: "Mar", price: 15.2 },
            { month: "Apr", price: 16.5 },
            { month: "May", price: 18.2 },
          ],
          environmentalImpact: {
            trees: 12500,
            area: 85.3,
            biodiversity: 23,
            waterQuality: 17.8,
            carbonOffset: 742.5,
            soilHealth: 78.5,
            wildlifeProtection: 42,
            ecosystemServices: 5.2,
          },
          projectDetails: [
            {
              id: "proj001",
              name: "Nandurbar Forest",
              location: "Maharashtra, India",
              startDate: "2022-03-15",
              area: 42.6,
              treeSpecies: ["Teak", "Bamboo", "Banyan"],
              carbonSeq: 320.2,
              verificationStatus: "verified",
              verifier: "EcoWatch International",
              lastVerified: "2025-03-10",
              ndviChange: 0.28,
            },
            {
              id: "proj002",
              name: "Taita Hills",
              location: "Kenya",
              startDate: "2023-01-20",
              area: 24.2,
              treeSpecies: ["Acacia", "Cedar", "Olive"],
              carbonSeq: 215.8,
              verificationStatus: "verified",
              verifier: "Carbon Trust",
              lastVerified: "2025-04-22",
              ndviChange: 0.22,
            },
            {
              id: "proj003",
              name: "Rio Doce",
              location: "Brazil",
              startDate: "2023-09-05",
              area: 18.5,
              treeSpecies: ["Mahogany", "Ipe", "Brazil Nut"],
              carbonSeq: 168.5,
              verificationStatus: "pending",
              verifier: "Rainforest Alliance",
              lastVerified: "2025-02-18",
              ndviChange: 0.17,
            },
          ],
          marketTrends: {
            averageTokenValue: {
              current: 18.2,
              lastMonth: 16.5,
              growth: 10.3,
            },
            volumeTrends: {
              daily: [22, 19, 25, 28, 31, 27, 30],
              weekly: [145, 152, 168, 172, 190],
            },
            projectedGrowth: 12.5,
            marketCap: 1054280,
            totalTransactions: 283,
          },
          regionData: [
            { region: "South Asia", credits: 320, projects: 5 },
            { region: "Africa", credits: 225, projects: 3 },
            { region: "South America", credits: 168, projects: 2 },
            { region: "Southeast Asia", credits: 29, projects: 2 },
          ],
        });

        setError(null);
      } catch (err) {
        console.error("Failed to fetch analytics data:", err);
        setError("Could not load analytics data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="70vh"
          gap={2}
        >
          <CircularProgress size={60} thickness={4} sx={{ color: '#22c55e' }} />
          <Typography variant="h6" color="text.secondary">
            Loading analytics data...
          </Typography>
        </Box>
      </Container>
    );
  }

  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  
  // Function to handle data refresh
  const handleRefresh = () => {
    // In a real app, this would trigger a data refresh
    console.log('Refreshing data...');
  };

  // Function to handle data export
  const handleExport = (format) => {
    console.log(`Exporting data as ${format}...`);
    handleClose();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section with Actions */}
      <Box sx={{
        mb: 4,
        p: 0,
        position: 'relative',
        borderRadius: 2,
        overflow: 'hidden',
      }}>
        <Paper 
          elevation={0}
          sx={{
            p: 4,
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
            color: 'white',
            borderRadius: 2,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: 'url("/carbon-pattern.svg")',
              backgroundSize: 'cover',
              opacity: 0.1,
              zIndex: 0,
            }
          }}
        >
          {/* Header Content */}
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  gutterBottom
                  sx={{ fontWeight: 700, letterSpacing: '-0.025em' }}
                >
                  Carbon Credits Analytics
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 2, opacity: 0.9, maxWidth: '650px' }}>
                  Comprehensive analytics and insights for carbon credit projects,
                  market performance, and environmental impact
                </Typography>
              </Box>
              
              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <MuiTooltip title="Refresh data">
                  <IconButton 
                    onClick={handleRefresh}
                    sx={{ 
                      color: 'white', 
                      bgcolor: 'rgba(255,255,255,0.1)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } 
                    }}
                  >
                    <RefreshIcon />
                  </IconButton>
                </MuiTooltip>
                
                <MuiTooltip title="Export data">
                  <IconButton 
                    onClick={handleClick}
                    sx={{ 
                      color: 'white', 
                      bgcolor: 'rgba(255,255,255,0.1)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } 
                    }}
                  >
                    <DownloadOutlinedIcon />
                  </IconButton>
                </MuiTooltip>
                
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'export-button',
                  }}
                >
                  <MenuItem onClick={() => handleExport('csv')}>Export as CSV</MenuItem>
                  <MenuItem onClick={() => handleExport('pdf')}>Export as PDF</MenuItem>
                  <MenuItem onClick={() => handleExport('json')}>Export as JSON</MenuItem>
                </Menu>
              </Box>
            </Box>

            {/* Key Metrics */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                bgcolor: 'rgba(255,255,255,0.1)', 
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <Grid container spacing={3} sx={{ textAlign: 'center' }}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 0.5, fontSize: '0.875rem' }}>
                    Total Credits
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
                    {stats.totalCredits}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 0.5, fontSize: '0.875rem' }}>
                    Carbon Sequestered
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
                    {stats.totalCarbon} <Typography component="span" variant="body2">t</Typography>
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 0.5, fontSize: '0.875rem' }}>
                    Projects
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
                    {stats.projectDetails?.length || 3}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 0.5, fontSize: '0.875rem' }}>
                    Avg. Price
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'white' }}>
                    {stats.marketTrends?.averageTokenValue?.current || 18.2} <Typography component="span" variant="body2">MATIC</Typography>
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
            
            {/* Last updated timestamp */}
            <Typography variant="caption" sx={{ display: 'block', mt: 2, textAlign: 'right', opacity: 0.7 }}>
              Last updated: {lastUpdated.toLocaleString()}
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Analytics Navigation Tabs */}
      <Paper 
        elevation={0} 
        sx={{ 
          mb: 4, 
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="analytics tabs"
            sx={{
              '& .MuiTab-root': {
                py: 2,
                px: 3,
                minWidth: 120,
                fontWeight: 500,
                textTransform: 'none',
                fontSize: '0.95rem',
                letterSpacing: '-0.01em',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.04)',
                },
              },
              '& .Mui-selected': {
                fontWeight: 600,
                color: '#2563eb',
              },
              '& .MuiTabs-indicator': {
                height: 3,
                borderTopLeftRadius: 3,
                borderTopRightRadius: 3,
                bgcolor: '#2563eb',
              },
            }}
          >
            <Tab 
              value="overview" 
              label="Overview" 
              icon={<TrendingUpIcon fontSize="small" />} 
              iconPosition="start"
            />
            <Tab 
              value="projects" 
              label="Projects" 
              icon={<VerifiedIcon fontSize="small" />} 
              iconPosition="start"
            />
            <Tab 
              value="market" 
              label="Market" 
              icon={<TrendingUpIcon fontSize="small" />} 
              iconPosition="start"
            />
            <Tab 
              value="impact" 
              label="Environmental Impact" 
              icon={<InfoOutlinedIcon fontSize="small" />} 
              iconPosition="start"
            />
          </Tabs>
        </Box>
      </Paper>

      {error && (
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            mb: 4, 
            bgcolor: '#FEF2F2', 
            color: '#B91C1C',
            borderRadius: 2,
            border: '1px solid #FEE2E2',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Box sx={{ 
            width: 40, 
            height: 40, 
            borderRadius: '50%', 
            bgcolor: '#FEE2E2', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Error Loading Analytics
            </Typography>
            <Typography variant="body2">{error}</Typography>
          </Box>
        </Paper>
      )}

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <>
          {/* Enhanced Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 5 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                elevation={0} 
                sx={{ 
                  borderRadius: 2, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  height: '100%',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography
                      color="text.secondary"
                      variant="subtitle2"
                      sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem' }}
                    >
                      Total Carbon Credits
                    </Typography>
                    <Avatar sx={{ bgcolor: '#EFF6FF', width: 36, height: 36 }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </Avatar>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {stats.totalCredits}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUpIcon sx={{ color: '#10B981', fontSize: 18, mr: 0.5 }} />
                    <Typography variant="body2" sx={{ color: '#10B981', fontWeight: 500 }}>
                      +24% from last month
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                elevation={0} 
                sx={{ 
                  borderRadius: 2, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  height: '100%',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography
                      color="text.secondary"
                      variant="subtitle2"
                      sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem' }}
                    >
                      Carbon Sequestered
                    </Typography>
                    <Avatar sx={{ bgcolor: '#ECFDF5', width: 36, height: 36 }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 22h20M12 2v15M5 12l7-7 7 7" />
                      </svg>
                    </Avatar>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {stats.totalCarbon} <Typography component="span" variant="body2" sx={{ fontSize: '0.9rem', opacity: 0.7 }}>t</Typography>
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TrendingUpIcon sx={{ color: '#10B981', fontSize: 18, mr: 0.5 }} />
                    <Typography variant="body2" sx={{ color: '#10B981', fontWeight: 500 }}>
                      +17.2% YTD
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                elevation={0} 
                sx={{ 
                  borderRadius: 2, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  height: '100%',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography
                      color="text.secondary"
                      variant="subtitle2"
                      sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem' }}
                    >
                      Trees Protected
                    </Typography>
                    <Avatar sx={{ bgcolor: '#F0FDF4', width: 36, height: 36 }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 14v6m-3-3h6M6 20V10m0 0V4m0 6h8m-8 0a6 6 0 0 0 8 0m0-6v6" />
                      </svg>
                    </Avatar>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {stats.environmentalImpact?.trees.toLocaleString()}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      label="Target: 15,000"
                      size="small"
                      sx={{ 
                        bgcolor: '#F0FDF4', 
                        color: '#22C55E', 
                        fontWeight: 500,
                        border: '1px solid #DCFCE7'
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                elevation={0} 
                sx={{ 
                  borderRadius: 2, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  height: '100%',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography
                      color="text.secondary"
                      variant="subtitle2"
                      sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem' }}
                    >
                      Area Protected
                    </Typography>
                    <Avatar sx={{ bgcolor: '#EFF6FF', width: 36, height: 36 }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16" />
                      </svg>
                    </Avatar>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {stats.environmentalImpact?.area} <Typography component="span" variant="body2" sx={{ fontSize: '0.9rem', opacity: 0.7 }}>ha</Typography>
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Across {stats.regionData?.length || 4} regions
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={4} sx={{ mb: 5 }}>
            <Grid item xs={12} md={6}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 2, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  height: '100%',
                  overflow: 'visible'
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Carbon by Project
                    </Typography>
                    <Tooltip title="Distribution of carbon credits across different projects">
                      <IconButton size="small">
                        <InfoOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box height={320} sx={{ mt: 1 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.carbonByProject}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          innerRadius={60}
                          paddingAngle={2}
                          fill="#8884d8"
                          dataKey="value"
                          animationDuration={1000}
                          animationBegin={200}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {stats.carbonByProject.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                              stroke="#fff"
                              strokeWidth={1}
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => `${value} tCO₂e`} 
                          contentStyle={{ 
                            borderRadius: 8, 
                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)', 
                            border: 'none',
                            padding: '8px 12px',
                            backgroundColor: 'rgba(255, 255, 255, 0.95)'
                          }}
                          itemStyle={{ color: '#111827', fontWeight: 500 }}
                          labelStyle={{ color: '#6B7280', fontWeight: 500, marginBottom: 4 }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 2, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  height: '100%',
                  overflow: 'visible'
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Credit Growth (2025)
                    </Typography>
                    <Box>
                      <Tooltip title="Download chart data">
                        <IconButton size="small" sx={{ ml: 1 }}>
                          <DownloadOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View chart information">
                        <IconButton size="small">
                          <InfoOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Box height={320} sx={{ mt: 1 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={stats.creditVolume}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                        <XAxis 
                          dataKey="month" 
                          axisLine={{ stroke: '#E5E7EB' }}
                          tickLine={{ stroke: '#E5E7EB' }}
                          tick={{ fill: '#6B7280', fontSize: 12 }}
                        />
                        <YAxis 
                          axisLine={{ stroke: '#E5E7EB' }}
                          tickLine={{ stroke: '#E5E7EB' }}
                          tick={{ fill: '#6B7280', fontSize: 12 }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            borderRadius: 8, 
                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)', 
                            border: 'none',
                            padding: '8px 12px',
                            backgroundColor: 'rgba(255, 255, 255, 0.95)'
                          }}
                          itemStyle={{ color: '#111827', fontWeight: 500 }}
                          labelStyle={{ color: '#6B7280', fontWeight: 500, marginBottom: 4 }}
                        />
                        <Legend 
                          iconType="circle"
                          iconSize={8}
                          wrapperStyle={{ paddingTop: 20 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="credits"
                          stroke="#8884d8"
                          activeDot={{ r: 8, strokeWidth: 0 }}
                          name="Total Credits"
                          strokeWidth={3}
                          dot={{ strokeWidth: 2, r: 4, fill: '#fff' }}
                          animationDuration={1500}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Price History */}
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: 2, 
              border: '1px solid', 
              borderColor: 'divider',
              mb: 5,
              overflow: 'visible'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mr: 2 }}>
                    Average Credit Price (MATIC)
                  </Typography>
                  <Chip 
                    label="+12.4% YTD" 
                    size="small" 
                    sx={{ 
                      bgcolor: '#ECFDF5', 
                      color: '#10B981', 
                      fontWeight: 500,
                      height: 24,
                      '& .MuiChip-label': { px: 1 }
                    }}
                    icon={<TrendingUpIcon style={{ color: '#10B981', fontSize: 16 }} />}
                  />
                </Box>
                <Box>
                  <Tooltip title="Filter data">
                    <IconButton size="small" sx={{ ml: 1 }}>
                      <FilterListIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Download chart data">
                    <IconButton size="small" sx={{ ml: 1 }}>
                      <DownloadOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="View chart information">
                    <IconButton size="small">
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <Box height={350} sx={{ mt: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={stats.priceHistory}
                    margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                  >
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                    <XAxis 
                      dataKey="month" 
                      axisLine={{ stroke: '#E5E7EB' }}
                      tickLine={{ stroke: '#E5E7EB' }}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      padding={{ left: 10, right: 10 }}
                    />
                    <YAxis 
                      domain={["dataMin - 5", "dataMax + 5"]} 
                      axisLine={{ stroke: '#E5E7EB' }}
                      tickLine={{ stroke: '#E5E7EB' }}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      width={60}
                    />
                    <Tooltip 
                      formatter={(value) => `${value} MATIC`} 
                      contentStyle={{ 
                        borderRadius: 8, 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)', 
                        border: 'none',
                        padding: '8px 12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)'
                      }}
                      itemStyle={{ color: '#111827', fontWeight: 500 }}
                      labelStyle={{ color: '#6B7280', fontWeight: 500, marginBottom: 4 }}
                    />
                    <Legend 
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ paddingTop: 20 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="#82ca9d"
                      fillOpacity={1}
                      fill="url(#colorPrice)"
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#82ca9d"
                      activeDot={{ r: 8, strokeWidth: 0 }}
                      name="Price (MATIC)"
                      strokeWidth={3}
                      dot={{ strokeWidth: 2, r: 4, fill: '#fff' }}
                      animationDuration={1500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </>
      )}

      {/* PROJECTS TAB */}
      {activeTab === "projects" && (
        <>
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: 2, 
              border: '1px solid', 
              borderColor: 'divider',
              mb: 4,
              overflow: 'hidden'
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Reforestation Project Details
                </Typography>
                <Box>
                  <Tooltip title="Filter projects">
                    <IconButton size="small" sx={{ ml: 1 }}>
                      <FilterListIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Refresh data">
                    <IconButton size="small" sx={{ ml: 1 }}>
                      <RefreshIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Export data">
                    <IconButton size="small" sx={{ ml: 1 }}>
                      <DownloadOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: 'rgba(245, 245, 247, 0.8)' }}>
                        Project
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: 'rgba(245, 245, 247, 0.8)' }}>
                        Location
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: 'rgba(245, 245, 247, 0.8)' }}>
                        Area (ha)
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: 'rgba(245, 245, 247, 0.8)' }}>
                        Carbon (t)
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: 'rgba(245, 245, 247, 0.8)' }}>
                        Status
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, backgroundColor: 'rgba(245, 245, 247, 0.8)' }}>
                        NDVI Change
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.projectDetails.map((project) => (
                      <TableRow 
                        key={project.id}
                        hover
                        sx={{ 
                          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.02)' },
                          transition: 'background-color 0.2s ease'
                        }}
                      >
                        <TableCell sx={{ fontWeight: 500 }}>{project.name}</TableCell>
                        <TableCell>{project.location}</TableCell>
                        <TableCell>{project.area}</TableCell>
                        <TableCell>{project.carbonSeq}</TableCell>
                        <TableCell>
                          {project.verificationStatus === "verified" ? (
                            <Chip
                              icon={<VerifiedIcon style={{ fontSize: 16 }} />}
                              label="Verified"
                              size="small"
                              sx={{ 
                                bgcolor: '#ECFDF5', 
                                color: '#10B981', 
                                fontWeight: 500,
                                border: '1px solid #D1FAE5',
                                '& .MuiChip-label': { px: 1 }
                              }}
                            />
                          ) : (
                            <Chip
                              icon={<PendingIcon style={{ fontSize: 16 }} />}
                              label="Pending"
                              size="small"
                              sx={{ 
                                bgcolor: '#FEF3C7', 
                                color: '#D97706', 
                                fontWeight: 500,
                                border: '1px solid #FDE68A',
                                '& .MuiChip-label': { px: 1 }
                              }}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: '#10B981', 
                                fontWeight: 600, 
                                mr: 1 
                              }}
                            >
                              +{(project.ndviChange * 100).toFixed(1)}%
                            </Typography>
                            <Box
                              sx={{
                                width: 60,
                                height: 6,
                                bgcolor: `rgba(16, 185, 129, ${project.ndviChange})`,
                                borderRadius: 3
                              }}
                            />
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body2" color="text.secondary">
                  Showing {stats.projectDetails.length} projects
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Grid container spacing={4} sx={{ mb: 5 }}>
            <Grid item xs={12} md={6}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 2, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  height: '100%',
                  overflow: 'visible'
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Carbon Sequestration by Region
                    </Typography>
                    <Tooltip title="View chart information">
                      <IconButton size="small">
                        <InfoOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box height={320} sx={{ mt: 1 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={stats.regionData}
                        margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                        barGap={8}
                        barSize={20}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                        <XAxis 
                          dataKey="region" 
                          axisLine={{ stroke: '#E5E7EB' }}
                          tickLine={{ stroke: '#E5E7EB' }}
                          tick={{ fill: '#6B7280', fontSize: 12 }}
                          padding={{ left: 10, right: 10 }}
                        />
                        <YAxis 
                          axisLine={{ stroke: '#E5E7EB' }}
                          tickLine={{ stroke: '#E5E7EB' }}
                          tick={{ fill: '#6B7280', fontSize: 12 }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            borderRadius: 8, 
                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)', 
                            border: 'none',
                            padding: '8px 12px',
                            backgroundColor: 'rgba(255, 255, 255, 0.95)'
                          }}
                          itemStyle={{ color: '#111827', fontWeight: 500 }}
                          labelStyle={{ color: '#6B7280', fontWeight: 500, marginBottom: 4 }}
                        />
                        <Legend 
                          iconType="circle"
                          iconSize={8}
                          wrapperStyle={{ paddingTop: 20 }}
                        />
                        <Bar
                          dataKey="credits"
                          name="Carbon Credits (t)"
                          fill="#8884d8"
                          radius={[4, 4, 0, 0]}
                          animationDuration={1500}
                        />
                        <Bar
                          dataKey="projects"
                          name="Number of Projects"
                          fill="#82ca9d"
                          radius={[4, 4, 0, 0]}
                          animationDuration={1500}
                          animationBegin={300}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 2, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  height: '100%',
                  overflow: 'visible'
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Project Verification Timeline
                    </Typography>
                    <Box>
                      <Tooltip title="Filter projects">
                        <IconButton size="small" sx={{ mr: 1 }}>
                          <FilterListIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View timeline information">
                        <IconButton size="small">
                          <InfoOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    {stats.projectDetails.map((project, index) => (
                      <Box
                        key={project.id}
                        sx={{
                          mb: 2,
                          pb: 2,
                          borderBottom: index < stats.projectDetails.length - 1 ? '1px solid' : 'none',
                          borderColor: 'divider',
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: 'rgba(0, 0, 0, 0.01)'
                          }
                        }}
                      >
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={6}>
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                fontWeight: 500,
                                fontSize: '0.95rem',
                                color: 'text.primary'
                              }}
                            >
                              {project.name}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}
                            >
                              <LocationOnOutlinedIcon sx={{ fontSize: 14, mr: 0.5, opacity: 0.7 }} />
                              {project.location}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end'
                              }}
                            >
                              <Box sx={{ textAlign: 'right' }}>
                                {project.verificationStatus === "verified" ? (
                                  <Chip 
                                    size="small" 
                                    label="Verified" 
                                    color="success" 
                                    variant="outlined"
                                    sx={{ fontWeight: 500, fontSize: '0.75rem' }}
                                  />
                                ) : (
                                  <Chip 
                                    size="small" 
                                    label="Pending" 
                                    color="warning" 
                                    variant="outlined"
                                    sx={{ fontWeight: 500, fontSize: '0.75rem' }}
                                  />
                                )}
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ display: 'block', mt: 0.5 }}
                                >
                                  {project.verificationStatus === "verified"
                                    ? `Verified on ${project.lastVerified}`
                                    : "Awaiting verification"}
                                </Typography>
                              </Box>
                              <Box sx={{ ml: 2 }}>
                                {project.verificationStatus === "verified" ? (
                                  <Avatar 
                                    sx={{ 
                                      width: 24, 
                                      height: 24, 
                                      bgcolor: 'success.light',
                                      color: 'success.dark'
                                    }}
                                  >
                                    <VerifiedIcon sx={{ fontSize: 16 }} />
                                  </Avatar>
                                ) : (
                                  <Avatar 
                                    sx={{ 
                                      width: 24, 
                                      height: 24, 
                                      bgcolor: 'warning.light',
                                      color: 'warning.dark'
                                    }}
                                  >
                                    <PendingIcon sx={{ fontSize: 16 }} />
                                  </Avatar>
                                )}
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}

      {/* MARKET TAB */}
      {activeTab === "market" && (
        <>
          <Grid container spacing={3} sx={{ mb: 5 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 2, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  height: '100%',
                  overflow: 'visible',
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography
                      color="text.secondary"
                      variant="subtitle2"
                      sx={{ fontWeight: 500, mb: 1 }}
                    >
                      Avg. Credit Price
                    </Typography>
                    <Avatar 
                      sx={{ 
                        width: 36, 
                        height: 36, 
                        bgcolor: 'primary.light',
                        color: 'primary.dark'
                      }}
                    >
                      <MonetizationOnIcon sx={{ fontSize: 20 }} />
                    </Avatar>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {stats.marketTrends.averageTokenValue.current} <Typography component="span" variant="h6" color="text.secondary">MATIC</Typography>
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Chip 
                      icon={<TrendingUpIcon fontSize="small" />}
                      label={`+${stats.marketTrends.averageTokenValue.growth}% MoM`}
                      color="success" 
                      size="small"
                      sx={{ fontWeight: 500, height: 24 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 2, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  height: '100%',
                  overflow: 'visible',
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography
                      color="text.secondary"
                      variant="subtitle2"
                      sx={{ fontWeight: 500, mb: 1 }}
                    >
                      Market Cap
                    </Typography>
                    <Avatar 
                      sx={{ 
                        width: 36, 
                        height: 36, 
                        bgcolor: 'secondary.light',
                        color: 'secondary.dark'
                      }}
                    >
                      <ShowChartIcon sx={{ fontSize: 20 }} />
                    </Avatar>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {(stats.marketTrends.marketCap / 1000).toFixed(1)}K <Typography component="span" variant="h6" color="text.secondary">MATIC</Typography>
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      Based on {stats.totalCredits} total credits
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 2, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  height: '100%',
                  overflow: 'visible',
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography
                      color="text.secondary"
                      variant="subtitle2"
                      sx={{ fontWeight: 500, mb: 1 }}
                    >
                      Total Transactions
                    </Typography>
                    <Avatar 
                      sx={{ 
                        width: 36, 
                        height: 36, 
                        bgcolor: 'info.light',
                        color: 'info.dark'
                      }}
                    >
                      <SwapHorizIcon sx={{ fontSize: 20 }} />
                    </Avatar>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {stats.marketTrends.totalTransactions.toLocaleString()}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      Lifetime platform volume
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 2, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  height: '100%',
                  overflow: 'visible',
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography
                      color="text.secondary"
                      variant="subtitle2"
                      sx={{ fontWeight: 500, mb: 1 }}
                    >
                      Projected Growth
                    </Typography>
                    <Avatar 
                      sx={{ 
                        width: 36, 
                        height: 36, 
                        bgcolor: 'success.light',
                        color: 'success.dark'
                      }}
                    >
                      <TrendingUpIcon sx={{ fontSize: 20 }} />
                    </Avatar>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {stats.marketTrends.projectedGrowth}%
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                      Next quarter estimate
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={4} sx={{ mb: 5 }}>
            <Grid item xs={12} md={8}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 2, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  height: '100%',
                  overflow: 'visible'
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Daily Trading Volume (Last 7 Days)
                    </Typography>
                    <Box>
                      <Tooltip title="Download chart data">
                        <IconButton size="small" sx={{ mr: 1 }}>
                          <DownloadOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View chart information">
                        <IconButton size="small">
                          <InfoOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Box height={320} sx={{ mt: 1 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={stats.marketTrends.volumeTrends.daily.map(
                          (volume, index) => ({
                            day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                              index
                            ],
                            volume,
                          })
                        )}
                        margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                        barSize={30}
                      >
                        <defs>
                          <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3f51b5" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3f51b5" stopOpacity={0.4}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                        <XAxis 
                          dataKey="day" 
                          axisLine={{ stroke: '#E5E7EB' }}
                          tickLine={{ stroke: '#E5E7EB' }}
                          tick={{ fill: '#6B7280', fontSize: 12 }}
                        />
                        <YAxis 
                          axisLine={{ stroke: '#E5E7EB' }}
                          tickLine={{ stroke: '#E5E7EB' }}
                          tick={{ fill: '#6B7280', fontSize: 12 }}
                        />
                        <Tooltip 
                          formatter={(value) => `${value.toLocaleString()} credits`}
                          contentStyle={{ 
                            borderRadius: 8, 
                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)', 
                            border: 'none',
                            padding: '8px 12px',
                            backgroundColor: 'rgba(255, 255, 255, 0.95)'
                          }}
                          itemStyle={{ color: '#111827', fontWeight: 500 }}
                          labelStyle={{ color: '#6B7280', fontWeight: 500, marginBottom: 4 }}
                        />
                        <Legend 
                          iconType="circle"
                          iconSize={8}
                          wrapperStyle={{ paddingTop: 20 }}
                        />
                        <Bar
                          dataKey="volume"
                          name="Trading Volume"
                          fill="url(#colorVolume)"
                          radius={[4, 4, 0, 0]}
                          animationDuration={1500}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 2, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  height: '100%',
                  overflow: 'visible'
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Price Correlation
                    </Typography>
                    <Box>
                      <Tooltip title="Filter data">
                        <IconButton size="small" sx={{ mr: 1 }}>
                          <FilterListIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View chart information">
                        <IconButton size="small">
                          <InfoOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Box height={320} sx={{ mt: 1 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                        <XAxis 
                          type="number" 
                          dataKey="x" 
                          name="area" 
                          unit="ha" 
                          axisLine={{ stroke: '#E5E7EB' }}
                          tickLine={{ stroke: '#E5E7EB' }}
                          tick={{ fill: '#6B7280', fontSize: 12 }}
                        />
                        <YAxis
                          type="number"
                          dataKey="y"
                          name="price"
                          unit="MATIC"
                          axisLine={{ stroke: '#E5E7EB' }}
                          tickLine={{ stroke: '#E5E7EB' }}
                          tick={{ fill: '#6B7280', fontSize: 12 }}
                        />
                        <ZAxis
                          type="number"
                          dataKey="z"
                          range={[50, 400]}
                          name="volume"
                        />
                        <Tooltip 
                          cursor={{ strokeDasharray: "3 3" }} 
                          contentStyle={{ 
                            borderRadius: 8, 
                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)', 
                            border: 'none',
                            padding: '8px 12px',
                            backgroundColor: 'rgba(255, 255, 255, 0.95)'
                          }}
                          itemStyle={{ color: '#111827', fontWeight: 500 }}
                          labelStyle={{ color: '#6B7280', fontWeight: 500, marginBottom: 4 }}
                        />
                        <Legend 
                          iconType="circle"
                          iconSize={8}
                          wrapperStyle={{ paddingTop: 20 }}
                        />
                        <Scatter
                          name="Project Size vs. Price"
                          data={[
                            { x: 42.6, y: 17.8, z: 320 },
                            { x: 24.2, y: 18.2, z: 215 },
                            { x: 18.5, y: 16.9, z: 168 },
                            { x: 10.2, y: 15.4, z: 86 },
                            { x: 31.8, y: 18.6, z: 258 },
                          ]}
                          fill="#8884d8"
                          fillOpacity={0.8}
                          animationDuration={1500}
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}

      {/* ENVIRONMENTAL IMPACT TAB */}
      {activeTab === "impact" && (
        <>
          <Grid container spacing={3} sx={{ mb: 5 }}>
            <Grid item xs={12}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 2, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  overflow: 'visible'
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Environmental Impact Metrics
                    </Typography>
                    <Box>
                      <Tooltip title="Download report">
                        <IconButton size="small" sx={{ mr: 1 }}>
                          <DownloadOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View information">
                        <IconButton size="small">
                          <InfoOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 500, mb: 2 }}
                      >
                        Key Metrics
                      </Typography>
                      <TableContainer>
                        <Table size="small" sx={{ 
                          '& .MuiTableCell-root': { 
                            borderColor: 'divider',
                            py: 1.5
                          }
                        }}>
                          <TableBody>
                            <TableRow sx={{ '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.01)' } }}>
                              <TableCell sx={{ fontWeight: 500 }}>
                                Trees Protected
                              </TableCell>
                              <TableCell sx={{ color: 'success.main', fontWeight: 500 }}>
                                {stats.environmentalImpact.trees.toLocaleString()}
                              </TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.01)' } }}>
                              <TableCell sx={{ fontWeight: 500 }}>
                                Area Protected
                              </TableCell>
                              <TableCell sx={{ color: 'primary.main', fontWeight: 500 }}>
                                {stats.environmentalImpact.area} hectares
                              </TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.01)' } }}>
                              <TableCell sx={{ fontWeight: 500 }}>
                                Carbon Offset
                              </TableCell>
                              <TableCell sx={{ color: 'success.main', fontWeight: 500 }}>
                                {stats.environmentalImpact.carbonOffset} tons CO₂
                              </TableCell>
                            </TableRow>
                            <TableRow sx={{ '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.01)' } }}>
                              <TableCell sx={{ fontWeight: 500 }}>
                                Biodiversity Impact
                              </TableCell>
                              <TableCell sx={{ color: 'info.main', fontWeight: 500 }}>
                                {stats.environmentalImpact.biodiversity} species
                                protected
                              </TableCell>
                            </TableRow>
                          <TableRow sx={{ '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.01)' } }}>
                            <TableCell sx={{ fontWeight: 500 }}>
                              Water Quality
                            </TableCell>
                            <TableCell sx={{ color: 'info.main', fontWeight: 500 }}>
                              {stats.environmentalImpact.waterQuality}% improved
                            </TableCell>
                          </TableRow>
                          <TableRow sx={{ '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.01)' } }}>
                            <TableCell sx={{ fontWeight: 500 }}>
                              Wildlife Protection
                            </TableCell>
                            <TableCell sx={{ color: 'warning.main', fontWeight: 500 }}>
                              {stats.environmentalImpact.wildlifeProtection}{" "}
                              endangered species
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, color: 'text.primary' }}
                      >
                        Environmental Impact Radar
                      </Typography>
                      <Box>
                        <Tooltip title="Download as image">
                          <IconButton size="small" sx={{ mr: 1 }}>
                            <DownloadOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View detailed information">
                          <IconButton size="small">
                            <InfoOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                    <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, mb: 2 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                        This radar chart visualizes the project's environmental impact across six key metrics, normalized to a 0-100 scale.
                      </Typography>
                    </Box>
                    <ResponsiveContainer width="100%" height={340}>
                      <RadarChart
                        outerRadius={110}
                        data={[
                          {
                            subject: "Carbon Offset",
                            value: Math.min(stats.environmentalImpact.carbonOffset / 10, 100),
                            fullMark: 100,
                            actualValue: `${stats.environmentalImpact.carbonOffset} tons CO₂`,
                          },
                          {
                            subject: "Reforestation",
                            value: Math.min(stats.environmentalImpact.trees / 150, 100),
                            fullMark: 100,
                            actualValue: `${stats.environmentalImpact.trees.toLocaleString()} trees`,
                          },
                          {
                            subject: "Water Quality",
                            value: Math.min(stats.environmentalImpact.waterQuality * 5, 100),
                            fullMark: 100,
                            actualValue: `${stats.environmentalImpact.waterQuality}% improved`,
                          },
                          {
                            subject: "Wildlife",
                            value: Math.min(stats.environmentalImpact.wildlifeProtection * 2.2, 100),
                            fullMark: 100,
                            actualValue: `${stats.environmentalImpact.wildlifeProtection} species protected`,
                          },
                          {
                            subject: "Soil Health",
                            value: Math.min(stats.environmentalImpact.soilHealth * 1.2, 100),
                            fullMark: 100,
                            actualValue: `${stats.environmentalImpact.soilHealth}% improved`,
                          },
                          {
                            subject: "Biodiversity",
                            value: Math.min(stats.environmentalImpact.biodiversity * 4.2, 100),
                            fullMark: 100,
                            actualValue: `${stats.environmentalImpact.biodiversity} species`,
                          },
                        ]}
                        margin={{ top: 10, right: 30, left: 30, bottom: 10 }}
                      >
                        <PolarGrid stroke="#e0e0e0" strokeDasharray="3 3" />
                        <PolarAngleAxis 
                          dataKey="subject" 
                          tick={{ 
                            fill: '#444444', 
                            fontSize: 12, 
                            fontWeight: 500 
                          }} 
                          stroke="#e0e0e0"
                        />
                        <PolarRadiusAxis 
                          angle={30} 
                          domain={[0, 100]} 
                          tick={{ fill: '#666666' }} 
                          axisLine={{ stroke: '#e0e0e0' }}
                          tickCount={5}
                          tickFormatter={(value) => `${value}%`}
                        />
                        {/* Reference area for good impact level */}
                        <Radar
                          name="Target"
                          dataKey="fullMark"
                          stroke="#e0e0e0"
                          fill="#f5f5f5"
                          fillOpacity={0.3}
                          dot={false}
                        />
                        {/* Actual impact values */}
                        <Radar
                          name="Current Impact"
                          dataKey="value"
                          stroke="#2e7d32"
                          fill="#4caf50"
                          fillOpacity={0.7}
                          strokeWidth={2}
                          dot={{ 
                            fill: '#ffffff', 
                            stroke: '#2e7d32', 
                            strokeWidth: 2, 
                            r: 4 
                          }}
                          activeDot={{ 
                            fill: '#2e7d32', 
                            stroke: '#ffffff', 
                            strokeWidth: 2, 
                            r: 6 
                          }}
                          animationDuration={1800}
                          animationBegin={300}
                        />
                        <Legend 
                          iconType="circle"
                          iconSize={10}
                          wrapperStyle={{ 
                            paddingTop: 20,
                            fontSize: 12,
                            fontWeight: 500
                          }} 
                        />
                        <Tooltip 
                          formatter={(value, name, props) => {
                            if (name === "Current Impact") {
                              return [props.payload.actualValue, "Actual Impact"];
                            }
                            return [value, name];
                          }}
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                            borderRadius: '8px',
                            border: '1px solid #e0e0e0',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                            padding: '8px 12px',
                            fontSize: '12px'
                          }}
                          itemStyle={{ color: '#333333', fontWeight: 500 }}
                          labelStyle={{ color: '#666666', fontWeight: 600, marginBottom: 4 }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            </Grid>
          </Grid>

          <Grid container spacing={4} sx={{ mb: 6 }}>
            <Grid item xs={12} md={6}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 2, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  overflow: 'visible',
                  height: '100%',
                  transition: 'box-shadow 0.3s',
                  '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      NDVI Change Over Time
                    </Typography>
                    <Box>
                      <Tooltip title="Download chart">
                        <IconButton size="small" sx={{ mr: 1 }}>
                          <DownloadOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View information">
                        <IconButton size="small">
                          <InfoOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={[
                        {
                          month: "Jan",
                          Nandurbar: 0.52,
                          Taita: 0.45,
                          RioDoce: 0.67,
                        },
                        {
                          month: "Feb",
                          Nandurbar: 0.54,
                          Taita: 0.47,
                          RioDoce: 0.68,
                        },
                        {
                          month: "Mar",
                          Nandurbar: 0.57,
                          Taita: 0.5,
                          RioDoce: 0.69,
                        },
                        {
                          month: "Apr",
                          Nandurbar: 0.62,
                          Taita: 0.53,
                          RioDoce: 0.71,
                        },
                        {
                          month: "May",
                          Nandurbar: 0.65,
                          Taita: 0.55,
                          RioDoce: 0.73,
                        },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fill: '#666666' }}
                        axisLine={{ stroke: '#e0e0e0' }}
                        tickLine={{ stroke: '#e0e0e0' }}
                      />
                      <YAxis 
                        domain={[0.4, 0.8]} 
                        tick={{ fill: '#666666' }}
                        axisLine={{ stroke: '#e0e0e0' }}
                        tickLine={{ stroke: '#e0e0e0' }}
                        tickFormatter={(value) => value.toFixed(1)}
                      />
                      <Tooltip 
                        formatter={(value) => [`NDVI: ${value}`, '']}
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          borderRadius: '8px',
                          border: '1px solid #e0e0e0',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                        }}
                      />
                      <Legend wrapperStyle={{ paddingTop: 10 }} />
                      <Line
                        type="monotone"
                        dataKey="Nandurbar"
                        stroke="#673ab7"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                        animationDuration={1500}
                      />
                      <Line
                        type="monotone"
                        dataKey="Taita"
                        stroke="#4caf50"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                        animationDuration={1500}
                        animationBegin={300}
                      />
                      <Line
                        type="monotone"
                        dataKey="RioDoce"
                        stroke="#ff9800"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                        animationDuration={1500}
                        animationBegin={600}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: 2, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  overflow: 'visible',
                  height: '100%',
                  transition: 'box-shadow 0.3s',
                  '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Carbon Sequestration Rate
                    </Typography>
                    <Box>
                      <Tooltip title="Download chart">
                        <IconButton size="small" sx={{ mr: 1 }}>
                          <DownloadOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View information">
                        <IconButton size="small">
                          <InfoOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={stats.projectDetails.map((project) => ({
                        name: project.name,
                        rate: (project.carbonSeq / project.area).toFixed(2),
                        total: project.carbonSeq,
                      }))}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: '#666666' }}
                        axisLine={{ stroke: '#e0e0e0' }}
                        tickLine={{ stroke: '#e0e0e0' }}
                      />
                      <YAxis 
                        yAxisId="left" 
                        orientation="left" 
                        stroke="#673ab7"
                        tick={{ fill: '#666666' }}
                        axisLine={{ stroke: '#e0e0e0' }}
                        tickLine={{ stroke: '#e0e0e0' }}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#4caf50"
                        tick={{ fill: '#666666' }}
                        axisLine={{ stroke: '#e0e0e0' }}
                        tickLine={{ stroke: '#e0e0e0' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                          borderRadius: '8px',
                          border: '1px solid #e0e0e0',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                        }}
                      />
                      <Legend wrapperStyle={{ paddingTop: 10 }} />
                      <Bar
                        yAxisId="left"
                        dataKey="rate"
                        name="Rate (t/ha)"
                        fill="#673ab7"
                        radius={[4, 4, 0, 0]}
                        animationDuration={1500}
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="total"
                        name="Total (t)"
                        fill="#4caf50"
                        radius={[4, 4, 0, 0]}
                        animationDuration={1500}
                        animationBegin={300}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}

      <Box sx={{ textAlign: 'center', mt: 6, mb: 4 }}>
        <Button
          component={Link}
          to="/marketplace"
          variant="contained"
          color="primary"
          size="large"
          startIcon={<ShoppingCartOutlinedIcon />}
          sx={{ 
            px: 4, 
            py: 1.5, 
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '1rem',
            '&:hover': {
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)'
            }
          }}
        >
          Go to Marketplace
        </Button>
      </Box>
    </Container>
  );
}
