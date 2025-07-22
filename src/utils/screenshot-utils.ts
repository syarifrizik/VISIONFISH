
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

// Function to capture screenshot of a specific element with enhanced visual effects
export const captureScreenshot = async (elementId: string, filename: string): Promise<string | null> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      toast.error('Element not found for screenshot');
      return null;
    }

    const toastId = toast.loading('Menyiapkan screenshot...');
    
    // Set up the clone with proper styling
    const clonedElement = element.cloneNode(true) as HTMLElement;
    
    // Apply special effects for screenshot
    applyScreenshotEffects(clonedElement);
    
    // Set the styles to ensure proper rendering
    clonedElement.style.position = 'fixed';
    clonedElement.style.top = '0';
    clonedElement.style.left = '0';
    clonedElement.style.width = element.offsetWidth + 'px';
    clonedElement.style.height = 'auto';
    clonedElement.style.backgroundColor = '#111827'; // Match the dark mode background
    clonedElement.style.zIndex = '-9999'; // Position it out of view
    clonedElement.style.transform = 'none'; // Remove any transforms
    clonedElement.style.transition = 'none'; // Disable transitions
    clonedElement.style.padding = '32px'; // Add padding around content
    clonedElement.style.borderRadius = '12px'; // Rounded corners
    clonedElement.style.boxShadow = '0 25px 50px -12px rgba(0, 183, 235, 0.25), 0 0 40px rgba(0, 183, 235, 0.15) inset';
    
    // Add a light gradient overlay for a better visual effect
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'linear-gradient(135deg, rgba(0, 183, 235, 0.05) 0%, rgba(214, 51, 132, 0.05) 100%)';
    overlay.style.zIndex = '-1';
    overlay.style.pointerEvents = 'none';
    clonedElement.style.position = 'relative';
    clonedElement.appendChild(overlay);
    
    // Apply a subtle vignette effect
    const vignette = document.createElement('div');
    vignette.style.position = 'absolute';
    vignette.style.top = '0';
    vignette.style.left = '0';
    vignette.style.width = '100%';
    vignette.style.height = '100%';
    vignette.style.boxShadow = 'inset 0 0 100px rgba(0,0,0,0.5)';
    vignette.style.zIndex = '-1';
    vignette.style.pointerEvents = 'none';
    clonedElement.appendChild(vignette);
    
    // Add VisionFish watermark logo at the bottom
    const watermark = document.createElement('div');
    watermark.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 24px; opacity: 0.7;">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.5 14C6.88071 14 8 12.8807 8 11.5C8 10.1193 6.88071 9 5.5 9C4.11929 9 3 10.1193 3 11.5C3 12.8807 4.11929 14 5.5 14Z" fill="#00B7EB"/>
        <path d="M19.27 9.69C19.1075 9.43292 18.8843 9.21867 18.62 9.07L17 8.21V7L13.6 4L13 3.76V5.68L12 5.8C10.2 6.03 8.7 7.17 8 8.87C7.96217 8.97373 7.94029 9.08237 7.935 9.193C7.6032 9.0651 7.2518 8.99949 6.897 9.001C5.25795 9.00051 3.93075 10.3277 3.93024 11.9667C3.92972 13.6058 5.25644 14.933 6.89549 14.9335C8.53454 14.934 9.86174 13.6073 9.86225 11.9682C9.86251 11.9527 9.86267 11.9373 9.86225 11.9219C9.87259 11.4222 9.77938 10.9255 9.586 10.461C9.4543 10.1323 9.28714 9.82173 9.086 9.538C9.5526 8.43364 10.4475 7.59401 11.577 7.2C11.592 7.2 11.608 7.185 11.623 7.179L17 5.8V6.45L21 11L19.63 11.342C19.5154 11.3646 19.4106 11.4212 19.332 11.5035C19.2533 11.5858 19.2045 11.6898 19.194 11.801L18.991 14.201C18.9708 14.3954 19.0342 14.5891 19.1676 14.7348C19.301 14.8805 19.4926 14.9648 19.686 14.968C19.6966 14.9688 19.7073 14.9688 19.718 14.968C19.9036 14.9684 20.0829 14.8993 20.2198 14.7755C20.3567 14.6517 20.4419 14.4811 20.459 14.297L20.606 12.621L22.12 12.112L22.513 13.346C22.5743 13.5398 22.7122 13.7009 22.8952 13.7911C23.0782 13.8813 23.2917 13.8933 23.4839 13.8243C23.6762 13.7553 23.8361 13.6114 23.9228 13.4258C24.0095 13.2402 24.0165 13.0286 23.942 12.838L22.9 9.928L19.27 9.69Z" fill="#00B7EB"/>
      </svg>
      <span style="font-size: 12px; color: #00B7EB; font-weight: 500;">VisionFish.io</span>
    </div>`;
    watermark.style.display = 'flex';
    watermark.style.justifyContent = 'center';
    watermark.style.width = '100%';
    clonedElement.appendChild(watermark);
    
    document.body.appendChild(clonedElement);
    
    // Capture the clone with enhanced settings
    const canvas = await html2canvas(clonedElement, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#111827', // Dark background for better visibility
      logging: false,
      // Remove shadowColor as it's not a valid option
    });
    
    // Remove the clone after capturing
    document.body.removeChild(clonedElement);
    
    // Convert canvas to data URL
    const imageData = canvas.toDataURL('image/png');
    
    toast.dismiss(toastId);
    return imageData;
  } catch (error) {
    console.error('Screenshot error:', error);
    toast.error('Gagal membuat screenshot');
    return null;
  }
};

// Function to apply special effects for screenshots
const applyScreenshotEffects = (element: HTMLElement) => {
  // Add a subtle shine effect to tables
  const tables = element.querySelectorAll('table');
  tables.forEach(table => {
    table.style.borderCollapse = 'separate';
    table.style.borderSpacing = '0';
    table.style.borderRadius = '8px';
    table.style.overflow = 'hidden';
    table.style.boxShadow = '0 4px 20px rgba(0, 183, 235, 0.15), 0 0 0 1px rgba(0, 183, 235, 0.1)';
  });

  // Add glow effect to badges
  const badges = element.querySelectorAll('.badge, [class*=badge]');
  badges.forEach(badge => {
    const badgeElement = badge as HTMLElement;
    badgeElement.style.textShadow = '0 0 5px currentColor';
    badgeElement.style.boxShadow = '0 0 8px rgba(255, 255, 255, 0.1)';
  });

  // Enhance headings
  const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach(heading => {
    const headingElement = heading as HTMLElement;
    headingElement.style.textShadow = '0 1px 3px rgba(0, 0, 0, 0.3)';
    headingElement.style.background = 'linear-gradient(90deg, #00B7EB, #D63384)';
    // Fix the webkit property names to use camelCase (as required by TypeScript)
    headingElement.style.webkitBackgroundClip = 'text';
    headingElement.style.webkitTextFillColor = 'transparent';
    headingElement.style.backgroundClip = 'text';
    headingElement.style.color = 'transparent';
    headingElement.style.fontWeight = 'bold';
  });

  // Add glow to images
  const images = element.querySelectorAll('img');
  images.forEach(img => {
    const imgElement = img as HTMLElement;
    imgElement.style.boxShadow = '0 0 15px rgba(0, 183, 235, 0.5)';
    imgElement.style.borderRadius = '8px';
  });
};

// Function to download screenshot
export const downloadScreenshot = (dataUrl: string, filename: string) => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  toast.success("Screenshot berhasil diunduh");
  
  // Play screenshot sound
  const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YWoGAACBhYqFbF1fdH2Hd2NfcIeQlo+JhYmRkoyDfXyEkZeMgnt9hIqPjYmDhIeKi4eBfHx8goeKioaCgIOHioiEgH+BhYmIhoJ/gIOFhoaDgICChIWEg4GBgoSFhIOCgYGDhISDgoCBgoOEg4KBgYKDg4OCgYGBgoODgoKBgYKCgoKBgYGBgoKCgoGBgYGCgoGBgYGBgYKCgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYFAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgoKBgYGBgYKCgYGBgYKCgoKBgYGCgoKCgYGCgoODgoGBgoODg4KBgYODg4OCgYKDhISDgoGChISEg4GBg4SFhIKBgoSFhYSCgYOFhoWDgIKFhoaFgoGEhoeGg4GDhoiHhIKCh4iJh4SBhImJiYaBg4qLioiDgYaLjIuGgYSKjIyJg4GHi42LhYKFio2MiIOCiIyOi4aBhYqNjYmEgoeLjoyHgYWJjY6KhIKGio6NiISDiIuOjIeChouOjYmEg4iMjoyCgYaKjIyHg4SHi46OiYSEiIyOi4eDhYqMjYqFg4eKjIyIg4SIi4yLh4OFiYuMiYWDh4mLi4iFhIeJi4qHhIaIiouJhoSGiImKiIaFhoiJiYeGhYeHiIiHhoaGh4eHhoaGhoaHh4aGhoaGhoaGhoaGhoaGhoWFhoaGhoaFhYWFhoaFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWEhISFhYWFhISEhISFhYSEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhIQQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWEhISFhYWFhISEhYWFhYSEhISFhYWFhISEhYWFhYSEhIWFhYWEhISFhYWFhISEhIWFhYSEhIWFhYWEhISFhoaFhISFhoaGhYSEhYaGhoWEhIWGhoaFhIWFhoaGhYSFhoeHhoWEhYaHh4aFhIWGh4eGhYSFhoeHhoWFhYeHh4aFhYWHh4eGhYWFh4eHhoWFhoeHh4aFhYaHh4eGhYWGh4eHhoWFhoeHh4aFhoeHh4eGhYaHh4eHhoaGh4eHh4aGhoeHh4eGhoaHh4eHhoaGh4eHh4aGhoeHh4eGhoaHh4eHhoaGh4eHh4aGhoeHh4aGhoaHh4aGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGgoAA");
  audio.play().catch(err => console.error("Error playing sound:", err));
};

// Function to share to WhatsApp
export const shareToWhatsApp = (text: string, imageUrl?: string) => {
  // Base text + URL (if image exists)
  let shareText = encodeURIComponent(text);
  
  // If we have an image URL, we'll use "Check out this image" as text
  if (imageUrl) {
    shareText = encodeURIComponent("Hasil analisis ikan dari VisionFish.io");
  }
  
  const waUrl = `https://api.whatsapp.com/send?text=${shareText}`;
  window.open(waUrl, '_blank');
};

// Function to format current date for filenames
export const formatDateForFilename = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}`;
};
