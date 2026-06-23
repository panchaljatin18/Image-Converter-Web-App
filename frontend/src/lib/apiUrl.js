export const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== "undefined") {
    // If running in browser, determine host dynamically from window.location.hostname
    return `http://${window.location.hostname}:5000/api`;
  }
  return "http://localhost:5000/api";
};
