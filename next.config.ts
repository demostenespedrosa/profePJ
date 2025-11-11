import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https'
        ,
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  devIndicators: {
    allowedDevOrigins: [
        '*.cluster-mdgxqvvkkbfpqrfigfiuugu5pk.cloudworkstations.dev',
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false,
        missing: [
            {
                type: 'cookie',
                key: 'firebase-auth-token',
            }
        ]
      },
       {
        source: '/login',
        destination: '/',
        permanent: false,
        has: [
            {
                type: 'cookie',
                key: 'firebase-auth-token',
            }
        ]
      },
      {
        source: '/cadastro',
        destination: '/',
        permanent: false,
        has: [
            {
                type: 'cookie',
                key: 'firebase-auth-token',
            }
        ]
      }
    ]
  },
};

export default nextConfig;
