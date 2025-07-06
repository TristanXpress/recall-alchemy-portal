

// Utility functions for handling GMT+8 timezone
export const getGMT8DateTime = (date?: Date): string => {
  const now = date || new Date();
  // Get the current time in GMT+8 (Philippine Standard Time)
  // We need to adjust for the timezone offset to get the local GMT+8 time
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
  const gmt8Time = new Date(utcTime + (8 * 60 * 60 * 1000));
  
  // Format for datetime-local input (YYYY-MM-DDTHH:MM)
  return gmt8Time.toISOString().slice(0, 16);
};

export const getCurrentGMT8DateTime = (): string => {
  return getGMT8DateTime();
};

