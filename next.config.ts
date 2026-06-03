import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Yerel ağdan (telefon/tablet) dev sunucusuna erişim
  allowedDevOrigins: ["192.168.1.117", "192.168.1.*"],
};

export default nextConfig;
