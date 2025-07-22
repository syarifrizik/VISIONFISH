import { formatDistanceToNow, format, isToday, isYesterday, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

export const formatTimeAgo = (dateString: string | Date): string => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    const now = new Date();
    
    // If it's within the last hour, show "baru saja"
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'baru saja';
    }
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} menit yang lalu`;
    }
    
    // If it's today
    if (isToday(date)) {
      const hours = Math.floor(diffInMinutes / 60);
      if (hours < 24) {
        return `${hours} jam yang lalu`;
      }
    }
    
    // If it's yesterday
    if (isYesterday(date)) {
      return 'kemarin';
    }
    
    // Otherwise use relative time
    return formatDistanceToNow(date, { 
      addSuffix: true, 
      locale: id 
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'baru saja';
  }
};

export const formatExactTime = (dateString: string | Date): string => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'dd/MM/yyyy HH:mm', { locale: id });
  } catch (error) {
    console.error('Error formatting exact time:', error);
    return format(new Date(), 'dd/MM/yyyy HH:mm', { locale: id });
  }
};

export const formatMemberSince = (dateString: string | Date): string => {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    const now = new Date();
    
    // Check if it's today
    if (isToday(date)) {
      return 'bergabung hari ini';
    }
    
    // Check if it's yesterday
    if (isYesterday(date)) {
      return 'bergabung kemarin';
    }
    
    // Check if it's within the last 7 days
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffInDays <= 7) {
      return `bergabung ${diffInDays} hari yang lalu`;
    }
    
    // Otherwise show month and year
    return `bergabung ${format(date, 'MMMM yyyy', { locale: id })}`;
  } catch (error) {
    console.error('Error formatting member since:', error);
    return 'bergabung hari ini';
  }
};
