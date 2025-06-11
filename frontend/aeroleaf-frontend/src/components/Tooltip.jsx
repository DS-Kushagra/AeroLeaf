import React from 'react';
import { Tooltip as MUITooltip, IconButton } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useHelp } from '../contexts/HelpContext';

/**
 * Enhanced tooltip component that respects the help mode setting
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The element that triggers the tooltip
 * @param {string} props.title - The tooltip content
 * @param {string} props.placement - Tooltip placement (top, bottom, left, right, etc.)
 * @param {boolean} props.alwaysShow - Whether to show the tooltip even if help mode is disabled
 * @param {Object} props.sx - Additional styles for the tooltip
 * @returns {React.ReactElement} - The tooltip component
 */
export function EnhancedTooltip({ 
  children, 
  title, 
  placement = 'top',
  alwaysShow = false,
  sx = {},
  ...props 
}) {
  const { helpModeActive } = useHelp();
  
  // Only show tooltip if help mode is active or alwaysShow is true
  if (!helpModeActive && !alwaysShow) {
    return children;
  }
  
  return (
    <MUITooltip 
      title={title} 
      placement={placement}
      arrow
      sx={{ 
        '& .MuiTooltip-tooltip': {
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          padding: '8px 12px',
          fontSize: '0.875rem',
          maxWidth: 300,
          ...sx
        },
        '& .MuiTooltip-arrow': {
          color: 'rgba(0, 0, 0, 0.85)'
        }
      }}
      {...props}
    >
      {children}
    </MUITooltip>
  );
}

/**
 * Help icon with tooltip
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - The tooltip content
 * @param {string} props.placement - Tooltip placement
 * @param {string} props.size - Icon size (small, medium, large)
 * @param {Object} props.sx - Additional styles
 * @returns {React.ReactElement} - The help icon with tooltip
 */
export function HelpTooltip({ 
  title, 
  placement = 'top',
  size = 'small',
  sx = {},
  ...props 
}) {
  const { helpModeActive } = useHelp();
  
  // Don't render if help mode is not active
  if (!helpModeActive) {
    return null;
  }
  
  return (
    <MUITooltip 
      title={title} 
      placement={placement}
      arrow
      sx={{ 
        '& .MuiTooltip-tooltip': {
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          padding: '8px 12px',
          fontSize: '0.875rem',
          maxWidth: 300,
          ...sx
        },
        '& .MuiTooltip-arrow': {
          color: 'rgba(0, 0, 0, 0.85)'
        }
      }}
      {...props}
    >
      <IconButton size={size} color="primary" sx={{ padding: '2px', ml: 0.5 }}>
        <HelpOutlineIcon fontSize={size} />
      </IconButton>
    </MUITooltip>
  );
}