/** @type {import('next').NextConfig} */
const nextConfig = {
  // sharp 네이티브 바인딩은 번들하지 않음
  serverExternalPackages: ['sharp'],
  // 원본 최적화(최대 15MB) + 업로드 FormData — 기본 1MB면 본문 파싱 단계에서 실패
  experimental: {
    serverActions: {
      bodySizeLimit: '16mb',
    },
  },
  async redirects() {
    return [
      {
        source: '/signup',
        destination: '/member',
        permanent: true,
      },
      {
        source: '/en/signup',
        destination: '/en/member',
        permanent: true,
      },
      {
        source: '/en/directions',
        destination: '/en/contact',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
