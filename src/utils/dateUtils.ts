
export const formatMemberSince = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  
  // Set time to start of day for accurate comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const memberDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  // Calculate the difference in days
  const diffTime = today.getTime() - memberDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // If same day, show "Hari ini"
  if (diffDays === 0) {
    return 'Hari ini';
  }
  
  // If 1 day, show "Kemarin"
  if (diffDays === 1) {
    return 'Kemarin';
  }
  
  // If less than 7 days, show days ago
  if (diffDays < 7) {
    return `${diffDays} hari yang lalu`;
  }
  
  // Otherwise show month and year
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long'
  });
};

export const formatJoinDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long'
  });
};
