
export const isPremiumUser = (): boolean => {
  // Check if user has premium subscription from localStorage
  const premiumStatus = localStorage.getItem('isPremium');
  const premiumExpiry = localStorage.getItem('premiumExpiry');
  
  if (premiumStatus === 'true') {
    // Check if premium is still valid (if expiry date exists)
    if (premiumExpiry) {
      const expiryDate = new Date(premiumExpiry);
      const now = new Date();
      return now < expiryDate;
    }
    // If no expiry date, assume it's still valid
    return true;
  }
  
  return false;
};

export const setPremiumStatus = (status: boolean, expiryDate?: Date) => {
  localStorage.setItem('isPremium', status.toString());
  if (expiryDate) {
    localStorage.setItem('premiumExpiry', expiryDate.toISOString());
  } else if (status) {
    // Set default premium for 1 year if no expiry specified
    const defaultExpiry = new Date();
    defaultExpiry.setFullYear(defaultExpiry.getFullYear() + 1);
    localStorage.setItem('premiumExpiry', defaultExpiry.toISOString());
  }
};

export const showPremiumTooltip = (message: string = "Fitur ini hanya tersedia untuk pengguna Premium") => {
  return message;
};

// Temporary function to simulate premium user for testing
export const togglePremiumForTesting = () => {
  const currentStatus = isPremiumUser();
  setPremiumStatus(!currentStatus);
  return !currentStatus;
};
