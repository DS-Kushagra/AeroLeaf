import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  IconButton,
  Collapse,
  Box,
  Divider
} from '@mui/material';
import {
  InfoOutlined,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useHelp } from '../contexts/HelpContext';

/**
 * InfoCard component for displaying contextual help information
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.id - Unique identifier for the card
 * @param {boolean} props.defaultExpanded - Whether the card is expanded by default
 * @param {boolean} props.dismissible - Whether the card can be dismissed
 * @param {boolean} props.alwaysShow - Whether to show the card even if help mode is disabled
 * @param {string} props.variant - Card variant (info, warning, success, error)
 * @param {Object} props.sx - Additional styles
 * @returns {React.ReactElement|null} - The info card component or null if hidden
 */
export default function InfoCard({
  title,
  children,
  id,
  defaultExpanded = true,
  dismissible = true,
  alwaysShow = false,
  variant = 'info',
  sx = {}
}) {
  const { helpModeActive } = useHelp();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [dismissed, setDismissed] = useState(false);

  // Check if this card should be dismissed based on localStorage
  useEffect(() => {
    if (id) {
      const dismissedItems = JSON.parse(localStorage.getItem('aeroleaf_dismissed_help_items') || '[]');
      if (dismissedItems.includes(id)) {
        setDismissed(true);
      }
    }
  }, [id]);

  // Don't render if help mode is not active and alwaysShow is false
  // or if the card has been dismissed
  if ((!helpModeActive && !alwaysShow) || dismissed) {
    return null;
  }

  // Get variant colors
  const variantColors = {
    info: {
      light: '#e3f2fd',
      main: '#2196f3',
      dark: '#1976d2',
      contrastText: '#fff'
    },
    warning: {
      light: '#fff8e1',
      main: '#ffb74d',
      dark: '#f57c00',
      contrastText: 'rgba(0, 0, 0, 0.87)'
    },
    success: {
      light: '#e8f5e9',
      main: '#4caf50',
      dark: '#388e3c',
      contrastText: '#fff'
    },
    error: {
      light: '#ffebee',
      main: '#f44336',
      dark: '#d32f2f',
      contrastText: '#fff'
    }
  };

  const colors = variantColors[variant] || variantColors.info;

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleDismiss = () => {
    if (id) {
      // Get current dismissed items
      const dismissedItems = JSON.parse(localStorage.getItem('aeroleaf_dismissed_help_items') || '[]');
      
      // Add this item if not already in the list
      if (!dismissedItems.includes(id)) {
        dismissedItems.push(id);
        localStorage.setItem('aeroleaf_dismissed_help_items', JSON.stringify(dismissedItems));
      }
      
      // Update local state
      setDismissed(true);
    }
  };

  return (
    <Card 
      elevation={1} 
      sx={{
        mb: 2,
        border: `1px solid ${colors.main}`,
        borderLeft: `4px solid ${colors.main}`,
        backgroundColor: colors.light,
        ...sx
      }}
    >
      <CardHeader
        title={
          <Box display="flex" alignItems="center">
            <InfoOutlined sx={{ mr: 1, color: colors.main }} />
            <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'medium' }}>
              {title}
            </Typography>
          </Box>
        }
        action={
          <Box>
            {dismissible && (
              <IconButton 
                aria-label="dismiss" 
                onClick={handleDismiss}
                size="small"
                sx={{ mr: 0.5 }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton
              onClick={handleToggleExpand}
              aria-expanded={expanded}
              aria-label="show more"
              size="small"
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        }
        sx={{
          padding: '8px 16px',
          '& .MuiCardHeader-action': {
            margin: 0
          }
        }}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />
        <CardContent sx={{ pt: 1.5, pb: 1.5 }}>
          {typeof children === 'string' ? (
            <Typography variant="body2">{children}</Typography>
          ) : (
            children
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
}