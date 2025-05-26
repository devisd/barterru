import withPWA from 'next-pwa';

const nextConfig = {
    images: {
        domains: ['localhost', 'placehold.co'],
    },
    // любые другие опции Next.js
};

const { images, ...pureNextConfig } = nextConfig;

const pwaConfig = {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
};

const config = withPWA(pureNextConfig, pwaConfig);
config.images = images;

export default config;
