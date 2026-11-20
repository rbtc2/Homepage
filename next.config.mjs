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
    // Next 15+ 기본 qualities=[75]만 허용 → 상세/썸네일 고품질 prop 사용을 위해 명시
    qualities: [75, 85, 90],
    // 1180px 레이아웃 × 2~2.5 DPR까지 선명한 srcset
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560, 3840],
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
