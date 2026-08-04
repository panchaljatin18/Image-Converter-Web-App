export const getApiUrl = () => {
  // Automatically connect to local Next.js API routes when developing on localhost/127.0.0.1
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return "";
    }
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  return apiUrl.replace(/\/$/, "");
};