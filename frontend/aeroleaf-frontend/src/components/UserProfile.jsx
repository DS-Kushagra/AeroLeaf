/**
 * Modern Professional User Profile Component
 * Provides comprehensive user profile management with enhanced features
 */
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Paper,
  Skeleton,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  AccountCircle,
  Badge as BadgeIcon,
  CameraAlt,
  CheckCircle,
  Edit,
  Email,
  ErrorOutline,
  Fingerprint,
  Lock,
  Notifications,
  Phone,
  Save,
  Security,
  Settings,
  Visibility,
  VisibilityOff,
  WorkOutline,
} from "@mui/icons-material";

export default function UserProfile() {
  const { currentUser, loading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [editForm, setEditForm] = useState({
    displayName: "",
    phone: "",
    role: "",
    bio: "",
    location: "",
    company: "",
    website: "",
    socialLinks: {
      twitter: "",
      linkedin: "",
      github: "",
    },
    preferences: {
      emailNotifications: true,
      twoFactorAuth: false,
      darkMode: false,
    }
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [avatarMenuAnchor, setAvatarMenuAnchor] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (currentUser) {
      loadProfile();
    }
  }, [currentUser]);

  const loadProfile = async () => {
    try {
      const profileData = await apiService.getProfile();
      setProfile(profileData.profile);
      setEditForm({
        displayName: profileData.profile.displayName || "",
        phone: profileData.profile.phone || "",
        role: profileData.profile.role || "",
        bio: profileData.profile.bio || "",
        location: profileData.profile.location || "",
        company: profileData.profile.company || "",
        website: profileData.profile.website || "",
        socialLinks: {
          twitter: profileData.profile.socialLinks?.twitter || "",
          linkedin: profileData.profile.socialLinks?.linkedin || "",
          github: profileData.profile.socialLinks?.github || "",
        },
        preferences: {
          emailNotifications: profileData.profile.preferences?.emailNotifications ?? true,
          twoFactorAuth: profileData.profile.preferences?.twoFactorAuth ?? false,
          darkMode: profileData.profile.preferences?.darkMode ?? false,
        }
      });
    } catch (error) {
      console.error("Failed to load profile:", error);
      // Fallback to Firebase user data
      if (currentUser) {
        setProfile({
          email: currentUser.email,
          displayName: currentUser.displayName || "",
          uid: currentUser.uid,
          role: "investor", // default
          bio: "",
          location: "",
          company: "",
          website: "",
          socialLinks: {
            twitter: "",
            linkedin: "",
            github: "",
          },
          preferences: {
            emailNotifications: true,
            twoFactorAuth: false,
            darkMode: false,
          }
        });
        setEditForm({
          displayName: currentUser.displayName || "",
          phone: "",
          role: "investor",
          bio: "",
          location: "",
          company: "",
          website: "",
          socialLinks: {
            twitter: "",
            linkedin: "",
            github: "",
          },
          preferences: {
            emailNotifications: true,
            twoFactorAuth: false,
            darkMode: false,
          }
        });
      }
    }
  };
  
  // Handle avatar upload
  const handleAvatarClick = (event) => {
    setAvatarMenuAnchor(event.currentTarget);
  };

  const handleAvatarMenuClose = () => {
    setAvatarMenuAnchor(null);
  };

  const handleAvatarUpload = () => {
    fileInputRef.current.click();
    handleAvatarMenuClose();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        setUpdateLoading(true);
        // In a real implementation, you would upload the file to your server/storage
        // For now, we'll simulate this with a timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update profile with new avatar URL (in a real app, this would be the URL from your storage)
        const avatarUrl = URL.createObjectURL(file);
        setProfile(prev => ({ ...prev, avatarUrl }));
        
        setSuccess("Profile picture updated successfully");
        setTimeout(() => setSuccess(""), 3000);
      } catch (error) {
        setError("Failed to update profile picture");
      } finally {
        setUpdateLoading(false);
      }
    }
  };
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      displayName: profile?.displayName || "",
      phone: profile?.phone || "",
      role: profile?.role || "",
      bio: profile?.bio || "",
      location: profile?.location || "",
      company: profile?.company || "",
      website: profile?.website || "",
      socialLinks: {
        twitter: profile?.socialLinks?.twitter || "",
        linkedin: profile?.socialLinks?.linkedin || "",
        github: profile?.socialLinks?.github || "",
      },
      preferences: {
        emailNotifications: profile?.preferences?.emailNotifications ?? true,
        twoFactorAuth: profile?.preferences?.twoFactorAuth ?? false,
        darkMode: profile?.preferences?.darkMode ?? false,
      }
    });
    setError("");
    setSuccess("");
  };

  const handleSave = async () => {
    try {
      setUpdateLoading(true);
      setError("");

      const updateData = {};
      
      // Basic info
      if (editForm.displayName !== profile?.displayName) {
        updateData.displayName = editForm.displayName;
      }
      if (editForm.phone !== profile?.phone) {
        updateData.phone = editForm.phone;
      }
      if (editForm.bio !== profile?.bio) {
        updateData.bio = editForm.bio;
      }
      if (editForm.location !== profile?.location) {
        updateData.location = editForm.location;
      }
      if (editForm.company !== profile?.company) {
        updateData.company = editForm.company;
      }
      if (editForm.website !== profile?.website) {
        updateData.website = editForm.website;
      }
      
      // Social links
      const socialLinksChanged = (
        editForm.socialLinks.twitter !== profile?.socialLinks?.twitter ||
        editForm.socialLinks.linkedin !== profile?.socialLinks?.linkedin ||
        editForm.socialLinks.github !== profile?.socialLinks?.github
      );
      
      if (socialLinksChanged) {
        updateData.socialLinks = editForm.socialLinks;
      }
      
      // Preferences
      const preferencesChanged = (
        editForm.preferences.emailNotifications !== profile?.preferences?.emailNotifications ||
        editForm.preferences.twoFactorAuth !== profile?.preferences?.twoFactorAuth ||
        editForm.preferences.darkMode !== profile?.preferences?.darkMode
      );
      
      if (preferencesChanged) {
        updateData.preferences = editForm.preferences;
      }

      if (Object.keys(updateData).length === 0) {
        setError("No changes to save");
        return;
      }

      await apiService.updateProfile(updateData);

      // Update local state
      setProfile((prev) => ({ ...prev, ...updateData }));
      setIsEditing(false);
      setSuccess("Profile updated successfully");

      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError(error.message || "Failed to update profile");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties (socialLinks, preferences)
      const [parent, child] = name.split('.');
      setEditForm((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      // Handle top-level properties
      setEditForm((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  if (loading) {
    return (
      <Paper elevation={3} sx={{ borderRadius: 4, overflow: 'hidden' }}>
        <Box sx={{ p: 3, bgcolor: 'primary.main' }}>
          <Skeleton variant="text" width="50%" height={40} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
        </Box>
        <Box sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Skeleton variant="circular" width={80} height={80} sx={{ mr: 3 }} />
            <Box sx={{ width: '100%' }}>
              <Skeleton variant="text" width="60%" height={30} />
              <Skeleton variant="text" width="40%" height={20} />
            </Box>
          </Box>
          <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2, mb: 3 }} />
          <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
        </Box>
      </Paper>
    );
  }

  if (!currentUser) {
    return (
      <Paper elevation={3} sx={{ borderRadius: 4, p: 4, textAlign: 'center' }}>
        <AccountCircle sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Please sign in to view your profile
        </Typography>
        <Typography variant="body2" color="text.secondary">
          You need to be logged in to access your profile information and settings.
        </Typography>
      </Paper>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Paper 
        elevation={0} 
        sx={{ 
          borderRadius: 4, 
          overflow: 'hidden',
          bgcolor: 'background.paper',
          boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08)',
          border: '1px solid',
          borderColor: 'rgba(0,0,0,0.05)'
        }}
      >
        {/* Profile Header */}
        <Box 
          sx={{ 
            background: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)',
            p: 4,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box 
            sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
              backgroundSize: '24px 24px'
            }}
          />
          
          <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }}>
            <Box sx={{ mr: 3, position: 'relative' }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <Tooltip title="Change profile picture">
                    <IconButton 
                      size="small" 
                      sx={{ 
                        bgcolor: 'primary.main', 
                        color: 'white',
                        width: '32px',
                        height: '32px',
                        transition: 'all 0.2s ease',
                        '&:hover': { 
                          bgcolor: 'primary.dark',
                          transform: 'scale(1.1)' 
                        } 
                      }}
                      onClick={handleAvatarClick}
                      disabled={updateLoading}
                    >
                      <CameraAlt fontSize="small" />
                    </IconButton>
                  </Tooltip>
                }
              >
                <Avatar 
                  src={profile?.avatarUrl} 
                  alt={profile?.displayName || currentUser.email}
                  sx={{ 
                    width: 90, 
                    height: 90, 
                    border: '4px solid white',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {profile?.displayName ? profile.displayName[0].toUpperCase() : currentUser.email[0].toUpperCase()}
                </Avatar>
              </Badge>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileChange}
              />
              <Menu
                anchorEl={avatarMenuAnchor}
                open={Boolean(avatarMenuAnchor)}
                onClose={handleAvatarMenuClose}
                PaperProps={{
                  elevation: 3,
                  sx: { borderRadius: 2, mt: 1 }
                }}
              >
                <MenuItem onClick={handleAvatarUpload}>
                  <CameraAlt fontSize="small" sx={{ mr: 1 }} />
                  Upload new picture
                </MenuItem>
              </Menu>
            </Box>
            
            <Box>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 600, mb: 0.5 }}>
                {profile?.displayName || 'User'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip 
                  label={profile?.role || 'Investor'} 
                  size="small" 
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    textTransform: 'capitalize',
                    mr: 1
                  }} 
                />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  {currentUser.email}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ ml: 'auto' }}>
              {!isEditing ? (
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={handleEdit}
                  sx={{ 
                    color: 'white', 
                    borderColor: 'rgba(255,255,255,0.6)',
                    borderRadius: '8px',
                    px: 2,
                    py: 1,
                    fontWeight: 500,
                    textTransform: 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': { 
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.15)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  Edit Profile
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    disabled={updateLoading}
                    sx={{ 
                      bgcolor: 'success.main',
                      borderRadius: '8px',
                      px: 2,
                      py: 1,
                      fontWeight: 500,
                      textTransform: 'none',
                      transition: 'all 0.2s ease',
                      '&:hover': { 
                        bgcolor: 'success.dark',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    {updateLoading ? (
                      <>
                        <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />
                        Saving
                      </>
                    ) : 'Save'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    disabled={updateLoading}
                    sx={{ 
                      color: 'white', 
                      borderColor: 'rgba(255,255,255,0.6)',
                      borderRadius: '8px',
                      px: 2,
                      py: 1,
                      fontWeight: 500,
                      textTransform: 'none',
                      transition: 'all 0.2s ease',
                      '&:hover': { 
                        borderColor: 'white',
                        bgcolor: 'rgba(255,255,255,0.15)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
        
        {/* Notifications */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ px: 3, pt: 3 }}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 2.5, 
                    bgcolor: 'error.light', 
                    color: 'error.dark',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid',
                    borderColor: 'error.main',
                    borderOpacity: 0.2,
                    boxShadow: '0 4px 12px rgba(211, 47, 47, 0.1)'
                  }}
                >
                  <ErrorOutline sx={{ mr: 1 }} />
                  <Typography variant="body2">{error}</Typography>
                </Paper>
              </Box>
            </motion.div>
          )}
          
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ px: 3, pt: 3 }}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 2.5, 
                    bgcolor: 'success.light', 
                    color: 'success.dark',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid',
                    borderColor: 'success.main',
                    borderOpacity: 0.2,
                    boxShadow: '0 4px 12px rgba(46, 125, 50, 0.1)'
                  }}
                >
                  <CheckCircle sx={{ mr: 1 }} />
                  <Typography variant="body2">{success}</Typography>
                </Paper>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Tabs Navigation */}
        <Box sx={{ px: 3, pt: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ 
              '& .MuiTab-root': { 
                minWidth: 'auto',
                px: 3,
                py: 2,
                fontWeight: 500,
                textTransform: 'none',
                fontSize: '0.95rem',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: 'primary.main',
                  opacity: 1
                }
              },
              '& .Mui-selected': {
                color: 'primary.main',
                fontWeight: 600
              },
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0',
                backgroundColor: 'primary.main'
              }
            }}
          >
            <Tab icon={<AccountCircle />} label="Personal Info" iconPosition="start" />
            <Tab icon={<Security />} label="Security" iconPosition="start" />
            <Tab icon={<Notifications />} label="Preferences" iconPosition="start" />
            <Tab icon={<BadgeIcon />} label="Verification" iconPosition="start" />
          </Tabs>
        </Box>
        
        <Divider sx={{ mt: 2 }} />
        
        {/* Tab Content */}
        <Box sx={{ p: 3 }}>
          {/* Personal Info Tab */}
          {activeTab === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {isEditing ? (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                      Display Name
                    </Typography>
                    <TextField
                      fullWidth
                      name="displayName"
                      value={editForm.displayName}
                      onChange={handleInputChange}
                      placeholder="Enter your display name"
                      variant="outlined"
                      size="small"
                      InputProps={{
                        startAdornment: <AccountCircle sx={{ mr: 1, color: 'action.active' }} />
                      }}
                    />
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                      Email Address
                    </Typography>
                    <TextField
                      fullWidth
                      value={currentUser.email}
                      disabled
                      variant="outlined"
                      size="small"
                      InputProps={{
                        startAdornment: <Email sx={{ mr: 1, color: 'action.active' }} />
                      }}
                      helperText="Email cannot be changed"
                    />
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                      Phone Number
                    </Typography>
                    <TextField
                      fullWidth
                      name="phone"
                      value={editForm.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      variant="outlined"
                      size="small"
                      InputProps={{
                        startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} />
                      }}
                    />
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                      Role
                    </Typography>
                    <TextField
                      fullWidth
                      value={editForm.role}
                      disabled
                      variant="outlined"
                      size="small"
                      InputProps={{
                        startAdornment: <WorkOutline sx={{ mr: 1, color: 'action.active' }} />,
                        sx: { textTransform: 'capitalize' }
                      }}
                      helperText="Role cannot be changed"
                    />
                  </Box>
                  
                  <Box sx={{ gridColumn: { md: '1 / span 2' } }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                      Bio
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      name="bio"
                      value={editForm.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself"
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                      Location
                    </Typography>
                    <TextField
                      fullWidth
                      name="location"
                      value={editForm.location}
                      onChange={handleInputChange}
                      placeholder="City, Country"
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                      Company
                    </Typography>
                    <TextField
                      fullWidth
                      name="company"
                      value={editForm.company}
                      onChange={handleInputChange}
                      placeholder="Your company or organization"
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                  
                  <Box sx={{ gridColumn: { md: '1 / span 2' } }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                      Website
                    </Typography>
                    <TextField
                      fullWidth
                      name="website"
                      value={editForm.website}
                      onChange={handleInputChange}
                      placeholder="https://"
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                  
                  <Box sx={{ gridColumn: { md: '1 / span 2' } }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, mt: 2, fontWeight: 600 }}>
                      Social Links
                    </Typography>
                    
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
                      <TextField
                        fullWidth
                        name="socialLinks.twitter"
                        value={editForm.socialLinks.twitter}
                        onChange={handleInputChange}
                        placeholder="Twitter username"
                        variant="outlined"
                        size="small"
                        InputProps={{
                          startAdornment: <span style={{ marginRight: 8, color: '#1DA1F2' }}>@</span>
                        }}
                      />
                      
                      <TextField
                        fullWidth
                        name="socialLinks.linkedin"
                        value={editForm.socialLinks.linkedin}
                        onChange={handleInputChange}
                        placeholder="LinkedIn profile URL"
                        variant="outlined"
                        size="small"
                      />
                      
                      <TextField
                        fullWidth
                        name="socialLinks.github"
                        value={editForm.socialLinks.github}
                        onChange={handleInputChange}
                        placeholder="GitHub username"
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, mb: 4 }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
                        Display Name
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profile?.displayName || 'Not set'}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
                        Email Address
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {currentUser.email}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
                        Phone Number
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {profile?.phone || 'Not set'}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
                        Role
                      </Typography>
                      <Chip 
                        label={profile?.role || 'Investor'} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </Box>
                    
                    {profile?.bio && (
                      <Box sx={{ gridColumn: { md: '1 / span 2' } }}>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
                          Bio
                        </Typography>
                        <Typography variant="body1">
                          {profile.bio}
                        </Typography>
                      </Box>
                    )}
                    
                    {profile?.location && (
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
                          Location
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {profile.location}
                        </Typography>
                      </Box>
                    )}
                    
                    {profile?.company && (
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
                          Company
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {profile.company}
                        </Typography>
                      </Box>
                    )}
                    
                    {profile?.website && (
                      <Box sx={{ gridColumn: { md: '1 / span 2' } }}>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
                          Website
                        </Typography>
                        <Typography 
                          variant="body1" 
                          component="a" 
                          href={profile.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                        >
                          {profile.website}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  
                  {(profile?.socialLinks?.twitter || profile?.socialLinks?.linkedin || profile?.socialLinks?.github) && (
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                        Social Links
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        {profile?.socialLinks?.twitter && (
                          <Chip 
                            label={`@${profile.socialLinks.twitter}`}
                            component="a"
                            href={`https://twitter.com/${profile.socialLinks.twitter}`}
                            target="_blank"
                            clickable
                            color="primary"
                            variant="outlined"
                          />
                        )}
                        
                        {profile?.socialLinks?.linkedin && (
                          <Chip 
                            label="LinkedIn"
                            component="a"
                            href={profile.socialLinks.linkedin}
                            target="_blank"
                            clickable
                            color="primary"
                            variant="outlined"
                          />
                        )}
                        
                        {profile?.socialLinks?.github && (
                          <Chip 
                            label={`GitHub: ${profile.socialLinks.github}`}
                            component="a"
                            href={`https://github.com/${profile.socialLinks.github}`}
                            target="_blank"
                            clickable
                            color="primary"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </Box>
                  )}
                  
                  <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
                      User ID
                    </Typography>
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 2, 
                        bgcolor: 'background.default',
                        fontFamily: 'monospace',
                        fontSize: '0.85rem',
                        color: 'text.secondary',
                        wordBreak: 'break-all'
                      }}
                    >
                      {currentUser.uid}
                    </Paper>
                  </Box>
                </Box>
              )}
            </motion.div>
          )}
          
          {/* Security Tab */}
          {activeTab === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Box sx={{ maxWidth: 600 }}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 3.5, 
                    mb: 3, 
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(34, 197, 94, 0.08)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '100px',
                      height: '100px',
                      background: 'radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, rgba(255,255,255,0) 70%)',
                      zIndex: 0
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Password
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Change your account password
                      </Typography>
                    </Box>
                    <Button 
                      variant="outlined" 
                      startIcon={<Lock />}
                      size="small"
                    >
                      Change
                    </Button>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                      type={showPassword ? "text" : "password"}
                      value="••••••••••••"
                      disabled
                      fullWidth
                      size="small"
                      InputProps={{
                        endAdornment: (
                          <IconButton 
                            edge="end" 
                            onClick={() => setShowPassword(!showPassword)}
                            size="small"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        ),
                      }}
                    />
                  </Box>
                </Paper>
                
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 3.5, 
                    mb: 3, 
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(34, 197, 94, 0.08)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '100px',
                      height: '100px',
                      background: 'radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, rgba(255,255,255,0) 70%)',
                      zIndex: 0
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Two-Factor Authentication
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Add an extra layer of security to your account
                      </Typography>
                    </Box>
                    <Button 
                      variant="outlined" 
                      color={editForm.preferences.twoFactorAuth ? "success" : "primary"}
                      startIcon={editForm.preferences.twoFactorAuth ? <CheckCircle /> : <Security />}
                      size="small"
                      disabled={!isEditing}
                      onClick={() => {
                        if (isEditing) {
                          setEditForm(prev => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              twoFactorAuth: !prev.preferences.twoFactorAuth
                            }
                          }));
                        }
                      }}
                    >
                      {editForm.preferences.twoFactorAuth ? "Enabled" : "Enable"}
                    </Button>
                  </Box>
                </Paper>
                
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 3.5, 
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(211, 47, 47, 0.08)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '100px',
                      height: '100px',
                      background: 'radial-gradient(circle, rgba(211, 47, 47, 0.15) 0%, rgba(255,255,255,0) 70%)',
                      zIndex: 0
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'error.main' }}>
                        Delete Account
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Permanently delete your account and all data
                      </Typography>
                    </Box>
                    <Button 
                      variant="outlined" 
                      color="error"
                      size="small"
                    >
                      Delete
                    </Button>
                  </Box>
                </Paper>
              </Box>
            </motion.div>
          )}
          
          {/* Preferences Tab */}
          {activeTab === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Box sx={{ maxWidth: 600 }}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 3.5, 
                    mb: 3, 
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(34, 197, 94, 0.08)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '100px',
                      height: '100px',
                      background: 'radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, rgba(255,255,255,0) 70%)',
                      zIndex: 0
                    }
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Notification Settings
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box>
                      <Typography variant="body1">
                        Email Notifications
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Receive updates, alerts, and marketing emails
                      </Typography>
                    </Box>
                    <Button 
                      variant="outlined" 
                      color={editForm.preferences.emailNotifications ? "success" : "primary"}
                      startIcon={editForm.preferences.emailNotifications ? <CheckCircle /> : <Notifications />}
                      size="small"
                      disabled={!isEditing}
                      onClick={() => {
                        if (isEditing) {
                          setEditForm(prev => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              emailNotifications: !prev.preferences.emailNotifications
                            }
                          }));
                        }
                      }}
                    >
                      {editForm.preferences.emailNotifications ? "Enabled" : "Enable"}
                    </Button>
                  </Box>
                </Paper>
                
                <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Appearance
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body1">
                        Dark Mode
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Switch between light and dark theme
                      </Typography>
                    </Box>
                    <Button 
                      variant="outlined" 
                      color={editForm.preferences.darkMode ? "success" : "primary"}
                      size="small"
                      disabled={!isEditing}
                      onClick={() => {
                        if (isEditing) {
                          setEditForm(prev => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              darkMode: !prev.preferences.darkMode
                            }
                          }));
                        }
                      }}
                    >
                      {editForm.preferences.darkMode ? "Dark" : "Light"}
                    </Button>
                  </Box>
                </Paper>
              </Box>
            </motion.div>
          )}
          
          {/* Verification Tab */}
          {activeTab === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Box sx={{ maxWidth: 600 }}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 3.5, 
                    mb: 3, 
                    borderRadius: 2,
                    borderColor: 'primary.main',
                    bgcolor: 'primary.50',
                    boxShadow: '0 4px 20px rgba(34, 197, 94, 0.08)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '100px',
                      height: '100px',
                      background: 'radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, rgba(255,255,255,0) 70%)',
                      zIndex: 0
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CheckCircle color="success" sx={{ mr: 1.5 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Email Verified
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Your email address has been verified.
                  </Typography>
                </Paper>
                
                <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Phone Verification
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Verify your phone number for additional security
                      </Typography>
                    </Box>
                    <Button 
                      variant="outlined" 
                      startIcon={<Phone />}
                      size="small"
                    >
                      Verify
                    </Button>
                  </Box>
                </Paper>
                
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Identity Verification
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Verify your identity to unlock additional features
                      </Typography>
                    </Box>
                    <Button 
                      variant="outlined" 
                      startIcon={<Fingerprint />}
                      size="small"
                    >
                      Verify
                    </Button>
                  </Box>
                </Paper>
              </Box>
            </motion.div>
          )}
        </Box>
      </Paper>
    </motion.div>
  );

}
