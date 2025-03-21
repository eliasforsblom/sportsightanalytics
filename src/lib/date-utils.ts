
/**
 * Formats a date string to a readable format: "Month Day, Year"
 * Uses Intl.DateTimeFormat for reliable formatting
 */
export function formatDate(dateString: string): string {
  if (!dateString) return "";
  
  try {
    // Create a date object from the string
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.error("Invalid date:", dateString);
      return "";
    }
    
    // Use the Intl.DateTimeFormat for more reliable formatting
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  } catch (e) {
    console.error("Error formatting date:", e);
    return "";
  }
}
