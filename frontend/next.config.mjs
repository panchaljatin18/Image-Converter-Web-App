import os from 'os';

const getLocalIps = () => {
  const interfaces = os.networkInterfaces();
  const ips = ['localhost', '127.0.0.1'];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
        ips.push(`${iface.address}:3000`);
      }
    }
  }
  return ips;
};

const localIps = getLocalIps();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  allowedDevOrigins: localIps,
  experimental: {}
};

export default nextConfig;
