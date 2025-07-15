
export function formatToIST(dateTime: string): string {
    try {
      const utcDate = new Date(dateTime);
      const istFormatted = utcDate.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZoneName: "short" 
      });
      return istFormatted;
    } catch (error) {
      console.error("Invalid date passed to formatToIST:", dateTime);
      return "Invalid Date";
    }
  }
  