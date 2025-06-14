export const PAGINATION_CONFIG = {
  // Initial number of items to load per category
  INITIAL_LOAD_LIMIT: 10,

  // Number of items to load when "Load More" is clicked
  LOAD_MORE_LIMIT: 10,

  // Intersection observer settings
  INTERSECTION_OBSERVER: {
    // Start loading when element is 100px from viewport
    ROOT_MARGIN: "100px",

    // Trigger when 10% of the element is visible
    THRESHOLD: 0.1,
  },

  // Loading states
  LOADING: {
    // Minimum time to show loading spinner (ms)
    MIN_DISPLAY_TIME: 300,

    // Maximum time to wait for API response (ms)
    TIMEOUT: 10000,
  },

  // Performance optimizations
  PERFORMANCE: {
    // Debounce time for scroll events (ms)
    SCROLL_DEBOUNCE: 100,

    // Maximum number of items to keep in memory per category
    MAX_ITEMS_PER_CATEGORY: 100,
  },
} as const;

// Helper function to get pagination settings for different screen sizes
export function getPaginationSettings(
  screenSize: "mobile" | "tablet" | "desktop"
) {
  const baseConfig = { ...PAGINATION_CONFIG };

  switch (screenSize) {
    case "mobile":
      return {
        ...baseConfig,
        INITIAL_LOAD_LIMIT: 8,
        LOAD_MORE_LIMIT: 8,
        INTERSECTION_OBSERVER: {
          ...baseConfig.INTERSECTION_OBSERVER,
          ROOT_MARGIN: "50px",
        },
      };

    case "tablet":
      return {
        ...baseConfig,
        INITIAL_LOAD_LIMIT: 12,
        LOAD_MORE_LIMIT: 12,
      };

    case "desktop":
      return {
        ...baseConfig,
        INITIAL_LOAD_LIMIT: 15,
        LOAD_MORE_LIMIT: 15,
        INTERSECTION_OBSERVER: {
          ...baseConfig.INTERSECTION_OBSERVER,
          ROOT_MARGIN: "150px",
        },
      };

    default:
      return baseConfig;
  }
}

// Helper function to detect screen size
export function getScreenSize(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop";

  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}
