import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: false,
  
  // Configuração para Turbopack (Vercel)
  turbopack: {},
  
  // Configuração para Webpack (fallback local)
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
  
  // Pacotes que precisam ser transpilados
  transpilePackages: ['leaflet', 'react-leaflet'],
}

export default nextConfig
