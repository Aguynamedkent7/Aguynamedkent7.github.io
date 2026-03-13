/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // This is the crucial line for GitHub Pages
  images: {
    unoptimized: true, // Necessary if you use the <Image /> component
  },
};

export default nextConfig;