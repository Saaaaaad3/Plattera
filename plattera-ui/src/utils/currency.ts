// Currency configuration
export const CURRENCY_CONFIG = {
  symbol: "₹", // Change this to change currency symbol across the app
  position: "before" as const, // 'before' or 'after'
  decimalPlaces: 2,
};

// Format price with currency symbol
export const formatPrice = (price: number | string): string => {
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;
  const formattedPrice = numericPrice.toFixed(CURRENCY_CONFIG.decimalPlaces);

  return CURRENCY_CONFIG.position === "before"
    ? `${CURRENCY_CONFIG.symbol}${formattedPrice}`
    : `${formattedPrice}${CURRENCY_CONFIG.symbol}`;
};

// Get currency symbol only
export const getCurrencySymbol = (): string => CURRENCY_CONFIG.symbol;
