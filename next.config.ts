import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

const staticExport = process.env.SITES_STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
 poweredByHeader:false,
 turbopack:{root:fileURLToPath(new URL(".",import.meta.url))},
 reactStrictMode:true,
 output: staticExport ? "export" : undefined,
 trailingSlash: staticExport,
 images: { unoptimized: staticExport },
};
export default nextConfig;
