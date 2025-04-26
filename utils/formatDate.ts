export const formatDateTime = (dateString: Date | string) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",     // e.g., 'Mon'
    month: "short",       // e.g., 'Oct'
    day: "numeric",       // e.g., '25'
    hour: "numeric",      // e.g., '8'
    minute: "numeric",    // e.g., '30'
    hour12: true,         // e.g., '8:30 PM'
  };

  const date = new Date(dateString);
  return date.toLocaleString("en-US", dateTimeOptions);
};
