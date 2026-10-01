import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
const nextConfig:NextConfig={
 poweredByHeader:false,
 turbopack:{root:fileURLToPath(new URL(".",import.meta.url))},
 reactStrictMode:true,
 async headers() {
  return [{source:"/models/:path*",headers:[{key:"Cache-Control",value:"public, max-age=86400, stale-while-revalidate=604800"}]}];
 },
};
export default nextConfig;
