export const getApiUrl = () => {
  // Automatically connect to local backend when developing on localhost/127.0.0.1
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return "http://localhost:5000";
    }
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  return apiUrl.replace(/\/$/, "");
};