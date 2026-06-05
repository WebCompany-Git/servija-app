import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: false,  // Desativado temporariamente para compatibilidade com rotas dinâmicas
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
  transpilePackages: ['leaflet', 'react-leaflet'],
}

export default nextConfig
