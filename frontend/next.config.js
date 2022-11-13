/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true, // styled-components 적용
    removeConsole: process.env.NODE_ENV === 'production' ? true : false, // 배포 환경일시 console.* 제거
  },
};

module.exports = nextConfig;
