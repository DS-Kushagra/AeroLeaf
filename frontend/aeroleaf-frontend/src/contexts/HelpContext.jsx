import { createContext, useState, useContext, useEffect } from "react";

// Create the context
const HelpContext = createContext();

/**
 * HelpProvider component to manage help system state across the application
 * @param {ReactNode} children - Child components
 */
export const HelpProvider = ({ children }) => {
  // State for first-time user detection
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  
  // State for guided tour
  const [showGuidedTour, setShowGuidedTour] = useState(false);
  
  // State for feature highlights
  const [highlightedFeatures, setHighlightedFeatures] = useState({});
  
  // State for help mode
  const [helpModeActive, setHelpModeActive] = useState(false);
  
  // State for viewed help topics
  const [viewedHelpTopics, setViewedHelpTopics] = useState({});

  // Check if user is first time visitor on component mount
  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem("aeroleaf_visited");
    if (!hasVisitedBefore) {
      setIsFirstTimeUser(true);
      setShowGuidedTour(true);
      localStorage.setItem("aeroleaf_visited", "true");
    }

    // Load viewed help topics from localStorage
    const savedTopics = localStorage.getItem("aeroleaf_viewed_help_topics");
    if (savedTopics) {
      setViewedHelpTopics(JSON.parse(savedTopics));
    }
  }, []);

  // Save viewed help topics to localStorage when updated
  useEffect(() => {
    localStorage.setItem(
      "aeroleaf_viewed_help_topics",
      JSON.stringify(viewedHelpTopics)
    );
  }, [viewedHelpTopics]);

  /**
   * Mark a feature as highlighted
   * @param {string} featureId - Unique identifier for the feature
   * @param {boolean} status - Highlight status
   */
  const highlightFeature = (featureId, status = true) => {
    setHighlightedFeatures((prev) => ({
      ...prev,
      [featureId]: status,
    }));
  };

  /**
   * Check if a feature is highlighted
   * @param {string} featureId - Unique identifier for the feature
   * @returns {boolean} - Whether the feature is highlighted
   */
  const isFeatureHighlighted = (featureId) => {
    return highlightedFeatures[featureId] === true;
  };

  /**
   * Start the guided tour
   */
  const startGuidedTour = () => {
    setShowGuidedTour(true);
  };

  /**
   * End the guided tour
   */
  const endGuidedTour = () => {
    setShowGuidedTour(false);
  };

  /**
   * Toggle help mode
   */
  const toggleHelpMode = () => {
    setHelpModeActive((prev) => !prev);
  };

  /**
   * Mark a help topic as viewed
   * @param {string} topicId - Unique identifier for the help topic
   */
  const markTopicAsViewed = (topicId) => {
    setViewedHelpTopics((prev) => ({
      ...prev,
      [topicId]: true,
    }));
  };

  /**
   * Check if a help topic has been viewed
   * @param {string} topicId - Unique identifier for the help topic
   * @returns {boolean} - Whether the topic has been viewed
   */
  const hasViewedTopic = (topicId) => {
    return viewedHelpTopics[topicId] === true;
  };

  /**
   * Reset all help settings
   */
  const resetHelpSettings = () => {
    setIsFirstTimeUser(true);
    setShowGuidedTour(true);
    setHighlightedFeatures({});
    setViewedHelpTopics({});
    localStorage.removeItem("aeroleaf_visited");
    localStorage.removeItem("aeroleaf_viewed_help_topics");
  };

  // Context value
  const value = {
    isFirstTimeUser,
    showGuidedTour,
    helpModeActive,
    highlightFeature,
    isFeatureHighlighted,
    startGuidedTour,
    endGuidedTour,
    toggleHelpMode,
    markTopicAsViewed,
    hasViewedTopic,
    resetHelpSettings,
  };

  return <HelpContext.Provider value={value}>{children}</HelpContext.Provider>;
};

/**
 * Custom hook to use the help context
 * @returns {Object} Help context value
 */
export const useHelp = () => {
  const context = useContext(HelpContext);
  if (context === undefined) {
    throw new Error("useHelp must be used within a HelpProvider");
  }
  return context;
};

export default HelpContext;