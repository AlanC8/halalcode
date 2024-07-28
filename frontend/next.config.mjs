/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
    VITE_GOOGLE_SEARCH_API_KEY: process.env.VITE_GOOGLE_SEARCH_API_KEY,
    VITE_BROWSER_ENGINE_ID: process.env.VITE_BROWSER_ENGINE_ID,
  },
};

export default nextConfig;
