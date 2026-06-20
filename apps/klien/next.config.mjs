import withPWAInit from 'next-pwa';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const withPWA = withPWAInit({ dest: 'public', register: true, skipWaiting: true, disable: true, buildExcludes: [/app-build-manifest\.json$/, /_next\/app-build-manifest\.json$/] });
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@mikala/ui', '@mikala/lib', '@mikala/hooks', '@mikala/store', '@mikala/types'],
  webpack: (config) => {
    config.resolve.alias['@mikala/ui'] = path.resolve(__dirname, '../../packages/ui/src/index.ts');
    config.resolve.alias['@mikala/lib'] = path.resolve(__dirname, '../../packages/lib/index.ts');
    config.resolve.alias['@mikala/hooks'] = path.resolve(__dirname, '../../packages/hooks/index.ts');
    config.resolve.alias['@mikala/store'] = path.resolve(__dirname, '../../packages/store/index.ts');
    config.resolve.alias['@mikala/types'] = path.resolve(__dirname, '../../packages/types/index.ts');
    config.resolve.alias['@'] = path.resolve(__dirname);
    return config;
  },
};
export default withPWA(nextConfig);
