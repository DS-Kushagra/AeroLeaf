import { useState, useRef, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Divider,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
  Fade,
  useTheme,
  useMediaQuery,
  CircularProgress,
  StepContent,
  StepIcon,
  Avatar,
  alpha,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
  CloudUpload as CloudUploadIcon,
  Info as InfoIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  LocationOn as LocationOnIcon,
  ForestOutlined as ForestOutlinedIcon,
  NatureOutlined as NatureOutlinedIcon,
  Send as SendIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  InsertDriveFile as InsertDriveFileIcon,
  InfoOutlined as InfoOutlinedIcon,
  NoteAdd as NoteAddIcon,
  Verified as VerifiedIcon,
  Token as TokenIcon,
  AccessTime as AccessTimeIcon,
  CalendarToday as CalendarTodayIcon,
  MonetizationOn as MonetizationOnIcon,
  AttachFile as AttachFileIcon,
} from "@mui/icons-material";

// Custom file dropzone component
export const FileDropzone = ({ onFilesAdded, acceptedFileTypes }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    if (onFilesAdded) {
      onFilesAdded(newFiles);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const removeFile = (fileToRemove) => {
    setFiles(files.filter(file => file !== fileToRemove));
  };

  return (
    <Box sx={{ width: '100%', mb: 3 }}>
      <Box
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          backgroundColor: isDragActive ? 'rgba(76, 175, 80, 0.08)' : 'background.paper',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'rgba(76, 175, 80, 0.04)',
          },
        }}
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="File upload dropzone"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInputChange}
          accept={acceptedFileTypes}
          style={{ display: 'none' }}
        />
        <CloudUploadIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Drag & Drop Files Here
        </Typography>
        <Typography variant="body2" color="text.secondary">
          or click to browse your files
        </Typography>
        {acceptedFileTypes && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Accepted file types: {acceptedFileTypes}
          </Typography>
        )}
      </Box>

      {files.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Uploaded Files ({files.length}):
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {files.map((file, index) => (
              <Chip
                key={index}
                label={file.name}
                onDelete={() => removeFile(file)}
                color="primary"
                variant="outlined"
                sx={{ mb: 1 }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

// Using the exported FileDropzone component

export default function Report() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const formRef = useRef(null);
  
  // State for tracking the current step in the multi-step form
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [formVisible, setFormVisible] = useState(false);

  // State for form data across all steps
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    siteName: "",
    location: "",
    areaHectares: "",
    siteType: "",
    coordinates: "",

    // Step 2: Detailed Information
    treeSpecies: "",
    treeCount: "",
    siteAge: "",
    previousLandUse: "",
    description: "",
    carbonEstimate: "",

    // Step 3: Contact and Verification
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    organization: "",
    existingDocumentation: "",

    // Step 4: Additional Information
    additionalNotes: "",
    howDidYouHear: "",
    visitAvailability: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Animation effect when component mounts
  useEffect(() => {
    setFormVisible(true);
    
    // Scroll to top when step changes
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeStep]);
  
  const handleFileUpload = (files) => {
    setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  // Steps for the multi-step form with icons and descriptions
  const steps = [
    {
      label: "Basic Information",
      description: "Enter the basic details about your forest site",
      icon: <LocationOnIcon />,
      color: "#2E7D32"
    },
    {
      label: "Site Details",
      description: "Provide detailed information about the forest ecosystem",
      icon: <ForestOutlinedIcon />,
      color: "#388E3C"
    },
    {
      label: "Documentation",
      description: "Upload supporting documents and satellite imagery",
      icon: <CloudUploadIcon />,
      color: "#43A047"
    },
    {
      label: "Contact Information",
      description: "Your contact details for verification purposes",
      icon: <NatureOutlinedIcon />,
      color: "#4CAF50"
    },
    {
      label: "Review & Submit",
      description: "Review your information before final submission",
      icon: <CheckCircleIcon />,
      color: "#66BB6A"
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Validate form data for the current step
  const validateStep = (step) => {
    const newErrors = {};
    let isValid = true;

    if (step === 0) {
      // Validate Step 1: Basic Information
      if (!formData.siteName.trim()) {
        newErrors.siteName = "Site name is required";
        isValid = false;
      }

      if (!formData.location.trim()) {
        newErrors.location = "Location is required";
        isValid = false;
      }

      if (!formData.areaHectares || formData.areaHectares <= 0) {
        newErrors.areaHectares = "Please enter a valid area";
        isValid = false;
      }

      if (!formData.siteType) {
        newErrors.siteType = "Site type is required";
        isValid = false;
      }
    } else if (step === 1) {
      // Validate Step 2: Site Details
      if (!formData.description.trim()) {
        newErrors.description = "Description is required";
        isValid = false;
      }
      
      // Tree species is recommended but not required
      if (formData.treeSpecies.trim() === "" && formData.siteType !== "urban") {
        newErrors.treeSpecies = "Recommended: Please specify tree species";
        // Don't set isValid to false as this is just a recommendation
      }
    } else if (step === 2) {
      // Validate Step 3: Documentation
      // File upload is optional but recommended
      if (uploadedFiles.length === 0) {
        // This is just a warning, not a blocking error
        newErrors.files = "Recommended: Upload supporting documentation";
        // Don't set isValid to false as this is just a recommendation
      }
    } else if (step === 3) {
      // Validate Step 4: Contact Information
      if (!formData.contactName.trim()) {
        newErrors.contactName = "Contact name is required";
        isValid = false;
      }

      if (!formData.contactEmail.trim()) {
        newErrors.contactEmail = "Email is required";
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
        newErrors.contactEmail = "Please enter a valid email";
        isValid = false;
      }
      
      if (formData.contactPhone.trim() !== "" && !/^\+?[0-9\s-()]{8,20}$/.test(formData.contactPhone)) {
        newErrors.contactPhone = "Please enter a valid phone number";
        isValid = false;
      }
    } else if (step === 4) {
      // Validate Step 5: Review & Submit
      // No specific validation for this step as it's a review step
      // But we could add validation for additional fields if needed
      if (formData.howDidYouHear.trim() === "") {
        newErrors.howDidYouHear = "Please let us know how you heard about us";
        // Don't set isValid to false as this is just a recommendation
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle next step
  const handleNext = () => {
    if (validateStep(activeStep)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  // Handle going back to previous step
  const handleBack = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  const handleRemoveFile = (index) => {
    setUploadedFiles(prevFiles => {
      // Release object URL to avoid memory leaks
      if (prevFiles[index].preview) {
        URL.revokeObjectURL(prevFiles[index].preview);
      }
      return prevFiles.filter((_, i) => i !== index);
    });
  };

  // Calculate completion percentage
  const calculateCompletion = () => {
    const totalFields = Object.keys(formData).length;
    const filledFields = Object.values(formData).filter(
      (value) => value !== ""
    ).length;
    return (filledFields / totalFields) * 100;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (validateStep(activeStep)) {
      setIsSubmitting(true);
      
      try {
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 1500));
        // In a real app, this would send the data to the API
        console.log("Submitting form data:", formData);
        console.log("Files uploaded:", uploadedFiles);
        setSubmitted(true);

        // Reset form after success
        setTimeout(() => {
          setSubmitted(false);
          setActiveStep(0);
          setFormData({
            siteName: "",
            location: "",
            areaHectares: "",
            siteType: "",
            coordinates: "",
            treeSpecies: "",
            treeCount: "",
            siteAge: "",
            previousLandUse: "",
            description: "",
            carbonEstimate: "",
            contactName: "",
            contactEmail: "",
            contactPhone: "",
            organization: "",
            existingDocumentation: "",
            additionalNotes: "",
            howDidYouHear: "",
            visitAvailability: "",
          });
          setUploadedFiles([]);
        }, 3000);
      } catch (error) {
        console.error("Error submitting form:", error);
        // Handle error state here
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: formVisible ? 1 : 0, y: formVisible ? 0 : 20 }}
        transition={{ duration: 0.5 }}
        ref={formRef}
      />
        <Paper 
          elevation={4} 
          sx={{ 
            p: { xs: 2, sm: 4 }, 
            borderRadius: 2,
            background: 'linear-gradient(to bottom, #ffffff, #f9f9f9)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
          }}
        >
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography 
              variant="h4" 
              component="h1"
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(45deg, #2E7D32, #43A047)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}
            >
              Report a Forest Site for Carbon Credits
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 2 }}>
              Help us identify and verify forest sites for carbon credit generation. Complete the form below to start the process.
            </Typography>
            
            <LinearProgress
              variant="determinate"
              value={calculateCompletion()}
              sx={{ 
                height: 10, 
                borderRadius: 5,
                maxWidth: "50%",
                mx: "auto",
                bgcolor: "rgba(255,255,255,0.5)",
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #43A047, #2E7D32)'
                }
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Profile Completion: {Math.round(calculateCompletion())}%
            </Typography>
          </Box>         

        {submitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Alert 
              severity="success" 
              variant="filled"
              sx={{ 
                maxWidth: "800px", 
                mx: "auto", 
                mb: 4, 
                py: 2,
                alignItems: 'center',
                '& .MuiAlert-icon': {
                  fontSize: 28,
                  mr: 2
                }
              }}
            >
              <Typography variant="h6" component="div">
                Thank you for your submission!
              </Typography>
              <Typography variant="body2">
                Our team will review your report and contact you within 3-5 business days.
              </Typography>
            </Alert>
          </motion.div>
        )}

        <Box sx={{ width: "100%", maxWidth: "950px", mx: "auto", px: 3 }}>
          <Stepper 
            activeStep={activeStep} 
            alternativeLabel 
            sx={{ 
              mb: 4,
              '& .MuiStepConnector-line': {
                borderColor: 'rgba(0, 0, 0, 0.12)'
              },
              '& .MuiStepLabel-label': {
                mt: 1
              },
              '& .MuiStepLabel-iconContainer': {
                '& .MuiSvgIcon-root': {
                  fontSize: 32,
                  transition: 'all 0.3s ease'
                }
              },
              '& .Mui-active': {
                '& .MuiStepLabel-iconContainer': {
                  '& .MuiSvgIcon-root': {
                    color: 'primary.main',
                    transform: 'scale(1.2)'
                  }
                },
                '& .MuiStepLabel-label': {
                  color: 'primary.main',
                  fontWeight: 'bold'
                }
              },
              '& .Mui-completed': {
                '& .MuiStepLabel-iconContainer': {
                  '& .MuiSvgIcon-root': {
                    color: 'success.main'
                  }
                }
              }
            }}
          >
            {steps.map((step, index) => (
              <Step key={index}>
                <StepLabel 
                  StepIconComponent={(props) => (
                    <StepIcon 
                      {...props} 
                      icon={step.icon || props.icon}
                    />
                  )}
                >
                  <Typography variant="subtitle2">{step.label}</Typography>
                  {!isMobile && (
                    <Typography variant="caption" color="text.secondary">
                      {step.description}
                    </Typography>
                  )}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <Card
            elevation={3}
            sx={{
              borderRadius: 2,
              mb: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              background: "white",
              position: "relative",
              overflow: "visible",
              "&:before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "4px",
                background: "linear-gradient(90deg, #4ade80, #3b82f6)",
              },
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box component="form">
                {/* Step 1: Basic Information */}
                {activeStep === 0 && (
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Basic Site Information
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 3 }}
                      >
                        Please provide basic details about your forest site
                        location and size
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        required
                        label="Site Name"
                        name="siteName"
                        value={formData.siteName}
                        onChange={handleChange}
                        error={!!errors.siteName}
                        helperText={errors.siteName}
                        placeholder="e.g. Nandurbar East Forest"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        required
                        label="Location (Region, Country)"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        error={!!errors.location}
                        helperText={errors.location}
                        placeholder="e.g. Maharashtra, India"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        required
                        label="Area (Hectares)"
                        name="areaHectares"
                        type="number"
                        value={formData.areaHectares}
                        onChange={handleChange}
                        error={!!errors.areaHectares}
                        helperText={errors.areaHectares}
                        placeholder="e.g. 42.6"
                        InputProps={{ inputProps: { min: 0 } }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required error={!!errors.siteType}>
                        <InputLabel>Site Type</InputLabel>
                        <Select
                          name="siteType"
                          value={formData.siteType}
                          onChange={handleChange}
                          label="Site Type"
                        >
                          <MenuItem value="reforestation">
                            Reforestation
                          </MenuItem>
                          <MenuItem value="conservation">Conservation</MenuItem>
                          <MenuItem value="agroforestry">Agroforestry</MenuItem>
                          <MenuItem value="urban">Urban Forest</MenuItem>
                          <MenuItem value="mangrove">
                            Mangrove Restoration
                          </MenuItem>
                        </Select>
                        {errors.siteType && (
                          <FormHelperText>{errors.siteType}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>
                )}

                {/* Step 2: Site Details */}
                {activeStep === 1 && (
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Detailed Site Information
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 3 }}
                      >
                        These details help us accurately estimate carbon
                        sequestration potential
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Tree Species (comma separated)"
                        name="treeSpecies"
                        value={formData.treeSpecies}
                        onChange={handleChange}
                        placeholder="e.g. Teak, Bamboo, Banyan"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Estimated Tree Count"
                        name="treeCount"
                        type="number"
                        value={formData.treeCount}
                        onChange={handleChange}
                        placeholder="e.g. 5000"
                        InputProps={{ inputProps: { min: 0 } }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Site Age (years)"
                        name="siteAge"
                        type="number"
                        value={formData.siteAge}
                        onChange={handleChange}
                        placeholder="How long has this forest existed?"
                        InputProps={{ inputProps: { min: 0 } }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Previous Land Use"
                        name="previousLandUse"
                        value={formData.previousLandUse}
                        onChange={handleChange}
                        placeholder="e.g. Agricultural, Degraded forest, Unused"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        required
                        label="Site Description"
                        name="description"
                        multiline
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        error={!!errors.description}
                        helperText={errors.description}
                        placeholder="Describe the site, its ecological importance, and current status..."
                      />
                    </Grid>
                  </Grid>
                )}

                {/* Step 3: Documentation */}
                {activeStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                          Documentation & Evidence
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 3 }}
                        >
                          Upload supporting documents to expedite the verification process. This can include satellite imagery, land surveys, ownership documents, or photos of the site.
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                            Upload Supporting Files
                          </Typography>
                          
                          <FileDropzone 
                            acceptedFileTypes=".jpg, .jpeg, .png, .pdf, .doc, .docx, .xls, .xlsx"
                            onFilesAdded={handleFileUpload}
                          />
                          
                          {errors.files && (
                            <Typography color="warning.main" variant="body2" sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                              <InfoOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} />
                              {errors.files}
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel>Do you have existing documentation?</InputLabel>
                          <Select
                            name="existingDocumentation"
                            value={formData.existingDocumentation}
                            onChange={handleChange}
                            label="Do you have existing documentation?"
                          >
                            <MenuItem value="yes">Yes - I have all required documents</MenuItem>
                            <MenuItem value="partial">Partial - I have some documents</MenuItem>
                            <MenuItem value="no">No - I need assistance with documentation</MenuItem>
                            <MenuItem value="unsure">Unsure - I need guidance on requirements</MenuItem>
                          </Select>
                          <FormHelperText>
                            Such as land surveys, satellite imagery, or ownership documents
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Carbon Estimate (if known)"
                          name="carbonEstimate"
                          value={formData.carbonEstimate}
                          onChange={handleChange}
                          placeholder="Estimated carbon sequestration potential"
                          helperText="Optional: Enter if you have a previous carbon assessment"
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(76, 175, 80, 0.08)', borderRadius: 2, border: '1px solid rgba(76, 175, 80, 0.2)' }}>
                          <Typography variant="subtitle2" color="primary.main" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                            <InfoOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                            Documentation Tips
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Clear, high-resolution images and official documents will help expedite the verification process. If you're unsure about what to provide, you can continue and our team will guide you through the requirements during the review.
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </motion.div>
                )}
                
                {/* Step 4: Contact Information */}
                {activeStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                          Contact Information
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 3 }}
                        >
                          Please provide your contact details so we can reach you during the verification process
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          required
                          label="Contact Name"
                          name="contactName"
                          value={formData.contactName}
                          onChange={handleChange}
                          error={!!errors.contactName}
                          helperText={errors.contactName}
                          placeholder="Your full name"
                          InputProps={{
                            startAdornment: (
                              <Box component="span" sx={{ color: 'text.secondary', mr: 1 }}>
                                <NatureOutlinedIcon fontSize="small" />
                              </Box>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          required
                          label="Contact Email"
                          name="contactEmail"
                          type="email"
                          value={formData.contactEmail}
                          onChange={handleChange}
                          error={!!errors.contactEmail}
                          helperText={errors.contactEmail}
                          placeholder="your.email@example.com"
                          InputProps={{
                            startAdornment: (
                              <Box component="span" sx={{ color: 'text.secondary', mr: 1 }}>
                                <SendIcon fontSize="small" />
                              </Box>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Contact Phone"
                          name="contactPhone"
                          value={formData.contactPhone}
                          onChange={handleChange}
                          placeholder="Your phone number with country code"
                          error={!!errors.contactPhone}
                          helperText={errors.contactPhone}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Organization (if applicable)"
                          name="organization"
                          value={formData.organization}
                          onChange={handleChange}
                          placeholder="Company or organization name"
                        />
                      </Grid>
                    </Grid>
                  </motion.div>
                )}
                
                {/* Step 5: Review & Submit */}
                {activeStep === 4 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                          Review & Submit
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 3 }}
                        >
                          Please review your information before submitting your forest site report
                        </Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Box
                          sx={{
                            p: 3,
                            mb: 3,
                            bgcolor: "rgba(104, 189, 147, 0.1)",
                            borderRadius: 2,
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        >
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Typography
                                variant="subtitle2"
                                color="text.secondary"
                              >
                                Site Name:
                              </Typography>
                              <Typography variant="body1" sx={{ mb: 1 }}>
                                {formData.siteName || "Not provided"}
                              </Typography>

                              <Typography
                                variant="subtitle2"
                                color="text.secondary"
                              >
                                Location:
                              </Typography>
                              <Typography variant="body1" sx={{ mb: 1 }}>
                                {formData.location || "Not provided"}
                              </Typography>

                              <Typography
                                variant="subtitle2"
                                color="text.secondary"
                              >
                                Area:
                              </Typography>
                              <Typography variant="body1" sx={{ mb: 1 }}>
                                {formData.areaHectares
                                  ? `${formData.areaHectares} hectares`
                                  : "Not provided"}
                              </Typography>

                              <Typography
                                variant="subtitle2"
                                color="text.secondary"
                              >
                                Site Type:
                              </Typography>
                              <Typography variant="body1" sx={{ mb: 1 }}>
                                {formData.siteType || "Not provided"}
                              </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                              <Typography
                                variant="subtitle2"
                                color="text.secondary"
                              >
                                Contact:
                              </Typography>
                              <Typography variant="body1" sx={{ mb: 1 }}>
                                {formData.contactName || "Not provided"}
                              </Typography>

                              <Typography
                                variant="subtitle2"
                                color="text.secondary"
                              >
                                Email:
                              </Typography>
                              <Typography variant="body1" sx={{ mb: 1 }}>
                                {formData.contactEmail || "Not provided"}
                              </Typography>

                              <Typography
                                variant="subtitle2"
                                color="text.secondary"
                              >
                                Tree Species:
                              </Typography>
                              <Typography variant="body1" sx={{ mb: 1 }}>
                                {formData.treeSpecies || "Not provided"}
                              </Typography>

                              <Typography
                                variant="subtitle2"
                                color="text.secondary"
                              >
                                Organization:
                              </Typography>
                              <Typography variant="body1" sx={{ mb: 1 }}>
                                {formData.organization || "Not provided"}
                              </Typography>
                            </Grid>
                          </Grid>
                          
                          {uploadedFiles.length > 0 && (
                            <>
                              <Divider sx={{ my: 2 }} />
                              <Typography variant="subtitle2" color="text.secondary">
                                Uploaded Files:
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                {uploadedFiles.map((file, index) => (
                                  <Chip
                                    key={index}
                                    label={file.name}
                                    size="small"
                                    icon={<AttachFileIcon fontSize="small" />}
                                    variant="outlined"
                                    sx={{ mb: 1 }}
                                  />
                                ))}
                              </Box>
                            </>
                          )}
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Additional Notes"
                              name="additionalNotes"
                              multiline
                              rows={2}
                              value={formData.additionalNotes}
                              onChange={handleChange}
                              placeholder="Any other information you'd like to add"
                            />
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="How did you hear about us?"
                              name="howDidYouHear"
                              value={formData.howDidYouHear}
                              onChange={handleChange}
                              placeholder="e.g. Google, Friend, Conference"
                            />
                          </Grid>

                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="On-site Visit Availability"
                              name="visitAvailability"
                              value={formData.visitAvailability}
                              onChange={handleChange}
                              placeholder="When would be a good time for our team to visit the site?"
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </motion.div>
                )}

                {/* Step 4 content removed - using Step 5 Review & Submit instead */}
              </Box>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4, position: 'relative' }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              sx={{ 
                px: 3, 
                py: 1.2,
                borderRadius: 2,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                }
              }}
            >
              Back
            </Button>
            
            <Box sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="caption" color="text.secondary">
                Step {activeStep + 1} of {steps.length}
              </Typography>
            </Box>
            
            <Box>
              {activeStep < steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    px: 4,
                    py: 1.2,
                    borderRadius: 2,
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                    background: `linear-gradient(90deg, ${steps[activeStep].color}, ${activeStep < steps.length - 1 ? steps[activeStep + 1].color : steps[activeStep].color})`,
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                      background: `linear-gradient(90deg, ${steps[activeStep].color}, ${activeStep < steps.length - 1 ? steps[activeStep + 1].color : steps[activeStep].color})`,
                      filter: 'brightness(0.95)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  endIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : <CheckCircleIcon />}
                  sx={{
                    px: 4,
                    py: 1.2,
                    borderRadius: 2,
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                    background: `linear-gradient(90deg, #2E7D32, #66BB6A)`,
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
                      background: `linear-gradient(90deg, #2E7D32, #66BB6A)`,
                      filter: 'brightness(0.95)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      {/* </Box> */}
      </Paper>

      {/* Info Cards */}
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h5" gutterBottom align="center" sx={{ 
          fontWeight: 600, 
          mb: 4,
          background: 'linear-gradient(90deg, #1976d2, #4caf50)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          How AeroLeaf Works
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card
                elevation={3}
                sx={{
                  borderRadius: 3,
                  height: "100%",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                  overflow: "hidden",
                  position: "relative",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <Box sx={{ 
                  height: 8, 
                  width: "100%", 
                  background: steps[0].color,
                  position: "absolute",
                  top: 0,
                }} />
                <CardContent sx={{ p: 3, pt: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar sx={{ 
                      bgcolor: alpha(steps[0].color, 0.1), 
                      color: steps[0].color,
                      mr: 2 
                    }}>
                      <NoteAddIcon />
                    </Avatar>
                    <Box>
                      <Chip 
                        label="Phase 1" 
                        size="small" 
                        sx={{ 
                          bgcolor: alpha(steps[0].color, 0.1), 
                          color: steps[0].color,
                          fontWeight: 600,
                          mb: 0.5
                        }} 
                      />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Report Your Forest Site
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    Submit detailed information about your reforestation or
                    conservation project to start the assessment process. Include site details, 
                    documentation, and contact information for a comprehensive evaluation.
                  </Typography>
                  <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                    <AccessTimeIcon sx={{ fontSize: 16, color: "text.secondary", mr: 0.5 }} />
                    <Typography variant="caption" color="text.secondary">
                      Estimated time: 10-15 minutes
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card
                elevation={3}
                sx={{
                  borderRadius: 3,
                  height: "100%",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                  overflow: "hidden",
                  position: "relative",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <Box sx={{ 
                  height: 8, 
                  width: "100%", 
                  background: steps[2].color,
                  position: "absolute",
                  top: 0,
                }} />
                <CardContent sx={{ p: 3, pt: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar sx={{ 
                      bgcolor: alpha(steps[2].color, 0.1), 
                      color: steps[2].color,
                      mr: 2 
                    }}>
                      <VerifiedIcon />
                    </Avatar>
                    <Box>
                      <Chip 
                        label="Phase 2" 
                        size="small" 
                        sx={{ 
                          bgcolor: alpha(steps[2].color, 0.1), 
                          color: steps[2].color,
                          fontWeight: 600,
                          mb: 0.5
                        }} 
                      />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Verification Process
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    Our expert team will analyze satellite imagery, conduct field
                    verification, and use advanced AI algorithms to assess carbon sequestration potential 
                    and validate your forest site's environmental impact.
                  </Typography>
                  <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                    <CalendarTodayIcon sx={{ fontSize: 16, color: "text.secondary", mr: 0.5 }} />
                    <Typography variant="caption" color="text.secondary">
                      Process time: 2-4 weeks
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card
                elevation={3}
                sx={{
                  borderRadius: 3,
                  height: "100%",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                  overflow: "hidden",
                  position: "relative",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <Box sx={{ 
                  height: 8, 
                  width: "100%", 
                  background: "#2E7D32",
                  position: "absolute",
                  top: 0,
                }} />
                <CardContent sx={{ p: 3, pt: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar sx={{ 
                      bgcolor: alpha("#2E7D32", 0.1), 
                      color: "#2E7D32",
                      mr: 2 
                    }}>
                      <TokenIcon />
                    </Avatar>
                    <Box>
                      <Chip 
                        label="Phase 3" 
                        size="small" 
                        sx={{ 
                          bgcolor: alpha("#2E7D32", 0.1), 
                          color: "#2E7D32",
                          fontWeight: 600,
                          mb: 0.5
                        }} 
                      />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Generate Carbon Credits
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    Once verified, your forest site will generate tokenized carbon
                    credits that can be traded on our marketplace. Track your impact in real-time 
                    and connect with environmentally conscious buyers worldwide.
                  </Typography>
                  <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                    <MonetizationOnIcon sx={{ fontSize: 16, color: "text.secondary", mr: 0.5 }} />
                    <Typography variant="caption" color="text.secondary">
                      Average value: $15-25 per credit
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
