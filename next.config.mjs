/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vlbgfoerlwitdampmgfk.supabase.co',
      },
    ],
  },
};

export default nextConfig;
