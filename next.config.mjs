/** @type {import('next').NextConfig} */
const nextConfig = {
  // 커버 이미지 업로드(FormData) — 기본 1MB를 넘기면 Server Action이 본문 파싱 단계에서 실패할 수 있음
  experimental: {
    serverActions: {
      bodySizeLimit: '6mb',
    },
  },
  async redirects() {
    return [
      {
        source: '/signup',
        destination: '/member',
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
