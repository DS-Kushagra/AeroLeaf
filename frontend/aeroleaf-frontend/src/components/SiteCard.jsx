import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  LinearProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  LocationOn,
  ForestOutlined,
  ShowChart,
  VerifiedUser,
  WarningAmber,
  PendingActions,
  TrendingUp,
} from "@mui/icons-material";
import PropTypes from "prop-types";

/**
 * SiteCard component displays information about a reforestation site
 * @param {Object} props - Component props
 * @returns {React.ReactElement} SiteCard component
 */
export default function SiteCard({ site }) {
  // Calculate verification status color and icon
  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case "verified":
        return {
          color: "success",
          icon: <VerifiedUser fontSize="small" />,
          backgroundColor: "bg-green-100",
          textColor: "text-green-800",
        };
      case "pending":
        return {
          color: "warning",
          icon: <PendingActions fontSize="small" />,
          backgroundColor: "bg-amber-100",
          textColor: "text-amber-800",
        };
      case "flagged":
        return {
          color: "error",
          icon: <WarningAmber fontSize="small" />,
          backgroundColor: "bg-red-100",
          textColor: "text-red-800",
        };
      default:
        return {
          color: "info",
          icon: <ShowChart fontSize="small" />,
          backgroundColor: "bg-blue-100",
          textColor: "text-blue-800",
        };
    }
  };

  const statusInfo = getStatusInfo(site.status);

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300 relative overflow-hidden group">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardContent className="relative z-10">
        {/* Header with site name and status */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <Typography variant="h6" className="font-bold text-gray-900 mb-1">
              {site.name}
            </Typography>
            <div className="flex items-center text-gray-600 text-sm">
              <LocationOn fontSize="small" className="mr-1" />
              <span>{site.region}</span>
            </div>
          </div>
          <Chip
            icon={statusInfo.icon}
            label={site.status || "Unknown"}
            size="small"
            className={`${statusInfo.backgroundColor} ${statusInfo.textColor}`}
            sx={{
              height: "24px",
              "& .MuiChip-label": {
                fontSize: "0.75rem",
                px: 1,
              },
            }}
          />
        </div>

        {/* Site metrics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 rounded-lg bg-green-50">
            <Typography
              variant="body2"
              className="text-green-600 font-medium flex items-center gap-1"
            >
              <ForestOutlined fontSize="small" />
              Area
            </Typography>
            <Typography variant="h6" className="font-bold text-gray-900">
              {site.area_hectares?.toLocaleString() ?? "N/A"}
              {site.area_hectares && (
                <span className="text-sm font-normal text-gray-600 ml-1">
                  ha
                </span>
              )}
            </Typography>
          </div>
          <div className="p-3 rounded-lg bg-blue-50">
            <Typography
              variant="body2"
              className="text-blue-600 font-medium flex items-center gap-1"
            >
              <ShowChart fontSize="small" />
              Carbon Captured
            </Typography>
            <Typography variant="h6" className="font-bold text-gray-900">
              {site.carbon_tonnes?.toLocaleString() ?? "N/A"}
              {site.carbon_tonnes && (
                <span className="text-sm font-normal text-gray-600 ml-1">
                  tCO₂
                </span>
              )}
            </Typography>
          </div>
        </div>

        {/* Verification progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <Typography variant="body2" className="text-gray-600">
              Verification Progress
            </Typography>
            <Typography variant="body2" className="font-medium text-gray-900">
              {site.verification_progress ?? 0}%
            </Typography>
          </div>
          <LinearProgress
            variant="determinate"
            value={site.verification_progress || 0}
            className="h-2 rounded-full bg-gray-100"
            classes={{
              bar: "bg-green-500",
            }}
          />
        </div>

        {/* NDVI Change indicator */}
        {site.ndvi_change && (
          <Box className="flex items-center justify-between p-2 rounded-lg bg-gray-50 mb-4">
            <Typography variant="body2" className="text-gray-600">
              NDVI Improvement
            </Typography>
            <div className="flex items-center">
              <TrendingUp className="text-green-500 mr-1" fontSize="small" />
              <Typography
                variant="body2"
                className={`font-medium ${
                  site.ndvi_change > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {site.ndvi_change > 0 ? "+" : ""}
                {(site.ndvi_change * 100).toFixed(1)}%
              </Typography>
            </div>
          </Box>
        )}

        {/* Flagged issues warning */}
        {site.flagged_issues?.length > 0 && (
          <Box className="bg-red-50 p-2 rounded-lg mb-4">
            <Typography
              variant="body2"
              className="text-red-700 flex items-center gap-1"
            >
              <WarningAmber fontSize="small" />
              {site.flagged_issues.length} Issue
              {site.flagged_issues.length > 1 ? "s" : ""} Flagged
            </Typography>
          </Box>
        )}

        {/* View details link */}
        <Link
          to={`/site/${site.id}`}
          className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center justify-end mt-2"
        >
          View Details →
        </Link>
      </CardContent>
    </Card>
  );
}

SiteCard.propTypes = {
  site: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    region: PropTypes.string.isRequired,
    status: PropTypes.string,
    area_hectares: PropTypes.number,
    carbon_tonnes: PropTypes.number,
    verification_progress: PropTypes.number,
    ndvi_change: PropTypes.number,
    flagged_issues: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};
