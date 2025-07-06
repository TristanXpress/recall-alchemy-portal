
// Utility functions for handling GMT+8 timezone
export const getGMT8DateTime = (date?: Date): string => {
  const now = date || new Date();
  // Convert to GMT+8 (Philippine Standard Time)
  const gmt8Time = new Date(now.getTime() + (8 * 60 * 60 * 1000));
  // Format for datetime-local input (YYYY-MM-DDTHH:MM)
  return gmt8Time.toISOString().slice(0, 16);
};

export const getCurrentGMT8DateTime = (): string => {
  return getGMT8DateTime();
};
