export const getApiUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not defined. Please configure it in Vercel Environment Variables."
    );
  }

  return apiUrl.replace(/\/$/, "");
};