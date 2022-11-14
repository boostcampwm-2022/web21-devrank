/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true, // styled-components 적용
    removeConsole: process.env.NODE_ENV === 'production', // 배포 환경일시 console.* 제거
  },
  images: {
    remotePatterns: [
      // 외부 이미지 허용
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
      },
    ],
  },
};

module.exports = nextConfig;
